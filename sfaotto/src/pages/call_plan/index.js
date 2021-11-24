import React from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import {
  getCallPlans,
  findSubArea,
  getCluster,
  generateCallPlan,
  getCallPlansV2
} from "../../actions/call_plan";
import { IconDownload, IconUpload } from "../../components/Icons";
import {
  NotAuthorize,
  SelectAsync,
  LoadingDots,
  Pagination,
  ModalAction,
  DatePicker,
  ModalExportCallPlan,
  ModalRegenerateCallPlan,
} from "../../components";
import { ind, en } from "../../languages/call_plan";
import { Modal } from "reactstrap";

const style = {
  link: {
    cursor: "pointer",
  },
};

class Index extends React.Component {
  state = {
    id: "",
    date: "",
    to: "",
    cluster: "",
    sales_id: "",
    sales_phone: "",
    sales_name: "",
    sub_area: "",
    page: 1,
    listSubArea: [],
    listClusters: [],
    selectedFilter: true,
    languagesFilter: {},
    languagesTable: {},
    disabledStatusExport: false,
    buttonActionText: "Generate",
    confirmIsOpen: false,
    resultIsOpen: false,
    confirmText: "",
    resultText: "",
    type: "success",
    dateStatus: 0,

    // confirmIsOpen2: false,
    textSuccess2: "",
    textError2: "",
    type2: "success",

    exportIsOpen: false,

    regenerateIsOpen: false,
  };

  componentDidMount() {
    document.title = "SFA OTTO - Call Plan";

    if (this.props.auth.language === "in") {
      this.setState({ languagesFilter: ind.filter, languagesTable: ind.table });
    } else if (this.props.auth.language === "en") {
      this.setState({ languagesFilter: en.filter, languagesTable: en.table });
    }
    this.fetchCallPlan(window.location.search);

    this.props.findSubArea(null).then((data) => {
      let newSubArea = [];
      data.data.forEach((subarea) => {
        newSubArea.push({ value: subarea.id, label: `${subarea.name}` });
      });

      this.setState({ listSubArea: newSubArea });
    });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchCallPlan(this.props.location.search);
    }
  }

  fetchCallPlan = (pageNumber) => {
    const {
      id,
      sales_id,
      sales_phone,
      sales_name,
      cluster,
      date,
      to,
      sub_area,
    } = this.state;
    let page = "?page=1";
    let timeTo = "";
    var dateFrom = "";
    var dateTo = "";

    if (to !== "" || date !== "") {
      timeTo = to.slice(17, 19).replace("00", "59");
      timeTo = to.slice(0, 17).concat("", timeTo);
      dateFrom = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
      dateTo = moment(timeTo, "DD-MM-YYYY").format("YYYY-MM-DD");
    }

    if (pageNumber) {
      page = pageNumber.includes("page") ? pageNumber : "?page=1";
    }

    this.props.getCallPlansV2(
      {
        id,
        sales_id,
        sales_phone,
        sales_name,
        cluster: cluster.label,
        date: dateFrom,
        to: dateTo,
        sub_area: sub_area.label,
      },
      page
    );
  };

  filterCallPlan() {
    const {
      id,
      sales_id,
      sales_phone,
      sales_name,
      cluster,
      date,
      to,
      sub_area,
    } = this.state;
    let page = "?page=1";
    let timeTo = "";
    let timeFrom = "";

    if (to !== "" || date !== "") {
      timeTo = to.slice(17, 19).replace("00", "59");
      timeTo = to.slice(0, 17).concat("", timeTo);
      timeTo = moment(timeTo, "DD-MM-YYYY").format("YYYY-MM-DD");
      timeFrom = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
    }

    this.props.getCallPlansV2(
      {
        id,
        sales_id,
        sales_phone,
        sales_name,
        cluster: cluster.label,
        date: timeFrom,
        to: timeTo,
        sub_area: sub_area.label,
      },
      page
    );
  }

  // exportCallplan = () => {
  //   const { date, to, cluster, sales_id, sales_phone, sales_name, sub_area} = this.state
  //   let dateFrom = ''
  //   let dateTo = ''
  //   if (to !== "" || date !== "" ) {
  //     dateFrom = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  //     dateTo = moment(to, 'DD-MM-YYYY').format('YYYY-MM-DD')
  //   }

  //   axios.post(NEWAPI_CALL_PLAN + `/call_plan/export`, { date: dateFrom, to: dateTo, cluster: cluster.label, sales_id, sales_phone, sales_name, sub_area: sub_area.label, limit: 100000})
  // 		.then(data => {
  //       this.setState({disabledStatusExport: false})
  //       if(data.data.meta.status === false){
  //         this.setState({confirmIsOpen2: true, type2: 'error', textError2: data.data.meta.message})
  //       }else{
  //         this.setState({confirmIsOpen2: true, type2: 'success', textSuccess2: data.data.meta.message})
  //       }
  //   });
  // }

  dateValidate() {
    const { date, to } = this.state;

    if (date && to) {
      var dateFrom = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
      var dateTo = moment(to, "DD-MM-YYYY").format("YYYY-MM-DD");
      var date1 = new Date(dateFrom);
      var date2 = new Date(dateTo);
      // To calculate the time difference of two dates
      var Difference_In_Time = date2.getTime() - date1.getTime();
      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      if (Difference_In_Days > 31) {
        this.state.dateStatus = 1;
      } else {
        this.state.dateStatus = 0;
        this.filterCallPlan();
      }
    } else if (date && !to) {
      this.state.dateStatus = 2;
    } else if (!date && to) {
      this.state.dateStatus = 3;
    } else {
      this.filterCallPlan();
    }
  }

  filterSubArea = debounce((inputValue) => {
    if (inputValue.length > 0) {
      this.props.findSubArea(inputValue).then((data) => {
        let newSubArea = [];
        data.data.forEach((subarea) => {
          newSubArea.push({ value: subarea.id, label: `${subarea.name}` });
        });

        this.setState({ listSubArea: newSubArea });
      });
    }
  });

  filterCluster = debounce((key, id) => {
    // if(inputValue.length > 0){
    this.props.getCluster(key, id).then((data) => {
      let newCluster = [];
      data.data.forEach((cluster) => {
        newCluster.push({ value: cluster.id, label: `${cluster.name}` });
      });

      this.setState({ listClusters: newCluster });
    });
    // }
  });

  render() {
    const { auth, history, call_plan, generateCallPlan } = this.props;
    const {
      sales_id,
      sales_phone,
      sales_name,
      cluster,
      type,
      date,
      to,
      sub_area,
      listSubArea,
      listClusters,
      selectedFilter,
      languagesFilter,
      languagesTable,
      confirmIsOpen,
      resultIsOpen,
      confirmText,
      resultText,
      buttonActionText,
      dateStatus,
      // confirmIsOpen2,
      // textSuccess2,
      // textError2,
      // type2,
      exportIsOpen,
      regenerateIsOpen,
    } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["attendance_history"] === "" ||
        auth.authority["attendance_history"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    return (
      <div className="container">
        <div className="row">
          {/* <ModalConfirm
            confirmIsOpen={confirmIsOpen2}
            confirmClose={() => this.setState({confirmIsOpen2: false, loading: false})}
            confirmSuccess={() => this.setState({confirmIsOpen2: false})}
            textSuccess={textSuccess2}
            textError={textError2}
            type={type2}
          /> */}

          <ModalAction
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmText={confirmText}
            resultText={resultText}
            confirmClose={() => this.setState({ confirmIsOpen: false })}
            resultClose={() => this.setState({ resultIsOpen: false })}
            buttonActionText={buttonActionText}
            confirmYes={() => {
              this.setState(
                { confirmIsOpen: false, confirmText: confirmText },
                () => {
                  generateCallPlan()
                    .then((data) => {
                      if (data.meta.status === false) {
                        this.setState({
                          resultIsOpen: true,
                          type: "error",
                          resultText: data.meta.message,
                        });
                      } else {
                        this.setState(
                          {
                            resultIsOpen: true,
                            type: "success",
                            resultText: data.meta.message,
                            status: "",
                          },
                          () => this.fetchCallPlan()
                        );
                      }
                    })
                    .catch((e) => {
                      this.setState({
                        resultIsOpen: true,
                        type: "error",
                        resultText: "Generate Call Plan Gagal.",
                      });
                    });
                }
              );
            }}
          />

          <Modal
            className="modal-confirmation d-flex align-items-center justify-content-center"
            size="sm"
            isOpen={exportIsOpen}
            toggle={() => this.setState({ exportIsOpen: false })}
          >
            <ModalExportCallPlan
              history={history}
              state={this.state}
              exportIsOpen={() => this.setState({ exportIsOpen: false })}
            />
          </Modal>

          <Modal
            className="modal-confirmation d-flex align-items-center justify-content-center"
            size="sm"
            isOpen={regenerateIsOpen}
            toggle={() => this.setState({ regenerateIsOpen: false })}
          >
            <ModalRegenerateCallPlan
              history={history}
              state={this.state}
              exportIsOpen={() => this.setState({ regenerateIsOpen: false })}
              toggle={() => this.setState({ regenerateIsOpen: false })}
            />
          </Modal>

          <div className="col-12">
            <h2>{languagesFilter.header}</h2>
            <div className="actions d-flex justify-content-end mb-3">
              <div
                className="btn-toolbar"
                role="toolbar"
                aria-label="Toolbar with button groups"
              >
                <div
                  className="btn-group mr-2"
                  role="group"
                  aria-label="Second group"
                >
                  <button
                    className="btn btn-link btn-outline-danger text-danger btn-rounded"
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => this.setState({ exportIsOpen: true })}
                  >
                    <IconDownload />
                    Export
                  </button>
                </div>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Third group"
                >
                  <button
                    className="btn btn-danger btn-rounded"
                    onClick={() =>
                      this.setState({
                        regenerateIsOpen: true,
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-clockwise"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                      />
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                    </svg>
                    Generate Call Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  {selectedFilter ? (
                    <div className="col-12 my-3">
                      <div className="row">
                        <div className="col-12 col-lg-6">
                          <div className="form-inline">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.id}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter">
                              <input
                                type="text"
                                name="ID"
                                className="form-control form-control-line w-30"
                                placeholder={languagesFilter.pId}
                                onChange={(e) => {
                                  this.setState({
                                    sales_id: e.target.value.toString(),
                                  });
                                }}
                                value={sales_id}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline">
                            <div className="col-lg-5">
                              <button
                                type="submit"
                                className="btn btn-danger w-100"
                                onClick={() => {
                                  this.filterCallPlan();
                                }}
                              >
                                {languagesFilter.search}
                              </button>
                            </div>
                            <div className="col-lg-4 input-action">
                              <Link to={`?page=1`} aria-label="Previous">
                                <button
                                  className="btn btn-link text-danger"
                                  onClick={() => {
                                    this.setState(
                                      { selectedFilter: false, sales_id: "" },
                                      () => this.fetchCallPlan()
                                    );
                                  }}
                                >
                                  {languagesFilter.more}
                                </button>
                              </Link>
                            </div>
                            <div className="col-3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12">
                      <div className="row mt-2">
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-2">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.id}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter ml-7">
                              <input
                                type="text"
                                name="id"
                                className="form-control form-control-line w-30"
                                placeholder={languagesFilter.pId}
                                onChange={(e) => {
                                  this.setState({ sales_id: e.target.value });
                                }}
                                value={sales_id}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-2">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.salesName}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter ml-7">
                              <input
                                type="text"
                                name="sales_name"
                                className="form-control form-control-line w-30"
                                placeholder={languagesFilter.pSalesName}
                                onChange={(e) => {
                                  this.setState({ sales_name: e.target.value });
                                }}
                                value={sales_name}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-2">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.dateTime}
                              </label>
                            </div>
                            <div className="col-sm-4 input-filter">
                              <DatePicker
                                handleChange={(date) =>
                                  this.setState({ date, dateStatus: 0 })
                                }
                                value={date}
                              />
                            </div>
                            <div className="d-flex ml-4 mr-1">
                              <label className="col-form-label">
                                {languagesFilter.to}
                              </label>
                            </div>
                            <div className="col-sm-4 input-filter">
                              <DatePicker
                                handleChange={(to) =>
                                  this.setState({ to, dateStatus: 0 })
                                }
                                value={to}
                                required
                              />
                            </div>
                          </div>
                          {(dateStatus === 1 ||
                            dateStatus === 2 ||
                            dateStatus === 3) && (
                            <div className="form-inline my-2">
                              <div className="col-sm-3 d-flex"></div>
                              <div className="col-sm-9 input-filter">
                                {dateStatus === 1 ? (
                                  <small className="text-danger">
                                    Can't be greater than 31 days.
                                  </small>
                                ) : dateStatus === 2 ? (
                                  <small className="text-danger">
                                    To date can't be blank.
                                  </small>
                                ) : (
                                  <small className="text-danger">
                                    From date can't be blank.
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-2">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.subArea}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter ml-7">
                              {/* <SelectComponent options={types} initValue={type.label} handleChange={(type) => this.setState({type: type.value.toString()}) }
                            /> */}
                              <SelectAsync
                                initValue={sub_area}
                                options={listSubArea}
                                handleChange={(sub_area) => {
                                  this.filterCluster(null, sub_area.value);
                                  this.setState({ sub_area: sub_area });
                                }}
                                onInputChange={(value) => {
                                  this.filterSubArea(value);
                                }}
                                placeholder="Type Sub Area"
                                className="select-circle flex-fill"
                                classNamePrefix="select-circle-inner"
                              ></SelectAsync>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-2">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.salesPhone}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter ml-7">
                              <input
                                type="number"
                                name="sales_phone"
                                className="form-control form-control-line w-30"
                                placeholder={languagesFilter.pSalesPhone}
                                onChange={(e) => {
                                  if (
                                    isNaN(Number(e.target.value)) ||
                                    e.target.value.split("").length > 16
                                  ) {
                                    return;
                                  }
                                  this.setState({
                                    sales_phone: e.target.value,
                                  });
                                }}
                                value={sales_phone}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-2">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.cluster}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter ml-7">
                              {/* <SelectComponent 
                            options={clusters} initValue={cluster.label}
                            handleChange={(cluster) => this.setState({cluster: cluster.value.toString()}) }
                            /> */}
                              <SelectAsync
                                initValue={cluster}
                                options={listClusters}
                                handleChange={(cluster) =>
                                  this.setState({ cluster })
                                }
                                onInputChange={(value) => {
                                  this.filterCluster(value, sub_area.value);
                                }}
                                placeholder="Type Sub Area"
                                className="select-circle flex-fill"
                                classNamePrefix="select-circle-inner"
                              ></SelectAsync>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline mb-2">
                            <div className="col-sm-3 d-flex"></div>
                            <div className="col-lg-9 input-filter ml-7"></div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline">
                            <div className="col-3"></div>
                            <div className="col-lg-5">
                              <Link to={`?page=1`} aria-label="Previous">
                                <button
                                  type="submit"
                                  className="btn btn-danger w-100"
                                  onClick={() => {
                                    this.dateValidate();
                                  }}
                                >
                                  {languagesFilter.search}
                                </button>
                              </Link>
                            </div>
                            <div className="col-lg-4 input-action my-2">
                              <Link to={`?page=1`} aria-label="Previous">
                                <button
                                  className="btn btn-link text-danger"
                                  onClick={() => {
                                    this.setState(
                                      {
                                        selectedFilter: true,
                                        sales_id: "",
                                        id: "",
                                        sales_phone: "",
                                        sales_name: "",
                                        cluster: "",
                                        sub_area: "",
                                        date: "",
                                        to: "",
                                        dateStatus: 0,
                                      },
                                      () => this.fetchCallPlan()
                                    );
                                  }}
                                >
                                  {languagesFilter.hide}
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="table-fixed">
                <table className="table table-header table-striped mb-0">
                  <thead>
                    <tr>
                      {/* <th width="2%"><input type="checkbox" /></th> */}
                      <th width="5%">{languagesTable.id}</th>
                      <th width="7%">{languagesTable.tId}</th>
                      <th width="10%">{languagesTable.tDateTime}</th>
                      <th width="12%">{languagesTable.tSalesPhone}</th>
                      <th width="20%">{languagesTable.tSalesName}</th>
                      <th width="12%">{languagesTable.tSubArea}</th>
                      <th width="12%">{languagesTable.tCluster}</th>
                      <th width="10%">{languagesTable.tSuccess}</th>
                      <th width="10%">{languagesTable.tEffective}</th>
                    </tr>
                  </thead>
                  {call_plan.loading ? (
                    <tbody>
                      <tr>
                        <td colSpan={9}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {call_plan.data !== undefined ||
                      call_plan.data.length > 0 ? (
                        call_plan.data.map((plan, idx) => {
                          return (
                            <tr key={idx}>
                              {/* <td>
                                <input type="checkbox" />
                              </td> */}
                              <td>
                                <Link
                                  to={`/call-plan/${plan.id}`}
                                  style={style.link}
                                >
                                  {plan.id}
                                </Link>
                              </td>
                              <td>{plan.sales_id}</td>
                              <td>
                                {moment(
                                  plan.call_plan_date,
                                  "YYYY-MM-DD"
                                ).format("DD-MM-YYYY")}
                              </td>
                              <td>{plan.sales_phone}</td>
                              <td>{plan.sales_name}</td>
                              <td>{plan.sub_area}</td>
                              <td>{plan.clusters}</td>
                              <td>
                                {plan.success_call
                                  ? plan.success_call + "%"
                                  : "0%"}
                              </td>
                              <td>
                                {plan.effective_call
                                  ? plan.effective_call + "%"
                                  : "0%"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center">
                            {languagesTable.tNoData}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )}
                  {/* {(call_plan.loading === false && call_plan.data === undefined || call_plan.data.length < 1) &&
                    <tbody>
                      <tr>
                        <td colSpan={9} className="text-center">{languagesTable.tNoData}</td>
                      </tr>
                    </tbody>
                  } */}
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination
                  pages={call_plan.meta}
                  routeName="call-plan"
                  handleClick={(pageNumber) => this.fetchCallPlan(pageNumber)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ auth, call_plan }) => ({ auth, call_plan }), {
  getCallPlans,
  getCluster,
  findSubArea,
  generateCallPlan,
  getCallPlansV2
})(Index);
