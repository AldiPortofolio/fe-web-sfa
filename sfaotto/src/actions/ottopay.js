import axios from './config'
import { FILTER_OTTOPAYS, FETCHING_OTTOPAY, ERROR_FETCHING_OTTOPAY, GET_OTTOPAYS } from './constants'

export const getOttopayOrders = (param = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get('/ottopay_orders/list')
        .then(({data}) => {
          dispatch({ type: GET_OTTOPAYS, data: data.data, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getOttopayOrder = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/ottopay_orders/${id}`)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const createOttopayOrder = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/ottopay_orders/new', data).then(({data}) => {
        // dispatch(getAdmins);
        if (data.meta.status) {
          resolve(data)
        } else {
          reject(data.meta)
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const createOttopayOrderBulk = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/ottopay_orders/bulk', data).then(({data}) => {
        // dispatch(getAdmins);
        if (data.meta.status) {
          resolve(data)
        } else {
          reject(data.meta)
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const editOttopayOrder = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/ottopay_orders/${id}`, data).then(({data}) => {
        dispatch(getOttopayOrders);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteOttopayOrder = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.delete(`/ottopay_orders/${id}`).then(({data}) => {
        // dispatch(getOttopayOrders);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_OTTOPAY }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_OTTOPAY, error }
}
