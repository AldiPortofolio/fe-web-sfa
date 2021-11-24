import axios from './config'
import { NEWAPI, GET_SALES_LEVEL_ASSIGNMENT, GET_SALES_LEVEL_ASSIGNMENTS, FETCHING_SALES_LEVEL_ASSIGNMENT, ERROR_FETCHING_SALES_LEVEL_ASSIGNMENT } from './constants'

export const getSalesLevelAssignments = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(search === null){
      actionURL = '/sales_level_assignment/list'
    }else{
      actionURL = `/sales_level_assignment/list${search}`
    }

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + actionURL, {...param})
        .then(({data}) => {
          dispatch({ type: GET_SALES_LEVEL_ASSIGNMENTS, data: data.data.sales_level_assignment, meta: data.data.meta, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const findSalesLevelAssignmentByPhone = (param, functional = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(NEWAPI + `/sales_level_assignment/sales_search_by_phone?keyword=${param}`)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

// export const deleteSalesLevel = (id) => {
//   return (dispatch, getState) => {
//     const { auth: {access_token} } = getState()
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    
//     return new Promise((resolve, reject) => {
//       axios.delete(NEWAPI + `/sales_level/delete/${id}`)
//       .then(({data}) => {
//         resolve(data)
//       }).catch(err => {
//         reject(err)
//       })
//     });
//   }
// }

export const detailSalesLevelAssignment = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/sales_level_assignment/detail/${id}`)
      .then(({data}) => {
        dispatch({ type: GET_SALES_LEVEL_ASSIGNMENT, one: data.data.sales_level_assignment, meta: data.meta });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const createSalesLevelAssignment = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    
    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + '/sales_level_assignment/create', data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const editSalesLevelAssignment = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/sales_level_assignment/update`, data)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_SALES_LEVEL_ASSIGNMENT}
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_SALES_LEVEL_ASSIGNMENT, error }
}
