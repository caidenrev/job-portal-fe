"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Briefcase, MapPin, Building, Info, FileText, CheckCircle2 } from "lucide-react"

export default function PostJobPage() {
    const router = useRouter()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Form Data
    const [title, setTitle] = useState("")
    const [type, setType] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const [requirements, setRequirements] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/login")
                return
            }

            const res = await fetch(`${API_URL}/api/jobs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    type,
                    location,
                    description,
                    requirements
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || "Gagal memposting lowongan")
            }

            setIsSubmitted(true)
            // Reset form
            setTitle("")
            setType("")
            setLocation("")
            setDescription("")
            setRequirements("")

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-20 h-20 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Lowongan Berhasil Diposting!</h2>
                <p className="text-muted-foreground max-w-md">
                    Lowongan kerja Anda telah masuk ke dalam sistem dan sekarang dapat dilihat oleh para pelamar.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4 border-primary/30 hover:bg-primary/10 transition-colors shadow-sm">
                    Pasang Lowongan Lainnya
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    Pasang Lowongan Kerja
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Buat lowongan pekerjaan baru untuk menarik talenta terbaik ke perusahaan Anda.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-background/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border/50 shadow-sm shadow-primary/5">
                {/* Posisi & Tipe Pekerjaan */}
                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> Judul Posisi
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Cth: Frontend Developer"
                            required
                            className="h-12 border-primary/20 focus-visible:ring-primary/30 shadow-sm bg-background/80"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="type" className="text-base font-semibold flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" /> Tipe Pekerjaan
                        </Label>
                        {/* Pakai form html biasa dulu agar cepat */}
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="flex h-12 w-full items-center justify-between rounded-md border border-primary/20 focus-visible:ring-primary/30 shadow-sm bg-background/80 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >

                            <option value="">Pilih tipe...</option>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="INTERNSHIP">Internship</option>
                        </select>
                    </div>
                </div>

                {/* Lokasi */}
                <div className="space-y-3">
                    <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Lokasi Kerja
                    </Label>
                    <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Cth: Jakarta Selatan (Remote / WFO)"
                        required
                        className="h-12 border-primary/20 focus-visible:ring-primary/30 shadow-sm bg-background/80"
                    />
                </div>

                {/* Deskripsi */}
                <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> Deskripsi Pekerjaan
                    </Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Jelaskan tanggung jawab dan ruang lingkup pekerjaan..."
                        className="min-h-[120px] resize-y border-primary/20 focus-visible:ring-primary/30 shadow-sm bg-background/80"
                        required
                    />
                </div>

                {/* Persyaratan */}
                <div className="space-y-3">
                    <Label htmlFor="requirements" className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> Persyaratan (Requirements)
                    </Label>
                    <Textarea
                        id="requirements"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Cth: Minimal 2 tahun pengalaman di React, Menguasai Tailwind CSS..."
                        className="min-h-[120px] resize-y border-primary/20 focus-visible:ring-primary/30 shadow-sm bg-background/80"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto font-semibold shadow-md shadow-primary/20 h-12 px-8 transition-transform hover:scale-[1.02]">
                        {isSubmitting ? "Memproses..." : "Publikasikan Lowongan"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
