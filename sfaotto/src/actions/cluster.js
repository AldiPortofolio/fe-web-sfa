import { result } from 'lodash'
import axios from './config'
import { NEWAPI, GET_CLUSTER, GET_CLUSTERS, FETCHING_CLUSTER, ERROR_FETCHING_CLUSTER } from './constants'

export const getClusters = (params = {}, page = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(page === null){
      actionURL = '/clusters/list'
    }else{
      actionURL = `/clusters/list${page}`

    }

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + actionURL, {...params})
      .then(({data}) => {
        if (result(data, 'data')) {
          dispatch({ type: GET_CLUSTERS, data: data.data,  meta: data.meta, params });
          resolve(data)
        } else {
          reject('error')
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getCluster = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    dispatch(fetcing())

    return new Promise((resolve, reject) => {
        axios.post(NEWAPI + `/clusters/detail/${id}`)
        .then(({data}) => {
        if (result(data, 'data')) {
          dispatch({ type: GET_CLUSTER, data: data.data, meta: data.meta });
          resolve(data)
        } else {
          reject('error')
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_CLUSTER }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_CLUSTER, error }
}
