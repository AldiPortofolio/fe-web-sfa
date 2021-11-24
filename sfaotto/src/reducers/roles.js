import initialState from './initialState'
import { GET_ROLES, GET_ROLE, FETCHING_ROLE, ERROR_FETCHING_ROLE } from '../actions/constants'

const roles = (state = initialState.roles, action = {}) => {
  switch (action.type) {
    case FETCHING_ROLE:
      return {...state, loading: true}
    case GET_ROLES:
      return {...state, loading: false, data: action.data, form: action.form}
    case GET_ROLE:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_ROLE:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default roles
