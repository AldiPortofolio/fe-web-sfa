import initialState from "./initialState";
import {
  FETCHING_TASK_CATEGORY,
  ERROR_FETCHING_TASK_CATEGORY,
  GET_CATEGORY,
  GET_CATEGORIES,
} from "../actions/constants";

const task_category = (state = initialState.task_category, action = {}) => {
  switch (action.type) {
    case FETCHING_TASK_CATEGORY:
      return { ...state, loading: true };
    case GET_CATEGORIES:
      return { ...state, loading: false, data: action.data, meta: action.meta };
    case GET_CATEGORY:
      return { ...state, loading: false, one: action.one };
    case ERROR_FETCHING_TASK_CATEGORY:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default task_category;
