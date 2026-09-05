import { useEffect, useId, useMemo, useRef, useState } from 'react'
import WorldCanvas from './components/WorldCanvas.jsx'
import portfolio from './data/portfolio.json'

const { profile, navigation: waypoints, sections, meta } = portfolio
const { systems, work, experience, principles, contact } = sections
const mailHref = 'mailto:' + profile.email
const phoneHref = 'tel:' + profile.phone.replace(/\s/g, '')

function ThemeIcon({ theme }) {
  if (theme === 'day') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3.4" />
        <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.45 1.45M18.35 18.35l1.45 1.45M2.5 12h2M19.5 12h2M4.2 19.8l1.45-1.45M18.35 5.65l1.45-1.45" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.1 15.25A8.35 8.35 0 0 1 8.75 3.9a8.35 8.35 0 1 0 11.35 11.35Z" />
    </svg>
  )
}

function ContactMenu({ label, variant = 'chrome', enabled = true }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const menuRef = useRef(null)
  const triggerRef = useRef(null)
  const isOpen = open && enabled

  useEffect(() => {
    if (!enabled) setOpen(false)
  }, [enabled])

  useEffect(() => {
    if (!isOpen) return undefined

    const closeFromOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }
    const closeWithEscape = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeFromOutside)
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      document.removeEventListener('pointerdown', closeFromOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className={'contact-menu contact-menu--' + variant}>
      <button
        ref={triggerRef}
        type="button"
        className={variant === 'section' ? 'contact-action' : 'chrome-contact'}
        aria-expanded={isOpen}
        aria-controls={panelId}
        tabIndex={enabled ? 0 : -1}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
        <span className="contact-chevron" aria-hidden="true" />
      </button>

      <div
        id={panelId}
        className={'contact-panel' + (isOpen ? ' is-open' : '')}
        aria-hidden={!isOpen}
      >
        <a className="contact-option" href={mailHref} tabIndex={isOpen ? 0 : -1} onClick={() => setOpen(false)}>
          <span>Email</span>
          <strong>{profile.email}</strong>
        </a>
        <a className="contact-option" href={phoneHref} tabIndex={isOpen ? 0 : -1} onClick={() => setOpen(false)}>
          <span>Phone</span>
          <strong>{profile.phone}</strong>
        </a>
      </div>
    </div>
  )
}

function RouteMap({ active, onSelect }) {
  return (
    <nav className="route-map" aria-label="Portfolio journey">
      <span className="route-line" aria-hidden="true" />
      {waypoints.map((item, index) => (
        <button
          className="route-stop"
          key={item.id}
          type="button"
          aria-current={active === index ? 'step' : undefined}
          onClick={() => onSelect(index)}
        >
          <span className="route-dot" aria-hidden="true" />
          <span className="route-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

function ExperienceList({ items }) {
  return (
    <ol className="experience-list">
      {items.map((item) => (
        <li key={item.period + '-' + item.company}>
          <span>{item.period}</span>
          <strong>{item.role} · {item.company}</strong>
          <p>{item.description}</p>
        </li>
      ))}
    </ol>
  )
}

function MinimalPortfolio() {
  return (
    <div id="minimal-content" className="minimal-portfolio">
      <section className="minimal-hero" aria-labelledby="minimal-hero-title">
        <p className="minimal-meta">{profile.roles.join(' · ')} · {profile.location}</p>
        <h1 id="minimal-hero-title">{profile.headline[0]}<br />{profile.headline[1]}</h1>
        <p>{profile.introduction}</p>
      </section>

      <section className="minimal-section minimal-systems" aria-labelledby="minimal-systems-title">
        <div className="minimal-section-heading">
          <h2 id="minimal-systems-title">{systems.headline[0]} {systems.headline[1]}</h2>
          <p>{systems.description}</p>
        </div>
        <dl className="minimal-capabilities">
          {systems.capabilities.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="minimal-section" aria-labelledby="minimal-work-title">
        <div className="minimal-section-heading">
          <h2 id="minimal-work-title">{work.headline.join(' ')}</h2>
        </div>
        <div className="minimal-projects">
          {work.projects.map((project) => (
            <article key={project.name}>
              <div className="minimal-project-heading">
                <p>{project.name}</p>
                <a href={project.url} target="_blank" rel="noreferrer">{project.linkLabel}</a>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <small>{project.stack}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="minimal-section minimal-experience" aria-labelledby="minimal-experience-title">
        <div className="minimal-section-heading">
          <h2 id="minimal-experience-title">{experience.headline}</h2>
        </div>
        <ExperienceList items={experience.items} />
      </section>

      <section className="minimal-section minimal-principles" aria-labelledby="minimal-principles-title">
        <div className="minimal-section-heading">
          <h2 id="minimal-principles-title">{principles.headline.join(' ')}</h2>
          <p>{principles.description}</p>
        </div>
        <ul>
          {principles.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="minimal-section minimal-contact" aria-labelledby="minimal-contact-title">
        <div className="minimal-section-heading">
          <h2 id="minimal-contact-title">{contact.headline}</h2>
          <p>{contact.description}</p>
        </div>
        <ContactMenu label={contact.actionLabel} variant="section" />
      </section>

      <footer className="minimal-footer">{meta.conceptNote}</footer>
    </div>
  )
}

export default function App() {
  const worldRef = useRef(null)
  const [active, setActive] = useState(0)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') === 'day' ? 'day' : 'night'
    } catch {
      return 'night'
    }
  })
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem('portfolio-view') === 'minimal' ? 'minimal' : 'world'
    } catch {
      return 'world'
    }
  })
  const totalWeight = useMemo(() => waypoints.reduce((sum, item) => sum + item.weight, 0), [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('portfolio-theme', theme)
    } catch {
      // The preference still applies for this visit when storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent('portfolio:themechange'))
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('portfolio-view', view)
    } catch {
      // The preference still applies for this visit when storage is unavailable.
    }

    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
      window.dispatchEvent(new Event('resize'))
    })
    return () => cancelAnimationFrame(frame)
  }, [view])

  useEffect(() => {
    const root = worldRef.current
    if (!root || !window.ScrollCraft) return undefined
    window.ScrollCraft.mount(document)

    const workIndex = waypoints.findIndex((item) => item.id === 'work')
    const workStart = waypoints.slice(0, workIndex).reduce((sum, item) => sum + item.weight, 0)
    const workWeight = waypoints[workIndex]?.weight || 1
    const workSection = root.querySelector('.world-copy--work')
    const workTrack = root.querySelector('.work-copy-track')
    const copySections = Array.from(root.querySelectorAll('[data-sc-copy]'))
    let scrollFrame = 0

    const updateScrollState = () => {
      scrollFrame = 0

      if (workSection && workTrack) {
        const sectionStyle = getComputedStyle(workSection)
        const availableHeight = window.innerHeight
          - Number.parseFloat(sectionStyle.paddingTop)
          - Number.parseFloat(sectionStyle.paddingBottom)
        const travel = Math.max(workTrack.scrollHeight - availableHeight, 0)
        const worldTop = root.getBoundingClientRect().top + window.scrollY
        const flightPosition = (window.scrollY - worldTop) / Math.max(window.innerHeight, 1)
        const localProgress = Math.min(Math.max((flightPosition - workStart) / workWeight, 0), 1)
        const revealProgress = Math.min(Math.max((localProgress - 0.12) / 0.56, 0), 1)
        const easedProgress = revealProgress * revealProgress * (3 - 2 * revealProgress)

        workTrack.style.transform = 'translate3d(0, ' + (-travel * easedProgress).toFixed(2) + 'px, 0)'
      }

      let dominantIndex = 0
      let dominantOpacity = -1
      copySections.forEach((section, index) => {
        const opacity = Number.parseFloat(getComputedStyle(section).opacity) || 0
        if (opacity > dominantOpacity) {
          dominantIndex = index
          dominantOpacity = opacity
        }
      })
      setActive((current) => current === dominantIndex ? current : dominantIndex)
    }

    const scheduleScrollState = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState)
    }

    window.addEventListener('scroll', scheduleScrollState, { passive: true })
    window.addEventListener('resize', scheduleScrollState)
    scheduleScrollState()

    const relayout = () => window.dispatchEvent(new Event('resize'))
    window.addEventListener('load', relayout)
    document.fonts?.ready.then(relayout)

    return () => {
      window.removeEventListener('scroll', scheduleScrollState)
      window.removeEventListener('resize', scheduleScrollState)
      window.removeEventListener('load', relayout)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
    }
  }, [])

  const goTo = (index) => {
    const before = waypoints.slice(0, index).reduce((sum, item) => sum + item.weight, 0)
    const isFinale = index === waypoints.length - 1
    const positionInSegment = isFinale ? 0.85 : waypoints[index].id === 'work' ? 0.12 : 0.5
    const target = index === 0 ? 0 : before + waypoints[index].weight * positionInSegment
    const top = worldRef.current?.getBoundingClientRect().top + window.scrollY || 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: top + target * window.innerHeight, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const goToStart = () => {
    if (view === 'minimal') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    goTo(0)
  }

  return (
    <>
      <a className="skip-link" href={view === 'minimal' ? '#minimal-content' : '#world-copy'}>
        Skip to portfolio content
      </a>
      <header className="site-chrome">
        <button type="button" className="wordmark" onClick={goToStart} aria-label="Return to the beginning">
          {profile.initials}<span>///</span>
        </button>
        <div className="header-actions">
          <button
            type="button"
            className="display-toggle"
            aria-label={theme === 'day' ? 'Switch to night theme' : 'Switch to day theme'}
            aria-pressed={theme === 'day'}
            onClick={() => setTheme((current) => current === 'night' ? 'day' : 'night')}
          >
            <span className="theme-icon-window" aria-hidden="true">
              <span key={theme} className="theme-icon-pop">
                <ThemeIcon theme={theme} />
              </span>
            </span>
            <span>{theme === 'day' ? 'Day' : 'Night'}</span>
          </button>
          <button
            type="button"
            className="display-toggle"
            aria-label={view === 'minimal' ? 'Switch to immersive portfolio' : 'Switch to minimalist portfolio'}
            aria-pressed={view === 'minimal'}
            onClick={() => setView((current) => current === 'world' ? 'minimal' : 'world')}
          >
            Minimal
          </button>
          <ContactMenu label={contact.actionLabel} />
        </div>
      </header>

      <main>
        <div
          ref={worldRef}
          className="portfolio-world"
          data-sc-mode="worldflight"
          data-sc-seam="0.16"
          data-sc-lerp="0.12"
          hidden={view === 'minimal'}
        >
          <div data-sc-world className="world-stage">
            <WorldCanvas worldRef={worldRef} totalWeight={totalWeight} />

            <figure className="hero-figure" aria-hidden="true">
              <img
                src={profile.heroImage}
                alt=""
                width="1493"
                height="1054"
                decoding="async"
              />
            </figure>

            <div className="world-depth world-depth--near" aria-hidden="true" />
            <div className="world-depth world-depth--far" aria-hidden="true" />

            {waypoints.map((item) => (
              <div
                key={item.id}
                data-sc-segment
                data-sc-w={item.weight}
                data-sc-linger={item.id === 'experience' ? '0.42' : '0.12'}
                data-sc-waypoint={item.label}
                aria-hidden="true"
              />
            ))}
          </div>

          <div id="world-copy" data-sc-world-copy className="copy-layer">
            <div className="copy-scrim" aria-hidden="true" />

            <section className="world-copy world-copy--hero" data-sc-copy data-sc-window="0 0.145 0 0.28" aria-labelledby="hero-title">
              <p className="status-line"><span /> {profile.roles.join(' · ')} · {profile.location}</p>
              <h1 id="hero-title">{profile.headline[0]}<br />{profile.headline[1]}</h1>
              <p className="hero-lede">{profile.introduction}</p>
            </section>

            <section className="world-copy world-copy--systems" data-sc-copy data-sc-window="0.115 0.295 0.18 0.18" aria-labelledby="systems-title">
              <h2 id="systems-title">{systems.headline[0]}<br /><em>{systems.headline[1]}</em></h2>
              <dl className="stack-ledger" aria-label="Technical capabilities">
                {systems.capabilities.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p>{systems.description}</p>
            </section>

            <section className="world-copy world-copy--work" data-sc-copy data-sc-window="0.265 0.55 0.12 0.08" aria-labelledby="work-title">
              <div className="work-copy-track">
                <h2 id="work-title">{work.headline[0]}<br />{work.headline[1]}</h2>
                <div className="project-list">
                {work.projects.map((project) => (
                  <article key={project.name}>
                    <p>{project.name}</p>
                    <div>
                      <h3>{project.title}</h3>
                      <span>{project.summary}</span>
                    </div>
                    <div className="project-meta">
                      <small>{project.stack}</small>
                      <a className="project-link" href={project.url} target="_blank" rel="noreferrer">
                        {project.linkLabel}
                      </a>
                    </div>
                  </article>
                ))}
                </div>
              </div>
            </section>

            <section className="world-copy world-copy--experience" data-sc-copy data-sc-window="0.525 0.78 0.12 0.14" aria-labelledby="experience-title">
              <div className="experience-heading">
                <p>{experience.label}</p>
                <h2 id="experience-title">{experience.headline}</h2>
              </div>
              <ExperienceList items={experience.items} />
            </section>

            <section className="world-copy world-copy--principles" data-sc-copy data-sc-window="0.755 0.9 0.16 0.14" aria-labelledby="principles-title">
              <h2 id="principles-title">{principles.headline[0]}<br />{principles.headline[1]}</h2>
              <p className="principles-intro">{principles.description}</p>
              <ul className="principles-list">
                {principles.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="world-copy world-copy--contact" data-sc-copy data-sc-window="finale" aria-labelledby="contact-title">
              <p className="contact-kicker">{contact.label}</p>
              <h2 id="contact-title">{contact.headline}</h2>
              <p>{contact.description}</p>
              <ContactMenu
                label={contact.actionLabel}
                variant="section"
                enabled={active === waypoints.length - 1}
              />
            </section>
          </div>

          <RouteMap active={active} onSelect={goTo} />

          <div className="journey-trace" aria-hidden="true">
            <span style={{ '--trace-progress': `${(active + 1) / waypoints.length}` }} />
          </div>

          <div data-sc-spacer aria-hidden="true" />
        </div>

        {view === 'minimal' && <MinimalPortfolio />}
      </main>

      {view === 'world' && <div className="fiction-note">{meta.conceptNote}</div>}
    </>
  )
}
