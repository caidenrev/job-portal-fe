"use client"

import { useState, useEffect } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDown, RefreshCw, Mail, Users } from "lucide-react"

interface Candidate {
    id: number
    cvUrl: string
    status: string
    createdAt: string
    applicant: {
        name: string
        email: string
        phone: string | null
    }
    job: {
        title: string
    }
}

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)

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
        </div>
    )
}
