"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api-config"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Briefcase, LayoutDashboard, Users, LogOut, Settings } from "lucide-react"

export default function HRLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [companyName, setCompanyName] = useState("Memuat...")
    const [companyInitials, setCompanyInitials] = useState("HR")
    const [hrAvatar, setHrAvatar] = useState("")

    useEffect(() => {
        const fetchHRProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return

                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()

                    if (data.profileImageUrl) {
                        setHrAvatar(data.profileImageUrl)
                    } else {
                        setHrAvatar("")
                    }

                    if (data.company && data.company.name) {
                        const name = data.company.name
                        setCompanyName(name)
                        // Create 2-letter initials
                        const words = name.split(' ')
                        let initials = ''
                        if (words.length > 1) {
                            initials = words[0][0] + words[1][0]
                        } else if (words[0].length > 1) {
                            initials = words[0].substring(0, 2)
                        } else {
                            initials = words[0]
                        }
                        setCompanyInitials(initials.toUpperCase())
                    } else {
                        setCompanyName("Profil Perusahaan Kosong")
                    }
                }
            } catch (error) {
                console.error("Gagal mengambil profil HR:", error)
            }
        }

        fetchHRProfile()

        // Listen for profile updates from the hr-profile page
        window.addEventListener('profileUpdated', fetchHRProfile)
        return () => {
            window.removeEventListener('profileUpdated', fetchHRProfile)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userRole")
        router.push("/login")
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-muted/10">

                {/* --- KOMPONEN SIDEBAR KIRI --- */}
                <Sidebar className="border-r border-border/50 shadow-sm">
                    <SidebarHeader className="border-b border-border/50 py-5 px-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary transition-transform hover:scale-105">
                            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                J
                            </div>
                            <span>HR Portal</span>
                        </Link>
                    </SidebarHeader>

                    <SidebarContent className="pt-4">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Menu Rekrutmen
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-2">
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip="Dashboard" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                            <Link href="/dashboard">
                                                <LayoutDashboard className="w-5 h-5" />
                                                <span className="font-medium text-base">Dashboard</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip="Pasang Lowongan" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                            <Link href="/post-job">
                                                <Briefcase className="w-5 h-5" />
                                                <span className="font-medium text-base">Pasang Lowongan</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip="Kelola Kandidat" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                            <Link href="/candidates">
                                                <Users className="w-5 h-5" />
                                                <span className="font-medium text-base">Kelola Kandidat</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip="Profil & Perusahaan" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                            <Link href="/hr-profile">
                                                <Settings className="w-5 h-5" />
                                                <span className="font-medium text-base">Profil & Perusahaan</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    {/* Footer Sidebar (Logout) */}
                    <div className="mt-auto p-4 border-t border-border/50">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer">
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium text-base">Keluar Akun</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                </Sidebar>

                {/* --- AREA KONTEN KANAN --- */}
                <div className="flex flex-col flex-1 w-full relative overflow-hidden">
                    {/* Header Dashboard Atas */}
                    <header className="h-16 flex items-center border-b border-border/50 px-4 md:px-6 bg-background/95 backdrop-blur z-10 sticky top-0 shadow-sm">
                        <SidebarTrigger className="text-primary hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer" />

                        <div className="ml-auto flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end text-sm">
                                <span className="font-bold text-foreground truncate max-w-[200px]">{companyName}</span>
                                <span className="text-xs text-muted-foreground">Mode: HR Admin</span>
                            </div>
                            {hrAvatar ? (
                                <img src={hrAvatar} alt="HR" className="h-9 w-9 rounded-full object-cover border-2 border-primary shadow-sm" />
                            ) : (
                                <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold">
                                    {companyInitials}
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Main Konten (Halaman yang berubah-ubah akan masuk sini) */}
                    <main className="p-4 md:p-8 flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>

            </div>
        </SidebarProvider>
    )
}