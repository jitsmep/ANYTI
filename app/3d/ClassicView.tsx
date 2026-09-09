"use client"

import React from "react"
import { BIO, PROJECTS, SKILLS } from "./data/portfolio"

// ── Nav ─────────────────────────────────────────────────────────────────────
function ClassicNav() {
  return (
    <nav className="classic-nav">
      <div className="classic-nav-inner">
        <span className="classic-nav-logo">
          <span className="classic-nav-logo-accent">J</span>oshuva P
        </span>
        <div className="classic-nav-links">
          <a href="#classic-projects">Projects</a>
          <a href="#classic-about">About</a>
          <a href="#classic-contact">Contact</a>
        </div>
      </div>
    </nav>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function ClassicHero() {
  return (
    <section className="classic-hero">
      <div className="classic-blobs">
        <div className="classic-blob classic-blob-1" />
        <div className="classic-blob classic-blob-2" />
      </div>
      <div className="classic-hero-content">
        <div className="classic-badge">
          <span className="classic-badge-dot" />
          Open to opportunities
        </div>
        <h1 className="classic-hero-name">
          Joshuva{" "}
          <span className="classic-hero-accent">P</span>
        </h1>
        <p className="classic-hero-tagline">{BIO.title}</p>
        <p className="classic-hero-sub">{BIO.tagline}</p>
        <div className="classic-hero-cta">
          <a href="#classic-projects" className="classic-btn-primary">View Projects</a>
          <a href="#classic-contact" className="classic-btn-secondary">Get in Touch</a>
        </div>
        <div className="classic-hero-socials">
          <a href={BIO.github} target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
          <span>·</span>
          <a href={`mailto:${BIO.email}`}>✉️ {BIO.email}</a>
        </div>
      </div>
      <div className="classic-scroll-hint">
        <span>Scroll</span>
        <span>↓</span>
      </div>
    </section>
  )
}

// ── About ────────────────────────────────────────────────────────────────────
function ClassicAbout() {
  const highlights = [
    { icon: "🎓", label: "Education", value: "BSc Computer Science", sub: "Madras Christian College · 2027" },
    { icon: "💻", label: "Focus Area", value: "AI-assisted Development", sub: "Vibe Coding · Prompt Engineering" },
    { icon: "📈", label: "Domain Strength", value: "Finance + Tech", sub: "Trading Journals · Finance Trackers" },
    { icon: "🚀", label: "Currently Learning", value: "Full-stack Web · Bot Dev", sub: "API Integration · AI Tools" },
  ]
  return (
    <section id="classic-about" className="classic-section">
      <p className="classic-eyebrow">Who I am</p>
      <h2 className="classic-section-heading">About Me</h2>
      <div className="classic-heading-bar" />
      <div className="classic-about-grid">
        <div className="classic-bio">
          <p>I&apos;m <strong>{BIO.name}</strong>, a motivated BSc Computer Science student at Madras Christian College (graduating 2027), passionate about the intersection of technology, AI, and real-world problem solving.</p>
          <p>I build practical applications entirely through code — from a personal Finance Tracker to a full-stack Portfolio Builder — using modern vibe coding techniques and AI-assisted development.</p>
          <p>I also bring a unique edge: a background in finance that lets me design tools like trading journals and expense trackers that are both technically sound and financially meaningful.</p>
          <p>Currently expanding into AI full-stack web development, bot development, and API integration — always learning, always building.</p>
        </div>
        <div className="classic-highlights">
          {highlights.map((card) => (
            <div key={card.label} className="classic-highlight-card">
              <span className="classic-hl-icon">{card.icon}</span>
              <div>
                <p className="classic-hl-label">{card.label}</p>
                <p className="classic-hl-value">{card.value}</p>
                <p className="classic-hl-sub">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Skills ───────────────────────────────────────────────────────────────────
function ClassicSkills() {
  return (
    <section className="classic-section classic-section-alt">
      <p className="classic-eyebrow">What I know</p>
      <h2 className="classic-section-heading">Skills</h2>
      <div className="classic-heading-bar" />
      <div className="classic-skills-grid">
        {SKILLS.map((cat) => (
          <div key={cat.category} className="classic-skill-group">
            <h3 className="classic-skill-category">{cat.category}</h3>
            <div className="classic-skill-tags">
              {cat.items.map((item) => (
                <span key={item} className="classic-skill-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Projects ─────────────────────────────────────────────────────────────────
function ClassicProjects() {
  return (
    <section id="classic-projects" className="classic-section">
      <p className="classic-eyebrow">What I've built</p>
      <h2 className="classic-section-heading">Projects</h2>
      <div className="classic-heading-bar" />
      <div className="classic-projects-grid">
        {PROJECTS.map((project) => (
          <div key={project.id} className="classic-project-card">
            <div className="classic-project-top">
              <span className="classic-project-emoji">{project.emoji}</span>
              <div>
                <span className="classic-project-type">{project.type}</span>
                <h3 className="classic-project-title">{project.title}</h3>
              </div>
            </div>
            <p className="classic-project-desc">{project.description}</p>
            <div className="classic-project-tags">
              {project.tech.map((t) => (
                <span key={t} className="classic-skill-tag">{t}</span>
              ))}
            </div>
            <a
              href={project.link}
              className="classic-project-link"
              target={project.link !== "#" ? "_blank" : undefined}
              rel={project.link !== "#" ? "noopener noreferrer" : undefined}
            >
              {project.link !== "#" ? "View Project →" : "Coming soon"}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Contact ──────────────────────────────────────────────────────────────────
function ClassicContact() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")
  type Status = "idle" | "sending" | "success" | "error"
  const [status, setStatus] = React.useState<Status>("idle")
  const [errorMsg, setErrorMsg] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    const url = process.env.NEXT_PUBLIC_FORMSPREE_URL
    try {
      const res = await fetch(url as string, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setStatus("success")
        setName(""); setEmail(""); setMessage("")
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.errors?.[0]?.message ?? "Something went wrong.")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Network error.")
      setStatus("error")
    }
  }

  return (
    <section id="classic-contact" className="classic-section classic-section-alt">
      <p className="classic-eyebrow">Say hello</p>
      <h2 className="classic-section-heading">Get in Touch</h2>
      <div className="classic-heading-bar" />
      <div className="classic-contact-wrap">
        <div className="classic-contact-form-box">
          {status === "success" ? (
            <div className="classic-contact-success">
              <span>✓</span>
              <p>Thanks! I&apos;ll get back to you soon.</p>
              <button onClick={() => setStatus("idle")}>Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="classic-form-row">
                <div className="classic-form-field">
                  <label htmlFor="cv-name">Name *</label>
                  <input id="cv-name" type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} disabled={status === "sending"} />
                </div>
                <div className="classic-form-field">
                  <label htmlFor="cv-email">Email *</label>
                  <input id="cv-email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === "sending"} />
                </div>
              </div>
              <div className="classic-form-field">
                <label htmlFor="cv-message">Message *</label>
                <textarea id="cv-message" required rows={5} placeholder="Tell me what's on your mind…" value={message} onChange={(e) => setMessage(e.target.value)} disabled={status === "sending"} />
              </div>
              {status === "error" && <div className="classic-form-error">{errorMsg}</div>}
              <button type="submit" disabled={status === "sending"} className="classic-submit-btn">
                {status === "sending" ? "Sending…" : "Send Message →"}
              </button>
            </form>
          )}
        </div>
        <div className="classic-contact-links">
          <a href={`mailto:${BIO.email}`} className="classic-contact-pill">
            <span className="classic-contact-pill-icon">📧</span>
            <div>
              <p className="classic-contact-pill-label">Email</p>
              <p className="classic-contact-pill-value">{BIO.email}</p>
            </div>
          </a>
          <a href={BIO.github} target="_blank" rel="noopener noreferrer" className="classic-contact-pill">
            <span className="classic-contact-pill-icon">🐙</span>
            <div>
              <p className="classic-contact-pill-label">GitHub</p>
              <p className="classic-contact-pill-value">github.com/jitsmep</p>
            </div>
          </a>
          {BIO.linkedin && (
            <a
              href={BIO.linkedin.startsWith("http") ? BIO.linkedin : `https://${BIO.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="classic-contact-pill"
            >
              <span className="classic-contact-pill-icon">💼</span>
              <div>
                <p className="classic-contact-pill-label">LinkedIn</p>
                <p className="classic-contact-pill-value">View Profile</p>
              </div>
            </a>
          )}
        </div>
      </div>
      <p className="classic-footer-note">
        Built with Next.js · Designed &amp; developed by <strong>Joshuva P</strong>
      </p>
    </section>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function ClassicView() {
  return (
    <div className="classic-root">
      <ClassicNav />
      <ClassicHero />
      <ClassicAbout />
      <ClassicSkills />
      <ClassicProjects />
      <ClassicContact />
    </div>
  )
}
