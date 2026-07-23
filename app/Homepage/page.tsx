import React from 'react'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Project from './Project'
import Contact from './Contact'

export default function page() {
    return (
        <div>
            <Hero />
            <About />
            <Skills />
            <Project />
            <Contact />
        </div>
    )
}
