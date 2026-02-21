"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, ShieldCheck, Heart, Zap, Briefcase, Users, Globe, Building2 } from "lucide-react"

export default function TentangKamiPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-20 py-10 px-4 sm:px-6">

            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-3xl mx-auto relative cursor-default">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 mb-4 shadow-sm backdrop-blur-sm">
                    Kenali Kami Lebih Dekat
                </Badge>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
                    Membangun Masa Depan <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
                        Karir Nusantara
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-6">
                    LokerIn hadir mengatasi tantangan kesenjangan pekerjaan di Indonesia. Misi kami adalah menjembatani talenta terbaik dengan peluang emas di perusahaan-perusahaan revolusioner di berbagai industri.
                </p>
            </div>

            {/* Visi dan Misi Cards */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch pt-8">
                <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target className="w-32 h-32" />
                    </div>
                    <CardContent className="p-8 sm:p-10 relative z-10 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-inner">
                            <Target className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Visi Utama</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Menciptakan ekosistem rekrutmen terdepan yang transparan, mudah diakses, dan efisien. Kami meyakini bahwa setiap profesional berhak mendapatkan tempat kerja yang dapat memaksimalkan potensi sejati mereka.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-primary to-indigo-700 text-white shadow-xl shadow-primary/20 border-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-32 h-32" />
                    </div>
                    <CardContent className="p-8 sm:p-10 relative z-10 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white">Misi Penggerak</h2>
                        <ul className="space-y-4 text-emerald-50 text-base sm:text-lg">
                            <li className="flex items-start gap-3">
                                <ShieldCheck className="w-6 h-6 shrink-0 text-blue-200" />
                                <span>Menyediakan platform lowongan kerja yang aman dan terverifikasi.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Briefcase className="w-6 h-6 shrink-0 text-blue-200" />
                                <span>Mempermudah perusahaan menemukan talenta yang tepat dan selaras.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Heart className="w-6 h-6 shrink-0 text-blue-200" />
                                <span>Mendukung kesejahteraan karir dan pertumbuhan individual.</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Statistik / Dampak Kita */}
            <div className="py-16 border-y border-border/40 relative">
                <div className="absolute inset-0 bg-primary/5 -z-10"></div>
                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Dampak Loker<span className="text-blue-600">In</span> Hari Ini</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Kami terus bertumbuh untuk menghubungkan lebih banyak impian menjadi kenyataan.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {/* Stat Item Masing-masing */}
                    {[
                        { icon: Users, value: "500+", label: "Ribuan Pencari Kerja Aktif" },
                        { icon: Building2, value: "10+", label: "Ribu Perusahaan Bergabung" },
                        { icon: Briefcase, value: "50+", label: "Ribu Lowongan Tersedia" },
                        { icon: Globe, value: "24/7", label: "Dukungan Platform Penuh" }
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center p-6 text-center bg-background/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">{stat.value}</div>
                            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action Mini */}
            <div className="text-center max-w-2xl mx-auto pb-10">
                <h2 className="text-3xl font-bold mb-6">Siap Memulai Langkah Baru?</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                    Bergabunglah dengan ekosistem LokerIn hari ini dan temukan berbagai peluang karir atau talenta terbaik untuk mengembangkan perusahaan Anda.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/register" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 shadow-md shadow-primary/20">
                        Daftar Sebagai Pelamar
                    </a>
                    <a href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
                        Portal Perusahaan (HR)
                    </a>
                </div>
            </div>

        </div>
    )
}
