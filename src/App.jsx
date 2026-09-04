import { useEffect, useMemo, useRef, useState } from 'react'
import WorldCanvas from './components/WorldCanvas.jsx'
import portfolio from './data/portfolio.json'

const { profile, navigation: waypoints, sections, meta } = portfolio
const { systems, work, experience, principles, contact } = sections
const mailHref = 'mailto:' + profile.email

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

export default function App() {
  const worldRef = useRef(null)
  const [active, setActive] = useState(0)
  const totalWeight = useMemo(() => waypoints.reduce((sum, item) => sum + item.weight, 0), [])

  useEffect(() => {
    const root = worldRef.current
    if (!root || !window.ScrollCraft) return undefined
    window.ScrollCraft.mount(document)

    const updateWaypoint = (event) => setActive(event.detail.index)
    root.addEventListener('sc:waypoint', updateWaypoint)

    const relayout = () => window.dispatchEvent(new Event('resize'))
    window.addEventListener('load', relayout)
    document.fonts?.ready.then(relayout)

    return () => {
      root.removeEventListener('sc:waypoint', updateWaypoint)
      window.removeEventListener('load', relayout)
    }
  }, [])

  const goTo = (index) => {
    const before = waypoints.slice(0, index).reduce((sum, item) => sum + item.weight, 0)
    const isFinale = index === waypoints.length - 1
    const positionInSegment = isFinale ? 0.85 : 0.5
    const target = index === 0 ? 0 : before + waypoints[index].weight * positionInSegment
    const top = worldRef.current?.getBoundingClientRect().top + window.scrollY || 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: top + target * window.innerHeight, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <>
      <a className="skip-link" href="#world-copy">Skip to portfolio content</a>
      <header className="site-chrome">
        <button type="button" className="wordmark" onClick={() => goTo(0)} aria-label="Return to the beginning">
          {profile.initials}<span>///</span>
        </button>
        <a className="chrome-contact" href={mailHref}>{contact.actionLabel}</a>
      </header>

      <main>
        <div ref={worldRef} className="portfolio-world" data-sc-mode="worldflight" data-sc-seam="0.16" data-sc-lerp="0.12">
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

            <section className="world-copy world-copy--hero" data-sc-copy data-sc-window="0 0.16 0 0.28" aria-labelledby="hero-title">
              <p className="status-line"><span /> {profile.roles.join(' · ')} · {profile.location}</p>
              <h1 id="hero-title">{profile.headline[0]}<br />{profile.headline[1]}</h1>
              <p className="hero-lede">{profile.introduction}</p>
            </section>

            <section className="world-copy world-copy--systems" data-sc-copy data-sc-window="0.12 0.34 0.2 0.2" aria-labelledby="systems-title">
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

            <section className="world-copy world-copy--work" data-sc-copy data-sc-window="0.29 0.52 0.18 0.22" aria-labelledby="work-title">
              <h2 id="work-title">{work.headline[0]}<br />{work.headline[1]}</h2>
              <div className="project-list">
                {work.projects.map((project) => (
                  <article key={project.name}>
                    <p>
                      <a href={project.url} target="_blank" rel="noreferrer">
                        {project.name}
                      </a>
                    </p>
                    <div>
                      <h3>{project.title}</h3>
                      <span>{project.summary}</span>
                    </div>
                    <small>{project.stack}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="world-copy world-copy--experience" data-sc-copy data-sc-window="0.45 0.76 0.16 0.18" aria-labelledby="experience-title">
              <div className="experience-heading">
                <p>{experience.label}</p>
                <h2 id="experience-title">{experience.headline}</h2>
              </div>
              <ExperienceList items={experience.items} />
            </section>

            <section className="world-copy world-copy--principles" data-sc-copy data-sc-window="0.73 0.89 0.2 0.18" aria-labelledby="principles-title">
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
              <a className="contact-action" href={mailHref} tabIndex={active === waypoints.length - 1 ? 0 : -1}>
                {contact.actionLabel} <span aria-hidden="true">↗</span>
              </a>
            </section>
          </div>

          <RouteMap active={active} onSelect={goTo} />

          <div className="journey-trace" aria-hidden="true">
            <span style={{ '--trace-progress': `${(active + 1) / waypoints.length}` }} />
          </div>

          <div data-sc-spacer aria-hidden="true" />
        </div>
      </main>

      <div className="fiction-note">{meta.conceptNote}</div>
    </>
  )
}
