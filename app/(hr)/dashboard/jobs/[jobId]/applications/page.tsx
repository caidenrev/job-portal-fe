"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { API_URL } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, FileText, CheckCircle2, XCircle, Clock } from "lucide-react"

interface Applicant {
    id: number
    name: string
    email: string
    phone: string | null
    experience: string | null
    skills: string | null
}

interface Application {
    id: number
    jobId: number
    applicantId: number
    cvUrl: string
    status: string
    createdAt: string
    applicant: Applicant
}

export default function JobApplicationsPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.jobId as string

    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const res = await fetch(`${API_URL}/api/jobs/${jobId}/applications`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!res.ok) {
                    if (res.status === 403 || res.status === 404) {
                        throw new Error("Pekerjaan tidak ditemukan atau Anda tidak memiliki akses.")
                    }
                    throw new Error("Gagal mengambil data pelamar")
                }

                const data = await res.json()
                setApplications(data)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (jobId) {
            fetchApplications()
        }
    }, [jobId, router])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'REVIEWED': return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Sedang Direview</Badge>
            case 'INTERVIEW': return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Interview</Badge>
            case 'ACCEPTED': return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 justify-center mr-1" /> Diterima</Badge>
            case 'REJECTED': return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 justify-center mr-1" /> Ditolak</Badge>
            default: return <Badge variant="outline" className="text-muted-foreground"><Clock className="w-3 h-3 mr-1" /> Menunggu</Badge>
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-medium">Memuat daftar pelamar...</div>
    }

    if (error) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
                </Button>
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Daftar Pelamar</h1>
                    <p className="text-muted-foreground">Kelola kandidat untuk lowongan ini</p>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Pelamar</h3>
                    <p className="text-muted-foreground">Lowongan ini belum menerima aplikasi lamaran apa pun sejauh ini.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => (
                        <Card key={app.id} className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                    <div>
                                        <CardTitle className="text-xl mb-1">{app.applicant.name}</CardTitle>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {app.applicant.email}</div>
                                            {app.applicant.phone && (
                                                <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {app.applicant.phone}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {getStatusBadge(app.status)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Riwayat Pengalaman</h4>
                                        <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">{app.applicant.experience || "Belum ada informasi pengalaman."}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Keahlian (Skills)</h4>
                                        <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">{app.applicant.skills || "Belum ada informasi keahlian."}</p>
                                    </div>
                                </div>
                                <div className="border-t border-border/40 pt-4 flex gap-4">
                                    <Button asChild variant="outline" className="gap-2">
                                        <a href={app.cvUrl} target="_blank" rel="noopener noreferrer">
                                            <FileText className="w-4 h-4" /> Lihat CV (Resume)
                                        </a>
                                    </Button>
                                    {/* Additional buttons to update status could go here */}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
