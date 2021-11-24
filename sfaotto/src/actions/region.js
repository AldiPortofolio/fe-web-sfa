import axios from './config'
import { isEmpty } from 'lodash'
import { NEWAPI, GET_REGIONS, GET_REGIONS_PROVINCES, FETCHING_REGION, ERROR_FETCHING_REGION } from './constants'

export const getRegions = (param = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    let actionURL

    if(isEmpty(param)){
      actionURL = '/regions/list'
    }else{
      actionURL = `/regions/list${param}`
    }

    return new Promise((resolve, reject) => {
      axios.get(NEWAPI + actionURL, {...param})
      .then(({data}) => {
        dispatch({ type: GET_REGIONS, data: data.data.regions, meta: data.data.meta, filter: {...param} });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getUnassignedRegions = (param = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios('/regions/unassigned_list', {...param}).then(({data}) => {
        dispatch({ type: GET_REGIONS, data: data.data.regions, filter: {...param} });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getRegionDetail = (regionID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/regions/detail/${regionID}`)
      .then(({data}) => {
        // dispatch({ type: GET_REGION, data: data.data.region });
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getRegionCode = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios('/regions/generate_code').then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const CreateRegion = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      // axios.post('/regions/create', data)
      axios.post(NEWAPI + '/regions/create', data)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const UpdateRegion = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + '/regions/update', data).then(({data}) => {
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteRegion = (regionID) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.delete(NEWAPI + `/regions/delete/${regionID}`)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export const bulkDeleteRegion = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/regions/bulk_delete`, data)
      .then(({data}) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export const getRegionsProvinces = (country_id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `regions/search_provinces?province=${country_id}`)
        .then(({data}) => {
          const form = data.data.provinces.map(c => ({value: c.id, label: c.name}))
          data = data.data.provinces.map(c => ({value: c.id, label: c.name}))
          data.unshift({value: '', label: 'Semua'})
          dispatch({ type: GET_REGIONS_PROVINCES, data, form });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_REGION }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_REGION, error }
}
