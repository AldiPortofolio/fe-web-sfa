import initialState from "./initialState";
import {
  FETCHING_TASK_MANAGEMENT,
  ERROR_FETCHING_TASK_MANAGEMENT,
  GET_TASK_MANAGEMENT,
  GET_TASK_MANAGEMENTS,
} from "../actions/constants";

const task_management = (state = initialState.task_management, action = {}) => {
  switch (action.type) {
    case FETCHING_TASK_MANAGEMENT:
      return { ...state, loading: true };
    case GET_TASK_MANAGEMENTS:
      return { ...state, loading: false, data: action.data, meta: action.meta };
    case GET_TASK_MANAGEMENT:
      return { ...state, loading: false, one: action.one };
    case ERROR_FETCHING_TASK_MANAGEMENT:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default task_management;
