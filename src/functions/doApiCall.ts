import axios from "axios"

export const doApiCall = async (_url: string, code: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/airport?code=${code}`
    )
    return response.data
  } catch (err: any) {
    console.log(err.message)
  }
}

export const doApiCallAirline = async (code: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/airline?code=${code}`
    )
    return response.data
  } catch (err: any) {
    console.log(err.message)
  }
}