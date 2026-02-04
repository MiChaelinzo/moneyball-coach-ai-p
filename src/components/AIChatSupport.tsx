import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    ChatCircleDots, 
    X, 
    PaperPlaneRight, 
    Image as ImageIcon, 
    VideoCamera, 
    Microphone, 
    Stop,
    Sparkle,
    User,
    Cpu,
    ArrowDown,
    ArrowUp,
    FileArrowUp,
    FileCsv,
    FileJs
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Player, Match, Tournament, Team } from '@/lib/types'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    mediaUrl?: string
    mediaType?: 'image' | 'video' | 'file'
    fileName?: string
}

interface AIChatSupportProps {
    onDataImport?: (data: {
        players?: Player[]
        matches?: Match[]
        tournaments?: Tournament[]
        teams?: Team[]
    }) => void
}

const SUGGESTED_PROMPTS = [
    "How do I interpret player analytics?",
    "What does the heatmap show?",
    "How can I track live matches?",
    "Explain the strategic impact metrics",
    "How do I export reports?",
    "What's the difference between titles?",
    "How to use the replay feature?",
    "Show me player transfer history",
    "How do I upload player data?",
    "What file formats are supported?"
]

export function AIChatSupport({ onDataImport }: AIChatSupportProps = {}) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "👋 Hi! I'm your Assistant Coach AI helper. I can help you understand player analytics, interpret match data, explain features, and answer questions about the platform.\n\n📁 You can also upload data files (JSON, CSV) to import player, team, tournament, or match data directly into the system.\n\nHow can I assist you today?",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [mediaPreview, setMediaPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [isAtBottom, setIsAtBottom] = useState(true)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const scrollToBottom = useCallback((smooth = true) => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollElement) {
                scrollElement.scrollTo({
                    top: scrollElement.scrollHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                })
            }
        }
    }, [])

    const scrollToTop = useCallback(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollElement) {
                scrollElement.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        }
    }, [])

    const checkScrollPosition = useCallback(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollElement) {
                const { scrollTop, scrollHeight, clientHeight } = scrollElement
                const distanceFromBottom = scrollHeight - scrollTop - clientHeight
                const atBottom = distanceFromBottom < 50
                const shouldShowButton = scrollTop > 100
                
                setIsAtBottom(atBottom)
                setShowScrollButton(shouldShowButton)
            }
        }
    }, [])

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollElement) {
                scrollElement.addEventListener('scroll', checkScrollPosition)
                return () => scrollElement.removeEventListener('scroll', checkScrollPosition)
            }
        }
    }, [checkScrollPosition])

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom(true)
        }
    }, [messages, isAtBottom, scrollToBottom])

    const handleSendMessage = async () => {
        if (!input.trim() && !mediaPreview) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
            mediaUrl: mediaPreview?.url,
            mediaType: mediaPreview?.type
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            let prompt = input

            if (mediaPreview) {
                if (mediaPreview.type === 'image') {
                    prompt = `[User uploaded an image] ${input || 'Can you analyze this image?'}`
                    toast.info('Analyzing image...')
                } else if (mediaPreview.type === 'video') {
                    prompt = `[User uploaded a video] ${input || 'Can you analyze this video?'}`
                    toast.info('Analyzing video...')
                }
            }

            const aiPrompt = window.spark.llmPrompt`You are an AI assistant for the "Assistant Coach" esports analytics platform for Cloud9. 
            
Context about the platform:
- It tracks player performance across League of Legends, Valorant, and CS2
- Features include: player analytics, live match tracking, heatmaps, strategic insights, AI-powered analysis
- Users can view detailed stats like KDA, win rate, games played, and mistake tracking
- The platform integrates with Grid.gg API for real-time data
- Supports exporting reports in JSON, CSV, and markdown formats
- Has replay features, transfer history, and cross-title comparisons
- Users can import player, team, tournament, and match data via JSON or CSV file upload
- Data import supports both single entity arrays and multi-entity objects with nested data

User question: ${prompt}

Provide a helpful, friendly, and concise response (2-3 paragraphs max). If the user uploaded media, acknowledge it and provide relevant insights about analyzing esports data visually. If asked about data import, explain the supported formats.`

            const response = await window.spark.llm(aiPrompt)

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
            toast.success('Response received!')
        } catch (error) {
            toast.error('Failed to get response. Please try again.')
            console.error('AI Chat error:', error)
        } finally {
            setIsLoading(false)
            setMediaPreview(null)
        }
    }

    const handleSuggestedPrompt = (prompt: string) => {
        setInput(prompt)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')
        const isJSON = file.type === 'application/json' || file.name.endsWith('.json')
        const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv')

        if (isImage || isVideo) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const url = event.target?.result as string
                setMediaPreview({
                    url,
                    type: isImage ? 'image' : 'video'
                })
                toast.success(`${isImage ? 'Image' : 'Video'} uploaded successfully`)
            }
            reader.readAsDataURL(file)
        } else if (isJSON || isCSV) {
            const reader = new FileReader()
            reader.onload = async (event) => {
                const content = event.target?.result as string
                
                try {
                    let parsedData: any
                    
                    if (isJSON) {
                        parsedData = JSON.parse(content)
                    } else {
                        parsedData = parseCSV(content)
                    }

                    const importedData = {
                        players: parsedData.players || (Array.isArray(parsedData) && parsedData[0]?.name ? parsedData : undefined),
                        matches: parsedData.matches,
                        tournaments: parsedData.tournaments,
                        teams: parsedData.teams
                    }

                    const dataTypes = Object.entries(importedData)
                        .filter(([_, value]) => value && value.length > 0)
                        .map(([key, value]) => `${(value as any[]).length} ${key}`)
                        .join(', ')

                    if (dataTypes) {
                        if (onDataImport) {
                            onDataImport(importedData)
                        }
                        
                        const userMessage: Message = {
                            id: Date.now().toString(),
                            role: 'user',
                            content: `Uploaded data file: ${file.name}`,
                            timestamp: new Date(),
                            fileName: file.name,
                            mediaType: 'file'
                        }
                        
                        const assistantMessage: Message = {
                            id: (Date.now() + 1).toString(),
                            role: 'assistant',
                            content: `✅ Successfully imported ${dataTypes} from ${file.name}.\n\nThe data has been added to the system and is now available in the analytics dashboard. You can view the imported data in the respective tabs (Players, Teams, Tournaments, etc.).`,
                            timestamp: new Date()
                        }
                        
                        setMessages(prev => [...prev, userMessage, assistantMessage])
                        toast.success(`Data imported: ${dataTypes}`)
                    } else {
                        throw new Error('No valid data found in file')
                    }
                } catch (error) {
                    toast.error('Failed to parse data file. Please check the format.')
                    console.error('File parsing error:', error)
                }
            }
            reader.readAsText(file)
        } else {
            toast.error('Please upload an image, video, JSON, or CSV file')
        }
    }

    const parseCSV = (csvContent: string): any[] => {
        const lines = csvContent.split('\n').filter(line => line.trim())
        if (lines.length < 2) return []
        
        const headers = lines[0].split(',').map(h => h.trim())
        const data: any[] = []
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim())
            const row: any = {}
            headers.forEach((header, index) => {
                row[header] = values[index]
            })
            data.push(row)
        }
        
        return data
    }

    const startVoiceRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                
                toast.info('Processing voice input...')
                setInput('Voice message transcribed: [Voice chat feature - transcription would happen here with a speech-to-text API]')
                
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
            toast.success('Recording started...')
        } catch (error) {
            toast.error('Failed to access microphone')
            console.error('Voice recording error:', error)
        }
    }

    const stopVoiceRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            toast.info('Recording stopped')
        }
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-[420px] h-[600px] z-50"
                    >
                        <Card className="h-full flex flex-col shadow-2xl border-2 border-primary/20">
                            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/20">
                                            <ChatCircleDots size={24} weight="duotone" className="text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">AI Support</CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                Ask me anything about the platform
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="hover:bg-destructive/20"
                                    >
                                        <X size={20} />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                                <div className="border-b border-border/50 bg-muted/30 max-h-40 overflow-hidden">
                                    <div className="p-4 pb-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                            Suggested Questions
                                        </p>
                                    </div>
                                    <ScrollArea className="h-24 px-4 pb-4">
                                        <div className="flex flex-wrap gap-2 pr-4">
                                            {SUGGESTED_PROMPTS.map((prompt, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-primary/20 hover:border-primary transition-colors text-xs whitespace-nowrap"
                                                    onClick={() => handleSuggestedPrompt(prompt)}
                                                >
                                                    {prompt}
                                                </Badge>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>

                                <div className="relative flex-1 overflow-hidden">
                                    <ScrollArea ref={scrollAreaRef} className="h-full chat-scroll-area">
                                        <div className="space-y-4 p-4">
                                            {messages.map((message) => (
                                                <motion.div
                                                    key={message.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                                >
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                        message.role === 'user' 
                                                            ? 'bg-primary/20' 
                                                            : 'bg-accent/20'
                                                    }`}>
                                                        {message.role === 'user' ? (
                                                            <User size={16} weight="duotone" className="text-primary" />
                                                        ) : (
                                                            <Cpu size={16} weight="duotone" className="text-accent" />
                                                        )}
                                                    </div>
                                                    <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                        {message.mediaUrl && message.mediaType !== 'file' && (
                                                            <div className="mb-2">
                                                                {message.mediaType === 'image' ? (
                                                                    <img 
                                                                        src={message.mediaUrl} 
                                                                        alt="Uploaded" 
                                                                        className="max-w-full h-auto rounded-lg border border-border"
                                                                    />
                                                                ) : (
                                                                    <video 
                                                                        src={message.mediaUrl} 
                                                                        controls 
                                                                        className="max-w-full h-auto rounded-lg border border-border"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                        {message.fileName && (
                                                            <div className={`mb-2 flex items-center gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border">
                                                                    {message.fileName.endsWith('.json') ? (
                                                                        <FileJs size={16} weight="duotone" className="text-primary" />
                                                                    ) : (
                                                                        <FileCsv size={16} weight="duotone" className="text-success" />
                                                                    )}
                                                                    <span className="text-xs font-mono">{message.fileName}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className={`inline-block p-3 rounded-lg max-w-[85%] ${
                                                            message.role === 'user'
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-card border border-border text-foreground'
                                                        }`}>
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                                {message.content}
                                                            </p>
                                                            <p className={`text-xs mt-2 ${
                                                                message.role === 'user' 
                                                                    ? 'text-primary-foreground/80' 
                                                                    : 'text-muted-foreground'
                                                            }`}>
                                                                {message.timestamp.toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {isLoading && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex gap-3"
                                                >
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent/20">
                                                        <Cpu size={16} weight="duotone" className="text-accent" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="inline-block p-3 rounded-lg bg-card border border-border">
                                                            <div className="flex gap-1">
                                                                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </ScrollArea>

                                    <AnimatePresence>
                                        {showScrollButton && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute bottom-4 right-4 flex flex-col gap-2 z-10"
                                            >
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                                                    onClick={scrollToTop}
                                                    title="Scroll to top"
                                                >
                                                    <ArrowUp size={18} weight="bold" />
                                                </Button>
                                                {!isAtBottom && (
                                                    <Button
                                                        size="icon"
                                                        className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
                                                        onClick={() => scrollToBottom(true)}
                                                        title="Scroll to bottom"
                                                    >
                                                        <ArrowDown size={18} weight="bold" />
                                                    </Button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="p-4 border-t border-border/50 space-y-3">
                                    {mediaPreview && (
                                        <div className="relative">
                                            {mediaPreview.type === 'image' ? (
                                                <img 
                                                    src={mediaPreview.url} 
                                                    alt="Preview" 
                                                    className="max-h-24 rounded border border-border"
                                                />
                                            ) : (
                                                <video 
                                                    src={mediaPreview.url} 
                                                    className="max-h-24 rounded border border-border"
                                                />
                                            )}
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                onClick={() => setMediaPreview(null)}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex gap-2 flex-wrap">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,video/*,.json,.csv"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Upload image"
                                            className="flex-shrink-0"
                                        >
                                            <ImageIcon size={18} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Upload video"
                                            className="flex-shrink-0"
                                        >
                                            <VideoCamera size={18} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Upload data file (JSON/CSV)"
                                            className="flex-shrink-0"
                                        >
                                            <FileArrowUp size={18} />
                                        </Button>
                                        <Button
                                            variant={isRecording ? "destructive" : "outline"}
                                            size="icon"
                                            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                                            title={isRecording ? "Stop recording" : "Voice chat"}
                                            className="flex-shrink-0"
                                        >
                                            {isRecording ? <Stop size={18} /> : <Microphone size={18} />}
                                        </Button>
                                    </div>

                                    <div className="flex gap-2">
                                        <Textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Ask me anything..."
                                            className="resize-none min-h-[60px]"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleSendMessage()
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={(!input.trim() && !mediaPreview) || isLoading}
                                            size="icon"
                                            className="h-[60px] w-[60px] flex-shrink-0"
                                        >
                                            {isLoading ? (
                                                <Sparkle size={20} weight="duotone" className="animate-spin" />
                                            ) : (
                                                <PaperPlaneRight size={20} weight="duotone" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="fixed bottom-6 right-6 z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isOpen ? (
                            <X size={28} weight="bold" />
                        ) : (
                            <ChatCircleDots size={28} weight="duotone" />
                        )}
                    </motion.div>
                </Button>
                {!isOpen && (
                    <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </motion.div>
        </>
    )
}
