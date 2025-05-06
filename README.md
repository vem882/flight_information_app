# Flight Information App

A web application for real-time flight information at Finnish airports.  
This project was created as my coursework for a web programming course.  
The app is built with **React**, **TypeScript**, and **Vite** for the frontend, and **Express** for the backend, which acts as a proxy and cache for external APIs (Finavia and Flightradar24).

---

## Screenshot

<div align="center">
  <a href="img/1.png" target="_blank"><img src="img/1.png" alt="Screenshot 1" width="180" height="180"/></a>
  <a href="img/2.png" target="_blank"><img src="img/2.png" alt="Screenshot 2" width="180" height="180"/></a>
  <a href="img/3.png" target="_blank"><img src="img/3.png" alt="Screenshot 3" width="180" height="180"/></a>
  <a href="img/4.png" target="_blank"><img src="img/4.png" alt="Screenshot 4" width="180" height="180"/></a>
  <a href="img/5.png" target="_blank"><img src="img/5.png" alt="Screenshot 5" width="180" height="180"/></a>
</div>

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

- **Recently Searched:**  
  Both airport and airline search fields suggest your recent searches, and you can quickly select them.

- **Favorite Flight:**  
  You can mark a flight as favorite (star icon). The favorite flight is saved in your browser and always shown first in the arrivals/departures table when you return.

- **Backend Caching:**  
  All API requests are cached for 5 minutes to minimize external API calls and improve performance.

- **Responsive Design:**  
  The UI is fully responsive and visually appealing on both desktop and mobile devices. On mobile, the favorite star icon is shown next to the flight number for better usability.

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

### 3. To DO: Install `concurrently` (for running frontend and backend together) 

```bash
npm install --save-dev concurrently
```

### 4. Start the development environment

```bash
frontend 
npm run dev

backend 
cd server
node server.js
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

- **/api/airline**  
  Returns airline details from Flightradar24 by ICAO code.

- **/api/airlines**  
  Returns filtered flights by airport and/or airline from Finavia API.

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
- **Mobile UI:** The favorite star icon is shown next to the flight number for better usability.

---

## Author

Made by [Martin Negin](https://github.com/vem882/flight_information_app)  
Flight data provided by Flightradar24 and Finavia APIs.

---
