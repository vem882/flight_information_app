import "../Home.css"
import { FaPlaneDeparture, FaPlaneArrival, FaGlobeEurope, FaSearchLocation, FaChartBar } from "react-icons/fa"

export const Home = () => {
  return (
    <div className="home-container">
      <header className="home-hero">
        <FaGlobeEurope className="hero-icon" />
        <h1>Lentotietosovellus</h1>
        <p className="subtitle">
          Tervetuloa seuraamaan Suomen lentoliikennettä reaaliajassa!
        </p>
      </header>

      <section className="home-section">
        <h2><FaSearchLocation className="section-icon" /> Hae lentokenttä</h2>
        <p>
          Syötä suomalaisen lentokentän IATA- tai ICAO-koodi (esim. <b>HEL</b>), niin näet kentän perustiedot, päivän saapuvat ja lähtevät lennot sekä tilastot.
        </p>
      </section>

      <section className="home-section">
        <h2><FaPlaneDeparture className="section-icon" /> &nbsp;<FaPlaneArrival className="section-icon" /> Päivän lennot</h2>
        <p>
          Selaa päivän <b>saapuvia</b> ja <b>lähteviä</b> lentoja. Voit tarkastella myös aiempia lentoja tältä päivältä.
        </p>
      </section>

      <section className="home-section">
        <h2><FaChartBar className="section-icon" /> Tilastot</h2>
        <p>
          Näet yhdellä silmäyksellä kuinka monta lentoa on suunniteltu, peruttu tai myöhässä valitulla kentällä.
        </p>
      </section>

      <section className="home-section">
        <h2><FaPlaneDeparture className="section-icon" /> Lennon tiedot</h2>
        <p>
          Klikkaa lennon numeroa nähdäksesi tarkemmat tiedot yksittäisestä lennosta: mm. koneen tyyppi, reitti, aikataulut ja toteutunut matka.
        </p>
      </section>

      <div className="home-visuals">
        <FaPlaneDeparture className="plane-visual" />
        <FaPlaneArrival className="plane-visual" />
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="Lentokone taivaalla"
          className="hero-image"
        />
      </div>
    </div>
  )
}


