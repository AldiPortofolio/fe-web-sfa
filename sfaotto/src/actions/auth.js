import { result } from 'lodash'
import axios from './config'
import { NEWAPI, AUTH_REQUEST, AUTH_RECEIVED, AUTH_FAILED, AUTH_SIGNOUT, NEWAPI_V2_1 } from './constants'

export const register = (data, callback) => {
  return (dispatch, getState) => {
    dispatch(startAuthentication())
    return axios({
      url: `${process.env.REACT_APP_API_URL}`,
      method: 'POST',
      data
    }).then(response => {
      const access_token = response.headers['access_token']
      const email = response.headers['email']
      const first_name = response.headers['access-token']
      const last_name = response.headers['last_name']
      dispatch(successAuthentication(access_token, email, first_name, last_name))
      callback();
    }).catch(error => {
      dispatch(failAuthentication(error))
    })
  }
}

export const confirmEmail = (data) => {
  return (dispatch, getState) => {
    dispatch(startAuthentication())

    return new Promise((resolve, reject) => {
      axios.post('/auth/confirm-email', data)
        .then(({data: {data}}) => {
          if (result(data, 'email', false)) {
            resolve(data)
          } else {
            reject('error')
          }
          resolve(data)
        }).catch(error => {
          reject(error)
          dispatch(failAuthentication(error))
        })
    });
  }
}

export const confirmEmailV2 = (data) => {
  return (dispatch, getState) => {
    dispatch(startAuthentication())

    return new Promise((resolve, reject) => {
      axios.post(`${NEWAPI_V2_1}/auth/confirm-email`, data)
        .then(({data: {data}}) => {
          if (result(data, 'email', false)) {
            resolve(data)
          } else {
            reject('error')
          }
          resolve(data)
        }).catch(error => {
          reject(error)
          dispatch(failAuthentication(error))
        })
    });
  }
}

export const signIn = (data, language) => {
  return (dispatch, getState) => {
    dispatch(startAuthentication())

    return new Promise((resolve, reject) => {
      axios.post('/auth/login', data)
      // axios.post(NEWAPI + '/auth/login', data)
        .then(({data: {data}}) => {
          if (result(data, 'admin.access_token', false)) {
            dispatch(successAuthentication(data.admin, language))
            resolve(data)
          } else {
            reject('error')
          }
          resolve(data)
        }).catch(error => {
          reject(error)
          dispatch(failAuthentication(error))
        })
    });
  }
}

export const signInV2 = (data, language) => {
  return (dispatch, getState) => {
    dispatch(startAuthentication())

    return new Promise((resolve, reject) => {
      axios.post(`${NEWAPI_V2_1}/auth/login`, data)
      // axios.post(NEWAPI + '/auth/login', data)
        .then(({data: {data}}) => {
          if (result(data, 'admin.access_token', false)) {
            dispatch(successAuthentication(data.admin, language))
            resolve(data)
          } else {
            reject('error')
          }
          resolve(data)
        }).catch(error => {
          reject(error)
          dispatch(failAuthentication(error))
        })
    });
  }
}

export const checkAuthToken = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return new Promise((resolve, reject) => {
      axios.post('/auth/check_token')
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(failAuthentication(error))
          reject(error)
        })
    });
  }
}

export const signOut = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(doSignout())
      resolve(true)
    });
  }
}

const startAuthentication = () => {
  return { type: AUTH_REQUEST }
}

const successAuthentication = ({access_token, email, first_name, last_name, authority, province_id, province_name, city_id, city_name, district_id, district_name, role, position, chief_division }, language) => {
  return { type: AUTH_RECEIVED, access_token, email, first_name, last_name, authority, province_id, province_name, city_id, city_name, district_id, district_name, role, position, chief_division, language}
}

const failAuthentication = (error) => {
  return { type: AUTH_FAILED, error }
}

const doSignout = () => {
  return { type: AUTH_SIGNOUT }
}
