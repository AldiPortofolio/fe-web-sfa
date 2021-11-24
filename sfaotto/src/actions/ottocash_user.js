import axios from './config'
import { isEmpty } from 'lodash'
import {
  // FILTER_OTTOCASHS,
  FETCHING_OTTOCASH,
  ERROR_FETCHING_OTTOCASH,
  GET_OTTOCASHS,
  // GET_OTTOCASH,
} from './constants'

export const getOttocashUsers = (keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`/otto_cash_users/list${isEmpty(keyword) ? '' : ('?keyword=' + keyword)}`)
        .then(({data}) => {
          dispatch({ type: GET_OTTOCASHS, data: data.data.otto_cash_users, meta: data.data.meta });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const exportOttocashUser = (start_date, end_date) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`/otto_cash_users/export?start_date=${start_date}&end_date=${end_date}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_OTTOCASH }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_OTTOCASH, error }
}