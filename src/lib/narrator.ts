import type { ReplayEvent, ReplaySnapshot } from './replayData'
import { formatGameTime } from './replayData'

export interface NarrationScript {
  timestamp: number
  text: string
  priority: 'high' | 'medium' | 'low'
  event?: ReplayEvent
}

export class MatchNarrator {
  private synthesis: SpeechSynthesis | null = null
  private voice: SpeechSynthesisVoice | null = null
  private isEnabled: boolean = false
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private queue: NarrationScript[] = []
  private lastNarrationTime: number = -999
  private rate: number = 1.2
  private pitch: number = 1.0
  private volume: number = 0.8

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
      this.loadVoices()
      
      if (this.synthesis) {
        this.synthesis.addEventListener('voiceschanged', () => {
          this.loadVoices()
        })
      }
    }
  }

  private loadVoices() {
    if (!this.synthesis) return
    
    const voices = this.synthesis.getVoices()
    this.voice = voices.find(v => 
      v.name.includes('Microsoft David') || 
      v.name.includes('Google US English') ||
      v.name.includes('Alex') ||
      v.lang.startsWith('en')
    ) || voices[0] || null
  }

  isAvailable(): boolean {
    return this.synthesis !== null && this.voice !== null
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
    if (!enabled) {
      this.stop()
    }
  }

  setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate))
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
    this.currentUtterance = null
    this.queue = []
  }

  generateNarration(
    currentSnapshot: ReplaySnapshot,
    previousSnapshot: ReplaySnapshot | null,
    currentTime: number
  ): NarrationScript[] {
    const scripts: NarrationScript[] = []

    if (currentSnapshot.events.length > 0 && currentTime - this.lastNarrationTime > 5) {
      currentSnapshot.events.forEach(event => {
        const script = this.eventToNarration(event, currentSnapshot)
        if (script) {
          scripts.push(script)
        }
      })
    }

    if (previousSnapshot && Math.abs(currentSnapshot.goldDiff - previousSnapshot.goldDiff) > 2000) {
      const isPositive = currentSnapshot.goldDiff > previousSnapshot.goldDiff
      const diff = Math.abs(currentSnapshot.goldDiff)
      scripts.push({
        timestamp: currentTime,
        text: isPositive 
          ? `Cloud9 extends their gold lead to ${Math.round(diff)} gold`
          : `The gold deficit has increased to ${Math.round(diff)} gold. Cloud9 needs to stabilize`,
        priority: 'medium'
      })
    }

    if (currentTime % 300 === 0 && currentTime > 0 && currentTime - this.lastNarrationTime > 20) {
      const status = this.generateStatusUpdate(currentSnapshot, currentTime)
      if (status) {
        scripts.push(status)
      }
    }

    return scripts
  }

  private eventToNarration(event: ReplayEvent, snapshot: ReplaySnapshot): NarrationScript | null {
    let text = ''
    let priority: 'high' | 'medium' | 'low' = 'medium'

    switch (event.type) {
      case 'objective':
        if (event.data?.objective === 'baron') {
          text = `Baron secured by Cloud9 at ${formatGameTime(event.timestamp)}. This could be the game-changing moment`
          priority = 'high'
        } else if (event.data?.objective === 'dragon') {
          text = `Cloud9 secures another dragon at ${formatGameTime(event.timestamp)}`
          priority = 'medium'
        }
        break

      case 'mistake':
        if (event.impact === 'critical' || event.impact === 'high') {
          text = `Critical moment at ${formatGameTime(event.timestamp)}. ${event.playerName} ${event.description.toLowerCase()}`
          if (event.data?.outcome) {
            text += `. ${event.data.outcome}`
          }
          priority = event.impact === 'critical' ? 'high' : 'medium'
        }
        break

      case 'kill':
        const killText = event.description
        if (Math.random() > 0.7) {
          text = `${killText} at ${formatGameTime(event.timestamp)}`
          priority = 'low'
        }
        break
    }

    if (text) {
      return {
        timestamp: event.timestamp,
        text,
        priority,
        event
      }
    }

    return null
  }

  private generateStatusUpdate(snapshot: ReplaySnapshot, currentTime: number): NarrationScript | null {
    const goldDiff = snapshot.goldDiff
    const isWinning = goldDiff > 0
    const minutes = Math.floor(currentTime / 60)

    let text = `At ${minutes} minutes, `

    if (isWinning) {
      text += `Cloud9 is ahead with a ${Math.round(goldDiff)} gold advantage. `
    } else {
      text += `Cloud9 is behind by ${Math.round(Math.abs(goldDiff))} gold. `
    }

    const totalKills = snapshot.players.reduce((sum, p) => sum + p.kills, 0)
    text += `The team has ${totalKills} kills. `

    if (snapshot.objectives.dragons > 0) {
      text += `${snapshot.objectives.dragons} dragons secured. `
    }

    if (snapshot.objectives.barons > 0) {
      text += `Baron has been taken. `
    }

    return {
      timestamp: currentTime,
      text,
      priority: 'low'
    }
  }

  speak(script: NarrationScript) {
    if (!this.isEnabled || !this.synthesis || !this.voice) return

    if (this.currentUtterance) {
      this.synthesis.cancel()
    }

    this.lastNarrationTime = script.timestamp

    const utterance = new SpeechSynthesisUtterance(script.text)
    utterance.voice = this.voice
    utterance.rate = this.rate
    utterance.pitch = this.pitch
    utterance.volume = this.volume

    utterance.onend = () => {
      this.currentUtterance = null
      this.processQueue()
    }

    utterance.onerror = () => {
      this.currentUtterance = null
      this.processQueue()
    }

    this.currentUtterance = utterance
    this.synthesis.speak(utterance)
  }

  queueNarration(scripts: NarrationScript[]) {
    scripts.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return a.timestamp - b.timestamp
    })

    this.queue.push(...scripts)
    this.processQueue()
  }

  private processQueue() {
    if (!this.isEnabled || this.currentUtterance || this.queue.length === 0) {
      return
    }

    const nextScript = this.queue.shift()
    if (nextScript) {
      this.speak(nextScript)
    }
  }

  isSpeaking(): boolean {
    return this.currentUtterance !== null
  }
}

export function generateMatchNarrationScript(
  snapshot: ReplaySnapshot,
  previousSnapshot: ReplaySnapshot | null
): string[] {
  const narrations: string[] = []

  snapshot.events.forEach(event => {
    if (event.type === 'objective' && event.data?.objective === 'baron') {
      narrations.push(`Baron Nashor secured at ${formatGameTime(event.timestamp)}`)
    } else if (event.type === 'objective' && event.data?.objective === 'dragon') {
      narrations.push(`Dragon secured at ${formatGameTime(event.timestamp)}`)
    } else if (event.type === 'mistake' && (event.impact === 'critical' || event.impact === 'high')) {
      narrations.push(`${event.playerName}: ${event.description}`)
    }
  })

  return narrations
}
