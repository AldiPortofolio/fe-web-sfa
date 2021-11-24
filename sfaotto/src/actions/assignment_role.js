import { result } from 'lodash'
import axios from './config'
import { NEWAPI_V2_1, NEWAPI, GET_ASSIGNMENT_ROLES, FETCHING_ASSIGNMENT_ROLE, ERROR_FETCHING_ASSIGNMENT_ROLE } from './constants'

export const getAssignmentRoles = () => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
        axios.get(NEWAPI_V2_1 + "/assignment_role/list")
        .then(({data}) => {
          dispatch({ type: GET_ASSIGNMENT_ROLES, data: data.data});
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
      });
  }
}

const fetcing = () => {
  return { type: FETCHING_ASSIGNMENT_ROLE }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_ASSIGNMENT_ROLE, error }
}
