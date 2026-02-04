import type { Player, Match, Mistake, Insight, PlayerAnalytics, StrategicImpact, Team } from './types'

export type ExportFormat = 'csv' | 'pdf'

export interface ExportOptions {
  format: ExportFormat
  includeCharts?: boolean
  dateRange?: {
    start: string
    end: string
  }
}

export interface TeamAnalyticsExport {
  players: Player[]
  matches: Match[]
  mistakes: Mistake[]
  insights: Insight[]
  strategicImpacts: StrategicImpact[]
  teams?: Team[]
  generatedAt: string
  reportTitle: string
}

export interface PlayerAnalyticsExport {
  player: Player
  analytics: PlayerAnalytics
  recentMatches: Match[]
  mistakes: Mistake[]
  generatedAt: string
}

function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function arrayToCSV(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const headerRow = headers.map(escapeCSV).join(',')
  const dataRows = rows.map(row => row.map(escapeCSV).join(','))
  return [headerRow, ...dataRows].join('\n')
}

export function exportPlayersToCSV(players: Player[]): string {
  const headers = ['Player ID', 'Name', 'Role', 'KDA', 'Win Rate (%)', 'Games Played']
  const rows = players.map(p => [
    p.id,
    p.name,
    p.role,
    p.kda.toFixed(2),
    p.winRate,
    p.gamesPlayed
  ])
  return arrayToCSV(headers, rows)
}

export function exportMatchesToCSV(matches: Match[]): string {
  const headers = ['Match ID', 'Date', 'Opponent', 'Result', 'Score', 'Duration (min)', 'Dragons', 'Barons', 'Towers', 'Format', 'Tournament']
  const rows = matches.map(m => [
    m.id,
    m.date,
    m.opponent,
    m.result.toUpperCase(),
    m.score || 'N/A',
    Math.round(m.duration / 60),
    m.objectives.dragons,
    m.objectives.barons,
    m.objectives.towers,
    m.format?.nameShortened || 'N/A',
    m.tournament?.nameShortened || 'N/A'
  ])
  return arrayToCSV(headers, rows)
}

export function exportMistakesToCSV(mistakes: Mistake[]): string {
  const headers = ['Mistake ID', 'Player', 'Category', 'Description', 'Impact', 'Match ID', 'Game Time', 'Outcome', 'Map Zone']
  const rows = mistakes.map(m => [
    m.id,
    m.playerName,
    m.category,
    m.description,
    m.impact,
    m.matchId,
    `${Math.floor(m.gameTime / 60)}:${String(m.gameTime % 60).padStart(2, '0')}`,
    m.outcome,
    m.mapPosition?.zone || 'N/A'
  ])
  return arrayToCSV(headers, rows)
}

export function exportInsightsToCSV(insights: Insight[]): string {
  const headers = ['Insight ID', 'Type', 'Severity', 'Title', 'Description', 'Affected Players', 'Frequency', 'Win Rate Impact (%)', 'Confidence (%)']
  const rows = insights.map(i => [
    i.id,
    i.type,
    i.severity,
    i.title,
    i.description,
    i.affectedPlayers.join('; '),
    i.frequency,
    i.impactOnWinRate.toFixed(1),
    i.confidence
  ])
  return arrayToCSV(headers, rows)
}

export function exportStrategicImpactsToCSV(impacts: StrategicImpact[]): string {
  const headers = ['Mistake Category', 'Occurrences', 'Avg Time to Objective Loss (s)', 'Win Rate Impact (%)', 'Objectives Lost']
  const rows = impacts.map(i => [
    i.mistakeCategory,
    i.occurrences,
    i.avgTimeToObjectiveLoss,
    i.winRateImpact.toFixed(1),
    i.objectivesLost
  ])
  return arrayToCSV(headers, rows)
}

export function exportPlayerAnalyticsToCSV(data: PlayerAnalyticsExport): string {
  const sections: string[] = []
  
  sections.push('PLAYER SUMMARY')
  sections.push(arrayToCSV(
    ['Player ID', 'Name', 'Role', 'KDA', 'Win Rate (%)', 'Games Played'],
    [[data.player.id, data.player.name, data.player.role, data.player.kda.toFixed(2), data.player.winRate, data.player.gamesPlayed]]
  ))
  
  if (data.player.biography) {
    const bio = data.player.biography
    sections.push('\nPLAYER BIOGRAPHY')
    const bioRows: (string | number | null)[][] = []
    if (bio.realName) bioRows.push(['Real Name', bio.realName])
    if (bio.nationality) bioRows.push(['Nationality', bio.nationality])
    if (bio.birthDate) {
      const birth = new Date(bio.birthDate)
      const today = new Date()
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      bioRows.push(['Age', `${age} years old`])
    }
    if (bio.hometown) bioRows.push(['Hometown', bio.hometown])
    if (bio.careerStart) bioRows.push(['Career Start', `${bio.careerStart} (${new Date().getFullYear() - bio.careerStart} years pro)`])
    if (bio.playstyle) bioRows.push(['Playstyle', bio.playstyle])
    if (bio.signature) bioRows.push(['Signature', bio.signature])
    bioRows.push(['Bio', bio.bio])
    sections.push(arrayToCSV(['Field', 'Value'], bioRows))
  }
  
  if (data.player.careerHistory && data.player.careerHistory.length > 0) {
    sections.push('\nCAREER HISTORY')
    sections.push(arrayToCSV(
      ['Year', 'Event', 'Achievement', 'Team', 'Game'],
      data.player.careerHistory
        .sort((a, b) => b.year - a.year)
        .map(m => [m.year, m.event, m.achievement, m.team || 'N/A', m.title || 'N/A'])
    ))
  }
  
  sections.push('\nTOP MISTAKES')
  sections.push(arrayToCSV(
    ['Category', 'Count', 'Trend'],
    data.analytics.topMistakes.map(m => [m.category, m.count, m.trend])
  ))
  
  sections.push('\nPERFORMANCE TREND')
  sections.push(arrayToCSV(
    ['Date', 'KDA', 'Mistakes'],
    data.analytics.performanceTrend.map(p => [p.date, p.kda.toFixed(2), p.mistakes])
  ))
  
  sections.push('\nCOMPARED TO TEAM AVERAGE')
  sections.push(arrayToCSV(
    ['Metric', 'Value'],
    [
      ['KDA', data.analytics.comparedToAverage.kda.toFixed(2)],
      ['Mistake Frequency', data.analytics.comparedToAverage.mistakeFrequency.toFixed(2)],
      ['Objective Contribution', data.analytics.comparedToAverage.objectiveContribution.toFixed(2)]
    ]
  ))
  
  sections.push('\nRECENT MISTAKES')
  sections.push(exportMistakesToCSV(data.mistakes))
  
  sections.push(`\nReport Generated: ${data.generatedAt}`)
  
  return sections.join('\n')
}

export function exportTeamAnalyticsToCSV(data: TeamAnalyticsExport): string {
  const sections: string[] = []
  
  sections.push(`${data.reportTitle.toUpperCase()}`)
  sections.push(`Generated: ${data.generatedAt}\n`)
  
  sections.push('TEAM ROSTER')
  sections.push(exportPlayersToCSV(data.players))
  
  sections.push('\nMATCH HISTORY')
  sections.push(exportMatchesToCSV(data.matches))
  
  sections.push('\nMISTAKE LOG')
  sections.push(exportMistakesToCSV(data.mistakes))
  
  sections.push('\nAI INSIGHTS')
  sections.push(exportInsightsToCSV(data.insights))
  
  sections.push('\nSTRATEGIC IMPACT ANALYSIS')
  sections.push(exportStrategicImpactsToCSV(data.strategicImpacts))
  
  return sections.join('\n')
}

export function generatePDFContent(data: TeamAnalyticsExport | PlayerAnalyticsExport): string {
  const isTeamReport = 'players' in data
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #00c8ff;
      border-bottom: 3px solid #00c8ff;
      padding-bottom: 10px;
      margin-bottom: 30px;
      font-size: 32px;
    }
    h2 {
      color: #333;
      margin-top: 40px;
      margin-bottom: 20px;
      font-size: 24px;
      border-left: 4px solid #00c8ff;
      padding-left: 15px;
    }
    h3 {
      color: #555;
      margin-top: 25px;
      margin-bottom: 15px;
      font-size: 18px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    th {
      background-color: #00c8ff;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .metric-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      border-radius: 8px;
      color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .metric-label {
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: bold;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-critical { background-color: #ef4444; color: white; }
    .badge-high { background-color: #f59e0b; color: white; }
    .badge-medium { background-color: #eab308; color: white; }
    .badge-low { background-color: #10b981; color: white; }
    .badge-win { background-color: #10b981; color: white; }
    .badge-loss { background-color: #ef4444; color: white; }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>
`

  if (isTeamReport) {
    const teamData = data as TeamAnalyticsExport
    
    html += `
  <h1>${teamData.reportTitle}</h1>
  <p style="color: #666; margin-bottom: 30px;">Generated: ${teamData.generatedAt}</p>
  
  <div class="metric-grid">
    <div class="metric-card">
      <div class="metric-label">Total Players</div>
      <div class="metric-value">${teamData.players.length}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Matches Analyzed</div>
      <div class="metric-value">${teamData.matches.length}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Mistakes Tracked</div>
      <div class="metric-value">${teamData.mistakes.length}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Critical Insights</div>
      <div class="metric-value">${teamData.insights.filter(i => i.severity === 'critical').length}</div>
    </div>
  </div>

  <h2>Team Roster</h2>
  <table>
    <thead>
      <tr>
        <th>Player</th>
        <th>Role</th>
        <th>KDA</th>
        <th>Win Rate</th>
        <th>Games</th>
      </tr>
    </thead>
    <tbody>
      ${teamData.players.map(p => `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.role}</td>
          <td>${p.kda.toFixed(2)}</td>
          <td>${p.winRate}%</td>
          <td>${p.gamesPlayed}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>Match History</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Opponent</th>
        <th>Result</th>
        <th>Score</th>
        <th>Duration</th>
        <th>Dragons</th>
        <th>Barons</th>
        <th>Towers</th>
      </tr>
    </thead>
    <tbody>
      ${teamData.matches.map(m => `
        <tr>
          <td>${m.date}</td>
          <td>${m.opponent}</td>
          <td><span class="badge badge-${m.result}">${m.result.toUpperCase()}</span></td>
          <td>${m.score || 'N/A'}</td>
          <td>${Math.round(m.duration / 60)} min</td>
          <td>${m.objectives.dragons}</td>
          <td>${m.objectives.barons}</td>
          <td>${m.objectives.towers}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>AI-Generated Insights</h2>
  <table>
    <thead>
      <tr>
        <th>Severity</th>
        <th>Type</th>
        <th>Title</th>
        <th>Impact</th>
        <th>Confidence</th>
      </tr>
    </thead>
    <tbody>
      ${teamData.insights.map(i => `
        <tr>
          <td><span class="badge badge-${i.severity}">${i.severity}</span></td>
          <td>${i.type}</td>
          <td><strong>${i.title}</strong></td>
          <td>${i.impactOnWinRate.toFixed(1)}%</td>
          <td>${i.confidence}%</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>Mistake Analysis</h2>
  <table>
    <thead>
      <tr>
        <th>Player</th>
        <th>Category</th>
        <th>Impact</th>
        <th>Description</th>
        <th>Game Time</th>
      </tr>
    </thead>
    <tbody>
      ${teamData.mistakes.slice(0, 50).map(m => `
        <tr>
          <td>${m.playerName}</td>
          <td>${m.category}</td>
          <td><span class="badge badge-${m.impact}">${m.impact}</span></td>
          <td>${m.description}</td>
          <td>${Math.floor(m.gameTime / 60)}:${String(m.gameTime % 60).padStart(2, '0')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ${teamData.mistakes.length > 50 ? `<p style="color: #666; font-style: italic;">Showing first 50 of ${teamData.mistakes.length} mistakes. Export to CSV for full data.</p>` : ''}

  <h2>Strategic Impact Analysis</h2>
  <table>
    <thead>
      <tr>
        <th>Mistake Category</th>
        <th>Occurrences</th>
        <th>Avg Time to Obj Loss</th>
        <th>Win Rate Impact</th>
        <th>Objectives Lost</th>
      </tr>
    </thead>
    <tbody>
      ${teamData.strategicImpacts.map(i => `
        <tr>
          <td><strong>${i.mistakeCategory}</strong></td>
          <td>${i.occurrences}</td>
          <td>${i.avgTimeToObjectiveLoss}s</td>
          <td>${i.winRateImpact.toFixed(1)}%</td>
          <td>${i.objectivesLost}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`
  } else {
    const playerData = data as PlayerAnalyticsExport
    
    html += `
  <h1>Player Analytics Report: ${playerData.player.name}</h1>
  <p style="color: #666; margin-bottom: 30px;">Generated: ${playerData.generatedAt}</p>
  
  <div class="metric-grid">
    <div class="metric-card">
      <div class="metric-label">KDA</div>
      <div class="metric-value">${playerData.player.kda.toFixed(2)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Win Rate</div>
      <div class="metric-value">${playerData.player.winRate}%</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Games Played</div>
      <div class="metric-value">${playerData.player.gamesPlayed}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Role</div>
      <div class="metric-value" style="font-size: 20px;">${playerData.player.role}</div>
    </div>
  </div>
`

    if (playerData.player.biography) {
      const bio = playerData.player.biography
      html += `
  <h2>Player Biography</h2>
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
      ${bio.realName ? `<div><strong>Real Name:</strong> ${bio.realName}</div>` : ''}
      ${bio.nationality ? `<div><strong>Nationality:</strong> ${bio.nationality}</div>` : ''}
      ${bio.hometown ? `<div><strong>Hometown:</strong> ${bio.hometown}</div>` : ''}
      ${bio.careerStart ? `<div><strong>Pro Since:</strong> ${bio.careerStart} (${new Date().getFullYear() - bio.careerStart} years)</div>` : ''}
      ${bio.playstyle ? `<div><strong>Playstyle:</strong> ${bio.playstyle}</div>` : ''}
      ${bio.signature ? `<div><strong>Signature:</strong> ${bio.signature}</div>` : ''}
    </div>
    <div style="border-top: 2px solid #dee2e6; padding-top: 15px;">
      <strong>About:</strong>
      <p style="margin-top: 10px; line-height: 1.8;">${bio.bio}</p>
    </div>
  </div>
`
    }

    if (playerData.player.careerHistory && playerData.player.careerHistory.length > 0) {
      html += `
  <h2>Career History</h2>
  <table>
    <thead>
      <tr>
        <th>Year</th>
        <th>Event</th>
        <th>Achievement</th>
        <th>Team</th>
        <th>Game</th>
      </tr>
    </thead>
    <tbody>
      ${playerData.player.careerHistory.sort((a, b) => b.year - a.year).map(milestone => `
        <tr>
          <td><strong>${milestone.year}</strong></td>
          <td>${milestone.event}</td>
          <td>${milestone.achievement}</td>
          <td>${milestone.team || 'N/A'}</td>
          <td>${milestone.title || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`
    }

    html += `
  <h2>Top Mistake Categories</h2>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Count</th>
        <th>Trend</th>
      </tr>
    </thead>
    <tbody>
      ${playerData.analytics.topMistakes.map(m => `
        <tr>
          <td><strong>${m.category}</strong></td>
          <td>${m.count}</td>
          <td>${m.trend === 'improving' ? '📈' : m.trend === 'declining' ? '📉' : '➡️'} ${m.trend}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Performance vs Team Average</h2>
  <table>
    <thead>
      <tr>
        <th>Metric</th>
        <th>Relative Performance</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>KDA</td>
        <td>${playerData.analytics.comparedToAverage.kda > 0 ? '+' : ''}${playerData.analytics.comparedToAverage.kda.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Mistake Frequency</td>
        <td>${playerData.analytics.comparedToAverage.mistakeFrequency > 0 ? '+' : ''}${playerData.analytics.comparedToAverage.mistakeFrequency.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Objective Contribution</td>
        <td>${playerData.analytics.comparedToAverage.objectiveContribution > 0 ? '+' : ''}${playerData.analytics.comparedToAverage.objectiveContribution.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <h2>Recent Mistakes</h2>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Impact</th>
        <th>Description</th>
        <th>Game Time</th>
        <th>Outcome</th>
      </tr>
    </thead>
    <tbody>
      ${playerData.mistakes.map(m => `
        <tr>
          <td>${m.category}</td>
          <td><span class="badge badge-${m.impact}">${m.impact}</span></td>
          <td>${m.description}</td>
          <td>${Math.floor(m.gameTime / 60)}:${String(m.gameTime % 60).padStart(2, '0')}</td>
          <td>${m.outcome}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`
  }

  html += `
  <div class="footer">
    <p><strong>Assistant Coach - Cloud9 Esports Analytics Platform</strong></p>
    <p>Powered by GRID API | AI-Enhanced Performance Analysis</p>
  </div>
</body>
</html>
`

  return html
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportTeamAnalytics(
  data: TeamAnalyticsExport,
  format: ExportFormat
): void {
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `team-analytics-${timestamp}`

  if (format === 'csv') {
    const csv = exportTeamAnalyticsToCSV(data)
    downloadFile(csv, `${filename}.csv`, 'text/csv')
  } else if (format === 'pdf') {
    const html = generatePDFContent(data)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }
}

export function exportPlayerAnalytics(
  data: PlayerAnalyticsExport,
  format: ExportFormat
): void {
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `player-analytics-${data.player.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`

  if (format === 'csv') {
    const csv = exportPlayerAnalyticsToCSV(data)
    downloadFile(csv, `${filename}.csv`, 'text/csv')
  } else if (format === 'pdf') {
    const html = generatePDFContent(data)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }
}
