import axios from './config'
import {
  NEWAPI,
  NEWAPI_V2_2,
  // FILTER_REQUESTS,
  FETCHING_REQUEST,
  ERROR_FETCHING_REQUEST,
  GET_REQUESTS,
  GET_REQUEST,
  GET_REQUEST_ACTION_TYPE,
  GET_REQUEST_STATUS,
  GET_REQUEST_MODULE
} from './constants'

export const getRequests = (type, param) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      // axios.get(`/admin/request_${type}_list${param}`)
      axios.get(NEWAPI + `/admin/request_${type}_list${param}`)
        .then(({data}) => {
          dispatch({ type: GET_REQUESTS, data: data.data, meta: data.meta });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getRequestsV2 = (type, param) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      // axios.get(`/admin/request_${type}_list${param}`)
      axios.get(NEWAPI_V2_2 + `/admin/request_${type}_list${param}`)
        .then(({data}) => {
          dispatch({ type: GET_REQUESTS, data: data.data.requests, meta: data.data.meta });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getRequestActionTypes = (type, param) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios.get(`/admin/action_types`)
      // axios.get(NEWAPI + `/admin/action_types`)
        .then(({data}) => {
          dispatch({ type: GET_REQUEST_ACTION_TYPE, action_types: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getRequestModules = (type, param) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios.get(`/admin/module_requests`)
      // axios.get(NEWAPI + `/admin/module_requests`)
        .then(({data}) => {
          dispatch({ type: GET_REQUEST_MODULE, modules: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getRequestStatus = (type, param) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios.get(`/admin/status_requests`)
      // axios.get(NEWAPI + `/admin/status_requests`)
        .then(({data}) => {
          dispatch({ type: GET_REQUEST_STATUS, status: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}


export const getRequestDetail = (ID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      // axios(`/admin/request_detail/${ID}`)
      axios(NEWAPI + `/admin/request_detail/${ID}`)
      .then(({data}) => {
        dispatch({ type: GET_REQUEST, one: data.data });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const changeRequestStatus = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + '/admin/change_status_request', data)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const changeRequestStatusV2 = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2_2 + '/admin/change_status_request', data)
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
  return { type: FETCHING_REQUEST }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_REQUEST, error }
}