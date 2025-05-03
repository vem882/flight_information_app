import { useState } from 'react'
import { doApiCall } from '../functions'

export const Airport = () => {
  const airportUrl = 'https://fr24api.flightradar24.com/api/static/airports/'
  const [airportCode, setAirportCode] = useState('HEL')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAirport = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    const response = await doApiCall(airportUrl, airportCode)
    if (response && response.name) {
      setData(response)
    } else {
      setError("Lentokenttää ei löytynyt tai koodi on virheellinen.")
    }
    setLoading(false)
  }

  return (
    <div>
      <h2>Hae lentokenttä</h2>
      <p>Syötä lentokentän IATA- tai ICAO-koodi (esim. HEL) saadaksesi lisätietoja.</p>
      <form
        onSubmit={e => {
          e.preventDefault()
          fetchAirport()
        }}
      >
        <input
          type="text"
          value={airportCode}
          onChange={e => setAirportCode(e.target.value.toUpperCase())}
          maxLength={4}
        />
        <button type="submit" className='haku-button'>Hae</button>
      </form>
      <div className='result-div'>
      {loading && <p>Ladataan lentokentän tietoja...</p>}
      {error && <p>Virhe: {error}</p>}
      {data && data.name && (
        <div className='info-view'>
          <h3 style={{ marginTop: 0 }}>{data.name}</h3>
          <p><strong>IATA:</strong> {data.iata}</p>
          <p><strong>ICAO:</strong> {data.icao}</p>
          </div>
        )}
      </div>
    </div>
  )
}


