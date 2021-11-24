import initialState from './initialState'
import { GET_SUB_CATEGORY, FETCHING_SUB_CATEGORY_LIST, ERROR_FETCHING_SUB_CATEGORY_LIST } from '../actions/constants'

const sub_category = (state = initialState.sub_category, action = {}) => {
  switch (action.type) {
    case FETCHING_SUB_CATEGORY_LIST:
      return {...state, loading: true}
    case GET_SUB_CATEGORY:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case ERROR_FETCHING_SUB_CATEGORY_LIST:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default sub_category
