import axios from './config'
import { GET_COUNTRIES, FETCHING_COUNTRY, ERROR_FETCHING_COUNTRY } from './constants'

export const getCountries = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios('/country').then(({data}) => {
        data = data.data.countries.map(c => ({value: c.id, label: c.name}))
        dispatch({ type: GET_COUNTRIES, data });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_COUNTRY }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_COUNTRY, error }
}
