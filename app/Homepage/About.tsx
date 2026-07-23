import React from 'react'

export default function About() {
  return (
    <section id="about" className="py-24 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Who I am</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">About Me</h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Bio */}
          <div className="space-y-5 text-slate-300 text-base md:text-lg leading-relaxed">
            <p>
              I&apos;m <span className="text-white font-semibold">Joshuva P</span>, a motivated BSc Computer Science student at Madras Christian College (graduating 2027), passionate about the intersection of technology, AI, and real-world problem solving.
            </p>
            <p>
              I build practical applications entirely through code — from a personal Finance Tracker to a full-stack Portfolio Builder — using modern vibe coding techniques and AI-assisted development. My approach combines clean logic with a strong eye for useful, user-friendly products.
            </p>
            <p>
              I also bring a unique edge to my projects: a background in finance that lets me design tools like trading journals and expense trackers that are both technically sound and financially meaningful.
            </p>
            <p>
              Currently expanding into AI full-stack web development, bot development, and API integration — I&apos;m always learning, always building, and eager to contribute to innovative tech teams.
            </p>
          </div>

          {/* Highlights cards */}
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: '🎓',
                label: 'Education',
                value: 'BSc Computer Science',
                sub: 'Madras Christian College · 2027',
              },
              {
                icon: '💻',
                label: 'Focus Area',
                value: 'AI-assisted Development',
                sub: 'Vibe Coding · Prompt Engineering',
              },
              {
                icon: '📈',
                label: 'Domain Strength',
                value: 'Finance + Tech',
                sub: 'Trading Journals · Finance Trackers',
              },
              {
                icon: '🚀',
                label: 'Currently Learning',
                value: 'Full-stack Web · Bot Dev',
                sub: 'API Integration · AI Tools',
              },
            ].map((card) => (
              <div
                key={card.label}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/40 hover:bg-slate-800 transition-all duration-200"
              >
                <span className="text-2xl">{card.icon}</span>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{card.label}</p>
                  <p className="text-white font-semibold">{card.value}</p>
                  <p className="text-slate-400 text-sm">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
