import axios from './config'
import { NEWAPI_V2, GET_CITIES, FETCHING_CITY, ERROR_FETCHING_CITY } from './constants'

export const getCities = (province_id = 1) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/city/${province_id}`)
        .then(({data}) => {
          data = data.data.cities.map(c => ({value: c.id, label: c.name}))
          dispatch({ type: GET_CITIES, data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const findCity = (id, keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + `/city/list?province_id=${id}`, keyword)
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
  return { type: FETCHING_CITY }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_CITY, error }
}
