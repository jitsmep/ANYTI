"use client"

import React, { useEffect, useRef, useState } from "react"
import type { StationId } from "./data/stations"
import { STATIONS } from "./data/stations"
import { PROJECTS, BIO } from "./data/portfolio"

// ── Sub-content components ─────────────────────────────────────────────────

function ProjectsContent() {
  return (
    <div className="modal-section">
      <p className="modal-eyebrow">What I've built</p>
      <h2 className="modal-heading">Projects</h2>
      <div className="modal-divider" />
      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-card-top">
              <span className="project-emoji">{project.emoji}</span>
              <div>
                <span className="project-type">{project.type}</span>
                <h3 className="project-title">{project.title}</h3>
              </div>
            </div>
            <p className="project-desc">{project.description}</p>
            <div className="project-tags">
              {project.tech.map((t) => (
                <span key={t} className="project-tag">{t}</span>
              ))}
            </div>
            <a
              href={project.link}
              className="project-link"
              target={project.link !== "#" ? "_blank" : undefined}
              rel={project.link !== "#" ? "noopener noreferrer" : undefined}
            >
              {project.link !== "#" ? "View Project →" : "Link coming soon"}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutContent() {
  const highlights = [
    { icon: "🎓", label: "Education", value: "BSc Computer Science", sub: "Madras Christian College · 2027" },
    { icon: "💻", label: "Focus Area", value: "AI-assisted Development", sub: "Vibe Coding · Prompt Engineering" },
    { icon: "📈", label: "Domain Strength", value: "Finance + Tech", sub: "Trading Journals · Finance Trackers" },
    { icon: "🚀", label: "Currently Learning", value: "Full-stack Web · Bot Dev", sub: "API Integration · AI Tools" },
  ]
  return (
    <div className="modal-section">
      <p className="modal-eyebrow">Who I am</p>
      <h2 className="modal-heading">About Me</h2>
      <div className="modal-divider" />
      <div className="about-grid">
        <div className="about-bio">
          <p>
            I&apos;m <strong>{BIO.name}</strong>, a motivated BSc Computer Science student at Madras Christian College
            (graduating 2027), passionate about the intersection of technology, AI, and real-world problem solving.
          </p>
          <p>
            I build practical applications entirely through code — from a personal Finance Tracker to a full-stack
            Portfolio Builder — using modern vibe coding techniques and AI-assisted development.
          </p>
          <p>
            I also bring a unique edge: a background in finance that lets me design tools like trading journals and
            expense trackers that are both technically sound and financially meaningful.
          </p>
          <p>
            Currently expanding into AI full-stack web development, bot development, and API integration — always
            learning, always building.
          </p>
        </div>
        <div className="highlights-grid">
          {highlights.map((card) => (
            <div key={card.label} className="highlight-card">
              <span className="highlight-icon">{card.icon}</span>
              <div>
                <p className="highlight-label">{card.label}</p>
                <p className="highlight-value">{card.value}</p>
                <p className="highlight-sub">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContactContent() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  type Status = "idle" | "sending" | "success" | "error"
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

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
        setName("")
        setEmail("")
        setMessage("")
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.errors?.[0]?.message ?? "Something went wrong.")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Network error. Please try again.")
      setStatus("error")
    }
  }

  return (
    <div className="modal-section">
      <p className="modal-eyebrow">Say hello</p>
      <h2 className="modal-heading">Get in Touch</h2>
      <div className="modal-divider" />
      <p className="contact-intro">
        I&apos;m open to internship opportunities, collaborations, and interesting projects.
      </p>

      {status === "success" ? (
        <div className="contact-success">
          <span className="contact-success-icon">✓</span>
          <p>Thanks! I&apos;ll get back to you soon.</p>
          <button onClick={() => setStatus("idle")} className="contact-resend-btn">
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="modal-name">Name *</label>
              <input
                id="modal-name"
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "sending"}
              />
            </div>
            <div className="form-field">
              <label htmlFor="modal-email">Email *</label>
              <input
                id="modal-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "sending"}
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="modal-message">Message *</label>
            <textarea
              id="modal-message"
              required
              rows={4}
              placeholder="Tell me what's on your mind…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "sending"}
            />
          </div>
          {status === "error" && <div className="form-error">{errorMsg}</div>}
          <button type="submit" disabled={status === "sending"} className="form-submit-btn">
            {status === "sending" ? "Sending…" : "Send Message →"}
          </button>
        </form>
      )}

      <div className="contact-links">
        <a href={`mailto:${BIO.email}`} className="contact-link-pill">📧 {BIO.email}</a>
        <a href={BIO.github} target="_blank" rel="noopener noreferrer" className="contact-link-pill">
          🐙 github.com/jitsmep
        </a>
        {BIO.linkedin && (
          <a
            href={BIO.linkedin.startsWith("http") ? BIO.linkedin : `https://${BIO.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link-pill"
          >
            💼 LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}

// ── Main Modal ─────────────────────────────────────────────────────────────

interface ContentModalProps {
  stationId: StationId | null
  onClose: () => void
}

export default function ContentModal({ stationId, onClose }: ContentModalProps) {
  const isOpen = stationId !== null
  const station = STATIONS.find((s) => s.id === stationId)

  // Escape key closes modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Trap focus within modal when open
  const modalRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={station?.label}>
      <div className="modal-container" ref={modalRef}>
        {/* Header bar */}
        <div className="modal-header" style={{ borderColor: station?.color }}>
          <div className="modal-header-left">
            <span className="modal-station-icon">{station?.icon}</span>
            <span className="modal-station-label">{station?.label}</span>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="modal-body">
          {stationId === "projects" && <ProjectsContent />}
          {stationId === "about" && <AboutContent />}
          {stationId === "contact" && <ContactContent />}
        </div>

        {/* Footer hint */}
        <div className="modal-footer">
          Press <kbd>Esc</kbd> or click ✕ to return to driving
        </div>
      </div>
    </div>
  )
}
