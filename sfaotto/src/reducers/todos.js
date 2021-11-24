import initialState from './initialState'
import { GET_TODOS, GET_TODO, FETCHING_TODO, ERROR_FETCHING_TODO } from '../actions/constants'

const todos = (state = initialState.todos, action = {}) => {
  switch (action.type) {
    case FETCHING_TODO:
      return {...state, loading: true}
    case GET_TODOS:
      return {...state, loading: false, data: action.data, filter: action.filter}
    case GET_TODO:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_TODO:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default todos
