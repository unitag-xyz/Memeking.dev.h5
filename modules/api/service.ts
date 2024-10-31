import axios from 'axios'

export { createService }

const TIMEOUT_DEFAULT = 15000

function createService(baseURL: string, { timeout = TIMEOUT_DEFAULT }) {
  const service = axios.create({
    baseURL, // url = base url + request urls
    timeout, // request timeout
  })

  service.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      // do something with request error
      // console.log("### request error: ", error) // for debug
      return Promise.reject(error)
    },
  )

  return service
}
