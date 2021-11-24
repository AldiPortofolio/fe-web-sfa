import initialState from './initialState'
import { GET_CLUSTERS, GET_CLUSTER, FETCHING_CLUSTER, ERROR_FETCHING_CLUSTER} from '../actions/constants'

const clusters = (state = initialState.clusters, action = {}) => {
  switch (action.type) {
    case FETCHING_CLUSTER:
      return {...state, loading: true}
    case GET_CLUSTERS:
      return {...state, loading: false, data: action.data.clusters, meta: action.data.meta}
    case GET_CLUSTER:
      return {...state, loading: false, one: action.data, meta: action.meta}
    case ERROR_FETCHING_CLUSTER:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default clusters
