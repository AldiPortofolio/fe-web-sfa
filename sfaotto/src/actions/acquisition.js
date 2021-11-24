import { result } from "lodash";
import axios from "./config";
import {
  NEWAPI_V2_2,
  FETCHING_ACQUISITION,
  ERROR_FETCHING_ACQUISITION,
  GET_ACQUISITION,
  GET_ACQUISITIONS,
} from "./constants";

export const getAcquisitions = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/acquisitions/list";
    } else {
      actionURL = `/acquisitions/list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_2 + actionURL, { ...param })
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({
              type: GET_ACQUISITIONS,
              data: data.data.acquisitions,
              meta: data.data.meta,
            });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getAcquisition = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());
    return new Promise(async (resolve, reject) => {
      axios
        .get(`${NEWAPI_V2_2}/acquisitions/edit-detail/${id}`)
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({ type: GET_ACQUISITION, one: data.data });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getDetailAcquisition = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());
    return new Promise(async (resolve, reject) => {
      axios
        .get(`${NEWAPI_V2_2}/acquisitions/detail/${id}`)
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({ type: GET_ACQUISITION, one: data.data });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const createAcquisition = (body) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_2}/acquisitions/create`, body)
        .then(({ data }) => {
          dispatch(getAcquisitions);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const editAcquisition = (body) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());
    return new Promise((resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_2}/acquisitions/update`, body)
        .then(({ data }) => {
          dispatch(getAcquisitions);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const deleteAcquisition = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .delete(`${NEWAPI_V2_2}/acquisitions/delete/${id}`)
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

export const changeStatusAcquisition = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_2}/acquisitions/change-status`, data)
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
  return { type: FETCHING_ACQUISITION };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_ACQUISITION, error };
};
