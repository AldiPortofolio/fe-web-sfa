import axios from './config'
import { FETCHING_MANAGE_TARGET, ERROR_FETCHING_MANAGE_TARGET, GET_MANAGE_TARGETS,
         GET_MANAGE_TARGETS_MONTHLY, GET_MANAGE_TARGETS_REGIONAL, 
        //  GET_MANAGE_TARGET 
        } from './constants'

export const setTargetHQAnnual = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`target_management/set_annual_hq_targets`, data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const setTargetHQMonthly = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`target_management/set_monthly_hq_targets`, data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getAnnualTargetHQ = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`target_management/get_annual_hq_targets`)
        .then(({data}) => {
          dispatch({ type: GET_MANAGE_TARGETS, data: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getMonthlyTargetHQ = (year) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`target_management/hq_target_monthly?year=${year}`)
        .then(({data}) => {
          dispatch({ type: GET_MANAGE_TARGETS, data: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getAnnualTargetRegion = (year, regional_type) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`target_management/regional_target_list?year=${year}&regional_type=${regional_type}`)
        .then(({data}) => {
          dispatch({ type: GET_MANAGE_TARGETS_REGIONAL, data: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getHQTargetMonthly = (year) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`target_management/hq_target_monthly?year=${year}`)
        .then(({data}) => {
          dispatch({ type: GET_MANAGE_TARGETS_MONTHLY, monthly_data: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}


export const getMonthlyTargetRegion = (year, regional_type, target_type, parent_params) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`target_management/regional_target_monthly?year=${year}&regional_type=${regional_type}&target_type=${target_type}&${parent_params}`)
        .then(({data}) => {
          dispatch({ type: GET_MANAGE_TARGETS_REGIONAL, data: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const createTargetRegion = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`target_management/set_regional_targets`, data)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getHQTarget = (year) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`target_management/hq_target_list?year=${year}`)
        .then(({data}) => {
          dispatch({ type: GET_MANAGE_TARGETS, data: data.data });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getRegionalTarget = (params) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.get(`target_management/regional_target_list?${params}`)
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
  return { type: FETCHING_MANAGE_TARGET }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_MANAGE_TARGET, error }
}