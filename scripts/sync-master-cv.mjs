import { copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const source = new URL('../../reebal_cv.tex', import.meta.url)
const target = new URL('../public/Muhammad-Reebal-Raza-CV.tex', import.meta.url)
await copyFile(source, target)
console.log('Updated master LaTeX download:', fileURLToPath(target))
