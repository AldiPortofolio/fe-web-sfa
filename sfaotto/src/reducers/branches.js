import initialState from './initialState'
import { GET_BRANCHES, GET_BRANCH, FETCHING_BRANCH, ERROR_FETCHING_BRANCH } from '../actions/constants'

const branches = (state = initialState.branches, action = {}) => {
  switch (action.type) {
    case FETCHING_BRANCH:
      return {...state, loading: true}
    case GET_BRANCHES:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case GET_BRANCH:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_BRANCH:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default branches
