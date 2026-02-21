"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Save, UserCircle } from "lucide-react"

export default function HRProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    // User State
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    // Company State
    const [companyName, setCompanyName] = useState("")
    const [companyLocation, setCompanyLocation] = useState("")
    const [companyDescription, setCompanyDescription] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()

                    // Populate User Data
                    setName(data.name || "")
                    setEmail(data.email || "")
                    setPhone(data.phone || "")

                    // Populate Company Data if HR
                    if (data.company) {
                        setCompanyName(data.company.name || "")
                        setCompanyLocation(data.company.location || "")
                        setCompanyDescription(data.company.description || "")
                    }
                }
            } catch (err) {
                console.error("Gagal mengambil profil", err)
                setMessage({ type: "error", text: "Terjadi kesalahan saat mengambil data profil." })
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [router])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: "", text: "" })

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${API_URL}/api/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    phone,
                    companyName,
                    companyLocation,
                    companyDescription
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Gagal menyimpan profil")
            }

            setMessage({ type: "success", text: "Profil berhasil diperbarui!" })

            // Trigger a potential reload or state update in the Layout
            window.dispatchEvent(new Event('profileUpdated'))

        } catch (err: any) {
            setMessage({ type: "error", text: err.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-medium">Memuat pengaturan profil...</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <UserCircle className="w-8 h-8 text-primary" />
                    </div>
                    Profil & Perusahaan
                </h1>
                <p className="text-muted-foreground mt-2">
                    Kelola informasi pribadi admin HR dan profil perusahaan yang akan tampil di lowongan.
                </p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-center justify-between border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ type: "", text: "" })} className="text-current opacity-70 hover:opacity-100">&times;</button>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Data Personal HR */}
                    <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <UserCircle className="w-5 h-5 text-muted-foreground" /> Informasi HR
                            </CardTitle>
                            <CardDescription>Detail kontak admin rekrutmen ini.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama HR Manager"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Login (Read-only)</Label>
                                <Input
                                    id="email"
                                    value={email}
                                    disabled
                                    className="bg-muted text-muted-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+62 8..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Perusahaan */}
                    <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-500" /> Profil Perusahaan
                            </CardTitle>
                            <CardDescription>Informasi yang dilihat oleh pelamar kerja.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Nama Perusahaan</Label>
                                <Input
                                    id="companyName"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="PT Teknologi Nusantara"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyLocation">Lokasi Pusat / Alamat</Label>
                                <Input
                                    id="companyLocation"
                                    value={companyLocation}
                                    onChange={(e) => setCompanyLocation(e.target.value)}
                                    placeholder="Jakarta, Indonesia"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyDesc">Deskripsi Singkat Perusahaan</Label>
                                <Textarea
                                    id="companyDesc"
                                    value={companyDescription}
                                    onChange={(e) => setCompanyDescription(e.target.value)}
                                    placeholder="Perusahaan kami bergerak di bidang..."
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={saving} className="gap-2 px-8">
                        {saving ? (
                            <>Menyimpan...</>
                        ) : (
                            <><Save className="w-4 h-4" /> Simpan Perubahan</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
