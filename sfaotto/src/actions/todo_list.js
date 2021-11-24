import axios from './config'
import { NEWAPI, GET_TODO_LIST, GET_TODO_DETAIL, FETCHING_TODO_DETAIL, FETCHING_TODO_LIST, ERROR_FETCHING_TODO_DETAIL, NEWAPI_V2, ERROR_FETCHING_TODO_LIST, NEWAPI_V2_3 } from './constants'

export const getToDoList = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcingList())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + '/todolist/filter_todolist', data)
        .then(({data}) => {
          dispatch({ type: GET_TODO_LIST, data: data.data, response_code: data.response_code, message: data.message, meta: data.meta});
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcingList(error))
          reject(error)
        })
    });
  }
}

export const getCountAllData = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + '/todolist/delete_count', data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
    });
  }
}

export const createTodoList = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + '/todolist/create', data)
      .then(({data}) => {
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

export const createTodoListV2 = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2_3 + '/todolist/create', data)
      .then(({data}) => {
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

export const updateTodoList = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + '/todolist/update', data)
      .then(({data}) => {
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

export const updateTodoListV2 = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2_3 + '/todolist/update', data)
      .then(({data}) => {
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

export const getToDoDetail = (review_id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI_V2 +  `/todolist/detail/${review_id}`)
        .then(({data}) => {
          dispatch({ type: GET_TODO_DETAIL, one: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getToDoDetailV2 = (review_id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI_V2_3 +  `/todolist/detail/${review_id}`)
        .then(({data}) => {
          dispatch({ type: GET_TODO_DETAIL, one: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const updateStatusTodoList = (data) => {

  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI +  `/todolist/verify`, data)
        .then(({data}) => {
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

export const bulkDeleteAllTodo = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/todolist/delete_by_filter`, data).then(({data}) => {
        // dispatch(getReviews);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const bulkDeleteTodoIds = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/todolist/delete_by_ids`, data).then(({data}) => {
        // dispatch(getReviews);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcingList = () => {
  return { type: FETCHING_TODO_LIST }
}

const errorFetcingList = (error) => {
  return { type: ERROR_FETCHING_TODO_LIST, error }
}

const fetcing = () => {
  return { type: FETCHING_TODO_DETAIL }
}
  
const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_TODO_DETAIL, error }
}