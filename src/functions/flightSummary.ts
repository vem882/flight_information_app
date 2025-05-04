import axios from "axios"

export const getFlightSummary = async (flight: string, from: string, to: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/flight-summary?flight=${flight}&from=${from}&to=${to}`
    )
    return response.data
  } catch (err: any) {
    console.log(err.message)
    throw err
  }
}