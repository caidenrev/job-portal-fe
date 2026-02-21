"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api-config"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDown, RefreshCw, Mail, Users, Eye, Sparkles, Briefcase, BookOpen, MessageCircle } from "lucide-react"

interface Candidate {
    id: number
    cvUrl: string
    status: string
    createdAt: string
    jobId: number
    applicantId: number
    applicant: {
        name: string
        email: string
        phone: string | null
        bio?: string
        experience?: string
        skills?: string
        profileImageUrl?: string
        savedCvUrl?: string
    }
    job: {
        title: string
    }
}

export default function CandidatesPage() {
    const router = useRouter()
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const fetchCandidates = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${API_URL}/api/applications`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setCandidates(data)
            }
        } catch (error) {
            console.error("Failed to fetch candidates:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCandidates()
    }, [])

    const handleStatusChange = async (id: number, newStatus: string) => {
        // Optimistic UI Update
        const previousCandidates = [...candidates]
        setCandidates(candidates.map(c =>
            c.id === id ? { ...c, status: newStatus } : c
        ))

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${API_URL}/api/applications/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!res.ok) {
                throw new Error("Gagal update status")
            }
        } catch (error) {
            console.error("Error updating status:", error)
            alert("Gagal memperbarui status kandidat.")
            // Rollback
            setCandidates(previousCandidates)
        }
    }

    const startChatWithApplicant = async (candidate: Candidate) => {
        try {
            const token = localStorage.getItem("token")
            let hrId = 0

            // Extract HR id from JWT token to initialize chat correctly
            if (token) {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                hrId = JSON.parse(jsonPayload).id;
            }

            const res = await fetch(`${API_URL}/api/chat/init`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId: candidate.jobId,
                    hrId: hrId,
                    applicantId: candidate.applicantId
                })
            })

            if (res.ok) {
                router.push("/messages")
            } else {
                alert("Gagal menginisialisasi percakapan")
            }
        } catch (error) {
            console.error("Initiate chat error:", error)
        }
    }

    const getStatusColorClass = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-gray-100 text-gray-700 hover:bg-gray-200"
            case "REVIEWED": return "bg-blue-100 text-blue-700 hover:bg-blue-200"
            case "INTERVIEW": return "bg-purple-100 text-purple-700 hover:bg-purple-200"
            case "ACCEPTED": return "bg-green-100 text-green-700 hover:bg-green-200"
            case "REJECTED": return "bg-red-100 text-red-700 hover:bg-red-200"
            default: return ""
        }
    }

    return (
        <div className="space-y-6 max-w-[95%] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        Kelola Kandidat
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Tinjau pelamar dan perbarui status proses rekrutmen.
                    </p>
                </div>
                <Button onClick={fetchCandidates} disabled={loading} variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 transition-colors">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? "Menyegarkan..." : "Segarkan Data"}
                </Button>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm overflow-x-auto min-h-[400px]">
                {loading && candidates.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[400px]">
                        <p className="text-muted-foreground animate-pulse">Memuat data kandidat...</p>
                    </div>
                ) : (
                    <Table>
                        <TableCaption className="pb-4">Menampilkan daftar pelamar terbaru.</TableCaption>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-semibold text-foreground">Nama Pelamar</TableHead>
                                <TableHead className="font-semibold text-foreground">Posisi (Job)</TableHead>
                                <TableHead className="font-semibold text-foreground">Tanggal Apply</TableHead>
                                <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                                <TableHead className="font-semibold text-foreground text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {candidates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-32 text-muted-foreground font-medium">
                                        Belum ada kandidat sejauh ini.
                                    </TableCell>
                                </TableRow>
                            ) : candidates.map((candidate) => (
                                <TableRow key={candidate.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{candidate.applicant.name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <Mail className="w-3 h-3" /> {candidate.applicant.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{candidate.job.title}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(candidate.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={`font-semibold border-0 ${getStatusColorClass(candidate.status)}`}>
                                            {candidate.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2 text-xs">
                                            <Button title="Lihat Profil" variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 h-8 w-8" onClick={() => { setSelectedCandidate(candidate); setIsDialogOpen(true); }}>
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" asChild className="hover:text-primary hover:bg-primary/10">
                                                <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                                                    <FileDown className="w-4 h-4 mr-1" /> CV
                                                </a>
                                            </Button>

                                            <select
                                                value={candidate.status}
                                                onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                                                className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer hover:border-primary/50 transition-colors"
                                            >
                                                <option value="PENDING">Set Pending</option>
                                                <option value="REVIEWED">Set Reviewed</option>
                                                <option value="INTERVIEW">Set Interview</option>
                                                <option value="ACCEPTED">Set Accepted</option>
                                                <option value="REJECTED">Set Rejected</option>
                                            </select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Modal Detail Pelamar */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex justify-between items-start pt-2 px-1">
                            <div>
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                    Detail Pelamar
                                </DialogTitle>
                                <DialogDescription className="mt-1.5">
                                    Profil lengkap untuk kandidat posisi {selectedCandidate?.job?.title}.
                                </DialogDescription>
                            </div>
                            <Button
                                onClick={() => startChatWithApplicant(selectedCandidate!)}
                                className="gap-2 shadow-md shadow-primary/20"
                            >
                                <MessageCircle className="w-4 h-4" /> Mulai Chat
                            </Button>
                        </div>
                    </DialogHeader>

                    {selectedCandidate && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-start gap-4">
                                {selectedCandidate.applicant.profileImageUrl ? (
                                    <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 shadow-sm">
                                        <img src={selectedCandidate.applicant.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20 shadow-sm">
                                        <Users className="w-10 h-10 text-primary" />
                                    </div>
                                )}
                                <div className="space-y-1 mt-2">
                                    <h3 className="text-2xl font-extrabold">{selectedCandidate.applicant.name}</h3>
                                    <div className="text-sm text-muted-foreground grid gap-1">
                                        <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {selectedCandidate.applicant.email}</span>
                                        {selectedCandidate.applicant.phone && <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {selectedCandidate.applicant.phone}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-lg border-b pb-1 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Tentang / Ringkasan</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {selectedCandidate.applicant.bio || "Pelamar ini belum menuliskan ringkasan diri."}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg border-b pb-1 mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Pengalaman Pengguna</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {selectedCandidate.applicant.experience || "Pengalaman belum diisi."}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg border-b pb-1 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Kemampuan (Skills)</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {selectedCandidate.applicant.skills || "Belum ada kemampuan spesifik yang dilampirkan."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
