import axios from './config'
import { isEmpty } from 'lodash'
import { GET_BRANCHES, FETCHING_BRANCH, ERROR_FETCHING_BRANCH, NEWAPI } from './constants'

export const getBranches = (param = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(isEmpty(param)){
      actionURL = '/branches/list'
    }else{
      actionURL = `/branches/list${param}`
    }

    return new Promise((resolve, reject) => {
      // axios(actionURL)
      axios.get(NEWAPI + actionURL)
      .then(({data}) => {
        dispatch({ type: GET_BRANCHES, data: data.data.branches, meta: data.data.meta, filter: {...param} });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getUnassignedBranches = (regionID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/branches/unassigned_list_by_region?region_id=${regionID}`).then(({data}) => {
        dispatch({ type: GET_BRANCHES, data: data.data.branches });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getBranchDetail = (branchID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      // axios(`/branches/${branchID}`)
      axios.get(NEWAPI + `/branches/detail/${branchID}`)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getBranchCode = (regionID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/branches/generate_code?region_id=${regionID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const CreateBranch = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      // axios.post('/branches/create', data)
      axios.post(NEWAPI + '/branches/create', data)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const UpdateBranch = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    
    return new Promise((resolve, reject) => {
      // axios.post('/branches/update', data)
      axios.post(NEWAPI + '/branches/update', data)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const searchBranch = (regionID = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/branches/list_by_region?region_id=${regionID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const searchCity = (regionID = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/branches/search_cities?region_id=${regionID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteBranch = (branchID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.delete(NEWAPI + `/branches/delete/${branchID}`)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export const bulkDeleteBranch = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/branches/bulk_delete`, data)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_BRANCH }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_BRANCH, error }
}
