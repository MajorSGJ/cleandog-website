import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001
const DATA_FILE = path.join(__dirname, 'public', 'data.json')

app.use(express.json({ limit: '5mb' }))

// Save data - called by admin panel
app.post('/api/save', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`))
