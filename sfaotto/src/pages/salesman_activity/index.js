import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { getActivities } from "../../actions/salesman_activity";
import { getSalesTypeList } from "../../actions/sales_type";
import { IconDownload, IconUpload, IconSearch } from "../../components/Icons";
import {
  NotAuthorize,
  SelectAsync,
  LoadingDots,
  Pagination,
  ModalAction,
  DatePicker,
  SelectComponent,
  DatePickerNew,
  DatePickerSelect,
  ModalConfirm,
} from "../../components";
import { Modal } from "reactstrap";
import "moment/locale/id";

const style = {
  link: {
    cursor: "pointer",
  },
};

class Index extends React.Component {
  state = {
    id: "",
    date: "",
    sales_name: "",
    phone_number: "",
    akuisisi: 0,
    sales_type: "",
    noo: 0,
    todolist: 0,
    success_call: 0,
    total_call: 0,
    date_from: "",
    date_to: "",
    dateStatus: 0,
    selectedFilter: true,
    disabledStatusExport: false,
    keyword: "",

    confirm: false,
    typeConfirm: "error",
    textSuccessConfirm: "",
    textErrorConfirm: "Filter tidak bisa lebih dari 2 bulan / 60 hari",

    maxDate: "",
  };

  componentWillMount() {
    document.title = "SFA OTTO - Activity Salesman List";
    this.fetchActivityList(window.location.search);
    this.props.getSalesTypeList();
  }

  componentDidUpdate(prevProps, nextProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchActivityList(this.props.location.search);
    }
  }

  fetchActivityList = (pageNumber) => {
    const { keyword, date_to, date_from, sales_type } = this.state;

    let page = "1";
    if (pageNumber) {
      page = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getActivities({
      keyword: keyword,
      sales_type_id: sales_type ? sales_type.value.toString() : "",
      period_from: date_from,
      period_to: date_to,
      page: parseInt(page),
    });
  };

  filterActivities = (e) => {
    e.preventDefault();
    const { keyword, sales_type, date_from, date_to } = this.state;

    this.props.getActivities({
      keyword: keyword,
      sales_type_id: sales_type ? sales_type.value.toString() : "",
      period_from: date_from,
      period_to: date_to,
      page: 1,
    });
  };

  toggleDropdown(toggle) {
    let obj = {};
    obj[toggle] = !this.state[toggle];
    this.setState(obj);
  }

  hide(toggle) {
    setTimeout(() => {
      let obj = {};
      obj[toggle] = false;
      this.setState(obj);
    }, 200);
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  render() {
    const { auth, activities, sales_types } = this.props;
    const {
      id,
      phone_number,
      sales_name,
      sales_type,
      date_from,
      date_to,
      task_date_end,
      noo,
      akuisisi,
      todolist,
      success_call,
      total_call,
      dateStatus,
      selectedFilter,
      disabledStatusExport,
      keyword,

      confirm,
      typeConfirm,
      textSuccessConfirm,
      textErrorConfirm,
      maxDate,
    } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["call_value"] === "" ||
        auth.authority["call_value"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    return (
      <>
        <ModalConfirm
          confirmIsOpen={confirm}
          type={typeConfirm}
          confirmClose={() => this.setState({ confirm: false })}
          confirmSuccess={() => this.setState({ confirm: false })}
          textSuccess={textSuccessConfirm}
          textError={textErrorConfirm}
        />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2>Aktivitas Salesman</h2>
              <div className="actions d-flex justify-content-end mb-3">
                <div
                  className="btn-toolbar"
                  role="toolbar"
                  aria-label="Toolbar with button groups"
                ></div>
              </div>
            </div>

            <div className="col-12 mb-4" style={{ borderRadius: "15px" }}>
              <div className="card noSelect" style={{ borderRadius: "15px" }}>
                <div className="card-body pb-0">
                  <div className="mb-4 mt-2 text-dark-gray">
                    <h5>Daftar Aktivitas Salesman</h5>
                  </div>
                  <form
                    className="form-inline"
                    onSubmit={this.filterActivities}
                  >
                    <div className="col-12 p-0">
                      <div className="row">
                        <div className="col-lg-4">
                          <p className="mb-2 text-dark-gray">
                            Apa yang dicari?
                          </p>
                          <div className="form-group input-action-2 mr-3 w-100">
                            <IconSearch />
                            <input
                              placeholder="Cari nama / ID Sales / nomor HP"
                              className="form-control form-control-line"
                              name="keyword"
                              value={keyword}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <p className="mb-2 text-dark-gray">Tipe Sales</p>
                          <div className="ml-7">
                            <SelectComponent
                              options={sales_types.data}
                              initValue={sales_type}
                              handleChange={(sales_type) =>
                                this.setState({ sales_type })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <p className="mb-2 text-dark-gray">Periode Tanggal</p>
                          <div className="d-flex">
                            <DatePickerSelect
                              placeholder="01/01/2021"
                              handleChange={(date_from) => {
                                const maxDate = moment(date_from, "YYYY-MM-DD")
                                  .add(60, "days")
                                  .format("YYYY-MM-DD");
                                this.setState({ date_from, maxDate });
                              }}
                              value={date_from}
                            />
                            <p className="my-2 mx-2 text-dark-gray">to</p>
                            <DatePickerSelect
                              placeholder="01/01/2021"
                              maxDate={maxDate}
                              handleChange={(date_to) =>
                                this.setState({ date_to })
                              }
                              value={date_to}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <button
                            type="submit"
                            className="btn btn-search w-100"
                            style={{}}
                            onClick={() => {
                              this.setState({ page: 1 }, () => {});
                            }}
                          >
                            Terapkan
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="table-fixed mt-4">
                  <table className="table table-header mb-0">
                    <thead className="thead-light">
                      <tr>
                        <th>#</th>
                        <th width="">Hari/Tanggal</th>
                        <th width="">ID Sales</th>
                        <th width="">Nama Sales</th>
                        <th width="">Tipe Sales</th>
                        <th width="">Nomor Hp</th>
                        <th width="">Akuisisi</th>
                        <th width="">NOO</th>
                        <th width="">Todo List</th>
                        <th width="">Success Call</th>
                        <th width="">Total Call</th>
                        <th width="">Success Call (%)</th>
                        <th width=""></th>
                      </tr>
                    </thead>
                    {activities.loading ? (
                      <tbody>
                        <tr>
                          <td colSpan={11}>
                            <div className="d-flex justify-content-center align-items-center">
                              <LoadingDots color="black" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {activities.data !== undefined ||
                        activities.data.length > 0 ? (
                          activities.data.map((value, idx) => {
                            moment().locale("id");
                            const date = moment(
                              value.action_date,
                              "YYYY-MM-DD"
                            ).format("ddd, DD MMM YYYY");
                            return (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{date}</td>
                                <td>{value.id}</td>
                                <td>{value.name}</td>
                                <td>{value.sales_type}</td>
                                <td>{value.phone_number}</td>
                                <td>{value.akusisi}</td>
                                <td>{value.noo}</td>
                                <td>{value.todolist_count}</td>
                                <td>{value.success_callplan_count}</td>
                                <td>{value.total_callplan_count}</td>
                                <td>
                                  {value.success_call
                                    ? `${value.success_call}%`
                                    : 0}
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-circle btn-more dropdown-toggle"
                                      type="button"
                                      onClick={() =>
                                        this.toggleDropdown(`show${idx}`)
                                      }
                                      onBlur={() => this.hide(`show${idx}`)}
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="19" cy="12" r="1"></circle>
                                        <circle cx="5" cy="12" r="1"></circle>
                                      </svg>
                                    </button>

                                    <div
                                      className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${
                                        this.state[`show${idx}`] ? "show" : ""
                                      }`}
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <Link
                                        to={`/activities/${
                                          value.id
                                        }/date/${moment(
                                          value.action_date,
                                          "YYYY-MM-DD"
                                        ).format("YYYY-MM-DD")}`}
                                        className="dropdown-item"
                                        style={style.link}
                                      >
                                        {" "}
                                        Detail Sales{" "}
                                      </Link>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={9} className="text-center">
                              No Data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </table>
                </div>
                <div className="card-body border-top">
                  <Pagination
                    pages={activities.meta}
                    routeName="activities"
                    handleClick={(pageNumber) =>
                      this.fetchActivityList(pageNumber)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  ({ auth, activities, sales_types }) => ({ auth, activities, sales_types }),
  {
    getActivities,
    getSalesTypeList,
  }
)(Index);
