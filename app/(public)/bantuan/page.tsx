"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare, Send, HelpCircle, Briefcase, Building2, CheckCircle2 } from "lucide-react"

export default function BantuanPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Kita menggunakan FormSubmit (formsubmit.co) sebagai Email API gratis tanpa backend
    // Ganti "hr-lokerin@yopmail.com" dengan email tujuan asli Anda nanti
    const ACTION_URL = "https://formsubmit.co/ajax/caidenrev@gmail.com"

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch(ACTION_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nama: data.name,
                    email: data.email,
                    subjek: data.subject,
                    pesan: data.message,
                    _template: "table" // Template bersih dari formsubmit
                })
            })

            if (res.ok) {
                setIsSuccess(true)
            } else {
                throw new Error("Gagal mengirim pesan")
            }
        } catch (error) {
            console.error(error)
            alert("Terjadi kesalahan saat mengirim pesan. Pastikan Anda sudah mengatur email tujuan di kode.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-16 py-8 px-4 sm:px-6">

            {/* Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 shadow-sm backdrop-blur-sm">
                    Pusat Dukungan LokerIn
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                    Halo! Ada yang bisa kami bantu?
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Pilih kategori kendala Anda di bawah ini, atau langsung kirimkan pesan kepada tim dukungan kami.
                </p>
            </div>

            {/* Quick Guides */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/40 backdrop-blur-md border-border/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">Panduan Pelamar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {['Cara melengkapi profil biodata & upload CV', 'Tips agar lamaran dilirik HR perusahaan', 'Melacak status lamaran di menu "Tracker"'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-md border-border/50 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">Panduan Perusahaan (HR)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {['Cara memposting lowongan pekerjaan baru', 'Mengelola ratusan pelamar di Dashboard HR', 'Mengubah status kandidat (Interview, Diterima)'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-indigo-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Section with API Form */}
            <div className="grid lg:grid-cols-5 gap-10 items-start pt-10 border-t border-border/40">

                {/* Contact Info (2 columns wide) */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Hubungi Kami</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Tidak menemukan jawaban dari panduan di atas? Jangan ragu untuk mengirim tiket bentuan kepada kami. Tim dukungan aktif 24/7.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                            <div className="p-3 bg-background rounded-lg shadow-sm">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email Dukungan</p>
                                <p className="text-lg font-bold">support@lokerin.id</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                            <div className="p-3 bg-background rounded-lg shadow-sm">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Hotline</p>
                                <p className="text-lg font-bold">+62 800 1234 5678</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                            <div className="p-3 bg-background rounded-lg shadow-sm">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Chat</p>
                                <p className="text-lg font-bold">Tersedia via WhatsApp</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Form (3 columns wide) */}
                <div className="lg:col-span-3">
                    <Card className="shadow-xl shadow-primary/5 border-border/50 bg-card/60 backdrop-blur-xl">
                        {isSuccess ? (
                            <div className="p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Pesan Berhasil Terkirim!</h3>
                                    <p className="text-muted-foreground">
                                        Terima kasih telah menghubungi kami. Tim dukungan LokerIn akan segera membalas pesan Anda ke alamat email yang diberikan.
                                    </p>
                                </div>
                                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                                    Kirim Pesan Lain
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <HelpCircle className="w-6 h-6 text-primary" /> Kirim Tiket Dukungan
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Pertanyaan teknis, bisnis, atau pengaduan.</p>
                                </div>

                                {/* Hidden input to prevent spam */}
                                <input type="hidden" name="_captcha" value="false" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold">Nama Lengkap</label>
                                        <Input id="name" name="name" placeholder="Cth: Revan Caidenso" required className="bg-background/80 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold">Alamat Email</label>
                                        <Input id="email" name="email" type="email" placeholder="Cth: Revan@contoh.com" required className="bg-background/80 h-12" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-semibold">Topik Bantuan</label>
                                    <select id="subject" name="subject" required className="flex h-12 w-full items-center justify-between rounded-md border border-input focus-visible:ring-primary/30 shadow-sm bg-background/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50">
                                        <option value="">Pilih topik kendala...</option>
                                        <option value="Kendala Login / Daftar">Kendala Login / Pendaftaran</option>
                                        <option value="Kendala Pasang Lowongan (HR)">Kendala Memposting Lowongan (HR)</option>
                                        <option value="Bug / Error di Website">Laporan Error di Website (Bug)</option>
                                        <option value="Kerjasama Bisnis">Penawaran Kerjasama Bisnis</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold">Deskripsikan Kendala Anda</label>
                                    <Textarea id="message" name="message" placeholder="Jelaskan secara detail masalah yang Anda alami..." required className="min-h-[150px] bg-background/80 resize-y" />
                                </div>

                                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full font-bold h-12 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform">
                                    {isSubmitting ? "Mengirim..." : (
                                        <>
                                            Kirim Pesan Sekarang <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>

        </div>
    )
}
