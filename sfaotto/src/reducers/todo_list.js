import initialState from './initialState'
import { GET_TODO_LIST, FETCHING_TODO_LIST, GET_TODO_DETAIL } from '../actions/constants'

const todo_list = (state = initialState.todo_list, action = {}) => {
  switch (action.type) {
    case FETCHING_TODO_LIST:
      return {...state, loading: true}
    case GET_TODO_LIST:
      return {...state, loading: false, data: action.data, meta: action.meta}
    case GET_TODO_DETAIL:
      return {...state, loading: false, one: action.one}
    default: return state
  }
}

export default todo_list