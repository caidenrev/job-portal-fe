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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Search, FileText } from "lucide-react"

export default function ApplicantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [userName, setUserName] = useState("")
    const [profileImageUrl, setProfileImageUrl] = useState("")

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
                    setProfileImageUrl(data.profileImageUrl || "")
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

                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/jobs"
                            className="transition-colors hover:text-primary text-foreground"
                        >
                            <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Cari Lowongan</span>
                        </Link>
                        <Link
                            href="/tracker"
                            className="transition-colors hover:text-primary text-muted-foreground"
                        >
                            <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Status Lamaran</span>
                        </Link>
                    </nav>

                    <div className="ml-auto flex items-center space-x-2 md:space-x-4">
                        <div className="flex items-center gap-2">
                            {profileImageUrl ? (
                                <img src={profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-primary/20 hidden sm:block" />
                            ) : null}
                            <div className="text-sm font-medium text-muted-foreground hidden sm:block">
                                Halo, {userName || "Pelamar"}
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="hidden sm:flex border-primary/20 hover:bg-primary/10 transition-colors">
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

                        {/* Mobile Side-Menu (Hamburger) */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10">
                                        <Menu className="h-6 w-6 text-foreground" />
                                        <span className="sr-only">Buka Menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] border-l border-white/10 bg-background/95 backdrop-blur-md flex flex-col p-6">
                                    <SheetHeader className="text-left mb-6 space-y-4">
                                        <SheetTitle className="text-2xl font-bold text-foreground">Loker<span className="text-blue-600">In</span></SheetTitle>
                                        <div className="flex items-center gap-3">
                                            {profileImageUrl ? (
                                                <img src={profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-primary font-bold">{userName.charAt(0) || "P"}</span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Halo,</p>
                                                <p className="text-sm text-muted-foreground">{userName || "Pelamar"}</p>
                                            </div>
                                        </div>
                                    </SheetHeader>

                                    <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Navigasi Utama</h4>
                                            <nav className="flex flex-col gap-1">
                                                <Link href="/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                                    <Search className="w-4 h-4 text-primary" /> Lowongan Kerja
                                                </Link>
                                                <Link href="/tracker" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                                    <FileText className="w-4 h-4 text-primary" /> Status Lamaran
                                                </Link>
                                                <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                                    Profil Pengguna
                                                </Link>
                                            </nav>
                                        </div>
                                    </div>

                                    {/* Sticky Logout At Bottom */}
                                    <div className="mt-auto pt-6 border-t border-border w-full">
                                        <Button onClick={handleLogout} variant="destructive" className="w-full justify-center font-bold h-11 transition-all hover:bg-red-700">
                                            Keluar (Logout)
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
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