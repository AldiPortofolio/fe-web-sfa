import axios from './config'
import { FETCHING_TODO, ERROR_FETCHING_TODO, GET_TODOS } from './constants'

export const getTodos = (param = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/todo_list', {...param})
        .then(({data}) => {
          dispatch({ type: GET_TODOS, data: data.data.todo_list, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getTodo = (todo_id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/todo_list/${todo_id}`)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const createTodo = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/todo_list/new', data).then(({data}) => {
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

export const createTodoBulk = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/todo_list/bulk', data).then(({data}) => {
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

export const editTodo = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/todo_list/${id}`, data).then(({data}) => {
        dispatch(getTodos);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteTodo = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.delete(`/todo_list/${id}`).then(({data}) => {
        // dispatch(gettodos);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_TODO }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_TODO, error }
}
