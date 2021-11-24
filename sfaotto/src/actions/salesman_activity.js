import axios from "./config";
import {
  FETCHING_SALES_ACTIVITIES,
  ERROR_FETCHING_SALES_ACTIVITIES,
  GET_SALES_ACTIVITIES,
  GET_SALES_ACTIVITY,
  NEWAPI_V2_3,
} from "./constants";

export const getActivities = (param = {}) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    const actionURL = "/activitas-salesmen/list";

    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_SALES_ACTIVITIES,
            data: data.data,
            meta: data.meta,
            filter: { ...param },
          });
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getActivityDetail = (param = {}) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + `/activitas-salesmen/detail-sales`, { ...param })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getTodolist = (param = {}) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + `/activitas-salesmen/list-detail-todolist`, {
          ...param,
        })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getDetailTodolist = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI_V2_3 + `/activitas-salesmen/detail-todolist/${id}`)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getCallplans = (param = {}) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + `/activitas-salesmen/list-detail-callplan`, {
          ...param,
        })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getDetailCallplan = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI_V2_3 + `/activitas-salesmen/detail-callplan/${id}`)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

const fetcing = () => {
  return { type: FETCHING_SALES_ACTIVITIES };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_SALES_ACTIVITIES, error };
};
