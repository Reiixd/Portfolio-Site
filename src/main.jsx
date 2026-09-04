import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/saira-condensed/600.css'
import '@fontsource/saira-condensed/700.css'
import '@fontsource/spline-sans/400.css'
import '@fontsource/spline-sans/500.css'
import '@fontsource/spline-sans/600.css'
import './styles/scrollcraft.css'
import './styles/site.css'
import './lib/scrollcraft.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
