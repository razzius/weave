// TODO use core-js ponyfill style instead
import 'core-js/es/map'
import 'core-js/es/set'
import 'weakmap-polyfill'
import 'polyfill-array-includes'
import React from 'react'
import { createRoot } from 'react-dom/client'
import 'url-polyfill'
import { init } from '@sentry/browser'

import './index.css'
import App from './App'

if (window.location.hostname !== 'localhost') {
  init({
    dsn: process.env.REACT_APP_JAVASCRIPT_SENTRY_DSN,
  })
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
