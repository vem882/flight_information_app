import { useState } from 'react'
import { doApiCall } from '../functions'

export const Airline = () => {
  const airlineUrl = 'https://fr24api.flightradar24.com/api/static/airlines/'
  const [airlineCode, setAirlineCode] = useState('FIN')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAirline = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    const response = await doApiCall(airlineUrl, airlineCode)
    if (response && response.name) {
      setData(response)
    } else {
      setError("Lentoyhtiötä ei löytynyt tai koodi on virheellinen.")
    }
    setLoading(false)
  }

  return (
    <div>
      <h2>Hae lentoyhtiö</h2>
      <p>Syötä lentoyhtiön ICAO-koodi (esim. FIN) saadaksesi lisätietoja.</p>
      <form
        onSubmit={e => {
          e.preventDefault()
          fetchAirline()
        }}
      >
        <input
          type="text"
          value={airlineCode}
          onChange={e => setAirlineCode(e.target.value.toUpperCase())}
          maxLength={4}
        />
        <button type="submit" className='haku-button'>Hae</button>
      </form>
      <div className='result-div'>
      {loading && <p>Ladataan lentoyhtiön tietoja...</p>}
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


