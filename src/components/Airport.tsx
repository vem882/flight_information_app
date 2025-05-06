import { useState } from 'react'
import { doApiCall, doApiCall2, getFlightSummary } from '../functions'
import { FaPlaneDeparture, FaPlaneArrival, FaGlobeEurope, FaSearchLocation, FaChartBar } from "react-icons/fa"
import "../Home.css"


export const Airport = () => {
  const airportUrl = 'https://fr24api.flightradar24.com/api/static/airports/'
  const flightsUrl = 'https://apigw.finavia.fi'
  const [airportCode, setAirportCode] = useState('HEL')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Finavia API -tilat
  const [flights, setFlights] = useState<any>(null)
  const [flightsLoading, setFlightsLoading] = useState(false)
  const [flightsError, setFlightsError] = useState<string | null>(null)

  // Selaus-tilat
  const [arrivalsPage, setArrivalsPage] = useState(0)
  const [departuresPage, setDeparturesPage] = useState(0)
  const pageSize = 20

  // flightsData on xml2js:n palauttama objekti
  const departuresRaw = flights?.flights?.dep?.body?.flight
  const departures = departuresRaw
    ? Array.isArray(departuresRaw)
      ? departuresRaw
      : [departuresRaw]
    : []

  const arrivalsRaw = flights?.flights?.arr?.body?.flight
  const arrivals = arrivalsRaw
    ? Array.isArray(arrivalsRaw)
      ? arrivalsRaw
      : [arrivalsRaw]
    : []

  // Suodata lennot tästä hetkestä eteenpäin ja järjestä aikajärjestykseen
  const now = new Date()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const arrivalsFiltered = arrivals
    .filter((f: any) => {
      const d = new Date(f.sdt)
      return d >= today && d < tomorrow
    })
    .sort((a: any, b: any) => new Date(a.sdt).getTime() - new Date(b.sdt).getTime())

  const departuresFiltered = departures
    .filter((f: any) => {
      const d = new Date(f.sdt)
      return d >= today && d < tomorrow
    })
    .sort((a: any, b: any) => new Date(a.sdt).getTime() - new Date(b.sdt).getTime())

  // Sivutus
  const arrivalsToShow = arrivalsFiltered.slice(arrivalsPage * pageSize, (arrivalsPage + 1) * pageSize)
  const departuresToShow = departuresFiltered.slice(departuresPage * pageSize, (departuresPage + 1) * pageSize)

  // Hae aiemmat/hae myöhemmät -napit
  const handleArrivalsPrev = () => setArrivalsPage(Math.max(arrivalsPage - 1, 0))
  const handleArrivalsNext = () => setArrivalsPage(arrivalsPage + 1)
  const handleDeparturesPrev = () => setDeparturesPage(Math.max(departuresPage - 1, 0))
  const handleDeparturesNext = () => setDeparturesPage(departuresPage + 1)

  // Etsi ensimmäinen sivu, jossa on tulevia lentoja
  const findUpcomingPage = (flightsArr: any[]) => {
    const now = new Date()
    const idx = flightsArr.findIndex(f => new Date(f.sdt) >= now)
    return idx === -1 ? 0 : Math.floor(idx / pageSize)
  }

  const fetchAirport = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    const response = await doApiCall(airportUrl, airportCode)
    if (response && response.name) {
      setData(response)
      fetchFlights(airportCode)
    } else {
      setError("Lentokenttää ei löytynyt tai koodi on virheellinen.")
    }
    setLoading(false)
  }

  // Hae lennot Finavian API:sta käyttäen doApiCall2
  const fetchFlights = async (code: string) => {
    setFlightsLoading(true)
    setFlightsError(null)
    setFlights(null)
    try {
      const json = await doApiCall2(flightsUrl, code)
      setFlights(json)
      setArrivalsPage(findUpcomingPage(
        (json?.flights?.arr?.body?.flight
          ? Array.isArray(json.flights.arr.body.flight)
            ? json.flights.arr.body.flight
            : [json.flights.arr.body.flight]
          : []
        )
          .filter((f: any) => {
            const d = new Date(f.sdt)
            return d >= today && d < tomorrow
          })
          .sort((a: any, b: any) => new Date(a.sdt).getTime() - new Date(b.sdt).getTime())
      ))
      setDeparturesPage(findUpcomingPage(
        (json?.flights?.dep?.body?.flight
          ? Array.isArray(json.flights.dep.body.flight)
            ? json.flights.dep.body.flight
            : [json.flights.dep.body.flight]
          : []
        )
          .filter((f: any) => {
            const d = new Date(f.sdt)
            return d >= today && d < tomorrow
          })
          .sort((a: any, b: any) => new Date(a.sdt).getTime() - new Date(b.sdt).getTime())
      ))
    } catch (err: any) {
      setFlightsError(err.message)
    } finally {
      setFlightsLoading(false)
    }
  }

  const [flightDetails, setFlightDetails] = useState<any>(null)
  const [flightDetailsOpen, setFlightDetailsOpen] = useState(false)
  const [flightDetailsLoading, setFlightDetailsLoading] = useState(false)
  const [flightDetailsError, setFlightDetailsError] = useState<string | null>(null)

  const handleFlightClick = async (flight: string, sdt: string) => {
    setFlightDetailsLoading(true)
    setFlightDetailsError(null)
    setFlightDetailsOpen(true)
    try {
      // Oletetaan, että haetaan ±1 päivä
      const from = new Date(new Date(sdt).getTime() - 12 * 3600 * 1000).toISOString()
      const to = new Date(new Date(sdt).getTime() + 36 * 3600 * 1000).toISOString()
      const data = await getFlightSummary(flight, from, to)
      setFlightDetails(data?.data?.[0] || null)
    } catch (e: any) {
      setFlightDetailsError("Tietojen haku epäonnistui")
    } finally {
      setFlightDetailsLoading(false)
    }
  }

  return (
    <div className="home-container">
      <section className="home-section">
        <h2><FaSearchLocation className="section-icon" /> Hae lentokenttä</h2>
        <p>
          Syötä suomalaisen lentokentän IATA- tai ICAO-koodi (esim. <b>HEL</b>), niin näet kentän perustiedot, päivän saapuvat ja lähtevät lennot sekä tilastot.
        </p>
      </section>
      <form
        className="vertical-form"
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
{(arrivalsFiltered.length > 0 || departuresFiltered.length > 0) && (
  <div className="info-view flight-stats">
    <h3 style={{ marginTop: 0, marginBottom: "1em" }}>Päivän lentotilasto</h3>
    <div className="stats-grid">
      <div className="stat-box">
        <span className="stat-label">Suunniteltuja lähtöjä</span>
        <span className="stat-value">{departuresFiltered.length}</span>
      </div>
      <div className="stat-box">
        <span className="stat-label">Suunniteltuja saapumisia</span>
        <span className="stat-value">{arrivalsFiltered.length}</span>
      </div>
      <div className="stat-box cancelled">
        <span className="stat-label">Peruttuja lähtöjä</span>
        <span className="stat-value">{departuresFiltered.filter(f => (f.prt_f || '').toLowerCase().includes('peruttu')).length}</span>
      </div>
      <div className="stat-box cancelled">
        <span className="stat-label">Peruttuja saapumisia</span>
        <span className="stat-value">{arrivalsFiltered.filter(f => (f.prt_f || '').toLowerCase().includes('peruttu')).length}</span>
      </div>
      <div className="stat-box delayed">
        <span className="stat-label">Myöhässä olevia lähtöjä</span>
        <span className="stat-value">{departuresFiltered.filter(f => {
          const s = f.sdt ? new Date(f.sdt) : null
          const e = f.est_d ? new Date(f.est_d) : null
          return s && e && e.getTime() > s.getTime()
        }).length}</span>
      </div>
      <div className="stat-box delayed">
        <span className="stat-label">Myöhässä olevia saapumisia</span>
        <span className="stat-value">{arrivalsFiltered.filter(f => {
          const s = f.sdt ? new Date(f.sdt) : null
          const e = f.est_d ? new Date(f.est_d) : null
          return s && e && e.getTime() > s.getTime()
        }).length}</span>
      </div>
    </div>
  </div>
)}
        <div>
          {flightsLoading && <p>Ladataan lentoja...</p>}
          {flightsError && <p>Virhe lentojen haussa: {flightsError}</p>}
          {arrivalsToShow.length > 0 && (
            <div className='info-view'>
              <h3>Saapuvat lennot</h3>
              <table>
                <thead>
                  <tr>
                    <th>Lennonro</th>
                    <th>Kenttä</th>
                    <th>Aikataulu</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {arrivalsToShow.map((f: any, i: number) => {
                    const scheduled = f.sdt ? new Date(f.sdt) : null
                    const estimated = f.est_d ? new Date(f.est_d) : null
                    let delayMin = 0
                    if (scheduled && estimated) {
                      delayMin = Math.round((estimated.getTime() - scheduled.getTime()) / 60000)
                    }
                    let rowStyle = {}
                    if (delayMin > 0 && delayMin <= 15) rowStyle = { background: '#fffbe6' }
                    if (delayMin > 15) rowStyle = { background: '#ffeaea' }

                    return (
                      <tr key={f.fltnr + f.sdt + i} style={rowStyle}>
                        <td data-label="Lennonro">
                          <button
                            className="flight-link"
                            onClick={() => handleFlightClick(f.fltnr, f.sdt)}
                            style={{ background: "none", border: "none", color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
                          >
                            {f.fltnr}
                          </button>
                        </td>
                        <td data-label="Kenttä">{f.route_1} {f.route_n_1}</td>
                        <td data-label="Aikataulu">
                          {estimated && scheduled && estimated.getTime() !== scheduled.getTime() ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#888', marginRight: 6 }}>
                                {scheduled.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span style={{ fontWeight: 600 }}>
                                {estimated.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </>
                          ) : (
                            scheduled
                              ? scheduled.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })
                              : '-'
                          )}
                        </td>
                        <td data-label="Status">{f.prt_f}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
                <button onClick={handleArrivalsPrev} disabled={arrivalsPage === 0}>Hae aiemmat lennot</button>
                <button onClick={handleArrivalsNext} disabled={arrivalsToShow.length < pageSize}>Hae myöhemmät lennot</button>
              </div>
            </div>
          )}
          {departuresToShow.length > 0 && (
            <div className='info-view'>
              <h3>Lähtevät lennot</h3>
              <table>
                <thead>
                  <tr>
                    <th>Lennonro</th>
                    <th>Kenttä</th>
                    <th>Aikataulu</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departuresToShow.map((f: any, i: number) => {
                    const scheduled = f.sdt ? new Date(f.sdt) : null
                    const estimated = f.est_d ? new Date(f.est_d) : null
                    let delayMin = 0
                    if (scheduled && estimated) {
                      delayMin = Math.round((estimated.getTime() - scheduled.getTime()) / 60000)
                    }
                    let rowStyle = {}
                    if (delayMin > 0 && delayMin <= 15) rowStyle = { background: '#fffbe6' }
                    if (delayMin > 15) rowStyle = { background: '#ffeaea' }

                    return (
                      <tr key={f.fltnr + f.sdt + i} style={rowStyle}>
                        <td data-label="Lennonro">
                          <button
                            className="flight-link"
                            onClick={() => handleFlightClick(f.fltnr, f.sdt)}
                            style={{ background: "none", border: "none", color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
                          >
                            {f.fltnr}
                          </button>
                        </td>
                        <td data-label="Kenttä">{f.route_1} {f.route_n_1}</td>
                        <td data-label="Aikataulu">
                          {estimated && scheduled && estimated.getTime() !== scheduled.getTime() ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#888', marginRight: 6 }}>
                                {scheduled.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span style={{ fontWeight: 600 }}>
                                {estimated.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </>
                          ) : (
                            scheduled
                              ? scheduled.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })
                              : '-'
                          )}
                        </td>
                        <td data-label="Status">{f.prt_f}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
                <button onClick={handleDeparturesPrev} disabled={departuresPage === 0}>Hae aiemmat lennot</button>
                <button onClick={handleDeparturesNext} disabled={departuresToShow.length < pageSize}>Hae myöhemmät lennot</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {flightDetailsOpen && (
  <div className="flight-modal">
    <div className="flight-modal-content">
      <button className="close-btn" onClick={() => setFlightDetailsOpen(false)}>Sulje</button>
      {flightDetailsLoading && <p>Ladataan...</p>}
      {flightDetailsError && <p style={{ color: 'red' }}>{flightDetailsError}</p>}
      {flightDetails && (
        <div>
          <h2 className="flight-modal-title">
            Lennon {flightDetails.flight} tiedot
          </h2>
          <table className="flight-details-table">
            <tbody>
              <tr>
                <td className="label">Lentoyhtiö</td>
                <td className="value">{flightDetails.operating_as}</td>
              </tr>
              <tr>
                <td className="label">Koneen tyyppi</td>
                <td className="value">{flightDetails.type}</td>
              </tr>
              <tr>
                <td className="label">Rekisteri</td>
                <td className="value">{flightDetails.reg}</td>
              </tr>
              <tr>
                <td className="label">Lähtö</td>
                <td className="value">{flightDetails.orig_iata} ({flightDetails.orig_icao})</td>
              </tr>
              <tr>
                <td className="label">Kohde</td>
                <td className="value">{flightDetails.dest_iata} ({flightDetails.dest_icao})</td>
              </tr>
              <tr>
                <td className="label">Lähtöaika</td>
                <td className="value">{flightDetails.datetime_takeoff ? new Date(flightDetails.datetime_takeoff).toLocaleString('fi-FI') : '-'}</td>
              </tr>
              <tr>
                <td className="label">Saapumisaika</td>
                <td className="value">{flightDetails.datetime_landed ? new Date(flightDetails.datetime_landed).toLocaleString('fi-FI') : '-'}</td>
              </tr>
              <tr>
                <td className="label">Lennon kesto</td>
                <td className="value">
  {flightDetails.flight_time
    ? (() => {
        const totalMin = Math.round(flightDetails.flight_time / 60)
        const h = Math.floor(totalMin / 60)
        const m = totalMin % 60
        return h > 0 ? `${h} h ${m} min` : `${m} min`
      })()
    : '-'}
</td>
              </tr>
              <tr>
                <td className="label">Matka</td>
                <td className="value">{flightDetails.actual_distance ? flightDetails.actual_distance.toFixed(0) + " km" : '-'}</td>
              </tr>
              <tr>
                <td className="label">Status</td>
                <td className="value">{flightDetails.flight_ended ? "Päättynyt" : "Käynnissä"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  )
}


