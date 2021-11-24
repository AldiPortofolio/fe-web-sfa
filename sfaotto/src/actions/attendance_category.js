import axios from './config'
import { NEWAPI, FETCHING_ATTENDANCE_CATEGORY, ERROR_FETCHING_ATTENDANCE_CATEGORY, GET_ATTENDANCE_CATEGORY } from './constants'

export const getAttendCategory = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(search === null){
      actionURL = '/attendance_categories/list'
    }else{
      actionURL = `/attendance_categories/list${search}`

    }

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + actionURL, {...param})
        .then(({data}) => {
          dispatch({ type: GET_ATTENDANCE_CATEGORY, data: data.data, meta: data.meta, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const createAttendCategory = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI+'/attendance_categories/create', data)
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

export const getCategoryDetail = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/attendance_categories/detail/${id}`)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const editAttendCategory = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/attendance_categories/update`, data).then(({data}) => {
        dispatch(getAttendCategory);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteAttendCategory = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.delete(NEWAPI + `/attendance_categories/delete/${id}`)
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
  return { type: FETCHING_ATTENDANCE_CATEGORY }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_ATTENDANCE_CATEGORY, error }
}
