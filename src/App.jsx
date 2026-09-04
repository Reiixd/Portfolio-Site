import { useEffect, useMemo, useRef, useState } from 'react'
import WorldCanvas from './components/WorldCanvas.jsx'

const waypoints = [
  { id: 'home', label: 'Home', weight: 1.7 },
  { id: 'systems', label: 'Systems', weight: 1.7 },
  { id: 'work', label: 'Work', weight: 1.9 },
  { id: 'experience', label: 'Experience', weight: 2.7 },
  { id: 'principles', label: 'Principles', weight: 1.5 },
  { id: 'contact', label: 'Contact', weight: 1.4 },
]

const capabilities = [
  { label: 'Frontend', value: 'React, TypeScript, Next.js, design systems, accessibility' },
  { label: 'Backend', value: 'Node.js, Go, REST, GraphQL, event-driven services' },
  { label: 'Data', value: 'PostgreSQL, Redis, Kafka, analytics pipelines' },
  { label: 'Platform', value: 'AWS, Docker, Kubernetes, Terraform, observability' },
]

const projects = [
  {
    name: 'Atlas',
    title: 'Climate operations, made legible',
    summary: 'A shared operational picture that turns sensor feeds and field reports into clear decisions.',
    stack: 'React · Go · PostgreSQL · Mapbox',
  },
  {
    name: 'Relay',
    title: 'Clinical workflows without the friction',
    summary: 'An accessible care-coordination workspace designed around fast handoffs and accountable decisions.',
    stack: 'Next.js · Node.js · GraphQL · FHIR',
  },
  {
    name: 'Beacon',
    title: 'Infrastructure teams can explain',
    summary: 'A deployment control plane that makes risk, ownership, and recovery paths visible before release.',
    stack: 'TypeScript · Kubernetes · OpenTelemetry',
  },
]

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

function ExperienceList() {
  return (
    <ol className="experience-list">
      <li>
        <span>2023 to now</span>
        <strong>Lead Software Engineer · Northstar Labs</strong>
        <p>Guiding a platform team building dependable data products for climate operations.</p>
      </li>
      <li>
        <span>2020 to 2023</span>
        <strong>Senior Engineer · Relay Health</strong>
        <p>Reworked clinical workflows into accessible tools that stay calm under pressure.</p>
      </li>
      <li>
        <span>2017 to 2020</span>
        <strong>Software Engineer · Fieldwork</strong>
        <p>Built offline-first systems for teams working far beyond reliable connections.</p>
      </li>
      <li>
        <span>2015 to 2017</span>
        <strong>Junior Engineer · Paper Kite Studio</strong>
        <p>Learned product craft by shipping small tools directly alongside designers and customers.</p>
      </li>
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
          AR<span>///</span>
        </button>
        <a className="chrome-contact" href="mailto:alex.ren@example.com">Contact me</a>
      </header>

      <main>
        <div ref={worldRef} className="portfolio-world" data-sc-mode="worldflight" data-sc-seam="0.16" data-sc-lerp="0.12">
          <div data-sc-world className="world-stage">
            <WorldCanvas worldRef={worldRef} totalWeight={totalWeight} />

            <figure className="hero-figure" aria-hidden="true">
              <img
                src="/assets/alex-ren-hero.png"
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
              <p className="status-line"><span /> Software engineer · Systems thinker · Vancouver</p>
              <h1 id="hero-title">I build systems<br />that remember.</h1>
              <p className="hero-lede">Alex Ren turns complex infrastructure into products people trust.</p>
            </section>

            <section className="world-copy world-copy--systems" data-sc-copy data-sc-window="0.12 0.34 0.2 0.2" aria-labelledby="systems-title">
              <h2 id="systems-title">Complexity in.<br /><em>Clarity out.</em></h2>
              <dl className="stack-ledger" aria-label="Technical capabilities">
                {capabilities.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p>I work across the stack, finding the structure that makes hard systems easier to change.</p>
            </section>

            <section className="world-copy world-copy--work" data-sc-copy data-sc-window="0.29 0.52 0.18 0.22" aria-labelledby="work-title">
              <h2 id="work-title">Selected work,<br />built to hold up.</h2>
              <div className="project-list">
                {projects.map((project) => (
                  <article key={project.name}>
                    <p>{project.name}</p>
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
                <p>The route so far</p>
                <h2 id="experience-title">Experience is a connected system.</h2>
              </div>
              <ExperienceList />
            </section>

            <section className="world-copy world-copy--principles" data-sc-copy data-sc-window="0.73 0.89 0.2 0.18" aria-labelledby="principles-title">
              <h2 id="principles-title">Leave the system<br />better than you found it.</h2>
              <p className="principles-intro">I care about boring reliability, legible code, and products that respect the person using them.</p>
              <ul className="principles-list">
                <li>Make failure visible.</li>
                <li>Design for the next engineer.</li>
                <li>Keep the user close to the decision.</li>
              </ul>
            </section>

            <section className="world-copy world-copy--contact" data-sc-copy data-sc-window="finale" aria-labelledby="contact-title">
              <p className="contact-kicker">One route left open.</p>
              <h2 id="contact-title">Let’s build something that lasts.</h2>
              <p>Have a difficult system or an ambitious product? I’d like to hear about it.</p>
              <a className="contact-action" href="mailto:alex.ren@example.com" tabIndex={active === 5 ? 0 : -1}>
                Contact me <span aria-hidden="true">↗</span>
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

      <div className="fiction-note">Concept portfolio · Fictional profile</div>
    </>
  )
}
