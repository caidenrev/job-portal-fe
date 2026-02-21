"use client"

import { useEffect, useState } from "react"
import { API_URL } from "@/lib/api-config"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Eye, Users, FileX, RefreshCw } from "lucide-react"

interface JobApplication {
    id: number
    job: {
        title: string
        company: {
            name: string
        }
    }
    createdAt: string
    status: string
}

// Konfigurasi tahapan (Stepper) dengan warna dan deskripsi khusus
const STEPS = [
    {
        id: "PENDING",
        label: "Terkirim",
        desc: "Lamaran kerjamu telah sukses meluncur ke sistem kotak masuk HRD.",
        icon: Clock,
        twColor: "blue",
        glassIcon: "bg-blue-500/20 text-blue-600 border-blue-500/30 shadow-blue-500/10",
        solidBg: "bg-blue-500"
    },
    {
        id: "REVIEWED",
        label: "Sedang Direview",
        desc: "HR sedang membaca teliti dan meninjau kehebatan CV/Profilmu.",
        icon: Eye,
        twColor: "amber",
        glassIcon: "bg-amber-500/20 text-amber-600 border-amber-500/30 shadow-amber-500/10",
        solidBg: "bg-amber-500"
    },
    {
        id: "INTERVIEW",
        label: "Wawancara",
        desc: "Bersiaplah! Kamu diundang untuk tahap wawancara/penilaian.",
        icon: Users,
        twColor: "purple",
        glassIcon: "bg-purple-500/20 text-purple-600 border-purple-500/30 shadow-purple-500/10",
        solidBg: "bg-purple-500"
    },
    {
        id: "ACCEPTED",
        label: "Diterima",
        desc: "Luar biasa! Selamat kamu secara resmi diterima di posisi ini.",
        icon: CheckCircle2,
        twColor: "emerald",
        glassIcon: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 shadow-emerald-500/10",
        solidBg: "bg-emerald-500"
    },
]

export default function TrackerPage() {
    const [applications, setApplications] = useState<JobApplication[]>([])
    const [loading, setLoading] = useState(true)

    const fetchApplications = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${API_URL}/api/applications/my`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setApplications(data)
            }
        } catch (error) {
            console.error("Gagal mengambil status lamaran", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    // Fungsi untuk mengecek posisi step aktif
    const getStepIndex = (status: string) => {
        if (status === "REJECTED") return STEPS.length;
        const index = STEPS.findIndex((s) => s.id === status);
        return index >= 0 ? index : 0;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        })
    }
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-start md:items-center border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Status Lamaran</h1>
                    <p className="text-muted-foreground">Pantau perkembangan lamaran kerjamu secara real-time dari pintu ke pintu.</p>
                </div>
                <Button onClick={fetchApplications} disabled={loading} variant="outline" className="gap-2 shrink-0 h-10 border-primary/20 hover:bg-primary/10">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{loading ? "Menyegarkan..." : "Segarkan"}</span>
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground animate-pulse text-lg font-medium">Melacak riwayat lamaran kerjamu...</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-20 bg-muted/10 border border-dashed border-border rounded-xl">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileX className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">Belum Ada Lamaran</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mt-2">Daftar lamaran kerja masih kosong. Yuk cari pekerjaan idamanmu di laman eksplorasi loker kami!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => {
                        const currentStepIndex = getStepIndex(app.status);
                        const isRejected = app.status === "REJECTED";
                        const activeStepData = !isRejected ? STEPS[currentStepIndex] : null;

                        // Badge Custom Colors based on state
                        let badgeClass = "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                        let badgeLabel = "Dikirim"
                        if (isRejected) {
                            badgeClass = "bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                            badgeLabel = "Mohon Maaf Ditolak"
                        } else if (app.status === "REVIEWED") {
                            badgeClass = "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
                            badgeLabel = "Sedang Direview HR"
                        } else if (app.status === "INTERVIEW") {
                            badgeClass = "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200"
                            badgeLabel = "Tahap Wawancara"
                        } else if (app.status === "ACCEPTED") {
                            badgeClass = "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                            badgeLabel = "Diterima / Lolos!"
                        }

                        return (
                            <Card key={app.id} className={`border-border/50 shadow-sm overflow-hidden transition-all duration-500 shadow-${activeStepData?.twColor || 'red'}-500/5`}>
                                <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent pb-4 border-b border-border/50">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div>
                                            <CardTitle className="text-xl leading-tight">{app.job.title}</CardTitle>
                                            <CardDescription className="text-base font-semibold text-foreground/80 mt-1.5 flex items-center gap-2">
                                                {app.job.company?.name || "Perusahaan Anonim"}
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end gap-2.5">
                                            <Badge className={`px-3 py-1 text-sm font-bold border transition-colors ${badgeClass}`}>
                                                {badgeLabel}
                                            </Badge>
                                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Dilamar pada {formatDate(app.createdAt)}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-10 pb-12 w-full overflow-hidden">

                                    {/* Visual Stepper Progress */}
                                    <div className="relative flex justify-between w-full max-w-3xl mx-auto px-2 md:px-12">
                                        {/* Garis background penghubung */}
                                        <div className="absolute top-5 md:top-6 left-6 right-6 md:left-16 md:right-16 h-1 md:h-1.5 bg-muted/70 -translate-y-1/2 z-0 rounded-full"></div>

                                        {/* Garis progress solid */}
                                        <div
                                            className="absolute top-5 md:top-6 left-6 md:left-16 h-1 md:h-1.5 -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-spring"
                                            style={{
                                                width: isRejected ? 'calc(100% - 3rem)' : `calc(${(currentStepIndex / (STEPS.length - 1)) * 100}% - 3rem)`,
                                                backgroundColor: isRejected ? '#ef4444' : (activeStepData ? `var(--tw-colors-${activeStepData.twColor}-500, currentColor)` : 'currentColor'),
                                            }}
                                        >
                                            {/* Inject dynamic inline styles fallback for generic tailwind colours */}
                                            {isRejected === false && activeStepData && (
                                                <div className={`w-full h-full rounded-full ${activeStepData.solidBg} shadow-[0_0_10px_rgba(0,0,0,0.2)] shadow-${activeStepData.twColor}-500/50`}></div>
                                            )}
                                        </div>

                                        {/* Render Bulatan/Ikon tiap Step */}
                                        {STEPS.map((step, index) => {
                                            const isActive = index <= currentStepIndex;
                                            const isCurrentlyFocused = index === currentStepIndex && !isRejected;
                                            const Icon = step.icon;

                                            // Styling Bulat / Icon
                                            let circleColor = isActive
                                                ? step.glassIcon
                                                : "bg-muted/30 text-muted-foreground border-muted/50 shadow-none";

                                            if (isRejected) {
                                                circleColor = "bg-red-500/20 text-red-600 border-red-500/30 shadow-red-500/10";
                                            }

                                            // Ring Highlight Effect if Currently Focused
                                            const ringEffect = isCurrentlyFocused ? `ring-[3px] md:ring-4 ring-${step.twColor}-500/20 ring-offset-2 ring-offset-background scale-105 md:scale-110` : 'scale-90 md:scale-100';

                                            return (
                                                <div key={step.id} className="relative z-10 flex flex-col items-center w-1/4">

                                                    {/* Kapsul/Icon Ikonator */}
                                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ease-out backdrop-blur-sm shadow-lg ${circleColor} ${ringEffect}`}>
                                                        <Icon className={`w-4 h-4 md:w-6 md:h-6 ${isCurrentlyFocused ? 'animate-pulse' : ''}`} />
                                                    </div>

                                                    {/* Typography Title & Desc */}
                                                    <div className="absolute top-12 md:top-16 w-20 md:w-48 text-center flex flex-col items-center">
                                                        <span className={`text-[10px] md:text-sm tracking-tight font-bold mb-0.5 md:mb-1 transition-colors ${isActive ? (isRejected ? 'text-red-600' : `text-${step.twColor}-600 dark:text-${step.twColor}-400`) : 'text-muted-foreground'}`}>
                                                            {isRejected && index === STEPS.length - 1 ? "Ditolak / Gagal" : step.label}
                                                        </span>

                                                        {/* Description appears only on active focused steps to avoid clutter, or on all past steps? We show on focused step only for elegance */}
                                                        {isCurrentlyFocused && (
                                                            <p className="hidden md:block text-[11px] md:text-xs text-muted-foreground font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
                                                                {step.desc}
                                                            </p>
                                                        )}
                                                        {isRejected && index === STEPS.length - 1 && (
                                                            <p className="hidden md:block text-[11px] md:text-xs text-red-500/80 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
                                                                Maaf, profilmu belum memenuhi kualifikasi saat ini.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {/* Spacer Extra for Absolute Descriptions */}
                                    <div className="h-10 md:h-20"></div>

                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}