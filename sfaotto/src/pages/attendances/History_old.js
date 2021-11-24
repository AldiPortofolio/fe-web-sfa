import React from "react";
import { debounce, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import {
  getAttendHistory,
  getAttendHistoryV2,
} from "../../actions/attendance_history";
import { IconDownload } from "../../components/Icons";
import {
  NotAuthorize,
  DateTime,
  SelectComponent,
  LoadingDots,
  Pagination,
} from "../../components";
import { ind, en } from "../../languages/attendance_history";
import axios from "../../actions/config";
import { NEWAPI } from "../../actions/constants";

const style = {
  link: {
    cursor: "pointer",
  },
};

var dateNow = new Date();
var dateNow2 = moment(dateNow, "DDMMYYYY");
dateNow2 = dateNow2.format("DDMMYYYY");

// const types = [
//   { value: '0', label: 'All'},
//   { value: '1', label: 'In'},
//   { value: '2', label: 'Out'}
// ]

const initState = {
  id: "",
  sales_id: "",
  sales_phone: "",
  sales_name: "",
  category: "",
  type: "",
  date_from: "",
  date_to: "",
  notes: "",
  keyword: "",
  selectedFilter: true,
  languagesFilter: {},
  languagesTable: {},
  disabledStatusExport: false,
};

class Manage extends React.Component {
  state = initState;

  componentDidMount() {
    document.title = "SFA OTTO - Sales Attendance";

    if (this.props.auth.language === "in") {
      this.setState({ languagesFilter: ind.filter, languagesTable: ind.table });
    } else if (this.props.auth.language === "en") {
      this.setState({ languagesFilter: en.filter, languagesTable: en.table });
    }
    this.fetchAttendance(window.location.search);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchAttendance(this.props.location.search);
    }
  }

  fetchAttendance = (pageNumber) => {
    const {
      id,
      sales_phone,
      sales_name,
      category,
      type,
      date_from,
      date_to,
      notes,
    } = this.state;
    let page = "?page=1";
    let timeTo = "";

    if (date_to !== null || date_from !== null) {
      timeTo = date_to.slice(17, 19).replace("00", "59");
      timeTo = date_to.slice(0, 17).concat("", timeTo);
    }

    let pages = 0;
    if (pageNumber) {
      page = pageNumber.includes("page") ? pageNumber : "?page=1";
      pages = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getAttendHistoryV2(
      {
        id,
        sales_phone,
        sales_name,
        category,
        type,
        date_from,
        date_to: timeTo,
        notes,
        page: parseInt(pages),
      },
      page
    );
  };

  filterAttendHistory = debounce(() => {
    const {
      id,
      sales_phone,
      sales_name,
      category,
      type,
      date_from,
      date_to,
      notes,
    } = this.state;
    let page = "?page=1";
    let timeTo = "";

    if (date_to !== null || date_from !== null) {
      timeTo = date_to.slice(17, 19).replace("00", "59");
      timeTo = date_to.slice(0, 17).concat("", timeTo);
    }

    this.props.getAttendHistoryV2(
      {
        id,
        sales_phone,
        sales_name,
        category,
        type,
        date_from,
        date_to: timeTo,
        notes,
      },
      page
    );
  }, 350);

  export = () => {
    const {
      id,
      sales_phone,
      sales_name,
      category,
      type,
      date_from,
      date_to,
      notes,
    } = this.state;
    axios
      .post(NEWAPI + `/attendances/export`, {
        id,
        sales_phone,
        sales_name,
        category,
        type,
        date_from,
        date_to,
        notes,
        limit: 100000,
      })
      .then((response) => {
        this.setState({ disabledStatusExport: false });
        const bstr = atob(response.data.data);
        const byteNumbers = new Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
          byteNumbers[i] = bstr.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: "file/csv" });

        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "export_data_attendance_history_" + dateNow2 + ".csv";
        a.click();
      });
  };

  render() {
    const { auth, attendance_history, getAttendHistory } = this.props;
    const {
      id,
      sales_phone,
      sales_name,
      category,
      type,
      date_from,
      date_to,
      notes,
      selectedFilter,
      languagesFilter,
      languagesTable,
      disabledStatusExport,
    } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["attendance_history"] === "" ||
        auth.authority["attendance_history"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    const types = [
      { value: "0", label: languagesFilter.all },
      { value: "1", label: languagesFilter.in },
      { value: "2", label: languagesFilter.out },
    ];

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>{languagesFilter.header}</h2>
            <div className="actions d-flex justify-content-end mb-3">
              <button
                className="btn btn-link text-danger"
                disabled={disabledStatusExport}
                onClick={() =>
                  this.setState({ disabledStatusExport: true }, () =>
                    this.export()
                  )
                }
              >
                <IconDownload />
                Export
              </button>
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
                              <label className="col-form-label">ID</label>
                            </div>
                            <div className="col-lg-9 input-filter">
                              <input
                                type="text"
                                name="ID"
                                className="form-control form-control-line w-30"
                                placeholder={languagesFilter.pId}
                                onChange={(e) => {
                                  this.setState({
                                    id: e.target.value.toString(),
                                  });
                                }}
                                value={id}
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
                                  this.filterAttendHistory();
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
                                    this.setState({
                                      selectedFilter: false,
                                      sales_id: "",
                                    });
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
                                  this.setState({ id: e.target.value });
                                }}
                                value={id}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-2">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.type}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter ml-7">
                              <SelectComponent
                                options={types}
                                initValue={type.label}
                                handleChange={(type) =>
                                  this.setState({ type: type.value.toString() })
                                }
                              />
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
                                {languagesFilter.notes}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter ml-7">
                              <input
                                type="text"
                                name="notes"
                                className="form-control form-control-line w-20"
                                placeholder={languagesFilter.pNotes}
                                onChange={(e) => {
                                  this.setState({ notes: e.target.value });
                                }}
                                value={notes}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-2">
                            <div className="col-sm-3 d-flex">
                              <label className="col-form-label">
                                {languagesFilter.category}
                              </label>
                            </div>
                            <div className="col-lg-9 input-filter ml-7">
                              <input
                                type="text"
                                name="category"
                                className="form-control form-control-line w-30"
                                placeholder={languagesFilter.pCategory}
                                onChange={(e) => {
                                  this.setState({ category: e.target.value });
                                }}
                                value={category}
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
                            <div className="col-sm-9 input-filter">
                              <DateTime
                                handleChange={(date_from) =>
                                  this.setState({ date_from })
                                }
                                value={date_from}
                                placeholder="from"
                              />
                            </div>
                            <div className="col-sm-3 d-flex my-2">
                              <label className="col-form-label"></label>
                            </div>
                            <div className="col-sm-9 input-filter my-2">
                              <DateTime
                                handleChange={(date_to) =>
                                  this.setState({ date_to })
                                }
                                value={date_to}
                                placeholder="to"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-inline my-4">
                            <div className="col-3"></div>
                            <div className="col-lg-5">
                              <Link to={`?page=1`} aria-label="Previous">
                                <button
                                  type="submit"
                                  className="btn btn-danger w-100"
                                  onClick={() => {
                                    this.filterAttendHistory();
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
                                        category: "",
                                        type: "",
                                        date_from: "",
                                        date_to: "",
                                        notes: "",
                                      },
                                      () =>
                                        getAttendHistoryV2(
                                          this.state,
                                          "?page=1"
                                        )
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
                      <th width="5%">{languagesTable.tId}</th>
                      <th width="10%">{languagesTable.tSalesPhone}</th>
                      <th width="15%">{languagesTable.tSalesName}</th>
                      <th width="10%">{languagesTable.tCategory}</th>
                      <th width="10%">{languagesTable.tType}</th>
                      <th width="15%">{languagesTable.tDateTime}</th>
                      <th width="15%">{languagesTable.tNotes}</th>
                    </tr>
                  </thead>
                  {attendance_history.loading ? (
                    <tbody>
                      <tr>
                        <td colSpan={8}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {attendance_history.data &&
                        attendance_history.data.map((history, idx) => {
                          // let salesStatus
                          // let attend_category_type2

                          // if (history.attend_category_type === '0') {
                          //   this.attend_category_type2 = languagesFilter.all
                          // }

                          return (
                            <tr key={idx}>
                              {/* <td>
                              <input type="checkbox" />
                            </td> */}
                              {/* <td className="text-capitalize">{history.id}</td> */}
                              <td>
                                <Link
                                  to={`/attendance/history/${history.id}`}
                                  style={style.link}
                                >
                                  {history.id}
                                </Link>
                              </td>
                              <td>{history.sales_phone}</td>
                              <td>{history.sales_name}</td>
                              <td>{history.attend_category}</td>
                              <td>
                                {history.attend_category_type === "0"
                                  ? languagesFilter.all
                                  : history.attend_category_type === "1"
                                  ? languagesFilter.in
                                  : history.attend_category_type === "2"
                                  ? languagesFilter.out
                                  : history.attend_category_type}
                              </td>
                              <td>
                                {moment(
                                  history.date,
                                  "YYYY-MM-DD, HH:mm"
                                ).format("DD-MM-YYYY, HH:mm")}
                              </td>
                              <td>{history.notes || "-"}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  )}
                  {!attendance_history.loading &&
                    isEmpty(attendance_history.data) && (
                      <tbody>
                        <tr>
                          <td colSpan={8} className="text-center">
                            {languagesTable.tNoDate}
                          </td>
                        </tr>
                      </tbody>
                    )}
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination
                  pages={attendance_history.meta}
                  routeName="attendance/history"
                  handleClick={(pageNumber) => this.fetchAttendance(pageNumber)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ auth, attendance_history }) => ({ auth, attendance_history }),
  { getAttendHistory, getAttendHistoryV2 }
)(Manage);
