import React from 'react'

const skillGroups = [
  {
    category: 'Programming Languages',
    color: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-300',
    skills: ['Python'],
  },
  {
    category: 'Tools & Software',
    color: 'from-indigo-600 to-blue-600',
    borderColor: 'border-indigo-500/30',
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-300',
    skills: ['Microsoft Excel', 'VS Code', 'Antigravity AI'],
  },
  {
    category: 'AI & Modern Development',
    color: 'from-fuchsia-600 to-pink-600',
    borderColor: 'border-fuchsia-500/30',
    bgColor: 'bg-fuchsia-500/10',
    textColor: 'text-fuchsia-300',
    skills: ['Vibe Coding', 'AI-assisted Development', 'Prompt Engineering'],
  },
  {
    category: 'Currently Learning',
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-300',
    skills: ['AI Full-stack Web Development', 'Bot Development', 'API Integration'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">What I know</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Skills</h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-200 group"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${group.color}`} />
                <h3 className="text-white font-semibold text-base">{group.category}</h3>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${group.borderColor} ${group.bgColor} ${group.textColor} hover:scale-105 transition-transform duration-150 cursor-default`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Strength callout */}
        <div className="mt-10 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-900/20 to-indigo-900/20 p-6 text-center">
          <p className="text-slate-300 text-base">
            💡 <span className="text-white font-semibold">Key Strength:</span> Finance knowledge combined with web development — building tools that are both technically robust and financially insightful.
          </p>
        </div>
      </div>
    </section>
  )
}
