import { result } from "lodash";
import axios from "./config";
import {
  NEWAPI_V2_3,
  FETCHING_TASK_CATEGORY,
  ERROR_FETCHING_TASK_CATEGORY,
  GET_CATEGORY,
  GET_CATEGORIES,
} from "./constants";

export const getCategories = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    let actionURL;

    if (search === null) {
      actionURL = "/jobcategories/filter";
    } else {
      actionURL = `/jobcategories/filter${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + actionURL, { ...param })
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({
              type: GET_CATEGORIES,
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

export const createTaskCategory = (body) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    return new Promise((resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_3}/jobcategories/save`, body)
        .then(({ data }) => {
          dispatch(getCategories);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const getDetailCategory = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());
    return new Promise(async (resolve, reject) => {
      axios
        .get(`${NEWAPI_V2_3}/jobcategories/detail/${id}`)
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({ type: GET_CATEGORY, one: data.data });
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

export const editCategory = (body) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());
    return new Promise((resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_3}/jobcategories/update`, body)
        .then(({ data }) => {
          dispatch(getCategories);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const deleteCategory = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    return new Promise((resolve, reject) => {
      axios
        .delete(`${NEWAPI_V2_3}/jobcategories/delete/${id}`)
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
  return { type: FETCHING_TASK_CATEGORY };
};

const errorFetching = (error) => {
  return { type: ERROR_FETCHING_TASK_CATEGORY, error };
};
