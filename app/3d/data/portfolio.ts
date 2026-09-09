// ── Portfolio data (single source of truth) ─────────────────────────────────
// Update this file to change content shown in modals AND Classic View.

export const BIO = {
  name: "Joshuva P",
  title: "Technology & AI Enthusiast · Vibe Coder",
  tagline: "BSc Computer Science student crafting practical tools — from finance trackers to full-stack web apps — entirely through code.",
  email: "pjoshuva31@gmail.com",
  github: "https://github.com/jitsmep",
  linkedin: "www.linkedin.com/in/j0shuva", // ← will be updated once user provides URL
  openToWork: true,
  education: "BSc Computer Science · Madras Christian College · 2027",
}

export const PROJECTS = [
  {
    id: "trading-journal",
    title: "Trading Journal",
    type: "Personal Project",
    description:
      "Developed a Trading Journal to help traders record, organize, and review their trades in one place. Features trade detail tracking, profit/loss calculation, and trading performance analysis with clear insights.",
    tech: ["Python"],
    emoji: "📊",
    link: "#",
    gradient: "from-violet-600/20 to-purple-600/10",
    accent: "border-violet-500/40",
    tagColor: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
  {
    id: "portfolio-builder",
    title: "Portfolio Builder",
    type: "Personal Project",
    description:
      "Built a Portfolio Builder application that helps users create and manage professional portfolios with an easy-to-use interface. Supports adding personal details, skills, projects, education, and work experience with real-time updates.",
    tech: ["AI-assisted Development", "Vibe Coding"],
    emoji: "🗂️",
    link: "#",
    gradient: "from-indigo-600/20 to-blue-600/10",
    accent: "border-indigo-500/40",
    tagColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  },
  {
    id: "finance-tracker",
    title: "Finance Tracker",
    type: "Personal Project",
    description:
      "Developed a Finance Tracker application to help users manage their income, expenses, and overall financial activities. Includes transaction tracking, budget management, and automatic calculation of savings and spending trends.",
    tech: ["Python", "Prompt Engineering"],
    emoji: "💰",
    link: "#",
    gradient: "from-emerald-600/20 to-teal-600/10",
    accent: "border-emerald-500/40",
    tagColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
]

export const SKILLS = [
  { category: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL"] },
  { category: "Frameworks", items: ["Next.js", "React", "Node.js"] },
  { category: "AI & Tools", items: ["Prompt Engineering", "Vibe Coding", "Groq API", "LLM Integration"] },
  { category: "Domain", items: ["Finance Tracking", "Trading Journals", "Bot Development"] },
]
