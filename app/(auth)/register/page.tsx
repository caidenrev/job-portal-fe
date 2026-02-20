"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("APPLICANT")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, role }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Gagal mendaftar")
            }

            // Arahkan ke login jika sukses 
            router.push("/login?registered=true")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                    Buat Akun Baru
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Pilih peranmu dan mulai perjalanan karir atau rekrutmenmu.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Pemilihan Role */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Mendaftar Sebagai:</Label>
                        <RadioGroup
                            defaultValue="APPLICANT"
                            className="flex gap-4"
                            onValueChange={(val) => setRole(val)}
                        >
                            <div className="flex items-center space-x-2 rounded-lg border border-border/50 bg-background p-3 hover:bg-accent hover:text-accent-foreground flex-1 cursor-pointer transition-colors">
                                <RadioGroupItem value="APPLICANT" id="APPLICANT" />
                                <Label htmlFor="APPLICANT" className="cursor-pointer font-medium w-full">
                                    Pelamar
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-lg border border-border/50 bg-background p-3 hover:bg-accent hover:text-accent-foreground flex-1 cursor-pointer transition-colors">
                                <RadioGroupItem value="HR" id="HR" />
                                <Label htmlFor="HR" className="cursor-pointer font-medium w-full">
                                    HR / Perusahaan
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Form Input Dasar */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full font-semibold" disabled={loading}>
                        {loading ? "Memproses..." : "Daftar Sekarang"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
                    >
                        Masuk di sini
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}