import initialState from './initialState'
import { GET_OTTOCASHS, GET_OTTOCASH, FETCHING_OTTOCASH, ERROR_FETCHING_OTTOCASH } from '../actions/constants'

const ottocash_user = (state = initialState.ottocash_user, action = {}) => {
  switch (action.type) {
    case FETCHING_OTTOCASH:
      return {...state, loading: true}
    case GET_OTTOCASHS:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case GET_OTTOCASH:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_OTTOCASH:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default ottocash_user
