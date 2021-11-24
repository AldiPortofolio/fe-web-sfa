import initialState from './initialState'
import { GET_CATEGORY_LIST, FETCHING_CATEGORY_LIST } from '../actions/constants'

const category_list = (state = initialState.category_list, action = {}) => {
  switch (action.type) {
    case FETCHING_CATEGORY_LIST:
      return {...state, loading: true}
    case GET_CATEGORY_LIST:
      return {...state, loading: false, data: action.data, form: action.form}
    default: return state
  }
}

export default category_list