"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, UserCircle } from "lucide-react"

export default function ProfilePage() {
    const router = useRouter()

    // User Form State
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [bio, setBio] = useState("")
    const [experience, setExperience] = useState("")
    const [skills, setSkills] = useState("")

    // Resume State
    const [savedCvUrl, setSavedCvUrl] = useState("")
    const [cvFile, setCvFile] = useState<File | null>(null)

    // Avatar State
    const [profileImageUrl, setProfileImageUrl] = useState("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    // UI State
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!res.ok) throw new Error("Gagal mengambil data profil")

                const data = await res.json()
                setName(data.name || "")
                setEmail(data.email || "")
                setPhone(data.phone || "")
                setBio(data.bio || "")
                setExperience(data.experience || "")
                setSkills(data.skills || "")
                setSavedCvUrl(data.savedCvUrl || "")
                setProfileImageUrl(data.profileImageUrl || "")

            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [router])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError("")
        setSuccess("")

        const token = localStorage.getItem("token")

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("phone", phone)
            formData.append("bio", bio)
            formData.append("experience", experience)
            formData.append("skills", skills)

            if (cvFile) {
                formData.append("cv", cvFile)
            }
            if (avatarFile) {
                formData.append("avatar", avatarFile)
            }

            // Sertakan password jika bermain-main mengubahnya
            if (newPassword) {
                if (!currentPassword) {
                    throw new Error("Password saat ini wajib diisi jika ingin mengganti password baru.")
                }
                formData.append("currentPassword", currentPassword)
                formData.append("newPassword", newPassword)
            }

            const res = await fetch(`${API_URL}/api/users/profile`, {
                method: "PUT",
                headers: {
                    // Do NOT set Content-Type header when sending FormData! Browser sets multipart/form-data automatically
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Gagal memperbarui profil")
            }

            setSuccess("Profil berhasil diperbarui!")
            setSavedCvUrl(data.user.savedCvUrl)
            setProfileImageUrl(data.user.profileImageUrl)

            // Kosongkan field kata sandi & file setelah sukses
            setCurrentPassword("")
            setNewPassword("")
            setCvFile(null)
            setAvatarFile(null)

            // Reset input file (optional trick to clear the UI)
            const cvInput = document.getElementById("cv") as HTMLInputElement;
            if (cvInput) cvInput.value = "";
            const avatarInput = document.getElementById("avatar") as HTMLInputElement;
            if (avatarInput) avatarInput.value = "";

        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <p className="text-muted-foreground animate-pulse font-medium">Memuat data profil Anda...</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Pengaturan Profil</h1>
                <p className="text-muted-foreground">Lengkapi Biodata Anda untuk menggunakan fitur Lamar Otomatis.</p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Biodata Lengkap</CardTitle>
                    <CardDescription>
                        Informasi ini akan dikirimkan secara otomatis jika Anda menekan tombol "Lamar" di halaman lowongan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/50">
                            <div className="shrink-0">
                                {profileImageUrl || avatarFile ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                                        <img src={avatarFile ? URL.createObjectURL(avatarFile) : profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <UserCircle className="w-24 h-24 text-muted-foreground opacity-50" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2 text-center sm:text-left">
                                <Label htmlFor="avatar" className="text-primary font-bold">Foto Profil (Opsional)</Label>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                                    className="bg-background cursor-pointer max-w-sm"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Gunakan foto bernuansa profesional untuk meningkatkan daya tarik lamaran Anda. File maksimum 2MB (JPG/PNG).</p>
                            </div>
                        </div>

                        {/* Section Informasi Dasar */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    value={email}
                                    disabled
                                    className="bg-muted text-muted-foreground cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground">Terkunci secara sistem.</p>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="081234567890"
                                    className="bg-background"
                                />
                            </div>
                        </div>

                        {/* Section Profil Profesional */}
                        <div className="pt-4 border-t border-border/50 space-y-4">
                            <h3 className="font-semibold text-md">Profil Profesional</h3>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Ringkasan Bio (Minat & Tujuan karir)</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tuliskan sedikit tentang diri dan minat Anda..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience">Pengalaman Kerja Lengkap</Label>
                                <Textarea
                                    id="experience"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="2020 - 2023: Software Engineer di Google..."
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skills">Keahlian (Pisahkan dengan koma)</Label>
                                <Input
                                    id="skills"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    placeholder="React, Node.js, AWS, Public Speaking"
                                    className="bg-background"
                                />
                            </div>

                            <div className="space-y-2 p-4 bg-primary/5 rounded-xl border border-primary/20">
                                <Label htmlFor="cv" className="text-primary font-bold">Dokumen CV Utama (PDF Maks 5MB)</Label>
                                <div className="mt-2 text-sm text-muted-foreground mb-3">
                                    {savedCvUrl ? (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" /> <span className="text-green-600 font-medium">CV aktif telah tersimpan.</span>
                                            <a href={savedCvUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold ml-2">Lihat File</a>
                                        </div>
                                    ) : (
                                        "Belum ada CV yang tersimpan di profil Anda."
                                    )}
                                </div>
                                <Input
                                    id="cv"
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                    className="bg-background cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground mt-2">Unggah PDF baru hanya jika Anda ingin menimpa CV lama.</p>
                            </div>
                        </div>

                        {/* Section Ubah Kata Sandi */}
                        <div className="pt-6 border-t border-border/50">
                            <h3 className="font-semibold text-md mb-4">Pengaturan Akun</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Kosongkan jika tidak ingin mengubah password"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="new-password">Kata Sandi Baru</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimal 6 karakter"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Alert Status */}
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
                                {success}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2 flex justify-end">
                            <Button type="submit" className="font-semibold px-8 shadow-sm shadow-primary/20" disabled={saving}>
                                {saving ? "Menyimpan Perubahan..." : "Simpan Seluruh Biodata Profil"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
