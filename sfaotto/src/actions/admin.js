import { result } from 'lodash'
import axios from './config'
import { NEWAPI_V2_1, GET_ADMINS, GET_ADMIN, GET_ADMIN_STATUS, FETCHING_ADMIN, ERROR_FETCHING_ADMIN } from './constants'

export const getAdmins = (role = '') => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/admin', {role})
      // axios.get(NEWAPI + '/admin', {role})
      .then(({data}) => {
        if (result(data, 'data')) {
          dispatch({ type: GET_ADMINS, data: data.data.admins, role });
          resolve(data)
        } else {
          reject('error')
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getAdminsV2_1 = (param = {}) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing());
    return new Promise((resolve, reject) => {
      axios.get(`${NEWAPI_V2_1}/admin/list`, {params: param})
        .then(({data}) => {
          dispatch({ type: GET_ADMINS, data: data.data, meta: data.meta, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}
export const getAdminStatuses = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/admin/authority_statuses`).then(({data}) => {
        // console.log(result(data, 'data.statutes'))
        if (result(data, 'data.statutes')) {
          dispatch({ type: GET_ADMIN_STATUS, statuses: data.data.statutes, labels: data.data.labels });
          resolve(data)
        } else {
          reject('error')
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getAdmin = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(`/admin/${id}`).then(({data}) => {
        if (result(data, 'data.admin')) {
          dispatch({ type: GET_ADMIN, one: data.data.admin });
          resolve(data)
        } else {
          reject('error')
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const getAdminV2_1 = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    dispatch(fetcing())

    return new Promise(async (resolve, reject) => {
      axios.get(`${NEWAPI_V2_1}/admin/detail/${id}`).then(({data})  => {
        if (result(data, 'data.admin')) {
          dispatch({ type: GET_ADMIN, one: data.data.admin });
          resolve(data)
        } else {
          reject('error')
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}


export const createAdmin = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`${NEWAPI_V2_1}/admin/create`, data).then(({data}) => {
        dispatch(getAdmins);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const editAdmin = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/admin/${id}`, data).then(({data}) => {
        dispatch(getAdmins);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const editAdminV2_1 = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    console.log(data)
    return new Promise((resolve, reject) => {
      axios.post(`${NEWAPI_V2_1}/admin/update`, data).then(({data}) => {
        dispatch(getAdmins);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteAdmin = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.delete(`/admin/${id}`).then(({data}) => {
        // dispatch(getAdmins);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const changeStatusAdmin = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`${NEWAPI_V2_1}/admin/change_status`, data).then(({data}) => {
        // dispatch(getAdmins);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_ADMIN }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_ADMIN, error }
}
