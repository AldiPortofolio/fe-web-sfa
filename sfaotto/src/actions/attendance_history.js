import axios from "./config";
import {
  NEWAPI,
  NEWAPI_V2_2,
  FETCHING_ATTENDANCE_HISTORY,
  ERROR_FETCHING_ATTENDANCE_HISTORY,
  GET_ATTENDANCE_HISTORY,
  NEWAPI_V2_3,
} from "./constants";

export const getAttendHistory = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/attendances/list";
    } else {
      actionURL = `/attendances/list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_ATTENDANCE_HISTORY,
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

export const getAttendHistoryV2 = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/attendances/list";
    } else {
      actionURL = `/attendances/list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_2 + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_ATTENDANCE_HISTORY,
            data: data.data.attendances,
            meta: data.data.meta,
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

export const getAttendHistoryV23 = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/attendances/list";
    } else {
      actionURL = `/attendances/list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_ATTENDANCE_HISTORY,
            data: data.data.attendances,
            meta: data.data.meta,
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

export const getHistoryDetail = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/attendances/detail/${id}`)
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

export const getHistoryDetailV23 = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios(NEWAPI_V2_3 + `/attendances/detail/${id}`)
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

export const validateAttendance = (param = {}) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_3 + `/attendances/validate`, param)
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
  return { type: FETCHING_ATTENDANCE_HISTORY };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_ATTENDANCE_HISTORY, error };
};
