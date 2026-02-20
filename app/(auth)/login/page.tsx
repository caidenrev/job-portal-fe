"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Gagal masuk. Periksa email dan password Anda.")
            }

            // Simpan token untuk authentikasi middleware/routing selanjutnya
            localStorage.setItem("token", data.token)
            localStorage.setItem("userRole", data.user.role)

            // Auto-redirect berdasarkan role aplikasi
            if (data.user.role === "HR") {
                router.push("/dashboard")
            } else {
                router.push("/jobs")
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-border/50 shadow-lg relative overflow-hidden">
            {/* Aksen garis biru di atas Card */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>

            <CardHeader className="space-y-1 text-center pt-8">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                    Selamat Datang Kembali
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Masukkan email dan password untuk mengakses dashboard-mu.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            required
                            className="bg-background/50 focus:bg-background"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="text-xs font-medium text-primary hover:underline underline-offset-4">
                                Lupa password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            className="bg-background/50 focus:bg-background"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full font-semibold shadow-md shadow-primary/20 mt-2" disabled={loading}>
                        {loading ? "Memproses..." : "Masuk"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Belum punya akun?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-primary underline underline-offset-4 hover:text-primary/90 transition-colors"
                    >
                        Daftar sekarang
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}