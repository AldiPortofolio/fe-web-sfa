import axios from './config'
import { NEWAPI_V2, GET_VILLAGES, FETCHING_VILLAGE, ERROR_FETCHING_VILLAGE } from './constants'

export const getVillages = (district_id = 1) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/village/${district_id}`)
        .then(({data}) => {
          data = data.data.villages.map(c => ({value: c.id, label: c.name}))
          dispatch({ type: GET_VILLAGES, data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const findVillage = (id, keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + `/village/list?district_id=${id}`, keyword)
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
  return { type: FETCHING_VILLAGE }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_VILLAGE, error }
}
