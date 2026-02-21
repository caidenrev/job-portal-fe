"use client"

import { useState, useEffect, useRef } from "react"
import { API_URL } from "@/lib/api-config"
import { io, Socket } from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, MessageCircle, User, Briefcase } from "lucide-react"

interface Message {
    id: number
    conversationId: number
    senderId: number
    content: string
    createdAt: string
    sender: {
        id: number
        name: string
    }
}

interface Conversation {
    id: number
    jobId: number
    job: { title: string }
    applicant: { id: number, name: string, profileImageUrl?: string }
    messages: Message[]
}

export default function HRMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [socket, setSocket] = useState<Socket | null>(null)
    const [myUserId, setMyUserId] = useState<number | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")

        // Decode token to get user ID
        try {
            if (token) {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                setMyUserId(JSON.parse(jsonPayload).id);
            }
        } catch (e) { }

        const fetchInbox = async () => {
            const res = await fetch(`${API_URL}/api/chat/inbox`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setConversations(data)

                // Jika URL ada query params ?id=, buka percakapan tersebut otomatis
                const urlParams = new URLSearchParams(window.location.search)
                const convIdParam = urlParams.get('id')
                if (convIdParam) {
                    const matchedConv = data.find((c: Conversation) => c.id === parseInt(convIdParam))
                    if (matchedConv) setActiveConversation(matchedConv)
                }
            }
        }
        fetchInbox()

        // Init Socket
        const socketUrl = API_URL || window.location.origin
        const newSocket = io(socketUrl, {
            path: '/socket.io',
            transports: ['polling', 'websocket'], // Biarkan polling jalan dulu baru upgrade
            secure: true
        })
        setSocket(newSocket)

        newSocket.on("inbox_update", () => {
            fetchInbox()
        })

        return () => {
            newSocket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (activeConversation && socket) {
            // Join Room
            socket.emit("join_room", activeConversation.id)

            // Fetch detailed messages
            const fetchMessages = async () => {
                const token = localStorage.getItem("token")
                const res = await fetch(`${API_URL}/api/chat/${activeConversation.id}/messages`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                if (res.ok) {
                    try {
                        const data = await res.json()
                        setMessages(Array.isArray(data) ? data : [])
                    } catch (e) {
                        console.error("Gagal parse pesan:", e)
                        setMessages([])
                    }
                }
            }
            fetchMessages()

            // Listen for new messages
            socket.on("receive_message", (msg: Message) => {
                if (msg.conversationId === activeConversation.id) {
                    setMessages(prev => [...prev, msg])
                }
            })

            return () => {
                socket.off("receive_message")
            }
        }
    }, [activeConversation, socket])

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeConversation || !socket || !myUserId) return

        socket.emit("send_message", {
            conversationId: activeConversation.id,
            senderId: myUserId,
            content: newMessage.trim()
        })

        setNewMessage("")
    }

    return (
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-[80vh]">

            {/* Sidebar Inbox */}
            <Card className="md:col-span-1 flex flex-col h-full bg-background/50 backdrop-blur-sm">
                <CardHeader className="border-b pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" /> Pesan Kandidat
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto flex-1">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                            <MessageCircle className="w-10 h-10 opacity-20" />
                            <p>Belum ada obrolan.</p>
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConversation(conv)}
                                className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${activeConversation?.id === conv.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        {conv.applicant.profileImageUrl ? (
                                            <img src={conv.applicant.profileImageUrl} className="w-full h-full rounded-full object-cover" alt="Pelamar" />
                                        ) : (
                                            <User className="w-5 h-5 text-primary" />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-semibold truncate text-sm">{conv.applicant.name}</h4>
                                        <p className="text-xs text-primary font-medium truncate flex items-center gap-1">
                                            <Briefcase className="w-3 h-3" /> {conv.job?.title || "Lowongan"}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate mt-1">
                                            {conv.messages && conv.messages[0] ? conv.messages[0].content : "Mulai percakapan..."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="md:col-span-2 flex flex-col h-full bg-background/50 backdrop-blur-sm">
                {activeConversation ? (
                    <>
                        <CardHeader className="border-b py-4 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center overflow-hidden bg-background">
                                        {activeConversation.applicant.profileImageUrl ? (
                                            <img src={activeConversation.applicant.profileImageUrl} alt="Pelamar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{activeConversation.applicant.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            Melamar: {activeConversation.job?.title || "Lowongan"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId === myUserId
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${isMe
                                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                            : 'bg-muted border border-border/50 rounded-tl-sm'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right opacity-70`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </CardContent>

                        <div className="p-4 bg-background border-t">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Balas pesan pelamar..."
                                    className="flex-1 bg-muted/30"
                                />
                                <Button type="submit" disabled={!newMessage.trim()} className="shrink-0 gap-2">
                                    <Send className="w-4 h-4" /> Kirim
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-60">
                        <MessageCircle className="w-16 h-16 mb-4" />
                        <p>Pilih percakapan untuk mulai bertukar pesan dengan pelamar</p>
                    </div>
                )}
            </Card>

        </div>
    )
}
