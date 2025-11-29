import Link from "next/link"
import { Navbar1 } from "@/components/navigation/nav-bar"
import { Footer } from "@/components/navigation/footer"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Not Found - Prompt Studio",
  description: "Sorry, we couldn't find the page you are looking for.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar1 />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-9xl font-black text-primary/10 mb-4 select-none">404</h1>
        <div className="-mt-16 relative z-10">
          <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
            Oops! It seems like the page you are looking for has vanished into the digital void.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/prompt-library">Explore Prompts</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full px-4">
            <Link href="/studio" className="group p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Prompt Studio</h3>
                <p className="text-sm text-muted-foreground">Create, test and optimize your prompts with our advanced studio.</p>
            </Link>
            <Link href="/converter" className="group p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Converters</h3>
                <p className="text-sm text-muted-foreground">Convert your data between JSON, XML, YAML, Markdown and more.</p>
            </Link>
            <Link href="/blog" className="group p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Blog</h3>
                <p className="text-sm text-muted-foreground">Read the latest updates, guides and tips about prompt engineering.</p>
            </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

