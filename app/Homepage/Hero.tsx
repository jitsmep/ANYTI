import React from 'react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          Open to opportunities
        </div>

        {/* Name */}
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-4 leading-none">
          Joshuva{' '}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            P
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          Technology &amp; AI Enthusiast&nbsp;·&nbsp;Vibe Coder&nbsp;·&nbsp;
          <span className="text-violet-400 font-medium">Building with AI</span>
        </p>

        {/* Sub-tagline */}
        <p className="mt-4 text-slate-400 text-base md:text-lg max-w-xl mx-auto">
          BSc Computer Science student crafting practical tools — from finance trackers to full-stack web apps — entirely through code.
        </p>

        {/* CTA buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            id="hero-view-projects"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50 hover:scale-105 transition-all duration-200"
          >
            View Projects
          </a>
          <a
            href="#contact"
            id="hero-contact"
            className="px-8 py-3.5 rounded-xl border border-slate-600 text-slate-300 font-semibold text-base hover:border-violet-500 hover:text-violet-300 hover:bg-violet-500/10 transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>

        {/* Social quick links */}
        <div className="mt-10 flex items-center justify-center gap-6 text-slate-400">
          <a
            href="https://github.com/jitsmep"
            id="hero-github"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-violet-400 transition-colors duration-200 text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <span className="w-px h-4 bg-slate-600" />
          <a
            href="mailto:pjoshuva31@gmail.com"
            id="hero-email"
            className="flex items-center gap-2 hover:text-violet-400 transition-colors duration-200 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            pjoshuva31@gmail.com
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs animate-bounce">
        <span>Scroll</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
