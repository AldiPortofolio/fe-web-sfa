import initialState from './initialState'
import { GET_REVIEWS, GET_REVIEW, FETCHING_REVIEW, ERROR_FETCHING_REVIEW } from '../actions/constants'

const reviews = (state = initialState.reviews, action = {}) => {
  switch (action.type) {
    case FETCHING_REVIEW:
      return {...state, loading: true}
    case GET_REVIEWS:
      // return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
      return {...state, loading: false, data: action.data, meta: action.meta}
    case GET_REVIEW:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_REVIEW:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default reviews
