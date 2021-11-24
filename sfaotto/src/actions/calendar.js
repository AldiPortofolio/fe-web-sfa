import axios from './config'
// import { isEmpty } from 'lodash'
import { NEWAPI, GET_CALENDAR, GET_CALENDARS, FETCHING_CALENDAR, ERROR_FETCHING_CALENDAR } from './constants'

export const getCalendars = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(search === null){
      actionURL = '/calendar_setup/list'
    }else{
      actionURL = `/calendar_setup/list${search}`
    }

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + actionURL, {...param})
        .then(({data}) => {
          dispatch({ type: GET_CALENDARS, data: data.data, meta: data.meta, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getCalendar = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/calendar_setup/detail/${id}`)
      .then(({data}) => {
        dispatch({ type: GET_CALENDAR, one: data.data, meta: data.meta });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteCalendar = (areaID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.delete(NEWAPI + `/calendar_setup/delete/${areaID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export const bulkDeleteCalendar = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/calendar_setup/bulk_delete`, data).then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export const createCalendar = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    
    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + '/calendar_setup/create', data)
        .then(({data}) => {
          dispatch({ type: GET_CALENDAR, one: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const editCalendar = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/calendar_setup/update`, data)
      .then(({data}) => {
        dispatch({ type: GET_CALENDAR, one: data.data });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_CALENDAR}
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_CALENDAR, error }
}
