# Flight Information App

A modern web application for real-time flight information at Finnish airports. The app is built with **React**, **TypeScript**, and **Vite** for the frontend, and **Express** for the backend, which acts as a proxy and cache for external APIs (Finavia and Flightradar24).

---

## Features

- **Search Finnish Airports:**  
  Enter an IATA or ICAO code (e.g. `HEL`) to view airport details, today's arrivals and departures, and statistics. Only allowed Finnish airports are supported.

- **Live Flight Tables:**  
  Browse today's arriving and departing flights, including paging for earlier/later flights.

- **Flight Statistics:**  
  Instantly see the number of scheduled, cancelled, and delayed flights for the selected airport.

- **Flight Details:**  
  Click a flight number to view detailed information (aircraft type, registration, route, times, distance, etc.) fetched from Flightradar24.

- **Airline Search:**  
  Search for airline details by ICAO code.

- **Backend Caching:**  
  All API requests are cached for 5 minutes to minimize external API calls and improve performance.

- **Responsive Design:**  
  The UI is fully responsive and visually appealing on both desktop and mobile devices, with a modern navigation bar and mobile burger menu.

---

## Frameworks & Libraries Used

### Frontend

- **React** – UI library
- **TypeScript** – Static typing
- **Vite** – Fast frontend build tool and dev server
- **react-icons** – Icon library
- **react-router-dom** – Routing for React
- **CSS** – Styling

### Backend

- **Express** – Web server and API proxy
- **Axios** – HTTP requests to external APIs
- **dotenv** – Environment variable management
- **cors** – CORS support
- **xml2js** – XML to JSON conversion

### Development Tools

- **concurrently** – Run frontend and backend together in development
- **eslint** – Code linting
- **@types/\*** – TypeScript type definitions

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file in the project root

Add your API keys:

```
FR24_API_TOKEN=your_flightradar24_token
FINAVIA_APP_KEY=your_finavia_app_key
```

### 4. Start the development environment

```bash
npm run dev
```

This will start both the frontend (Vite) and backend (Express) servers.

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)

---

## Project Structure

```
flight_information_app/
├── server/
│   └── server.js         # Express backend (API proxy & cache)
├── src/
│   ├── components/       # React components (Home, Airport, Airline, etc.)
│   ├── functions/        # API call utilities
│   ├── App.tsx           # Main app component
│   ├── App.css           # Main app styles
│   └── index.css         # Global styles
├── .env                  # API keys 
├── package.json
└── README.md
```

---

## API & Backend

- **/api/airport**  
  Returns airport info for allowed Finnish airports (IATA code, e.g. `HEL`).  
  Only 3-letter codes, no numbers, and must be in the allowed list.

- **/api/flights**  
  Returns arrivals and departures for a given airport from Finavia API.

- **/api/flight-summary**  
  Returns detailed flight info from Flightradar24 for a given flight and time window.

- **Caching:**  
  All API responses are cached in memory for 5 minutes to reduce external requests.

- **Error Handling:**  
  If no data is available (e.g. for a flight), a clear error message is returned.

---

## Notes

- You need valid API keys for both [Flightradar24](https://fr24api.flightradar24.com/) and [Finavia](https://apiportal.finavia.fi/).
- The app is intended for Finnish airports only.
- The backend must be running for the frontend to fetch data.

---

## Author

Made by [Martin Negin](https://github.com/vem882/flight_information_app)  
Flight data provided by Flightradar24 and Finavia APIs.

---
