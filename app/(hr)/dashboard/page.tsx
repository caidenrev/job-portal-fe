"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api-config"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, LayoutDashboard, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Job {
    id: number
    title: string
    type: string
    status: string
    _count?: {
        applications: number
    }
    createdAt: string
}

export default function HRDashboard() {
    const router = useRouter()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const res = await fetch(`${API_URL}/api/jobs/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!res.ok) throw new Error("Gagal mengambil data dashboard")

                const data = await res.json()
                setJobs(data)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [router])

    const totalJobs = jobs.length
    const totalApplications = jobs.reduce((sum, job) => sum + (job._count?.applications || 0), 0)
    const activeJobs = jobs.filter(j => j.status === 'OPEN').length

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-medium">Memuat dashboard HR...</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <LayoutDashboard className="w-8 h-8 text-primary" />
                        </div>
                        Tinjauan HR
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Pantau performa lowongan dan kelola jumlah pelamar Anda.
                    </p>
                </div>
                <Button asChild className="shadow-sm shadow-primary/20 h-11 px-6 font-semibold transition-transform hover:scale-105">
                    <Link href="/post-job" className="flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" /> Buat Lowongan Baru
                    </Link>
                </Button>
            </div>

            {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {error}
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="bg-card/50 backdrop-blur-sm shadow-sm border-border/50 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Lowongan</CardTitle>
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-foreground">{totalJobs}</div>
                                <p className="text-sm text-muted-foreground mt-2 font-medium">{activeJobs} lowongan berstatus aktif</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm shadow-sm border-border/50 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Pelamar</CardTitle>
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-foreground">{totalApplications}</div>
                                <p className="text-sm text-muted-foreground mt-2 font-medium">Dari semua publikasi lowongan</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Job List */}
                    <div className="space-y-6 pt-4">
                        <h2 className="text-2xl font-bold tracking-tight border-b border-border/40 pb-4">Daftar Lowongan Saya</h2>
                        {jobs.length === 0 ? (
                            <div className="text-center py-16 bg-muted/20 border border-dashed border-border rounded-xl">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Lowongan</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Mulai tarik talenta terbaik dengan mempublikasikan lowongan pekerjaan pertama Anda.</p>
                                <Button asChild variant="default" size="lg" className="font-semibold shadow-md shadow-primary/20">
                                    <Link href="/post-job" className="flex items-center gap-2">
                                        <PlusCircle className="w-5 h-5" /> Buat Lowongan
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {jobs.map(job => (
                                    <Card key={job.id} className="hover:shadow-lg transition-all border-border/50 bg-card/60 backdrop-blur-sm group hover:-translate-y-1">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1.5">
                                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
                                                    <CardDescription className="text-sm font-medium">
                                                        Dibuat pada {new Date(job.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'} className={`font-semibold shrink-0 ${job.status === 'OPEN' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-none' : ''}`}>
                                                    {job.status === 'OPEN' ? 'AKTIF' : 'DITUTUP'}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border/30">
                                                <span className="text-foreground font-semibold px-2">{job.type.replace('_', ' ')}</span>
                                                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-sm">
                                                    <Users className="w-4 h-4" />
                                                    {job._count?.applications || 0} Pelamar
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}