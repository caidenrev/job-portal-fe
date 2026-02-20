export default function Footer() {
    return (
        <footer className="border-t border-border/40 py-6 md:py-0 text-center bg-background/60 backdrop-blur-lg relative z-10">
            <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} LokerIn. Dibuat dengan Next.js & AWS.
                </p>
            </div>
        </footer>
    )
}
