import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/10">
            <Navbar />
            <main className="flex-1 container mx-auto py-8 px-4 md:px-8">
                {children}
            </main>
            <Footer />
        </div>
    )
}
