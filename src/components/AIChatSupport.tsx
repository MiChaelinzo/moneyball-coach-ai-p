import { useState, useRef, useEffect } from 'react'
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
    Cpu
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    mediaUrl?: string
    mediaType?: 'image' | 'video'
}

const SUGGESTED_PROMPTS = [
    "How do I interpret player analytics?",
    "What does the heatmap show?",
    "How can I track live matches?",
    "Explain the strategic impact metrics",
    "How do I export reports?",
    "What's the difference between titles?",
    "How to use the replay feature?",
    "Show me player transfer history"
]

export function AIChatSupport() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "👋 Hi! I'm your Assistant Coach AI helper. I can help you understand player analytics, interpret match data, explain features, and answer questions about the platform. How can I assist you today?",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [mediaPreview, setMediaPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollElement) {
                scrollElement.scrollTop = scrollElement.scrollHeight
            }
        }
    }, [messages])

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
                } else {
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

User question: ${prompt}

Provide a helpful, friendly, and concise response (2-3 paragraphs max). If the user uploaded media, acknowledge it and provide relevant insights about analyzing esports data visually.`

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')

        if (!isImage && !isVideo) {
            toast.error('Please upload an image or video file')
            return
        }

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
                                <div className="p-4 border-b border-border/50 bg-muted/30">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                        Suggested Questions
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-primary/20 hover:border-primary transition-colors text-xs"
                                                onClick={() => handleSuggestedPrompt(prompt)}
                                            >
                                                {prompt}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                                    <div className="space-y-4">
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
                                                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                    {message.mediaUrl && (
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
                                                    <div className={`inline-block p-3 rounded-lg ${
                                                        message.role === 'user'
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted text-foreground'
                                                    }`}>
                                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                        <p className={`text-xs mt-1 ${
                                                            message.role === 'user' 
                                                                ? 'text-primary-foreground/70' 
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
                                                    <div className="inline-block p-3 rounded-lg bg-muted">
                                                        <div className="flex gap-1">
                                                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                                                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                                                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </ScrollArea>

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

                                    <div className="flex gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,video/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Upload image"
                                        >
                                            <ImageIcon size={18} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Upload video"
                                        >
                                            <VideoCamera size={18} />
                                        </Button>
                                        <Button
                                            variant={isRecording ? "destructive" : "outline"}
                                            size="icon"
                                            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                                            title={isRecording ? "Stop recording" : "Voice chat"}
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
