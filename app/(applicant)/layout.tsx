"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { API_URL } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ApplicantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [userName, setUserName] = useState("")

    useEffect(() => {
        // Cek token dan ambil data user di Client Side
        const token = localStorage.getItem("token")

        if (!token) {
            // Jika belum login, tendang ke halaman login
            router.push("/login")
            return
        }

        // Fetch data profil singkat untuk ditampilkan di Navbar
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    setUserName(data.name.split(' ')[0]) // Ambil nama depan saja
                }
            } catch (error) {
                console.error("Gagal mengambil profil", error)
            }
        }

        fetchProfile()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userRole")
        router.push("/") // Arahkan kembali ke Landing Page
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            {/* Navbar Khusus Pelamar */}
            <header className="flex h-16 items-center border-b border-border/40 px-4 md:px-8 bg-background/80 backdrop-blur-xl sticky top-0 z-50 transition-all shadow-md shadow-primary/10">
                <div className="container flex w-full h-full items-center">
                    <Link href="/jobs" className="flex items-center gap-2 mr-8 hover:opacity-90">
                        <span className="font-bold text-xl tracking-tight text-primary">Loker<span className="text-blue-600">In</span></span>
                    </Link>

                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/jobs"
                            className="transition-colors hover:text-primary text-foreground"
                        >
                            Cari Lowongan
                        </Link>
                        <Link
                            href="/tracker"
                            className="transition-colors hover:text-primary text-muted-foreground"
                        >
                            Status Lamaran
                        </Link>
                    </nav>

                    <div className="ml-auto flex items-center space-x-4">
                        <div className="text-sm font-medium text-muted-foreground hidden sm:block">
                            Halo, {userName || "Pelamar"}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 transition-colors">
                                    Profil Saya
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 font-medium">
                                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                                    Edit Profil
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                    Keluar (Logout)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Konten Halaman akan dirender di sini */}
            <main className="flex-1 container mx-auto py-8 px-4 md:px-8">
                {children}
            </main>
        </div>
    )
}