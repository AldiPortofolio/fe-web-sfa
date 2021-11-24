import axios from './config'
import { GET_GENDERS, FETCHING_GENDER, ERROR_FETCHING_GENDER } from './constants'

export const getGenders = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios('/gender').then(({data}) => {
        const form = data.data.map(c => ({value: c.id, label: c.name}))
        data = data.data.map(c => ({value: c.name, label: c.name}))
        data.unshift({value: '', label: 'Semua'})
        dispatch({ type: GET_GENDERS, data, form });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_GENDER }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_GENDER, error }
}
