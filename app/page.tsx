"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { API_URL } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Sparkles, Rocket, Building2, ShieldCheck, MapPin } from "lucide-react"

interface Job {
  id: number
  title: string
  type: string
  status: string
  company: {
    name: string
    location: string
  }
}

export default function LandingPage() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        // Fetch lowongan terbaru dari public API
        const res = await fetch(`${API_URL}/api/jobs`)
        if (res.ok) {
          const data = await res.json()
          // Tampilkan hanya 3 lowongan terbaru
          setRecentJobs(data.slice(0, 3))
        }
      } catch (error) {
        console.error("Error fetching recent jobs:", error)
      } finally {
        setLoadingJobs(false)
      }
    }

    fetchRecentJobs()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">

      {/* --- Latar Belakang Animasi Modern --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Efek grid futuristik */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e51a_1px,transparent_1px),linear-gradient(to_bottom,#4f46e51a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        {/* Cahaya Biru bercahaya di tengah-atas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-60"></div>
        {/* Cahaya sekunder pink/ungu di sudut */}
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-fuchsia-500/10 blur-[100px] rounded-full"></div>
      </div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 w-full">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
          <div className="space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> Revolusi Pencarian Karir 2026
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-foreground drop-shadow-sm leading-tight">
              Jelajahi <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Peluang Emas</span> Untuk Masa Depanmu
            </h1>
            <p className="mx-auto max-w-[800px] text-lg text-muted-foreground sm:text-xl leading-relaxed">
              LokerIn menghubungkan jutaan talenta berbakat dengan perusahaan impian mereka. Dilengkapi fitur <strong>1-Click Auto Apply</strong> untuk pengalaman melamar kerja tanpa hambatan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50 rounded-full">
                <Link href="/jobs">Mulai Cari Kerja</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg border-primary/30 bg-background/50 hover:bg-primary/10 hover:text-primary backdrop-blur-md transition-all hover:scale-105 rounded-full">
                <Link href="/register">Pasang Lowongan (HR)</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Info / Features Section */}
        <section className="w-full max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-background/50">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">1-Click Apply</h3>
              <p className="text-muted-foreground">Simpan CV dan Biodata Anda sekali, lalu lamar pekerjaan hanya dengan 1 sentuhan jari.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-background/50">
              <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Perusahaan Top</h3>
              <p className="text-muted-foreground">Bermitra dengan ratusan startup dan perusahaan multinasional terkemuka.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-background/50">
              <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Keamanan S3 Cloud</h3>
              <p className="text-muted-foreground">Dokumen CV Anda disimpan dengan aman menggunakan infrastruktur AWS Cloud terenkripsi.</p>
            </div>
          </div>
        </section>

        {/* Recent Jobs Section */}
        <section className="w-full max-w-6xl px-4 py-20 border-t border-border/30">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">Lowongan Terbaru <Sparkles className="w-6 h-6 text-primary" /></h2>
              <p className="text-muted-foreground">Jangan lewatkan kesempatan karir yang baru saja diunggah.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10">
              <Link href="/jobs">Lihat Semua &rarr;</Link>
            </Button>
          </div>

          {loadingJobs ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="h-48 rounded-xl bg-muted/50 animate-pulse border border-border/50"></div>
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {recentJobs.map((job) => (
                <Card key={job.id} className="flex flex-col justify-between hover:shadow-xl transition-all border-border/50 group bg-card/60 backdrop-blur-sm hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
                        <CardDescription className="font-medium text-foreground">
                          {job.company?.name || "Perusahaan Anonim"}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-semibold">
                        {job.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" /> {job.company?.location || "Lokasi tidak diketahui"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full font-semibold shadow-sm group-hover:shadow-primary/25 transition-all">
                      <Link href="/jobs">Lihat Detail</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground">Belum ada lowongan pekerjaan yang tersedia saat ini.</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button variant="ghost" asChild className="text-primary hover:text-primary hover:bg-primary/10 w-full">
              <Link href="/jobs">Lihat Semua Lowongan</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}