import { useState, useEffect } from 'react'
import { doApiCallAirline } from '../functions'

export const Airline = () => {
  const [airlineCode, setAirlineCode] = useState('FIN')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentCodes, setRecentCodes] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentAirlineCodes')
    if (saved) setRecentCodes(JSON.parse(saved))
  }, [])

  // Update localStorage when a new search is made
  const saveRecentCode = (code: string) => {
    let updated = [code, ...recentCodes.filter(c => c !== code)].slice(0, 5)
    setRecentCodes(updated)
    localStorage.setItem('recentAirlineCodes', JSON.stringify(updated))
  }

  const fetchAirline = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      // Haetaan tiedot backendin kautta
      const response = await doApiCallAirline(airlineCode)
      if (response && response.name) {
        setData(response)
        saveRecentCode(airlineCode)
      } else {
        setError("No airline found or invalid code.")
      }
    } catch (e: any) {
      setError("Error fetching airline information.")
    }
    setLoading(false)
  }

  return (
    <div className="home-container">
      <section className="home-section">
        <h2>Search Airline</h2>
        <p>Enter the airline ICAO code (e.g. FIN) to get more information.</p>
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
            list="recent-codes"
          />
          <datalist id="recent-codes">
            {recentCodes.map(code => (
              <option value={code} key={code} />
            ))}
          </datalist>
          <button type="submit" className='haku-button'>Search</button>
        </form>

        {recentCodes.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 500, marginBottom: 4, color: "#1976d2" }}>
              Recently searched:
            </div>
            <ul style={{ display: "flex", gap: "0.5em", listStyle: "none", padding: 0, margin: 0 }}>
              {recentCodes.map(code => (
                <li key={code}>
                  <button
                    type="button"
                    style={{
                      background: "#e3eafc",
                      border: "none",
                      borderRadius: 4,
                      padding: "0.2em 0.7em",
                      cursor: "pointer",
                      color: "#1976d2"
                    }}
                    onClick={() => setAirlineCode(code)}
                  >
                    {code}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <div className='result-div'>
        {loading && <p>Loading airline information...</p>}
        {error && <p>Error: {error}</p>}
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


