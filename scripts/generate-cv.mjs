import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..')
const dataPath = join(projectRoot, 'src', 'data', 'portfolio.json')
const outputDirectory = join(projectRoot, 'public')
const htmlPath = join(outputDirectory, 'Muhammad-Reebal-Raza-CV.html')
const pdfPath = join(outputDirectory, 'Muhammad-Reebal-Raza-CV.pdf')
const texPath = join(outputDirectory, 'Muhammad-Reebal-Raza-CV.tex')

const portfolio = JSON.parse(await readFile(dataPath, 'utf8'))
const { profile, sections } = portfolio

const clean = (value = '') =>
  String(value)
    .replaceAll('Â·', '·')
    .replaceAll('â€™', '’')
    .trim()

const escapeHtml = (value = '') =>
  clean(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const escapeLatex = (value = '') =>
  clean(value)
    .replaceAll('\\', '\\textbackslash{}')
    .replaceAll('&', '\\&')
    .replaceAll('%', '\\%')
    .replaceAll('$', '\\$')
    .replaceAll('#', '\\#')
    .replaceAll('_', '\\_')
    .replaceAll('{', '\\{')
    .replaceAll('}', '\\}')
    .replaceAll('~', '\\textasciitilde{}')
    .replaceAll('^', '\\textasciicircum{}')
    .replaceAll(String.fromCharCode(183), '\\textperiodcentered{}')
    .replaceAll(String.fromCharCode(8217), "'")

const skills = sections.systems.capabilities
  .map(
    ({ label, value }) => `
      <div class="skill-group">
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(value)}</dd>
      </div>`,
  )
  .join('')

const experience = sections.experience.items
  .map(
    ({ period, role, company, description }) => `
      <article class="entry">
        <div class="entry-heading">
          <div>
            <h3>${escapeHtml(role)}</h3>
            <p class="organization">${escapeHtml(company)}</p>
          </div>
          <time>${escapeHtml(period)}</time>
        </div>
        <p>${escapeHtml(description)}</p>
      </article>`,
  )
  .join('')

const education = sections.education.items
  .slice(0, 1)
  .map(
    ({ period, qualification, institution, detail }) => `
      <article class="education-item">
        <div>
          <h3>${escapeHtml(qualification)}</h3>
          <time>${escapeHtml(period)}</time>
        </div>
        <p>${escapeHtml(institution)}</p>
        ${detail ? `<strong>${escapeHtml(detail)}</strong>` : ''}
      </article>`,
  )
  .join('')

const projects = sections.work.projects
  .map(
    ({ name, title, summary, stack, url }) => `
      <article class="entry project">
        <div class="entry-heading">
          <div>
            <h3>${escapeHtml(name)}</h3>
            <p class="organization">${escapeHtml(title)}</p>
          </div>
          <a href="${escapeHtml(url)}">Website ↗</a>
        </div>
        <p>${escapeHtml(summary)}</p>
        <p class="stack">${escapeHtml(stack)}</p>
      </article>`,
  )
  .join('')

const roles = profile.roles.map(clean).join(' · ')
const telephone = clean(profile.phone).replace(/\s+/g, '')

const latexSkills = sections.systems.capabilities
  .map(({ label, value }) =>
    ['\\cvskill{', escapeLatex(label), '}{', escapeLatex(value), '}'].join(''),
  )
  .join('\n')

const latexEducation = sections.education.items
  .slice(0, 1)
  .map(({ period, qualification, institution, detail }) =>
    [
      '\\cveducation{',
      escapeLatex(period),
      '}{',
      escapeLatex(qualification),
      '}{',
      escapeLatex(institution),
      '}{',
      escapeLatex(detail),
      '}',
    ].join(''),
  )
  .join('\n')

const latexExperience = sections.experience.items
  .map(({ period, role, company, description }) =>
    [
      '\\cventry{',
      escapeLatex(period),
      '}{',
      escapeLatex(role),
      '}{',
      escapeLatex(company),
      '}{',
      escapeLatex(description),
      '}',
    ].join(''),
  )
  .join('\n')

const latexProjects = sections.work.projects
  .map(({ name, title, summary, stack, url }) =>
    [
      '\\cvproject{',
      escapeLatex(name),
      '}{',
      escapeLatex(title),
      '}{',
      escapeLatex(summary),
      '}{',
      escapeLatex(stack),
      '}{',
      clean(url),
      '}',
    ].join(''),
  )
  .join('\n')

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(profile.name)} — CV</title>
    <style>
      :root {
        --ink: #11191b;
        --muted: #4f5f63;
        --line: #cbd5d7;
        --accent: #11191b;
        --paper: #ffffff;
      }

      * { box-sizing: border-box; }

      @page {
        size: A4;
        margin: 11mm 12mm 12mm;
      }

      html {
        background: var(--paper);
        color: var(--ink);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.3pt;
      }

      body {
        width: 186mm;
        min-height: 273mm;
        margin: 10mm auto;
        padding: 13mm 14mm;
        background: var(--paper);
        box-shadow: none;
      }

      h1, h2, h3, p, dl, dd, ul { margin-top: 0; }
      a { color: inherit; text-underline-offset: 2px; }

      .masthead {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12mm;
        align-items: end;
        padding-bottom: 7mm;
        border-bottom: 2px solid var(--ink);
      }

      h1 {
        max-width: 11ch;
        margin-bottom: 2mm;
        font-size: 31pt;
        line-height: 0.94;
        letter-spacing: -0.035em;
        text-transform: uppercase;
      }

      .role {
        margin-bottom: 0;
        color: var(--accent);
        font-size: 10pt;
        font-weight: 700;
      }

      address {
        display: grid;
        gap: 1.3mm;
        color: var(--muted);
        font-size: 8.5pt;
        font-style: normal;
        text-align: right;
      }

      .summary {
        width: 100%;
        max-width: none;
        margin: 6mm 0 0;
        color: var(--muted);
        font-size: 10.5pt;
        line-height: 1.55;
      }

      .summary strong { color: var(--ink); }

      .layout {
        display: grid;
        grid-template-columns: 60mm minmax(0, 1fr);
        gap: 8mm;
        margin-top: 8mm;
      }

      .sidebar {
        padding-right: 7mm;
        border-right: 1px solid var(--line);
      }

      section + section { margin-top: 5mm; }

      h2 {
        margin-bottom: 2mm;
        color: var(--accent);
        font-size: 8.2pt;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .skill-group {
        padding: 3.3mm 0;
        border-top: 1px solid var(--line);
        break-inside: avoid;
      }

      dt, h3 {
        margin-bottom: 1.2mm;
        font-size: 9.5pt;
        font-weight: 700;
        line-height: 1.3;
      }

      dd, .sidebar p {
        margin-bottom: 0;
        color: var(--muted);
        font-size: 8pt;
        line-height: 1.55;
      }

      .education-list {
        border-top: 1px solid var(--line);
      }

      .education-item {
        padding: 3mm 0;
        border-bottom: 1px solid var(--line);
        break-inside: avoid;
      }

      .education-item > div {
        display: flex;
        justify-content: space-between;
        gap: 2mm;
        align-items: baseline;
      }

      .education-item h3 {
        margin-bottom: 0;
        font-size: 8.3pt;
      }

      .education-item time {
        flex: 0 0 auto;
        color: var(--accent);
        font-size: 7pt;
        font-weight: 700;
      }

      .education-item p,
      .education-item strong {
        display: block;
        margin: 1.2mm 0 0;
        color: var(--muted);
        font-size: 7.3pt;
        line-height: 1.45;
      }

      .education-item strong {
        color: var(--ink);
      }

      .entry {
        padding: 4mm 0;
        border-top: 1px solid var(--line);
        break-inside: avoid;
      }

      .entry-heading {
        display: flex;
        justify-content: space-between;
        gap: 6mm;
        align-items: baseline;
      }

      .entry-heading > div { min-width: 0; }

      .entry-heading time,
      .entry-heading > a {
        flex: 0 0 auto;
        color: var(--accent);
        font-size: 7.8pt;
        font-weight: 700;
      }

      .organization {
        margin-bottom: 0;
        color: var(--muted);
        font-size: 8.2pt;
      }

      .entry > p {
        margin: 2.5mm 0 0;
        color: var(--muted);
        font-size: 8.4pt;
        line-height: 1.55;
      }

      .entry .stack {
        color: var(--ink);
        font-size: 7.4pt;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        gap: 8mm;
        margin-top: 8mm;
        padding-top: 4mm;
        border-top: 2px solid var(--ink);
        color: var(--muted);
        font-size: 7.5pt;
      }

      @media print {
        html {
          height: 100%;
          overflow: hidden;
          background: var(--paper);
        }

        body {
          width: 116.28%;
          min-height: auto;
          margin: 0;
          padding: 0;
          background: var(--paper);
          box-shadow: none;
          transform: scale(0.86);
          transform-origin: top left;
        }
      }

      @media screen and (max-width: 760px) {
        body {
          width: calc(100% - 24px);
          margin: 12px;
          padding: 24px;
        }

        .masthead, .layout { grid-template-columns: 1fr; }
        address { text-align: left; }
        .sidebar {
          padding-right: 0;
          padding-bottom: 8mm;
          border-right: 0;
          border-bottom: 1px solid var(--line);
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="masthead">
        <div>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="role">${escapeHtml(roles)}</p>
        </div>
        <address>
          <span>${escapeHtml(profile.location)}</span>
          <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
          <a href="tel:${escapeHtml(telephone)}">${escapeHtml(profile.phone)}</a>
        </address>
      </div>
      <p class="summary">
        ${escapeHtml(profile.professionalSummary)}
      </p>
    </header>

    <main class="layout">
      <aside class="sidebar">
        <section>
          <h2>Technical skills</h2>
          <dl>${skills}</dl>
        </section>
        <section>
          <h2>Education</h2>
          <div class="education-list">${education}</div>
        </section>
      </aside>

      <div>
        <section>
          <h2>Professional experience</h2>
          ${experience}
        </section>
        <section>
          <h2>Selected projects</h2>
          ${projects}
        </section>
      </div>
    </main>

    <footer class="footer">
      <span>${escapeHtml(profile.name)} · Curriculum Vitae</span>
      <span>References available upon request</span>
    </footer>
  </body>
</html>`

const visualLatexTemplate = [
  '\\documentclass[10pt,a4paper]{article}',
  '\\usepackage[T1]{fontenc}',
  '\\usepackage[utf8]{inputenc}',
  '\\usepackage[margin=11mm]{geometry}',
  '\\usepackage[scaled=0.94]{helvet}',
  '\\usepackage{xcolor}',
  '\\usepackage{hyperref}',
  '\\usepackage{microtype}',
  '\\renewcommand{\\familydefault}{\\sfdefault}',
  '\\definecolor{Muted}{HTML}{4F5F63}',
  '\\hypersetup{hidelinks,pdfauthor={%%NAME%%},pdftitle={%%NAME%% -- Curriculum Vitae}}',
  '\\pagestyle{empty}',
  '\\setlength{\\parindent}{0pt}',
  '\\setlength{\\parskip}{0pt}',
  '\\setlength{\\emergencystretch}{2em}',
  '\\newcommand{\\sectiontitle}[1]{\\vspace{2mm}{\\small\\bfseries\\MakeUppercase{#1}}\\par\\vspace{1.2mm}\\hrule\\vspace{2mm}}',
  '\\newcommand{\\cvskill}[2]{\\textbf{#1}\\par{\\small\\color{Muted}#2}\\par\\vspace{2.2mm}}',
  '\\newcommand{\\cveducation}[4]{\\textbf{#2}\\hfill{\\footnotesize\\bfseries #1}\\par{\\footnotesize\\color{Muted}#3}\\if\\relax\\detokenize{#4}\\relax\\else\\par{\\footnotesize\\bfseries #4}\\fi\\par\\vspace{2.2mm}}',
  '\\newcommand{\\cventry}[4]{\\textbf{#2}\\hfill{\\footnotesize\\bfseries #1}\\par{\\footnotesize\\color{Muted}#3}\\par\\vspace{0.8mm}{\\small\\color{Muted}#4}\\par\\vspace{2mm}\\hrule\\vspace{2mm}}',
  '\\newcommand{\\cvproject}[5]{\\textbf{#1}\\hfill\\href{#5}{\\footnotesize\\underline{Website}}\\par{\\footnotesize\\color{Muted}#2}\\par\\vspace{0.8mm}{\\small\\color{Muted}#3}\\par\\vspace{0.8mm}{\\footnotesize #4}\\par\\vspace{2mm}\\hrule\\vspace{2mm}}',
  '\\begin{document}',
  '\\begin{minipage}[t]{0.62\\textwidth}',
  '{\\fontsize{27}{28}\\selectfont\\bfseries\\MakeUppercase{%%NAME%%}}\\par\\vspace{1.5mm}',
  '{\\small\\bfseries %%ROLES%%}',
  '\\end{minipage}\\hfill',
  '\\begin{minipage}[t]{0.34\\textwidth}',
  '\\raggedleft\\small',
  '%%LOCATION%%\\par',
  '\\href{mailto:%%EMAIL_RAW%%}{\\underline{%%EMAIL%%}}\\par',
  '\\href{tel:%%PHONE_RAW%%}{\\underline{%%PHONE%%}}',
  '\\end{minipage}',
  '\\vspace{3mm}\\par\\hrule\\vspace{3.5mm}',
  '{\\small\\color{Muted}%%SUMMARY%%}\\par',
  '\\vspace{3.5mm}',
  '\\begin{minipage}[t]{0.36\\textwidth}',
  '\\raggedright',
  '\\sectiontitle{Technical Skills}',
  '%%SKILLS%%',
  '\\sectiontitle{Education}',
  '%%EDUCATION%%',
  '\\end{minipage}\\hfill',
  '\\begin{minipage}[t]{0.60\\textwidth}',
  '\\raggedright',
  '\\sectiontitle{Professional Experience}',
  '%%EXPERIENCE%%',
  '\\sectiontitle{Selected Projects}',
  '%%PROJECTS%%',
  '\\end{minipage}',
  '\\vfill',
  '\\hrule\\vspace{1.5mm}',
  '{\\footnotesize\\color{Muted}%%NAME%% -- Curriculum Vitae\\hfill References available upon request}',
  '\\end{document}',
].join('\n')

const atsLatexTemplate = [
  '% ATS-friendly single-column CV generated from src/data/portfolio.json',
  '\\documentclass[10pt,a4paper]{article}',
  '\\usepackage[T1]{fontenc}',
  '\\usepackage[utf8]{inputenc}',
  '\\usepackage[margin=12mm]{geometry}',
  '\\usepackage{helvet}',
  '\\usepackage[hidelinks]{hyperref}',
  '\\usepackage{enumitem}',
  '\\usepackage{microtype}',
  '\\usepackage{titlesec}',
  '\\renewcommand{\\familydefault}{\\sfdefault}',
  '\\linespread{0.98}',
  '\\IfFileExists{glyphtounicode.tex}{\\input{glyphtounicode}\\pdfgentounicode=1}{}',
  '\\hypersetup{pdfauthor={%%NAME%%},pdftitle={%%NAME%% -- Curriculum Vitae}}',
  '\\pagestyle{empty}',
  '\\flushbottom',
  '\\setlength{\\parindent}{0pt}',
  '\\setlength{\\parskip}{0pt}',
  '\\setlength{\\emergencystretch}{2em}',
  '\\setlist[itemize]{leftmargin=5mm,nosep}',
  '\\titleformat{\\section}{\\normalsize\\bfseries}{}{0pt}{}',
  '\\titlespacing*{\\section}{0pt}{1.8mm}{0.3mm}',
  '\\newcommand{\\atssection}[1]{\\section*{#1}\\vspace{0.5mm}\\hrule\\vspace{1mm}}',
  '\\newcommand{\\cvskill}[2]{\\textbf{#1:} #2\\par\\vspace{0.6mm plus 0.22fill}}',
  '\\newcommand{\\cveducation}[4]{\\textbf{#2}\\hfill #1\\par #3\\if\\relax\\detokenize{#4}\\relax\\else\\space -- #4\\fi\\par\\vspace{0.6mm plus 0.18fill}}',
  '\\newcommand{\\cventry}[4]{\\textbf{#2}\\hfill #1\\par\\textit{#3}\\par #4\\par\\vspace{1mm plus 0.32fill}}',
  '\\newcommand{\\cvproject}[5]{\\textbf{#1}\\hfill\\href{#5}{Project Link}\\par\\textit{#2}\\par #3\\par\\textbf{Technologies:} #4\\par\\vspace{1mm plus 0.32fill}}',
  '\\begin{document}',
  '\\fontsize{10}{11.5}\\selectfont',
  '{\\LARGE\\bfseries %%NAME%%}\\par\\vspace{0.8mm}',
  '%%LOCATION%% \\textbar{} \\href{mailto:%%EMAIL_RAW%%}{%%EMAIL%%} \\textbar{} \\href{tel:%%PHONE_RAW%%}{%%PHONE%%}\\par',
  '\\textbf{Target Role:} %%ROLES%%',
  '\\atssection{Professional Summary}',
  '%%SUMMARY%%',
  '\\atssection{Technical Skills}',
  '%%SKILLS%%',
  '\\atssection{Professional Experience}',
  '%%EXPERIENCE%%',
  '\\atssection{Selected Projects}',
  '%%PROJECTS%%',
  '\\atssection{Education}',
  '%%EDUCATION%%',
  '\\end{document}',
].join('\n')

const latex = atsLatexTemplate
  .replaceAll('%%NAME%%', escapeLatex(profile.name))
  .replaceAll('%%ROLES%%', escapeLatex(roles))
  .replaceAll('%%LOCATION%%', escapeLatex(profile.location))
  .replaceAll('%%EMAIL_RAW%%', clean(profile.email))
  .replaceAll('%%EMAIL%%', escapeLatex(profile.email))
  .replaceAll('%%PHONE_RAW%%', telephone)
  .replaceAll('%%PHONE%%', escapeLatex(profile.phone))
  .replaceAll(
    '%%SUMMARY%%',
    escapeLatex(profile.atsSummary ?? profile.professionalSummary),
  )
  .replaceAll('%%SKILLS%%', latexSkills)
  .replaceAll('%%EDUCATION%%', latexEducation)
  .replaceAll('%%EXPERIENCE%%', latexExperience)
  .replaceAll('%%PROJECTS%%', latexProjects)

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean)

const executablePath = chromeCandidates.find(existsSync)

if (!executablePath) {
  throw new Error('Chrome or Edge is required to generate the CV PDF.')
}

await mkdir(outputDirectory, { recursive: true })
await writeFile(htmlPath, html, 'utf8')
await writeFile(texPath, latex, 'utf8')

const browser = await chromium.launch({ headless: true, executablePath })

try {
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'load' })
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    pageRanges: '1',
    printBackground: true,
    preferCSSPageSize: true,
  })
} finally {
  await browser.close()
}

console.log(`Generated:
- ${htmlPath}
- ${pdfPath}
- ${texPath}`)
