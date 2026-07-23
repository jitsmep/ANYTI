'use client'

import React, { useState } from 'react'

const contactLinks = [
  {
    id: 'contact-email',
    label: 'Email',
    value: 'pjoshuva31@gmail.com',
    href: 'mailto:pjoshuva31@gmail.com',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    gradient: 'from-violet-600 to-indigo-600',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
  },
  {
    id: 'contact-github',
    label: 'GitHub',
    value: 'github.com/jitsmep',
    href: 'https://github.com/jitsmep',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    gradient: 'from-slate-600 to-gray-600',
    border: 'border-slate-500/30',
    bg: 'bg-slate-500/10',
  },
  {
    id: 'contact-linkedin',
    label: 'LinkedIn',
    value: '[ADD YOUR LINKEDIN]',
    href: '#',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    gradient: 'from-blue-600 to-cyan-600',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
  },
]

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const formspreeUrl = process.env.NEXT_PUBLIC_FORMSPREE_URL

    try {
      const res = await fetch(formspreeUrl as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(
          data?.errors?.[0]?.message ?? 'Something went wrong. Please try again.'
        )
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const inputBase =
    'w-full rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/60 transition-all duration-200'

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Say hello</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Get in Touch</h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
          <p className="mt-6 text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            I&apos;m open to internship opportunities, collaborations, and interesting projects. Feel free to reach out!
          </p>
        </div>

        {/* Contact form */}
        <div className="mb-10 rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 sm:p-8 backdrop-blur-sm">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Thanks! I&apos;ll get back to you soon.</p>
              <p className="text-slate-400 text-sm">Your message has been sent successfully.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-violet-400 hover:text-violet-300 text-sm underline underline-offset-2 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form id="contact-form" onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputBase}
                    disabled={status === 'sending'}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email-input" className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Email <span className="text-violet-400">*</span>
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputBase}
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Message <span className="text-violet-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Tell me what's on your mind…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputBase} resize-none`}
                  disabled={status === 'sending'}
                />
              </div>

              {/* Error banner */}
              {status === 'error' && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                id="contact-submit"
                type="submit"
                disabled={status === 'sending'}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 text-sm transition-all duration-200 shadow-md hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                {status === 'sending' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-slate-700/60" />
          <p className="text-slate-500 text-xs uppercase tracking-widest">or reach me directly</p>
          <div className="flex-1 h-px bg-slate-700/60" />
        </div>

        {/* Contact cards */}
        <div className="space-y-4">
          {contactLinks.map((link) => (
            <a
              key={link.id}
              id={link.id}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`flex items-center gap-5 p-5 rounded-2xl border ${link.border} ${link.bg} hover:bg-slate-800/60 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group`}
            >
              {/* Icon circle */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-white shadow-md`}>
                {link.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{link.label}</p>
                <p className="text-white font-semibold truncate group-hover:text-violet-300 transition-colors">
                  {link.value}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-slate-500 text-sm">
          Built with Next.js · Designed &amp; developed by <span className="text-slate-400">Joshuva P</span>
        </p>
      </div>
    </section>
  )
}
