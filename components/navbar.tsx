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
import { Menu, User, LogOut, LayoutDashboard, Search, HelpCircle, Info, MessageCircle, Bell } from "lucide-react"

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState("")
    const [userRole, setUserRole] = useState("")
    const [notifications, setNotifications] = useState<any[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem("userRole")

        if (token) {
            setIsLoggedIn(true)
            setUserRole(role || "")

            // Fetch Notifications
            const fetchNotifications = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/notifications`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                    if (res.ok) {
                        const data = await res.json()
                        setNotifications(data)
                        setUnreadCount(data.filter((n: any) => !n.isRead).length)
                    }
                } catch (error) {
                    console.error("Gagal mengambil notifikasi", error)
                }
            }
            fetchNotifications()

            // Fetch name for applicant specifically if needed, 
            // but for simplicity we can just display general info or fetch it.
            if (role === "APPLICANT") {
                const fetchProfile = async () => {
                    try {
                        const res = await fetch(`${API_URL}/api/users/profile`, {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        })
                        if (res.ok) {
                            const data = await res.json()
                            setUserName(data.name.split(' ')[0])
                        }
                    } catch (error) {
                        console.error("Gagal mengambil profil", error)
                    }
                }
                fetchProfile()
            }
        }
    }, [])

    const handleMarkAsRead = async (id: number) => {
        try {
            const token = localStorage.getItem("token")
            await fetch(`${API_URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { "Authorization": `Bearer ${token}` }
            })
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error(error)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token")
            await fetch(`${API_URL}/api/notifications/read-all`, {
                method: 'PATCH',
                headers: { "Authorization": `Bearer ${token}` }
            })
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error(error)
        }
    }

    const renderNotificationDropdown = () => (
        <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-semibold">Notifikasi</span>
                {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead} className="text-xs text-primary hover:underline">
                        Tandai semua dibaca
                    </button>
                )}
            </div>
            <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                        <Bell className="w-8 h-8 opacity-20" />
                        Belum ada notifikasi
                    </div>
                ) : (
                    notifications.map((notif: any) => (
                        <div
                            key={notif.id}
                            onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                            className={`p-4 border-b last:border-0 transition-colors hover:bg-muted/50 ${!notif.isRead ? 'bg-primary/5 cursor-pointer' : 'opacity-80'}`}
                        >
                            <div className="flex justify-between items-start gap-2 mb-1">
                                <p className={`text-sm ${!notif.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>{notif.title}</p>
                                {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                                {new Date(notif.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </DropdownMenuContent>
    )

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userRole")
        setIsLoggedIn(false)
        setUserName("")
        setUserRole("")
        router.push("/")
    }

    return (
        <header className="flex h-16 items-center border-b border-border/40 px-4 lg:px-8 bg-background/80 backdrop-blur-xl sticky top-0 z-50 transition-all shadow-md shadow-primary/10">
            <Link href="/" className="flex items-center gap-2 mr-8">
                <span className="font-bold text-xl tracking-tight text-foreground">Loker<span className="text-blue-600">In</span></span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium mr-auto">
                <Link href="/jobs" className="transition-colors hover:text-primary text-foreground flex items-center gap-2">
                    <Search className="w-4 h-4" /> Lowongan
                </Link>
                <Link href="/bantuan" className="transition-colors hover:text-primary text-muted-foreground flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Pusat Bantuan
                </Link>
                <Link href="/tentang" className="transition-colors hover:text-primary text-muted-foreground flex items-center gap-2">
                    <Info className="w-4 h-4" /> Tentang Kami
                </Link>
                <Link href="/faq" className="transition-colors hover:text-primary text-muted-foreground flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> FAQ
                </Link>
            </nav>

            <nav className="ml-auto flex items-center gap-2 sm:gap-4">
                <div className="hidden lg:flex items-center gap-4">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                Masuk
                            </Link>
                            <Button asChild size="sm" className="font-semibold shadow-md shadow-primary/20">
                                <Link href="/register">Daftar</Link>
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center space-x-2 xl:space-x-4">
                            <div className="text-sm font-medium text-muted-foreground hidden xl:block mr-2">
                                Halo, {userName || (userRole === "HR" ? "HR" : "Pelamar")}
                            </div>

                            {/* Notification Bell Desktop */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 rounded-full w-9 h-9">
                                        <Bell className="w-5 h-5 text-foreground/80" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1.5 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                {renderNotificationDropdown()}
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 transition-colors">
                                        Menu Pintar
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 font-medium">
                                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {userRole === "HR" ? (
                                        <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard HR
                                        </DropdownMenuItem>
                                    ) : (
                                        <>
                                            <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" /> Edit Profil
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push('/tracker')} className="cursor-pointer">
                                                <Search className="mr-2 h-4 w-4" /> Status Lamaran
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <LogOut className="mr-2 h-4 w-4" /> Keluar (Logout)
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>

                {/* Mobile Side-Menu (Hamburger) */}
                <div className="lg:hidden flex items-center gap-1 sm:gap-2">
                    {/* Notification Bell Mobile (Samping Kiri Menu) */}
                    {isLoggedIn && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                                    <Bell className="h-5 w-5 text-foreground/80" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2.5 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            {renderNotificationDropdown()}
                        </DropdownMenu>
                    )}

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                <Menu className="h-6 w-6 text-foreground" />
                                <span className="sr-only">Buka Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-white/10 bg-background/95 backdrop-blur-md flex flex-col p-6">
                            <SheetHeader className="text-left mb-6">
                                <SheetTitle className="text-2xl font-bold text-foreground">Loker<span className="text-blue-600">In</span></SheetTitle>
                                <p className="text-sm text-muted-foreground">Pusat Karir & Rekrutmen</p>
                            </SheetHeader>

                            <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Navigasi Utama</h4>
                                    <nav className="flex flex-col gap-1">
                                        <Link href="/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                            <Search className="w-4 h-4 text-primary" /> Lowongan
                                        </Link>
                                        <Link href="/bantuan" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                            <HelpCircle className="w-4 h-4 text-primary" /> Bantuan
                                        </Link>
                                        <Link href="/tentang" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                            <Info className="w-4 h-4 text-primary" /> Tentang Kami
                                        </Link>
                                        <Link href="/faq" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                            <MessageCircle className="w-4 h-4 text-primary" /> FAQ
                                        </Link>
                                    </nav>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-border">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Akun & Sesi</h4>
                                    <nav className="flex flex-col gap-2">
                                        {!isLoggedIn ? (
                                            <div className="flex flex-col gap-3 mt-2">
                                                <Button asChild variant="outline" className="w-full justify-center font-semibold h-11 border-primary/20 hover:bg-primary/10">
                                                    <Link href="/login">Masuk Akun</Link>
                                                </Button>
                                                <Button asChild className="w-full justify-center font-semibold h-11 shadow-md shadow-primary/20">
                                                    <Link href="/register">Daftar Sekarang</Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="px-3 py-2.5 bg-muted/50 rounded-lg mb-2 border border-border/50">
                                                    <p className="text-sm font-bold text-foreground leading-none">Halo, {userName || "Pengguna"}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1.5">{userRole}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    {userRole === "HR" ? (
                                                        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                                            <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard HR
                                                        </Link>
                                                    ) : (
                                                        <>
                                                            <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                                                <User className="w-4 h-4 text-primary" /> Edit Profil
                                                            </Link>
                                                            <Link href="/tracker" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                                                                <Search className="w-4 h-4 text-primary" /> Status Lamaran
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </nav>
                                </div>
                            </div>

                            {/* Sticky Logout At Bottom */}
                            {isLoggedIn && (
                                <div className="mt-auto pt-6 border-t border-border w-full">
                                    <Button onClick={handleLogout} variant="destructive" className="w-full justify-center font-bold h-11 transition-all hover:bg-red-700">
                                        <LogOut className="mr-2 h-4 w-4" /> Keluar
                                    </Button>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    )
}
