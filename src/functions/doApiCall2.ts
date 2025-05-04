import axios from "axios"

export const doApiCall2 = async (url: string, airportCode: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/flights?airport=${airportCode}`
    )
    return response.data
  } catch (err: any) {
    console.log(err.message)
    throw err
  }
}