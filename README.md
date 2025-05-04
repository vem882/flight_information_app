# Flight Information App

Tämä sovellus näyttää reaaliaikaista lentotietoa suomalaisilta lentokentiltä. Sovellus on rakennettu Reactilla, TypeScriptillä ja Vite:llä. Backend on toteutettu Expressillä ja toimii välipalvelimena ulkoisiin rajapintoihin (Finavia ja Flightradar24).

## Ominaisuudet

- Hae lentokentän tiedot IATA- tai ICAO-koodilla (vain sallitut suomalaiset kentät)
- Näe päivän saapuvat ja lähtevät lennot, sekä tilastot (perutut, myöhässä, suunnitellut)
- Selaa lentoja sivuittain (myös aiemmat lennot tältä päivältä)
- Klikkaa lennon numeroa nähdäksesi lennon tarkemmat tiedot (haetaan Flightradar24 API:sta)
- Kaikki API-kutsut cachetaan backendissä, jotta ulkoisia pyyntöjä tehdään mahdollisimman vähän

## Käyttöönotto

1. **Asenna riippuvuudet:**
   ```
   npm install
   ```

2. **Luo `.env`-tiedosto juureen ja lisää API-avaimet:**
   ```
   FR24_API_TOKEN=oma_flightradar24_token
   FINAVIA_APP_KEY=oma_finavia_app_key
   ```

3. **Asenna concurrently, jos haluat käynnistää frontin ja backin yhdellä komennolla:**
   ```
   npm install --save-dev concurrently
   ```

4. **Käynnistä kehitysympäristö:**
   ```
   npm run dev
   ```
   Tämä käynnistää sekä frontendin (Vite) että backendin (Express).

## Projektin rakenne

- **/src/components/** – React-komponentit (mm. Airport.tsx)
- **/src/functions/** – API-kutsujen funktiot
- **/server/server.js** – Express-backend, joka välittää ja cachetaa ulkoiset API-kutsut
- **/src/index.css** – Sovelluksen tyylit

## Backendin suojaus

- Vain sallitut suomalaiset lentokentät (IATA-koodit) hyväksytään
- Kaikki API-kutsut cachetaan 5 minuutiksi
- Jos lennon tietoja ei löydy, käyttäjälle näytetään selkeä ilmoitus

## Kehittäjälle

- Frontend: React + TypeScript + Vite
- Backend: Express + Axios + dotenv + xml2js
- Tyylit: CSS-tiedostossa, ei inline-tyylejä
- ESLint käytössä koodin laadun varmistamiseksi

## Huomioitavaa

- Flightradar24 API vaatii voimassaolevan tokenin
- Finavian API vaatii oman app_key:n
- Sovellus toimii paikallisesti osoitteessa [http://localhost:5173](http://localhost:5173) (oletus)

---

**Tekijä:**  
Martin Negin 
