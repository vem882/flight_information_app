import express from 'express'
import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'
import { parseStringPromise } from 'xml2js'

dotenv.config()

const app = express()
app.use(cors())

// Välimuisti API-kutsuille
const cache = new Map()
const CACHE_TTL = 1000 * 60 * 5 // 5 minuuttia

function getCache(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }
  return null
}
function setCache(key, data) {
  cache.set(key, { data, time: Date.now() })
}

const allowedAirports = [
  "HEL", "RVN", "OUL", "TKU", "TMP", "JYV", "KUO", "VAA", "IVL", "KEM", "KTT", "JOE", "SAV", "POR", "SVL", "BMA", "ENF", "KAJ", "KOK", "MHQ", "QVY"
]

app.get('/api/airport', async (req, res) => {
  const code = req.query.code?.toUpperCase()
  if (!code || !/^[A-Z]{3}$/.test(code) || !allowedAirports.includes(code)) {
    return res.status(400).json({ error: 'Vain suomalaiset lentokentät (IATA-koodi) sallitaan.' })
  }
  const cacheKey = `/api/airport?code=${code}`
  const cached = getCache(cacheKey)
  if (cached) return res.json(cached)
  try {
    const response = await axios.get(
      `https://fr24api.flightradar24.com/api/static/airports/${code}/light`,
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Version': 'v1',
          'Authorization': `Bearer ${process.env.FR24_API_TOKEN}`
        },
        maxBodyLength: Infinity
      }
    )
    setCache(cacheKey, response.data)
    res.json(response.data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/flight-summary', async (req, res) => {
  let { flight, from, to } = req.query
  const cacheKey = `/api/flight-summary?flight=${flight}&from=${from}&to=${to}`
  const cached = getCache(cacheKey)
  if (cached) return res.json(cached)
  try {
    if (!flight || !from || !to) {
      return res.status(400).json({ error: 'Missing parameters' })
    }
    // Poista millisekunnit ja Z (aikavyöhyke)
    const formatDate = (d) => d.replace(/\.\d{3}Z$/, '').replace(/Z$/, '')
    from = formatDate(from)
    to = formatDate(to)

    console.log('FR24 API request:', { flight, from, to })
    const response = await axios.get(
      `https://fr24api.flightradar24.com/api/flight-summary/full?flights=${flight}&flight_datetime_from=${from}&flight_datetime_to=${to}`,
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Version': 'v1',
          'Authorization': `Bearer ${process.env.FR24_API_TOKEN}`
        }
      }
    )

    // Tarkista löytyykö tietoja ennen palautusta
    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ error: 'Tietoja ei ole saatavilla tälle lennolle.' })
    }

    setCache(cacheKey, response.data)
    res.json(response.data)
    console.log('FR24 API response:', response.data)
  } catch (err) {
    console.error('FR24 API error:', err?.response?.data || err.message)
    res.status(500).json({ error: err?.response?.data || err.message })
  }
})

app.get('/api/flights', async (req, res) => {
  const airport = req.query.airport?.toUpperCase()
  const cacheKey = `/api/flights?airport=${airport}`
  const cached = getCache(cacheKey)
  if (cached) return res.json(cached)
  try {
    const response = await axios.get('https://apigw.finavia.fi/flights/public/v0/flights', {
      headers: {
        'Cache-Control': 'no-cache',
        'app_key': process.env.FINAVIA_APP_KEY
      },
      responseType: 'text'
    })
    const json = await parseStringPromise(response.data, { explicitArray: false })

    // Suodata lennot kenttäkoodin mukaan, jos airport-parametri on annettu
    if (airport) {
      if (json.flights?.dep?.body?.flight) {
        const dep = json.flights.dep.body.flight
        json.flights.dep.body.flight = Array.isArray(dep)
          ? dep.filter(f => f.h_apt === airport)
          : dep.h_apt === airport ? [dep] : []
      }
      if (json.flights?.arr?.body?.flight) {
        const arr = json.flights.arr.body.flight
        json.flights.arr.body.flight = Array.isArray(arr)
          ? arr.filter(f => f.h_apt === airport)
          : arr.h_apt === airport ? [arr] : []
      }
    }

    setCache(cacheKey, json)
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Proxy running on port 3001'))