import axios from './config'
import { isEmpty } from 'lodash'
import { GET_ROLES, FETCHING_ROLE, ERROR_FETCHING_ROLE } from './constants'

export const getRoles = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios('/admin/role_list')
        .then(({data}) => {
          let form;

          if(!isEmpty(data.data )){
            form = data.data.map(c => ({value: c.id, label: c.name}))
          }
          // data = data.data.map(c => ({value: c.id, label: c.name}))
          // data.unshift({value: '', label: 'Semua'})
          dispatch({ type: GET_ROLES, data: data.data, form });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getRole = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`/admin/detail_role/${id}`)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
    });
  }
}

export const createRole = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/admin/create_role', data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
    });
  }
}

export const updateRole = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/admin/update_role', data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
    });
  }
}

export const deleteRole = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.delete(`/admin/delete_role/${id}`)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_ROLE }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_ROLE, error }
}
