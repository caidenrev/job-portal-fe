"use client"

import { useState } from "react"
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

// Dummy data
const MOCK_CANDIDATES = [
    {
        id: 1,
        name: "Eka Pramudia",
        email: "eka@example.com",
        jobTitle: "Frontend Developer",
        appliedDate: "12 Okt 2024",
        status: "PENDING",
        cvUrl: "#"
    },
    {
        id: 2,
        name: "Budi Santoso",
        email: "budi@example.com",
        jobTitle: "Backend Developer",
        appliedDate: "11 Okt 2024",
        status: "REVIEWED",
        cvUrl: "#"
    },
    {
        id: 3,
        name: "Siti Rahma",
        email: "siti@example.com",
        jobTitle: "UI/UX Designer",
        appliedDate: "10 Okt 2024",
        status: "INTERVIEW",
        cvUrl: "#"
    }
]

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState(MOCK_CANDIDATES)

    const handleStatusChange = (id: number, newStatus: string) => {
        setCandidates(candidates.map(c =>
            c.id === id ? { ...c, status: newStatus } : c
        ))
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "PENDING": return "secondary"
            case "REVIEWED": return "default"
            case "INTERVIEW": return "default" // we will override bg in classname
            case "ACCEPTED": return "default" // override bg
            case "REJECTED": return "destructive"
            default: return "secondary"
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
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Segarkan Data
                </Button>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
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
                        {candidates.map((candidate) => (
                            <TableRow key={candidate.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{candidate.name}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Mail className="w-3 h-3" /> {candidate.email}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{candidate.jobTitle}</TableCell>
                                <TableCell className="text-muted-foreground">{candidate.appliedDate}</TableCell>
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

                                        {/* Dropdown HTML biasa untuk cepat ganti status */}
                                        <select
                                            value={candidate.status}
                                            onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                                            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
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
            </div>
        </div>
    )
}
