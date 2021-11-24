import axios from './config'
import { NEWAPI_V2, NEWAPI, GET_SUBAREAS, FETCHING_SUBAREA, ERROR_FETCHING_SUBAREA } from './constants'

export const getSubareas = (param = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(param === null){
      actionURL = '/sub_areas/list'
    }else{
      actionURL = `/sub_areas/list${param}`
    }

    return new Promise((resolve, reject) => {
      axios(NEWAPI + actionURL).then(({data}) => {
        dispatch({ type: GET_SUBAREAS, data: data.data.sub_areas, meta: data.data.meta, filter: {...param} });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getSubareaDetail = (subAreaID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI+`/sub_areas/detail/${subAreaID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getSubareaCode = (regionID, branchID, areaID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/sub_areas/generate_code?region_id=${regionID}&branch_id=${branchID}&area_id=${areaID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const CreateSubarea = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI+'/sub_areas/create', data).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const UpdateSubarea = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + '/sub_areas/update', data).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}
export const searchSubAreas = (areaID = null, sac_ids = '') => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let path
    if (sac_ids !== '') {
      path = `area_id=${areaID}&sac_ids=${sac_ids}`
    }else{
      path = `area_id=${areaID}`
    }

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/sub_areas/list_by_area?${path}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const searchVillages = (areaID, villages) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/sub_areas/search_villages?area_id=${areaID}&village=${villages}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteSubArea = (subAreaID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.delete(NEWAPI+`/sub_areas/${subAreaID}`).then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export const bulkDeleteSubArea = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI+`/sub_areas/bulk_delete`, data).then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export const findSAC = (param, functional = null) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(param === ''){
      actionURL = '/sales_area_channels/list'
    }else{
      actionURL = `/sales_area_channels/list?keyword=${param}`
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

export const getSubAreaChannels_ByVillage = (village_id, keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(village_id === ''){
      actionURL = '/sub-area-channel/list'
    }else{
      actionURL = `/sub-area-channel/list?village_id=${village_id}`
    }

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + actionURL, keyword)
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
  return { type: FETCHING_SUBAREA }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_SUBAREA, error }
}
