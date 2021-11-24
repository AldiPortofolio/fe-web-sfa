import axios from "./config";
import {
  NEWAPI,
  NEWAPI_CALL_PLAN,
  FETCHING_CALL_PLAN,
  ERROR_FETCHING_CALL_PLAN,
  GET_CALL_PLANS,
  GET_CALL_PLAN_MERCHANTS,
  NEWAPI_CALL_PLAN_v2,
  NEWAPI_CALL_PLAN_v23,
} from "./constants";

export const getCallPlans = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/call_plan/list";
    } else {
      actionURL = `/call_plan/list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_CALL_PLAN_v23 + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_CALL_PLANS,
            data: data.data.callplans,
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

export const getCallPlansV2 = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/call_plan/list";
    } else {
      actionURL = `/call_plan/list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_CALL_PLAN_v23 + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_CALL_PLANS,
            data: data.data.callplans,
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

export const getCallPlanDetail = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios(NEWAPI_CALL_PLAN + `/call_plan/sales_detail/${id}`)
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

export const getCallPlanDetailV2 = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios(NEWAPI_CALL_PLAN_v23 + `/call_plan/sales_detail/${id}`)
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

export const getMerchants = (page = null, call_plan_id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (page === null) {
      actionURL = `/call_plan/merchant_list/${call_plan_id}`;
    } else {
      actionURL = `/call_plan/merchant_list/${call_plan_id}${page}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI_CALL_PLAN + actionURL)
        .then(({ data }) => {
          dispatch({
            type: GET_CALL_PLAN_MERCHANTS,
            data: data.data.merchants,
            meta: data.data.meta,
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

export const getMerchantDetail = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios(NEWAPI_CALL_PLAN + `/call_plan/merchant_detail/${id}`)
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

export const getMerchantDetailV2 = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios(NEWAPI_CALL_PLAN_v23 + `/call_plan/merchant_detail/${id}`)
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

export const findSubArea = (param) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    // dispatch(fetcing())

    let actionURL;

    if (param === null) {
      actionURL = "/call_plan/sub_area_list?";
    } else {
      actionURL = `/call_plan/sub_area_list?name=${param}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI_CALL_PLAN + actionURL)
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

export const getCluster = (param, id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    // dispatch(fetcing())

    let queryParams =
      param === null
        ? NEWAPI_CALL_PLAN + `/call_plan/cluster_list/${id}?`
        : NEWAPI_CALL_PLAN + `/call_plan/cluster_list/${id}?keyword=${param}`;
    // let urlParams = (functional === null ? queryParams : (queryParams + '&functional_position=true') )

    return new Promise((resolve, reject) => {
      axios
        .get(queryParams)
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

export const getCallPlanResult = (id) => {
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

export const generateCallPlan = () => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI_CALL_PLAN + "/call_plan/generate")
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

export const exportCallplanAction = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_CALL_PLAN + "/call_plan/export", data)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

export const exportMerchantCallPlan = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_CALL_PLAN + "/call_plan/export_detail", data)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

export const parameterLastDate = () => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI_CALL_PLAN + "/call_plan/last_callplan_date")
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

export const validateNoHP = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_CALL_PLAN_v2 + "/salesman/validate", data)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

export const regenerateAllCallplan = () => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI_CALL_PLAN_v23 + "/call_plan/regenerate_all")
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

export const regenerateSpesificCallplan = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_CALL_PLAN_v23 + "/call_plan/regenerate_by_sales", data)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

const fetcing = () => {
  return { type: FETCHING_CALL_PLAN };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_CALL_PLAN, error };
};
