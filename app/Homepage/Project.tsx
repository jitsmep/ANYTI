import React from 'react'

const projects = [
  {
    id: 'trading-journal',
    title: 'Trading Journal',
    type: 'Personal Project',
    description:
      'Developed a Trading Journal to help traders record, organize, and review their trades in one place. Features trade detail tracking, profit/loss calculation, and trading performance analysis with clear insights.',
    tech: ['Python'],
    emoji: '📊',
    link: '#',
    gradient: 'from-violet-600/20 to-purple-600/10',
    accent: 'border-violet-500/40',
    tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  },
  {
    id: 'portfolio-builder',
    title: 'Portfolio Builder',
    type: 'Personal Project',
    description:
      'Built a Portfolio Builder application that helps users create and manage professional portfolios with an easy-to-use interface. Supports adding personal details, skills, projects, education, and work experience with real-time updates.',
    tech: ['AI-assisted Development', 'Vibe Coding'],
    emoji: '🗂️',
    link: '#',
    gradient: 'from-indigo-600/20 to-blue-600/10',
    accent: 'border-indigo-500/40',
    tagColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  },
  {
    id: 'finance-tracker',
    title: 'Finance Tracker',
    type: 'Personal Project',
    description:
      'Developed a Finance Tracker application to help users manage their income, expenses, and overall financial activities. Includes transaction tracking, budget management, and automatic calculation of savings and spending trends.',
    tech: ['Python', 'Prompt Engineering'],
    emoji: '💰',
    link: '#',
    gradient: 'from-emerald-600/20 to-teal-600/10',
    accent: 'border-emerald-500/40',
    tagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
]

export default function Project() {
  return (
    <section id="projects" className="py-24 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">What I&apos;ve built</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Projects</h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              id={`project-${project.id}`}
              className={`relative flex flex-col rounded-2xl border ${project.accent} bg-gradient-to-br ${project.gradient} bg-slate-900/80 backdrop-blur-sm overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-900/30 transition-all duration-300 group`}
            >
              {/* Top emoji area */}
              <div className="px-6 pt-6 pb-4">
                <span className="text-4xl">{project.emoji}</span>
                <div className="mt-3">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{project.type}</span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-violet-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-6 h-px bg-slate-700/50" />

              {/* Description */}
              <div className="px-6 py-4 flex-1">
                <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
              </div>

              {/* Tech tags */}
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium ${project.tagColor}`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Link */}
              <div className="px-6 pb-6">
                <a
                  href={project.link}
                  id={`project-link-${project.id}`}
                  target={project.link !== '#' ? '_blank' : undefined}
                  rel={project.link !== '#' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-violet-400 transition-colors duration-200"
                >
                  {project.link !== '#' ? 'View Project' : 'Link coming soon'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
