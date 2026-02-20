"use client"

import { useState, useEffect } from "react"
import NextLink from "next/link"
import { API_URL } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Sparkles, MapPin, Briefcase, Lock, Mail, KeyRound, ArrowRightCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Job {
    id: number
    title: string
    type: string
    status: string
    company: {
        name: string
        location: string
    }
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)

    // Form Application State
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [isApplying, setIsApplying] = useState(false)
    const [applySuccess, setApplySuccess] = useState(false)
    const [applyError, setApplyError] = useState("")

    // Login Modal State for Guests
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loginError, setLoginError] = useState("")

    // Profile State for Auto-Apply feature
    const [hasSavedProfile, setHasSavedProfile] = useState(false)

    useEffect(() => {
        const fetchJobsAndProfile = async () => {
            try {
                // Fetch Jobs
                const resJobs = await fetch(`${API_URL}/api/jobs`)
                if (!resJobs.ok) throw new Error('Failed to fetch jobs')
                const dataJobs = await resJobs.json()
                setJobs(dataJobs)

                // Fetch Profile if Logged In
                const token = localStorage.getItem('token')
                if (token) {
                    const resProfile = await fetch(`${API_URL}/api/users/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    if (resProfile.ok) {
                        const profileData = await resProfile.json()
                        // User can auto-apply if they have a saved CV
                        if (profileData.savedCvUrl) {
                            setHasSavedProfile(true)
                        }
                    }
                }

            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchJobsAndProfile()
    }, [])

    const handleApplyJob = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedJob) return

        // Cek validitas pengiriman CV
        if (!hasSavedProfile && !cvFile) {
            setApplyError("Anda wajib mengunggah CV baru atau melengkapi profil terlebih dahulu.");
            return;
        }

        setIsApplying(true)
        setApplyError("")

        try {
            const formData = new FormData()
            formData.append('jobId', selectedJob.id.toString())

            // Hanya lampirkan file jika user memilih file baru
            if (cvFile) {
                formData.append('cv', cvFile)
            }

            const token = localStorage.getItem('token')

            if (!token) {
                // Guest without token: show inline login modal instead of error
                setShowLoginModal(true)
                setIsApplying(false)
                return
            }

            const res = await fetch(`${API_URL}/api/apply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Gagal melamar pekerjaan')
            }

            setApplySuccess(true)
            setTimeout(() => {
                setApplySuccess(false)
                setSelectedJob(null)
            }, 3000)

        } catch (error: any) {
            console.error("Apply error:", error)
            setApplyError(error.message || "Terjadi kesalahan saat memproses lamaran.")
        } finally {
            setIsApplying(false)
        }
    }

    const resetModal = () => {
        setSelectedJob(null)
        setCvFile(null)
        setApplyError("")
        setApplySuccess(false)
        setShowLoginModal(false)
    }

    const handleGuestLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoggingIn(true)
        setLoginError("")

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Gagal login')
            }

            // Save token and role
            localStorage.setItem('token', data.token)
            localStorage.setItem('userRole', data.user.role)

            // Hide login modal, and proceed to submit the application
            setShowLoginModal(false)

            // Re-trigger the application submission now that token is present
            // We use standard synthetic event structure
            handleApplyJob({ preventDefault: () => { } } as React.FormEvent)

        } catch (error: any) {
            setLoginError(error.message)
        } finally {
            setIsLoggingIn(false)
        }
    }

    const isSubmitDisabled = isApplying || (!hasSavedProfile && !cvFile);

    return (
        <div className="space-y-8">
            {/* Header & Search Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-primary/5 p-6 rounded-xl border border-primary/10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Eksplor Lowongan</h1>
                    <p className="text-muted-foreground">Temukan pekerjaan yang cocok dengan keahlianmu.</p>
                </div>
                <div className="flex w-full md:w-1/2 max-w-sm items-center space-x-2">
                    <Input type="text" placeholder="Cari posisi, perusahaan..." className="bg-background" />
                    <Button type="submit">Cari</Button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-10">
                    <p className="text-muted-foreground animate-pulse">Memuat daftar lowongan API Backend...</p>
                </div>
            )}

            {!loading && jobs.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Belum ada lowongan pekerjaan yang tersedia saat ini.</p>
                </div>
            )}

            {/* Grid Lowongan Pekerjaan */}
            {!loading && jobs.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <Card key={job.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow border-border/50">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
                                        <CardDescription className="font-medium text-foreground">
                                            {job.company?.name || "Perusahaan Anonim"}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-semibold">
                                        {job.type}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" /> {job.company?.location || "Lokasi tidak diketahui"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-muted-foreground" /> Status: <span className="font-semibold text-foreground">{job.status}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full font-semibold shadow-sm"
                                    onClick={() => setSelectedJob(job)}
                                >
                                    Lamar Sekarang
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal Lamar Pekerjaan */}
            <Dialog open={selectedJob !== null} onOpenChange={(open) => !open && resetModal()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Kirim Lamaran</DialogTitle>
                        <DialogDescription>
                            Anda akan melamar untuk posisi <span className="font-semibold text-primary">{selectedJob?.title}</span> di {selectedJob?.company?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    {applySuccess ? (
                        <div className="py-6 text-center text-green-600 space-y-2">
                            <h3 className="font-bold text-lg">Lamaran Berhasil Terkirim!</h3>
                            <p className="text-sm text-muted-foreground">CV Anda telah masuk ke sistem HRD.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleApplyJob} className="space-y-6 py-4">

                            {hasSavedProfile ? (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                                    <h4 className="font-semibold text-green-800 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Fitur 1-Click Apply Aktif
                                    </h4>
                                    <p className="text-sm text-green-700">
                                        Sistem akan mengirimkan Biodata Lengkap dan CV yang telah tersimpan di Profil Anda.
                                    </p>
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <Label htmlFor="cv" className="font-medium">
                                    {hasSavedProfile ? "Timpa dengan CV Baru (Opsional)" : "Sertakan File CV Anda (PDF)"}
                                </Label>
                                <Input
                                    id="cv"
                                    type="file"
                                    accept=".pdf"
                                    required={!hasSavedProfile}
                                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                    className="cursor-pointer file:text-primary file:font-semibold"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Maksimal ukuran file 5MB. File akan diunggah ke Amazon S3 Cloud.
                                </p>
                            </div>

                            {applyError && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                                    {applyError}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
                                {isApplying
                                    ? "Memproses Lamaran..."
                                    : (hasSavedProfile && !cvFile ? "Lamar dengan Profil Saya" : "Kirim Lamaran Sekarang")
                                }
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Inline Login untuk Guest */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="sm:max-w-md border-white/10 glass shadow-2xl overflow-hidden p-0">
                    <div className="bg-primary/10 p-6 flex flex-col items-center text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2 shadow-inner">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-extrabold tracking-tight">Login Diperlukan</DialogTitle>
                            <DialogDescription className="text-muted-foreground font-medium">
                                Masuk ke akun Anda untuk melamar di <span className="text-primary font-bold italic">{selectedJob?.company?.name}</span>
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-8 pt-4">
                        <form onSubmit={handleGuestLogin} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email" className="flex items-center gap-2 text-sm font-bold">
                                        <Mail className="w-4 h-4 text-primary" /> Email Terdaftar
                                    </Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="contoh: revan@engineer.com"
                                        className="bg-muted/30 border-primary/10 focus:border-primary/50 transition-all h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password" className="flex items-center gap-2 text-sm font-bold">
                                        <KeyRound className="w-4 h-4 text-primary" /> Kata Sandi
                                    </Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-muted/30 border-primary/10 focus:border-primary/50 transition-all h-11"
                                    />
                                </div>
                            </div>

                            {loginError && (
                                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                                    <span className="font-medium">{loginError}</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 gap-2 group" disabled={isLoggingIn}>
                                    {isLoggingIn ? "Memverifikasi..." : (
                                        <>
                                            Login & Kirim Lamaran <ArrowRightCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <Separator className="bg-primary/5" />
                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Belum punya akun? <NextLink href="/register" className="text-primary font-bold hover:underline">Daftar Sekarang</NextLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}