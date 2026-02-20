// app/(public)/bantuan/page.tsx
export default function BantuanPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4 mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-primary">Pusat Bantuan</h1>
                <p className="text-lg text-muted-foreground">Kami di sini untuk membantu Anda.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 rounded-xl border bg-card">
                    <h2 className="text-xl font-semibold mb-2">Untuk Pelamar</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground marker:text-primary">
                        <li>Cara melengkapi profil biodata & CV</li>
                        <li>Panduan menggunakan fitur 1-Click Apply</li>
                        <li>Melacak status lamaran yang dikirim</li>
                    </ul>
                </div>
                <div className="p-6 rounded-xl border bg-card">
                    <h2 className="text-xl font-semibold mb-2">Untuk Perusahaan (HR)</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground marker:text-primary">
                        <li>Cara memposting lowongan pekerjaan baru</li>
                        <li>Mengelola dan meninjau kandidat</li>
                        <li>Mengubah status tahapan lamaran (Interview, Diterima, dll)</li>
                    </ul>
                </div>
            </div>

            <div className="mt-12 p-8 text-center bg-primary/5 rounded-2xl border border-primary/20">
                <h3 className="text-2xl font-bold mb-4">Masih butuh bantuan?</h3>
                <p className="text-muted-foreground mb-6">Tim dukungan kami siap menjawab pertanyaan Anda 24/7.</p>
                <div className="font-semibold text-lg text-primary">support@jobportal.id</div>
                <div className="font-semibold text-lg text-primary">+62 800 1234 5678</div>
            </div>
        </div>
    )
}
