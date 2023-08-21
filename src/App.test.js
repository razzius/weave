import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const { test } = global

test('renders without crashing', () => {
  const root = createRoot(document.createElement('div'))
  root.render(<App />)
})
