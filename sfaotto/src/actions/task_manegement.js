import { result } from "lodash";
import axios from "./config";
import {
  NEWAPI_V2_3,
  FETCHING_TASK_MANAGEMENT,
  ERROR_FETCHING_TASK_MANAGEMENT,
  GET_TASK_MANAGEMENT,
  GET_TASK_MANAGEMENTS,
} from "./constants";

export const getTaskManagement = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    let actionURL;

    if (search === null) {
      actionURL = "/job-management/filter";
    } else {
      actionURL = `/job-management/filter${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + actionURL, { ...param })
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({
              type: GET_TASK_MANAGEMENTS,
              data: data.data,
              meta: data.meta,
            });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const getDraft = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    let actionURL;

    if (search === null) {
      actionURL = "/job-management/draft";
    } else {
      actionURL = `/job-management/draft${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + actionURL, { ...param })
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({
              type: GET_TASK_MANAGEMENTS,
              data: data.data,
              meta: data.meta,
            });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const createTaskManagement = (body) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    return new Promise((resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_3}/job-management/save`, body)
        .then(({ data }) => {
          dispatch(getTaskManagement);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const editTaskManagement = (body) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    return new Promise((resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_3}/job-management/edit`, body)
        .then(({ data }) => {
          dispatch(getTaskManagement);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const getDetailTaskManagement = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());
    return new Promise(async (resolve, reject) => {
      axios
        .get(`${NEWAPI_V2_3}/job-management/detail/${id}`)
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({ type: GET_TASK_MANAGEMENT, one: data.data });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const getCheckAdmin = () => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());
    return new Promise(async (resolve, reject) => {
      axios
        .get(`${NEWAPI_V2_3}/job-management/check-admin`)
        .then(({ data }) => {
          if (result(data, "data")) {
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const getRecipientList = (keyword = {}) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());
    return new Promise(async (resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_3}/job-management/recipient-list`, keyword)
        .then(({ data }) => {
          if (result(data, "data")) {
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const deleteTaskManagement = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    return new Promise((resolve, reject) => {
      axios
        .delete(`${NEWAPI_V2_3}/job-management/delete/${id}`)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

const fetching = () => {
  return { type: FETCHING_TASK_MANAGEMENT };
};

const errorFetching = (error) => {
  return { type: ERROR_FETCHING_TASK_MANAGEMENT, error };
};
