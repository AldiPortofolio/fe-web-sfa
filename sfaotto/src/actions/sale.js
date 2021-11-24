import axios from "./config";
import { isEmpty } from "lodash";
import {
  NEWAPI,
  NEWAPI_V2_2,
  GET_SALES,
  GET_ASSIGNMENT_SALES,
  GET_POSITIONS_SALES,
  GET_UNASSIGN_SALES,
  GET_SALE,
  FETCHING_SALE,
  ERROR_FETCHING_SALE,
  NEWAPI_V2_1,
} from "./constants";

export const getSales = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/sales/list";
    } else {
      actionURL = `/sales/list${search}`;
    }

    return new Promise((resolve, reject) => {
      // axios.post(actionURL, {...param})
      axios
        .post(NEWAPI + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_SALES,
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

export const getSalesV2 = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/salesman/list";
    } else {
      actionURL = `/salesman/list${search}`;
    }

    return new Promise((resolve, reject) => {
      // axios.post(actionURL, {...param})
      axios
        .post(NEWAPI_V2_2 + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_SALES,
            data: data.data.salesman,
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

export const getAssignmentSales = (search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (isEmpty(search)) {
      actionURL = "/sales_management/assignment_list";
    } else {
      actionURL = `/sales_management/assignment_list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI + actionURL)
        .then(({ data }) => {
          dispatch({
            type: GET_ASSIGNMENT_SALES,
            assignments: data.data.salesmen,
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

export const getUnassignSales = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/sales/unassign_salesmen_list";
    } else {
      actionURL = `/sales/unassign_salesmen_list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .get(actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_UNASSIGN_SALES,
            unassign: data.data.salesmen,
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

export const getSale = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/sales/detail/${id}`)
        .then(({ data }) => {
          dispatch({ type: GET_SALE, one: data.data, meta: data.meta });
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getSaleV2 = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios(NEWAPI_V2_1 + `/sales/detail/${id}`)
        .then(({ data }) => {
          dispatch({ type: GET_SALE, one: data.data, meta: data.meta });
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getSaleDetail = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(`/sales/show_by_detail`, data)
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

export const createSale = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_1 + "/sales/create", data)
        .then(({ data }) => {
          dispatch({ type: GET_SALE, one: data.data });
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const verifySale = (id, data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(`/sales/verified/${id}`, data)
        .then(({ data }) => {
          dispatch({ type: GET_SALE, one: data.data.salesman });
          // dispatch(getSales);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const editSale = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      // axios.put(`/sales/${id}`, data)
      axios
        .post(NEWAPI_V2_1 + `/sales/update`, data)
        .then(({ data }) => {
          dispatch({ type: GET_SALE, one: data.data.salesman });
          // dispatch(getSales);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const deleteSale = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .delete(`/sales/${id}`)
        .then(({ data }) => {
          // dispatch(getSales);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const getSalesRoles = () => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .get(`/sales_management/role_list`)
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

export const getSalesManagementDetail = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI + `/sales_management/sales_detail?sales_id=${id}`)
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

export const findSales = (param, functional = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());
    let queryParams =
      param === null
        ? "/sales_management/salesmen_list?"
        : `/sales_management/salesmen_list?sales=${param}`;
    let urlParams =
      functional === null
        ? queryParams
        : queryParams + "&functional_position=true";

    return new Promise((resolve, reject) => {
      axios
        .get(urlParams)
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

export const findSalesByPhone = (param, functional = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .get(NEWAPI + `/sales/search_by_phone?keyword=${param}`)
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

export const findTransferSales = (param) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());
    let queryParam =
      param === null
        ? "/sales_management/salesmen_transfer_list"
        : `/sales_management/salesmen_transfer_list?sales=${param}`;

    return new Promise((resolve, reject) => {
      axios
        .get(queryParam)
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

export const getPositionsSales = (search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (isEmpty(search)) {
      actionURL = "/sales_management/sales_position_list";
    } else {
      actionURL = `/sales_management/sales_position_list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .get(actionURL)
        .then(({ data }) => {
          dispatch({
            type: GET_POSITIONS_SALES,
            positions: data.data.salesmen,
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

export const getPositionSaleDetail = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .get(`/sales_management/sales_position_detail/${id}`)
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

export const positionAssignment = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI + "/sales_management/position_assignment", data)
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

export const updatePositionAssignment = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI + "/sales_management/edit_assignment", data)
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

export const relationCheck = (sales_id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .get(
          NEWAPI + `/sales_management/sales_relation_check?sales_id=${sales_id}`
        )
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

export const promoteSales = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post("/sales_management/transfer_position", data)
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

export const SetPositionSales = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post("/sales_management/set_position_unassign_salesmen", data)
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

export const getFunctionalRoles = () => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios("/sales_management/functional_position_type_list")
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

export const updateFunctionalSales = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      axios
        .post(`/sales_management/update_functional_position`, data)
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
  return { type: FETCHING_SALE };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_SALE, error };
};
