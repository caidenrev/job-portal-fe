import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Eye, Users } from "lucide-react"

// Dummy Data Lamaran (Nanti ini diambil dari API AWS)
const DUMMY_APPLICATIONS = [
    {
        id: 1,
        jobTitle: "Frontend Web Developer",
        company: "Tech Nusantara",
        appliedAt: "21 Feb 2026",
        status: "interview", // Status: pending, reviewed, interview, accepted, rejected
    },
    {
        id: 2,
        jobTitle: "UI/UX Designer",
        company: "Kreativ Studio",
        appliedAt: "18 Feb 2026",
        status: "reviewed",
    },
    {
        id: 3,
        jobTitle: "IT Support Intern",
        company: "Bank Sejahtera",
        appliedAt: "10 Feb 2026",
        status: "pending",
    },
]

// Konfigurasi tahapan (Stepper)
const STEPS = [
    { id: "pending", label: "Terkirim", icon: Clock },
    { id: "reviewed", label: "Direview HR", icon: Eye },
    { id: "interview", label: "Wawancara", icon: Users },
    { id: "accepted", label: "Diterima", icon: CheckCircle2 }, // atau rejected
]

export default function TrackerPage() {
    // Fungsi untuk mengecek posisi step aktif
    const getStepIndex = (status: string) => {
        if (status === "rejected") return STEPS.length; // Jika ditolak, set ke ujung dengan warna merah nanti
        const index = STEPS.findIndex((s) => s.id === status);
        return index >= 0 ? index : 0;
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Status Lamaran</h1>
                <p className="text-muted-foreground">Pantau perkembangan lamaran kerjamu secara real-time di sini.</p>
            </div>

            <div className="grid gap-6">
                {DUMMY_APPLICATIONS.map((app) => {
                    const currentStepIndex = getStepIndex(app.status);
                    const isRejected = app.status === "rejected";

                    return (
                        <Card key={app.id} className="border-border/50 shadow-sm overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                    <div>
                                        <CardTitle className="text-xl text-primary">{app.jobTitle}</CardTitle>
                                        <CardDescription className="text-base font-medium text-foreground mt-1">
                                            {app.company}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge
                                            variant={isRejected ? "destructive" : app.status === "accepted" ? "default" : "secondary"}
                                            className={app.status === "accepted" ? "bg-green-600 hover:bg-green-700" : ""}
                                        >
                                            {isRejected ? "Ditolak" : app.status === "accepted" ? "Diterima" : "Diproses"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">Dilamar pada {app.appliedAt}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">

                                {/* Visual Stepper Progress */}
                                <div className="relative flex justify-between w-full max-w-2xl mx-auto">
                                    {/* Garis background penghubung */}
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 rounded-full"></div>

                                    {/* Garis progress aktif (warna biru) */}
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-in-out"
                                        style={{
                                            width: isRejected ? '100%' : `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                                            backgroundColor: isRejected ? 'var(--color-destructive)' : 'var(--color-primary)'
                                        }}
                                    ></div>

                                    {/* Render Bulatan/Ikon tiap Step */}
                                    {STEPS.map((step, index) => {
                                        const isActive = index <= currentStepIndex;
                                        const Icon = step.icon;

                                        // Logic khusus jika ditolak (warna merah mendominasi)
                                        let circleColor = isActive ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-muted";
                                        if (isRejected) {
                                            circleColor = "bg-destructive text-destructive-foreground border-destructive";
                                        } else if (app.status === "accepted" && isActive) {
                                            circleColor = "bg-green-600 text-white border-green-600";
                                        }

                                        return (
                                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                                                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${circleColor}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className={`text-xs md:text-sm font-medium absolute -bottom-6 w-24 text-center ${isActive ? (isRejected ? 'text-destructive' : 'text-foreground') : 'text-muted-foreground'}`}>
                                                    {isRejected && index === STEPS.length - 1 ? "Ditolak" : step.label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="h-8"></div> {/* Spacer untuk text di bawah bulatan */}

                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}