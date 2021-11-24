import axios from './config'
import { FETCHING_MANAGE_TARGET_TYPE, ERROR_FETCHING_MANAGE_TARGET_TYPE, GET_MANAGE_TARGET_TYPES, GET_MANAGE_TARGET_TYPE } from './constants'

export const createTargetType = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`target_management/create_target_type`, data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getTargetTypes = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get('target_management/target_type_list')
        .then(({data}) => {
          dispatch({ type: GET_MANAGE_TARGET_TYPES, data: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const updateTargetType = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`target_management/edit_target_type`, data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const deleteTargetType = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('target_management/delete_target_type', data)
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
  return { type: FETCHING_MANAGE_TARGET_TYPE }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_MANAGE_TARGET_TYPE, error }
}