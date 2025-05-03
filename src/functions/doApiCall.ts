import axios from "axios"

export const doApiCall = async (url: string, code: string) => {
    try {
      const response = await axios.get(
        `${url}${code}/light`,
        {
          headers: {
            'Accept': 'application/json',
            'Accept-Version': 'v1',
            'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
          },
          maxBodyLength: Infinity
        }
      )
      return response.data
    } catch (err: any) {
      console.log(err.message)
    }
  }