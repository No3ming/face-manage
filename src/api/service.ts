import axios from 'axios'
axios.defaults.baseURL = '/admin/v1'

// axios.interceptors.request.use(config => {
//   // axios.defaults.headers.common['Authorization'] = token
//   // axios.defaults.headers.post['Content-Type'] = 'application/json'
//   config.headers['Token'] = sessionStorage.getItem('Token')
//   config.headers['Content-Type'] = 'application/json'
//   return config
// })
axios.interceptors.response.use((response) => {
  return response.data
}, (err) => {
  if (err.response.status === 403) {
    location.replace('/login')
    return Promise.reject(err.response.data)
  } else {
    return Promise.reject(err.response.data)
  }
})

export default {
  get (url: string, params: {} = {}): Promise<any> {
    return axios.get(url, { params })
  },
  post (url: string, body: {}): Promise<any> {
    return axios.post(url, body)
  },
  patch (url: string, body: {} = {}): Promise<any> {
    return axios.patch(url, body)
  },
  put (url: string, body: {}): Promise<any> {
    return axios.put(url, body)
  }
}
