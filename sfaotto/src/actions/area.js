import axios from './config'
import { GET_AREAS, FETCHING_AREA, ERROR_FETCHING_AREA, NEWAPI } from './constants'

export const getAreas = (param = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(param === null){
      actionURL = '/areas/list'
    }else{
      actionURL = `/areas/list${param}`
    }

    return new Promise((resolve, reject) => {
      axios(actionURL).then(({data}) => {
        dispatch({ type: GET_AREAS, data: data.data.areas, meta: data.data.meta, filter: {...param} });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getUnassignedAreas = (branchID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/areas/unassigned_list_by_branch?branch_id=${branchID}`).then(({data}) => {
        dispatch({ type: GET_AREAS, data: data.data.areas });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getAreaDetail = (areaID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/areas/${areaID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getAreaCode = (regionID, branchID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/areas/generate_code?region_id=${regionID}&branch_id=${branchID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const CreateArea = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/areas/create', data).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const UpdateArea = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/areas/update', data).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const searchAreas = (branchID = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/areas/list_by_branch?branch_id=${branchID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const searchDistricts = (branchID = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/areas/search_districts?branch_id=${branchID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteArea = (areaID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.delete(`/areas/${areaID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export const bulkDeleteArea = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post(`/areas/bulk_delete`, data).then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_AREA }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_AREA, error }
}
