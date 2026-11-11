import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import portfolio from './data/portfolio.json'

const { profile, sections } = portfolio
const { systems, work, experience, education, interests, principles, contact, practice } = sections
const mailHref = 'mailto:' + profile.email
const phoneHref = 'tel:' + profile.phone.replace(/\s/g, '')

const navItems = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

const themeColors = { day: '#f6f7f9', night: '#14171d' }

function readTheme() {
  return document.documentElement.dataset.theme === 'night' ? 'night' : 'day'
}

function ThemeIcon({ theme }) {
  if (theme === 'day') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3.6" />
        <path d="M12 3v1.8M12 19.2V21M3 12h1.8M19.2 12H21M5.64 5.64l1.27 1.27M17.09 17.09l1.27 1.27M5.64 18.36l1.27-1.27M17.09 6.91l1.27-1.27" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.6A8 8 0 0 1 9.4 4 8 8 0 1 0 20 14.6Z" />
    </svg>
  )
}

function ArrowUpRight() {
  return (
    <svg className="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  )
}

function Section({ id, title, intro, tone, children }) {
  return (
    <section id={id} className={'section' + (tone ? ' section--' + tone : '')} aria-labelledby={id + '-title'}>
      <div className="wrap section-inner">
        <div className="section-head">
          <h2 id={id + '-title'} className="section-title">{title}</h2>
          {intro && <p className="section-intro">{intro}</p>}
        </div>
        <div className="section-body">{children}</div>
      </div>
    </section>
  )
}

export default function App() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
    try {
      localStorage.setItem('portfolio-theme', theme)
    } catch {
      // The preference still applies for this visit when storage is unavailable.
    }
  }, [theme])

  const nextTheme = theme === 'day' ? 'night' : 'day'

  // The theme change spreads outward from the toggle as a circle.
  const toggleTheme = (event) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduceMotion) {
      setTheme(nextTheme)
      return
    }

    const box = event.currentTarget.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = document.startViewTransition(() => {
      document.documentElement.dataset.theme = nextTheme
      flushSync(() => setTheme(nextTheme))
    })
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="wrap header-inner">
          <a className="wordmark" href="#top" aria-label={profile.name + ', back to top'}>
            {profile.initials}<span className="wordmark-dot" aria-hidden="true" />
          </a>
          <nav className="site-nav" aria-label="Sections">
            {navItems.map((item) => <a key={item.id} href={'#' + item.id}>{item.label}</a>)}
          </nav>
          <button
            type="button"
            className="theme-toggle"
            aria-label={'Switch to ' + nextTheme + ' theme'}
            onClick={toggleTheme}
          >
            <span key={theme} className="theme-icon"><ThemeIcon theme={theme} /></span>
          </button>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero on-field" aria-labelledby="hero-title">
          <div className="wrap hero-inner">
            <h1 id="hero-title" className="hero-name">
              <span className="line"><span>Muhammad</span></span>{' '}
              <span className="line"><span>Reebal Raza</span></span>
            </h1>
            <div className="hero-grid">
              <p className="hero-statement">{profile.headline.join(' ')}</p>
              <div className="hero-copy">
                <p className="hero-meta">
                  <strong>{profile.roles.join(' · ')}</strong>
                  <span>{profile.location}</span>
                </p>
                <p className="hero-summary">{profile.professionalSummary}</p>
                <p className="hero-availability"><span className="status-dot" aria-hidden="true" />{profile.availability}</p>
                <p className="hero-actions">
                  <a className="button" href={mailHref}>Email me</a>
                  <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight /></a>
                  <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">GitHub<ArrowUpRight /></a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section id="work" title={work.headline.join(' ')}>
          <div className="projects">
            {work.projects.map((project) => (
              <article className="project" key={project.name}>
                <header className="project-head">
                  <h3>{project.name}</h3>
                  {project.url && (
                    <a className="text-link" href={project.url} target="_blank" rel="noreferrer">
                      {project.linkLabel}<ArrowUpRight />
                    </a>
                  )}
                </header>
                <p className="project-kind">{project.title}</p>
                <p className="project-summary">{project.summary}</p>
                {project.contributions?.length > 0 && (
                  <ul className="quiet-list">
                    {project.contributions.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
                <p className="project-stack">{project.stack}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="experience" title={experience.headline}>
          <ol className="timeline">
            {experience.items.map((item) => (
              <li key={item.period + item.company}>
                <p className="timeline-period">{item.period}</p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="timeline-company">{item.company}</p>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="practice">
            <p>{practice.leadership}</p>
            <p>{practice.tooling}</p>
          </div>
        </Section>

        <Section id="skills" title={systems.headline.join(' ')} intro={systems.description} tone="surface">
          <dl className="ledger">
            {systems.capabilities.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="education" title="Education">
          <ul className="education">
            {education.items.map((item) => (
              <li key={item.qualification}>
                <p className="timeline-period">{item.period}</p>
                <div>
                  <h3>{item.qualification}</h3>
                  <p className="timeline-company">{item.institution}</p>
                  {item.detail && <p>{item.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="approach" title={principles.headline.join(' ')} intro={principles.description}>
          <ul className="statements">
            {principles.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h3 className="subhead">Areas of interest</h3>
          <ul className="quiet-list">
            {interests.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Section>

        <section id="contact" className="contact on-field" aria-labelledby="contact-title">
          <div className="wrap contact-inner">
            <h2 id="contact-title" className="contact-title">{contact.headline}</h2>
            <p className="contact-note">{contact.description}</p>
            <a className="contact-mail" href={mailHref}>{profile.email}</a>
            <p className="contact-links">
              <a className="text-link" href={phoneHref}>{profile.phone}</a>
              <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight /></a>
              <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">GitHub<ArrowUpRight /></a>
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <span>{profile.name}</span>
          <span>{profile.location}</span>
        </div>
      </footer>
    </>
  )
}
