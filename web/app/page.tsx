import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl tracking-tighter">BREW.</div>
          <div className="flex gap-6 items-center">
            <Link
              href="/login"
              className="text-sm uppercase tracking-widest text-secondary hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-primary text-white text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-heading font-medium text-primary leading-[1.1]">
              Master <br />
              <span className="italic font-light">Your Day</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary font-body max-w-md leading-relaxed">
              Experience clarity in a chaotic world. Brew helps you organize tasks, focus on what matters, and achieve your goals with elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-primary text-white text-center uppercase tracking-widest shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                Start Brewing
              </Link>
            </div>
          </div>

          {/* Abstract Visual / Dashboard Preview */}
          <div className="relative h-[400px] md:h-[600px] p-8 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Simple Geometric Composition */}
            <div className="relative z-10 w-full max-w-sm aspect-[3/4] border-4 border-primary/10 bg-white p-8 shadow-2xl flex flex-col gap-6 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-700">
              <div className="h-8 w-1/3 bg-black/5"></div>
              <div className="space-y-4">
                <div className="flex gap-4 items-center border-b border-black/5 pb-4">
                  <div className="w-4 h-4 border border-black/20"></div>
                  <div className="h-2 w-full bg-black/5"></div>
                </div>
                <div className="flex gap-4 items-center border-b border-black/5 pb-4">
                  <div className="w-4 h-4 border border-black/20"></div>
                  <div className="h-2 w-2/3 bg-black/5"></div>
                </div>
                <div className="flex gap-4 items-center border-b border-black/5 pb-4">
                  <div className="w-4 h-4 bg-primary/20"></div>
                  <div className="h-2 w-3/4 bg-black/5"></div>
                </div>
              </div>
              <div className="mt-auto pt-8 border-t-2 border-primary/10 flex justify-between items-end">
                <div className="h-12 w-12 rounded-full border border-black/10"></div>
                <div className="text-4xl font-heading text-primary/20 italic">B.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="border-t border-border/40 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="text-primary text-6xl">01</div>
                <h3 className="text-xl uppercase tracking-wide">Organize</h3>
                <p className="text-secondary font-body leading-relaxed">Cancel the noise. Structure your projects and tasks in a way that makes sense to you.</p>
              </div>
              <div className="space-y-4">
                <div className="text-primary text-6xl">02</div>
                <h3 className="text-xl uppercase tracking-wide">Focus</h3>
                <p className="text-secondary font-body leading-relaxed">Prioritize what matters most with our clutter-free interface designed for deep work.</p>
              </div>
              <div className="space-y-4">
                <div className="text-primary text-6xl">03</div>
                <h3 className="text-xl uppercase tracking-wide">Achieve</h3>
                <p className="text-secondary font-body leading-relaxed">Track your progress and celebrate small wins. Your productivity journey starts here.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-secondary text-sm font-body">
          <p>© 2025 Brew. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
