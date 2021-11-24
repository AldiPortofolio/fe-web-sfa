import axios from './config'
import { NEWAPI_V2, GET_RECRUITMENTS, FETCHING_RECRUITMENTS, ERROR_FETCHING_RECRUITMENT} from './constants'

export const getRecruitments = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(search === null){
      actionURL = '/merchants-new-recruitment/list'
    }else{
      actionURL = `/merchants-new-recruitment/list${search}`
    }

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + actionURL, {...param})
        .then(({data}) => {
          dispatch({ type: GET_RECRUITMENTS, data: data.data, meta: data.meta, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const createNewRecruitment = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + '/merchants-new-recruitment/create', data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const maxMinParameter = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(NEWAPI_V2 + '/param-configuration/min-max-phone')
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const findInstitution = (keyword) => {
    return (dispatch, getState) => {
      const { auth: {access_token} } = getState()
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      dispatch(fetcing())
  
      return new Promise((resolve, reject) => {
        axios.post(NEWAPI_V2 + '/institution/list', keyword)
          .then(({data}) => {
            resolve(data)
          }).catch(error => {
            dispatch(errorFetcing(error))
            reject(error)
          })
      });
    }
  }

export const getRecruitment = ( id = '') => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(NEWAPI_V2 + `/merchants-new-recruitment/detail/${id}`)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

// export const getCalendar = (id) => {
//   return (dispatch, getState) => {
//     const { auth: {access_token} } = getState()
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
//     dispatch(fetcing())

//     return new Promise((resolve, reject) => {
//       axios(NEWAPI + `/calendar_setup/detail/${id}`)
//       .then(({data}) => {
//         dispatch({ type: GET_CALENDAR, one: data.data, meta: data.meta });
//         resolve(data)
//       }).catch(error => {
//         dispatch(errorFetcing(error))
//         reject(error)
//       })
//     });
//   }
// }

// export const deleteCalendar = (areaID) => {
//   return (dispatch, getState) => {
//     const { auth: {access_token} } = getState()
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

//     return new Promise((resolve, reject) => {
//       axios.delete(NEWAPI + `/calendar_setup/delete/${areaID}`).then(({data}) => {
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     });
//   }
// }

// export const setStatusMerchant = (data) => {
//   return (dispatch, getState) => {
//     const { auth: {access_token} } = getState()
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

//     return new Promise((resolve, reject) => {
//       axios.post(NEWAPI + `/merchants/set_status`, data).then(({data}) => {
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     });
//   }
// }

// export const createCalendar = (data) => {
//   return (dispatch, getState) => {
//     const { auth: {access_token} } = getState()
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
//     dispatch(fetcing())
    
//     return new Promise((resolve, reject) => {
//       axios.post(NEWAPI + '/calendar_setup/create', data)
//         .then(({data}) => {
//           dispatch({ type: GET_CALENDAR, one: data.data });
//           resolve(data)
//         }).catch(error => {
//           dispatch(errorFetcing(error))
//           reject(error)
//         })
//     });
//   }
// }

const fetcing = () => {
  return { type: FETCHING_RECRUITMENTS}
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_RECRUITMENT, error }
}