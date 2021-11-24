import axios from './config'
import { GET_COMPANY_CODES, FETCHING_COMPANY_CODE, ERROR_FETCHING_COMPANY_CODE } from './constants'

export const getCompanyCodes = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios('/company-code')
        .then(({data}) => {
          const form = data.data.company_codes.map(c => ({value: c, label: c}))
          data = data.data.company_codes.map(c => ({value: c, label: c}))
          data.unshift({value: '', label: 'Semua'})
          dispatch({ type: GET_COMPANY_CODES, data, form });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_COMPANY_CODE }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_COMPANY_CODE, error }
}
