import initialState from './initialState'
import { GET_RECRUITMENTS, FETCHING_RECRUITMENTS, ERROR_FETCHING_RECRUITMENT, GET_RECRUITMENT } from '../actions/constants'

const recruitments = (state = initialState.recruitments, action = {}) => {
  switch (action.type) {
    case FETCHING_RECRUITMENTS:
      return {...state, loading: true}
    case GET_RECRUITMENTS:
      return {...state, loading: false, data: action.data, meta: action.meta}
    case GET_RECRUITMENT:
      return {...state, loading: false, data: action.data, meta: action.meta}
    case ERROR_FETCHING_RECRUITMENT:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default recruitments
