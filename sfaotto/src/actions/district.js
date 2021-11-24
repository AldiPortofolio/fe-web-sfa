import axios from './config'
import { NEWAPI_V2, GET_DISTRICTS, FETCHING_DISTRICT, ERROR_FETCHING_DISTRICT } from './constants'

export const getDistricts = (city_id = 1) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/district/${city_id}`)
        .then(({data}) => {
          data = data.data.districts.map(c => ({value: c.id, label: c.name}))
          dispatch({ type: GET_DISTRICTS, data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const findDistrict = (id, keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + `/district/list?city_id=${id}`, keyword)
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
  return { type: FETCHING_DISTRICT }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_DISTRICT, error }
}
