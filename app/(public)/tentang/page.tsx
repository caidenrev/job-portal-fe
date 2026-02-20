// app/(public)/tentang/page.tsx
import Image from "next/image"

export default function TentangKamiPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">Tentang LokerIn</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Misi kami adalah menjembatani talenta terbaik dengan peluang emas di perusahaan-perusahaan revolusioner berbagai industri.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Visi Kami</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Dipercaya oleh ratusan ribu profesional dan perusahaan, LokerIn membangun ekosistem rekrutmen masa depan yang transparan, mudah, dan efisien. Kami meyakini bahwa setiap orang berhak mendapatkan pekerjaan yang dapat memaksimalkan potensi mereka.
                    </p>
                </div>
                <div className="h-64 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border flex items-center justify-center">
                    <span className="text-6xl">🚀</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t">
                <div className="text-center">
                    <div className="text-4xl font-extrabold text-primary mb-2">500K+</div>
                    <div className="text-sm font-medium text-muted-foreground">Pengguna Aktif</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-extrabold text-primary mb-2">10K+</div>
                    <div className="text-sm font-medium text-muted-foreground">Perusahaan Mitra</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-extrabold text-primary mb-2">50K+</div>
                    <div className="text-sm font-medium text-muted-foreground">Lowongan Aktif</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-extrabold text-primary mb-2">24/7</div>
                    <div className="text-sm font-medium text-muted-foreground">Dukungan Tim</div>
                </div>
            </div>
        </div>
    )
}
