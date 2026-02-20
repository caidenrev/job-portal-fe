// app/(public)/faq/page.tsx
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-primary">Pertanyaan Umum (FAQ)</h1>
                <p className="text-lg text-muted-foreground">Temukan jawaban atas pertanyaan yang sering diajukan seputar LokerIn.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left text-lg font-semibold">Apakah layanan LokerIn gratis untuk pelamar?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-md leading-relaxed">
                        Ya, layanan kami 100% gratis untuk semua pencari kerja. Anda bebas melamar ke sebanyak mungkin lowongan yang Anda minati tanpa biaya apapun.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left text-lg font-semibold">Bagaimana cara kerja fitur 1-Click Auto Apply?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-md leading-relaxed">
                        Anda cukup melengkapi profil Anda dan mengunggah CV (format PDF) di menu "Edit Profil" satu kali saja. Pada aplikasi lowongan selanjutnya, Anda tidak perlu mengisi ulang form atau mengunggah CV—sistem otomatis mengambil data terakhir Anda.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left text-lg font-semibold">Berapa batas ukuran maksimal unggahan CV?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-md leading-relaxed">
                        Demi kelancaran sistem, batas maksimal ukuran file PDF unggahan CV adalah 5MB. Pastikan file Anda dikompres terlebih dahulu jika melebihi batas tersebut.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left text-lg font-semibold">Bagaimana saya tahu apakah lamaran saya diterima?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-md leading-relaxed">
                        Anda bisa mengecek status real-time dari setiap lamaran di menu "Status Lamaran" (Tracker). Saat pihak HR meninjau atau menerima Anda, status tersebut akan diperbarui secara otomatis dan Anda akan mendapat notifikasi.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left text-lg font-semibold">Bisakah saya mendaftarkan perusahaan saya (HR)?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-md leading-relaxed">
                        Tentu saja! Silakan daftar sebagai HR saat masuk ke halaman Registrasi. Anda akan mendapatkan Dashboard khusus HR untuk mengunggah lowongan baru dan mengelola resume pelamar secara efisien.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
