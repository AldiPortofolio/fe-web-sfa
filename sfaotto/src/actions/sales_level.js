import axios from './config'
import { NEWAPI, GET_SALES_LEVEL, GET_SALES_LEVELS, FETCHING_SALES_LEVEL, ERROR_FETCHING_SALES_LEVEL } from './constants'

export const getSalesLevels = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(search === null){
      actionURL = '/sales_level/list'
    }else{
      actionURL = `/sales_level/list${search}`
    }

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + actionURL, {...param})
        .then(({data}) => {
          dispatch({ type: GET_SALES_LEVELS, data: data.data.sales_level, meta: data.data.meta, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const findSalesLevel = (keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    let actionURL

    if(keyword === null){
      actionURL = '/sales_level/filter'
    }else{
      actionURL = `/sales_level/filter?keyword=${keyword}`
    }

    return new Promise((resolve, reject) => {
      axios.get(NEWAPI + actionURL)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const deleteSalesLevel = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    
    return new Promise((resolve, reject) => {
      axios.delete(NEWAPI + `/sales_level/delete/${id}`)
      .then(({data}) => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    });
  }
}

export const detailSalesLevel = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/sales_level/detail/${id}`)
      .then(({data}) => {
        dispatch({ type: GET_SALES_LEVEL, one: data.data.sales_level, meta: data.meta });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const createSalesLevel = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    
    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + '/sales_level/create', data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const editSalesLevel = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/sales_level/update`, data)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_SALES_LEVEL}
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_SALES_LEVEL, error }
}
