import axios from './config'
import { NEWAPI_V2, GET_PROVINCES, FETCHING_PROVINCE, ERROR_FETCHING_PROVINCE } from './constants'

export const getProvinces = (country_id = 1) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/province/${country_id}`)
        .then(({data}) => {
          const form = data.data.provinces.map(c => ({value: c.id, label: c.name}))
          data = data.data.provinces.map(c => ({value: c.id, label: c.name}))
          data.unshift({value: '', label: 'Semua'})
          dispatch({ type: GET_PROVINCES, data, form });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const findProvince = (keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + '/province/list', keyword)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_PROVINCE }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_PROVINCE, error }
}
