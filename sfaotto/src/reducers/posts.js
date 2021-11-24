import _ from 'lodash'
import { FETCH_POSTS, FETCH_POST, UPDATE_POST, DELETE_POST, ADD_POST, FIND_POSTS } from '../actions/constants'
import initialState from './initialState'

// const INIT_STATE = { all: {}, post: null }
// const INIT_STATE = {}

const posts = (state = initialState.posts, action) => {
  const data = (action.payload) ? action.payload.data : null
  switch (action.type) {
    case FETCH_POSTS:
      const newPost = _.mapKeys(data.posts, 'id')
      // return { all: {...state.all, ...newPost}, post: state.post }
      return { ...state, ...newPost }
    case FIND_POSTS:
      const findPost = _.mapKeys(data.posts, 'id')
      return { ...findPost }
      // return { ...state, ...findPost }
    case FETCH_POST:
      // return { all: {...state.all, [data.post.id]: data.post}, post: data.post}
      return {...state, [data.post.id]: data.post}
    case UPDATE_POST:
      return {...state, [data.post.id]: data.post}
    case DELETE_POST:
      return _.omit(state, action.payload)
    case ADD_POST:
      return {...state, [data.post.id]: data.post}
    default:
      return state
  }
}

export default posts
