import initialState from "./initialState";
import {
  FETCHING_MINIO,
  GET_MINIO,
  ERROR_FETCHING_MINIO,
} from "../actions/constants";

const calendars = (state = initialState.minio, action = {}) => {
  switch (action.type) {
    case FETCHING_MINIO:
      return { ...state, loading: true };
    case GET_MINIO:
      return { ...state, loading: false, one: action.data, meta: action.meta };
    case ERROR_FETCHING_MINIO:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default calendars;
