import axios from './config'
import { GET_TARGET_STATISTIC, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, FILTER_DISTRICT, FETCHING_TARGET_COUNTRY, FETCHING_TARGET_PROVINCE, FETCHING_TARGET_CITY, FETCHING_TARGET_DISTRICT, FETCHING_TARGET, ERROR_FETCHING_TARGET } from './constants'

export const getTargetStatistic = (country_id = 1) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/target/statistics/${country_id}`)
        .then(({data}) => {
          data.data.statistics && dispatch({ type: GET_TARGET_STATISTIC, statistic: data.data.statistics });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const createTargetCountry = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/target/country/new', data).then(({data}) => {
        // dispatch(getAdmins);
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

export const createTargetProvince = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/target/province/new', data).then(({data}) => {
        // dispatch(getAdmins);
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

export const createTargetCity = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/target/city/new', data).then(({data}) => {
        // dispatch(getAdmins);
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

export const createTargetDistrict = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/target/district/new', data).then(({data}) => {
        // dispatch(getAdmins);
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

export const createTargetVillage = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/target/village/new', data).then(({data}) => {
        // dispatch(getAdmins);
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

export const detailTargetCountry = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`/target/country/`, data).then(({data}) => {
        // dispatch(getAdmins);
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

export const detailTargetVillage = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`/target/merchant_village/`, data).then(({data}) => {
        // dispatch(getAdmins);
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

export const editTargetCountry = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/target/country/${id}`, data).then(({data}) => {
        // dispatch(getAdmins);
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

export const editTargetProvince = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/target/province/${id}`, data).then(({data}) => {
        // dispatch(getAdmins);
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

export const editTargetCity = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/target/city/${id}`, data).then(({data}) => {
        // dispatch(getAdmins);
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

export const editTargetDistrict = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/target/district/${id}`, data).then(({data}) => {
        // dispatch(getAdmins);
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

export const editTargetVillage = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/target/village/${id}`, data).then(({data}) => {
        // dispatch(getAdmins);
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

export const filterCountry = (id, data = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch({ type: FETCHING_TARGET_COUNTRY, loading_country: true })

    return new Promise((resolve, reject) => {
      axios.post(`/target/country/`, data).then(({data}) => {
        let invalid_token = false
        if (data.meta.message === 'Invalid Token') {
          invalid_token = true
        }else if(data.meta.message === "No target data available on this Country"){
          dispatch(errorFetcing(data.meta))
          reject(data.meta)
        }else{
          dispatch({ type: FILTER_COUNTRY, filter_country: data.data.target_country, invalid_token });
          resolve(data)
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const filterProvince = (data = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch({ type: FETCHING_TARGET_PROVINCE, loading_province: true })

    return new Promise((resolve, reject) => {
      axios.post(`/target/province/`, data)
        .then(({data}) => {
          let invalid_token = false
          if (data.meta.message === 'Invalid Token') {
            invalid_token = true
          }else if(data.meta.message === 'No target data available on this Province'){
            dispatch(errorFetcing(data.meta))
            reject(data.meta)
          }
          
          dispatch({ type: FILTER_PROVINCE, filter_province: data.data.target_province, invalid_token });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const filterCity = (city_id, year) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch({ type: FETCHING_TARGET_CITY, loading_city: true })

    return new Promise((resolve, reject) => {
      axios.post('/target/city/', {city_id, year})
        .then(({data}) => {
          dispatch({ type: FILTER_CITY, filter_city: data.data.target_city });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const filterDistrict = (district_id, year) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch({ type: FETCHING_TARGET_DISTRICT, loading_district: true })

    return new Promise((resolve, reject) => {
      axios.post('/target/district/', {district_id, year})
        .then(({data}) => {
          dispatch({ type: FILTER_DISTRICT, filter_district: data.data.target_district });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const deleteCountry = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    return new Promise((resolve, reject) => {
      axios.delete(`/target/country/${id}`)
        .then(({data}) => {
          resolve(data)
        })
        .catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const deleteProvince = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    return new Promise((resolve, reject) => {
      axios.delete(`/target/province/${id}`)
        .then(({data}) => {
          resolve(data)
        })
        .catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const deleteCity = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    return new Promise((resolve, reject) => {
      axios.delete(`/target/city/${id}`)
        .then(({data}) => {
          resolve(data)
        })
        .catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const deleteDistrict = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    return new Promise((resolve, reject) => {
      axios.delete(`/target/district/${id}`)
        .then(({data}) => {
          resolve(data)
        })
        .catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const deleteVillage = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    return new Promise((resolve, reject) => {
      axios.delete(`/target/village/${id}`)
        .then(({data}) => {
          resolve(data)
        })
        .catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_TARGET }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_TARGET, error }
}
