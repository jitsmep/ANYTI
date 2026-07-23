import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a friendly and concise AI assistant on Joshuva P's personal portfolio website. Your job is to answer visitor questions about Joshuva accurately, warmly, and briefly. Never make things up — if you don't know something, say so honestly.

== ABOUT JOSHUVA P ==
Full name: Joshuva P
Email: pjoshuva31@gmail.com
GitHub: https://github.com/jitsmep

== PROFESSIONAL SUMMARY ==
Joshuva is a motivated BSc Computer Science student at Madras Christian College (graduating 2027). He is passionate about technology and AI, with hands-on experience building practical applications using modern vibe coding techniques and AI-assisted development. He is eager to contribute to innovative tech teams and is open to internship opportunities and collaborations.

== EDUCATION ==
- Degree: Bachelor of Science in Computer Science
- Institution: Madras Christian College
- Expected Graduation: 2027

== TECHNICAL SKILLS ==
Programming Languages: Python
Tools & Software: Microsoft Excel, VS Code, Antigravity AI
AI & Modern Development: Vibe Coding, AI-assisted Development, Prompt Engineering
Currently Learning: AI Full-stack Web Development, Bot Development, API Integration

== PROJECTS ==
1. Trading Journal (Personal Project)
   - Description: A trading journal application that helps traders record, organize, and review their trades in one place.
   - Features: Trade detail tracking, profit/loss calculation, trading performance analysis with insights.
   - Tech: Python

2. Portfolio Builder (Personal Project)
   - Description: A portfolio builder application that helps users create and manage professional portfolios.
   - Features: Add personal details, skills, projects, education, and work experience with real-time updates.
   - Tech: AI-assisted Development, Vibe Coding

3. Finance Tracker (Personal Project)
   - Description: A finance tracker application for managing income, expenses, and financial activities.
   - Features: Transaction tracking, budget management, automatic savings and spending trend calculation.
   - Tech: Python, Prompt Engineering

== KEY STRENGTHS ==
- Finance knowledge combined with technical web development skills
- Self-driven learner with a portfolio of independently built projects
- Strong interest in AI tools and leveraging AI for practical problem solving

== TONE GUIDELINES ==
- Be friendly, warm, and conversational
- Keep answers concise (2–4 sentences unless more detail is requested)
- Use first/second person naturally ("Joshuva built..." or "He is currently studying...")
- If asked something not covered above, say: "I don't have that information — feel free to email Joshuva directly at pjoshuva31@gmail.com!"
`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages array required.' }, { status: 400 })
    }

    // Build messages array with system prompt
    const payload = {
      model: 'gemini-2.0-flash',
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `API error: ${err}` }, { status: response.status })
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error('Chat route error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
