import axios from 'axios'
// import { result } from 'lodash'

// const AUTH = JSON.parse(localStorage.getItem('AUTH'))
// const access_token = result(AUTH, 'auth.access_token')

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.mode = 'no-cors'

export default axios
