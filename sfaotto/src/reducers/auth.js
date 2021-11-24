import initialState from './initialState'
import { AUTH_REQUEST, AUTH_RECEIVED, AUTH_FAILED, AUTH_SIGNOUT } from '../actions/constants'

const auth = (state = initialState.auth, action = {}) => {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, loading: true }
    case AUTH_RECEIVED:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        access_token: action.access_token,
        email: action.email,
        first_name: action.first_name,
        last_name: action.last_name,
        province_id: action.province_id,
        province_name: action.province_name,
        city_id: action.city_id,
        city_name: action.city_name,
        district_id: action.district_id,
        district_name: action.district_name,
        role: action.role,
        position: action.position,
        authority: action.authority,
        chief_division: action.chief_division,
        language: action.language
      }
    case AUTH_FAILED:
      return { ...state, loading: false, error: action.error }
    case AUTH_SIGNOUT:
      return { ...initialState.auth }
    default: return state
  }
}

export default auth
