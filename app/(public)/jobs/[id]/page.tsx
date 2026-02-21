"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import NextLink from "next/link"
import { API_URL } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Sparkles, MapPin, Briefcase, Lock, Mail, KeyRound, ArrowRightCircle, Building2, CheckCircle2, ChevronLeft, CalendarDays, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface JobDetail {
    id: number
    title: string
    description: string
    requirements: string
    type: string
    status: string
    createdAt: string
    company: {
        name: string
        location: string
        description: string | null
    }
}

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.id as string

    const [job, setJob] = useState<JobDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Form Application State
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [isApplying, setIsApplying] = useState(false)
    const [applySuccess, setApplySuccess] = useState(false)
    const [applyError, setApplyError] = useState("")
    const [showApplyModal, setShowApplyModal] = useState(false)

    // Login Modal State for Guests
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loginError, setLoginError] = useState("")

    // Profile State for Auto-Apply feature
    const [hasSavedProfile, setHasSavedProfile] = useState(false)

    useEffect(() => {
        const fetchJobAndProfile = async () => {
            try {
                // Fetch Job details
                const resJob = await fetch(`${API_URL}/api/jobs/${jobId}`)
                if (!resJob.ok) throw new Error('Lowongan tidak ditemukan atau terjadi kesalahan server')
                const dataJob = await resJob.json()
                setJob(dataJob)

                // Fetch Profile if Logged In
                const token = localStorage.getItem('token')
                if (token) {
                    const resProfile = await fetch(`${API_URL}/api/users/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    if (resProfile.ok) {
                        const profileData = await resProfile.json()
                        if (profileData.savedCvUrl) {
                            setHasSavedProfile(true)
                        }
                    }
                }

            } catch (err: any) {
                console.error("Error fetching data:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (jobId) {
            fetchJobAndProfile()
        }
    }, [jobId])

    const handleApplyJob = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!job) return

        if (!hasSavedProfile && !cvFile) {
            setApplyError("Anda wajib mengunggah CV baru atau melengkapi profil terlebih dahulu.");
            return;
        }

        setIsApplying(true)
        setApplyError("")

        try {
            const formData = new FormData()
            formData.append('jobId', job.id.toString())

            if (cvFile) {
                formData.append('cv', cvFile)
            }

            const token = localStorage.getItem('token')

            if (!token) {
                setShowApplyModal(false)
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
                setShowApplyModal(false)
                // Optional: redirect to tracker
                // router.push("/tracker")
            }, 3000)

        } catch (error: any) {
            console.error("Apply error:", error)
            setApplyError(error.message || "Terjadi kesalahan saat memproses lamaran.")
        } finally {
            setIsApplying(false)
        }
    }

    const resetApplyModal = () => {
        setCvFile(null)
        setApplyError("")
        setApplySuccess(false)
        setShowApplyModal(false)
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

            localStorage.setItem('token', data.token)
            localStorage.setItem('userRole', data.user.role)

            setShowLoginModal(false)
            setShowApplyModal(true)

            // Re-check profile right after login so we know if they have saved profile
            const resProfile = await fetch(`${API_URL}/api/users/profile`, {
                headers: { 'Authorization': `Bearer ${data.token}` }
            })
            if (resProfile.ok) {
                const profileData = await resProfile.json()
                if (profileData.savedCvUrl) {
                    setHasSavedProfile(true)
                }
            }

        } catch (error: any) {
            setLoginError(error.message)
        } finally {
            setIsLoggingIn(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[60vh]">
                <p className="text-muted-foreground animate-pulse text-lg font-medium">Memuat detail pekerjaan...</p>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="text-center py-20 min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                    {error || "Lowongan Pekerjaan Tidak Ditemukan"}
                </div>
                <Button variant="outline" asChild>
                    <NextLink href="/jobs">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Lowongan
                    </NextLink>
                </Button>
            </div>
        )
    }

    const isSubmitDisabled = isApplying || (!hasSavedProfile && !cvFile);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigasi Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <NextLink href="/jobs" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> Cari Lowongan
                </NextLink>
                <span>/</span>
                <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{job.title}</span>
            </div>

            {/* Header Profil Pekerjaan */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between relative z-10">
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{job.title}</h1>
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center text-muted-foreground font-medium">
                            <span className="flex items-center gap-2 text-primary font-bold">
                                <Building2 className="w-5 h-5" /> {job.company.name}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {job.company.location}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-2 text-sm">
                                <CalendarDays className="w-4 h-4" /> Dibuat tgl {new Date(job.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Badge className="px-4 py-1.5 text-sm font-black tracking-wider bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none capitalize">
                                {job.type.replace('_', ' ').toLowerCase()}
                            </Badge>
                            {job.status === 'OPEN' ? (
                                <Badge variant="outline" className="px-4 py-1.5 text-sm uppercase font-black tracking-wider border-green-200 text-green-700 bg-green-50">
                                    Menerima Lamaran
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="px-4 py-1.5 text-sm uppercase font-black tracking-wider bg-gray-100 text-gray-500">
                                    Ditutup
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="shrink-0 w-full md:w-auto">
                        <Button
                            size="lg"
                            className="w-full md:w-auto h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                            onClick={() => setShowApplyModal(true)}
                            disabled={job.status !== 'OPEN'}
                        >
                            {job.status === 'OPEN' ? "Kirim Lamaran Sekarang" : "Lowongan Ditutup"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Isi Detail Pekerjaan */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Deskripsi */}
                    <section className="bg-card/30 rounded-xl p-6 sm:p-8 border border-border/40 space-y-4">
                        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Deskripsi Pekerjaan</h2>
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {job.description}
                        </div>
                    </section>

                    {/* Persyaratan */}
                    <section className="bg-card/30 rounded-xl p-6 sm:p-8 border border-border/40 space-y-4">
                        <h2 className="text-2xl font-bold border-b border-border/50 pb-2 flex items-center gap-2">
                            Kualifikasi & Persyaratan
                        </h2>
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed list-disc marker:text-primary px-4">
                            {job.requirements}
                        </div>
                    </section>
                </div>

                <div className="md:col-span-1 space-y-6">
                    {/* Kotak Perusahaan */}
                    <section className="bg-primary/5 rounded-xl border border-primary/10 p-6 space-y-4 sticky top-24">
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                            <Building2 className="w-5 h-5" /> Profil Perusahaan
                        </h3>
                        <div>
                            <p className="font-extrabold text-foreground text-xl mb-1">{job.company.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
                                <MapPin className="w-3.5 h-3.5" /> {job.company.location}
                            </p>
                            {job.company.description ? (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {job.company.description}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground italic opacity-70">
                                    Perusahaan ini belum menyematkan deskripsi.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal Lamar Pekerjaan */}
            <Dialog open={showApplyModal} onOpenChange={(open) => !open && resetApplyModal()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Kirim Lamaran</DialogTitle>
                        <DialogDescription>
                            Anda melamar untuk posisi <span className="font-semibold text-primary">{job.title}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    {applySuccess ? (
                        <div className="py-8 flex flex-col items-center text-center text-green-600 space-y-4 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                            <h3 className="font-bold text-xl text-foreground">Aplikasi Berhasil Dikirim!</h3>
                            <p className="text-sm text-muted-foreground">Resume dan lamaran kerja Anda telah diteruskan ke pihak {job.company.name}. Semoga berhasil!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleApplyJob} className="space-y-6 py-4">

                            {hasSavedProfile ? (
                                <div className="p-4 bg-green-50/50 border border-green-200/60 rounded-lg space-y-2">
                                    <h4 className="font-semibold text-green-800 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-green-600" /> Fitur One-Click Apply Siap
                                    </h4>
                                    <p className="text-sm text-green-700/80">
                                        Data diri secara otomatis dikirim. Anda dapat langsung menekan tombol kirim atau melampirkan file CV baru di bawah jika ingin menimpa.
                                    </p>
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <Label htmlFor="cv-detail" className="font-medium">
                                    {hasSavedProfile ? "Timpa dengan CV Spesifik (Opsional)" : "Sertakan Dokumen CV (PDF)"}
                                </Label>
                                <Input
                                    id="cv-detail"
                                    type="file"
                                    accept=".pdf"
                                    required={!hasSavedProfile}
                                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                    className="cursor-pointer file:text-primary file:font-semibold h-11"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                                    <Info className="w-3 h-3" /> Maks. 5MB, format PDF.
                                </p>
                            </div>

                            {applyError && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                                    {applyError}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-12 font-bold shadow-md" disabled={isSubmitDisabled}>
                                {isApplying
                                    ? "Sedang Mengirim..."
                                    : (hasSavedProfile && !cvFile ? "Kirim Berkas Tersimpan" : "Unggah & Lamar")
                                }
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Inline Login untuk Guest */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="sm:max-w-md border-white/10 glass shadow-2xl overflow-hidden p-0">
                    <div className="bg-primary/5 p-6 flex flex-col items-center text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2 shadow-inner">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-extrabold tracking-tight">Otentikasi Diperlukan</DialogTitle>
                            <DialogDescription className="text-muted-foreground font-medium">
                                Masuk ke akun Pelamar Anda untuk melanjutkan pengiriman lamaran ke <span className="text-primary font-bold italic">{job?.company?.name}</span>
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-8 pt-4">
                        <form onSubmit={handleGuestLogin} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="detail-login-email" className="flex items-center gap-2 text-sm font-bold">
                                        <Mail className="w-4 h-4 text-primary" /> Email
                                    </Label>
                                    <Input
                                        id="detail-login-email"
                                        type="email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="bg-muted/30 border-primary/10 transition-all h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="detail-login-password" className="flex items-center gap-2 text-sm font-bold">
                                        <KeyRound className="w-4 h-4 text-primary" /> Password
                                    </Label>
                                    <Input
                                        id="detail-login-password"
                                        type="password"
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        className="bg-muted/30 border-primary/10 transition-all h-11"
                                    />
                                </div>
                            </div>

                            {loginError && (
                                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3">
                                    <span className="font-medium">{loginError}</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 gap-2 group" disabled={isLoggingIn}>
                                    {isLoggingIn ? "Memeriksa..." : "Masuk & Lanjutkan Melamar"}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <Separator className="bg-primary/5" />
                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Pengguna baru? <NextLink href="/register" className="text-primary font-bold hover:underline">Buat Akun Pelamar</NextLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
