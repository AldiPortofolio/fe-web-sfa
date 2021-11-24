import React from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getActivityDetail,
  getCallplans,
  getTodolist,
} from "../../actions/salesman_activity";
import { getCategoryList } from "../../actions/category_list";
import {
  Lightbox,
  Pagination,
  LoadingDots,
  NotAuthorize,
  SelectComponent,
} from "../../components";
import axios from "../../actions/config";
import moment from "moment";
import dataJson from "./data-detail.json";
import { IconSearch } from "../../components/Icons";
import CurrencyFormat from "react-currency-format";
import "moment/locale/id";

const style = {
  link: {
    cursor: "pointer",
  },
};

const statuses = [
  { value: "", label: "All" },
  { value: "Open", label: "Open" },
  { value: "Done", label: "Done" },
  { value: "Pending", label: "Pending" },
  { value: "Not Exist", label: "Not Exist" },
  { value: "Verified", label: "Verified" },
  { value: "Reject", label: "Reject" },
  { value: "Late", label: "Late" },
];

const callplanStatuses = [
  { value: "", label: "All" },
  { value: "Visited", label: "Visited" },
  { value: "Completed", label: "Completed" },
];

class Detail extends React.Component {
  state = {
    detail: {},
    callplan: [],
    todolist: [],
    sales_name: "",
    photo_sales: "",
    phone_number: "",
    id: "",
    sales_type: "",
    subarea: "",
    akusisi: "",
    noo: "",
    todolist: "",
    success_call: "",
    total_call: "",
    amount: "",
    date: "",

    confirmIsOpen: false,
    expandCard: false,
    type: "success",
    textSuccess: "",
    textError: "",
    isOpen: false,
    isOpen2: false,

    todoListCount: 0,
    keywordTodoList: "",
    kategoriTodolist: "",
    statusTodolist: "",

    callplanCount: 0,
    keywordCallplan: "",
    kategoriCallplan: "",
    statusCallplan: "",
  };

  componentWillMount() {
    document.title = "SFA OTTO - Detail Sales";

    const {
      auth: { access_token },
      getActivityDetail,
      getTodolist,
      getCallplans,
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    // let queryString = new URLSearchParams(this.props.location.search);
    let date = this.props.match.params.callPlanDate;

    this.setState({
      id: this.props.match.params.id,
      date: date,
    });

    const param = {
      id: this.props.match.params.id,
      date: date,
    };
    getActivityDetail(param).then((data) => {
      this.setState({
        detail: data.data,
      });
    });

    const paramTodolist = {
      category: 0,
      date: date,
      id: this.props.match.params.id,
      keyword: "",
      status: "",
      page: 1,
    };
    getTodolist(paramTodolist).then((data) => {
      this.setState({
        todolist: data,
        todoListCount: data.data.length,
      });
    });

    getCallplans(paramTodolist).then((data) => {
      this.setState({
        callplan: data,
        callplanCount: data.data.length,
      });
    });

    this.props.getCategoryList("All");
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchTodolist(this.props.location.search);
      this.fetchCallPlan(window.location.search);
    }
  }

  filterTodolist = (e) => {
    e.preventDefault();
    const { keywordTodoList, statusTodolist, kategoriTodolist, date } =
      this.state;
    this.props
      .getTodolist({
        category: kategoriTodolist ? parseInt(kategoriTodolist) : 0,
        date: date,
        id: this.props.match.params.id,
        keyword: keywordTodoList,
        status: statusTodolist,
        page: 1,
      })
      .then((data) => {
        this.setState({
          todolist: data,
          todoListCount: data.data.length,
        });
      });
  };

  filterCallplan = (e) => {
    e.preventDefault();
    const { keywordCallplan, statusCallplan, kategoriCallplan, date } =
      this.state;
    this.props
      .getCallplans({
        category: kategoriCallplan ? parseInt(kategoriCallplan) : 0,
        date: date,
        id: this.props.match.params.id,
        keyword: keywordCallplan,
        status: statusCallplan,
        page: 1,
      })
      .then((data) => {
        this.setState({
          callplan: data,
          callplanCount: data.data.length,
        });
      });
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
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

  renderStatus(param) {
    switch (param) {
      case "Not Exist":
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#F0F3F5",
              color: "#859DAD",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
      case "Done":
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#EEFBF7",
              color: "#2CC995",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
      case "Pending":
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#FDF6ED",
              color: "#E89634",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
      case "Verified":
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#EBF7FF",
              color: "#056EB5",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
      case "Reject":
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#FDEDED",
              color: "#E93535",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
      default:
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#EEFBF7",
              color: "#2CC995",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
    }
  }

  renderStatusCallplan(param) {
    switch (param) {
      case "Incompleted":
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#F0F3F5",
              color: "#859DAD",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
      case "Completed":
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#EEFBF7",
              color: "#2CC995",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
      case "Visited":
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#FDF6ED",
              color: "#E89634",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
      default:
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#EEFBF7",
              color: "#2CC995",
              borderRadius: "0px",
            }}
          >
            {param}
          </span>
        );
    }
  }

  render() {
    const { auth, category_list } = this.props;
    const {
      detail,
      todolist,
      callplan,
      isOpen,
      isOpen2,
      todoListCount,
      keywordTodoList,
      kategoriTodolist,
      statusTodolist,
      callplanCount,
      keywordCallplan,
      kategoriCallplan,
      statusCallplan,
      id,
    } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["call_plan"] === "" ||
        auth.authority["call_plan"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    moment().locale("id");
    const date = moment(
      this.props.match.params.callPlanDate,
      "YYYY-MM-DD"
    ).format("DD MMM YYYY");

    return (
      detail && (
        <div className="container mb-5 noSelect">
          <div className="row">
            <div className="col-12 mb-1">
              <div className="col-12 mb-5">
                <h2>Detail Aktivitas Salesman ({date})</h2>
              </div>
              {/* <div className="row"> */}
              <div className="col-12 mb-3">
                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <div className="card-body">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-9 p-0 text-center d-flex flex-row align-items-center">
                          <div className="avatar mr-3 d-flex justify-content-center align-items-center">
                            {detail.photo === "" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-user"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            ) : (
                              <img
                                onClick={() => this.setState({ isOpen: true })}
                                src={detail.photo}
                                className="avatar justify-content-center align-items-center pointerYes"
                                alt=""
                              />
                            )}
                            <Lightbox
                              isOpen={isOpen}
                              images={detail.photo}
                              confirmClose={() =>
                                this.setState({ isOpen: false })
                              }
                            />
                          </div>
                          <div className="d-flex flex-column align-items-start">
                            <p className="mb-0">
                              <strong>{detail.name}</strong>
                            </p>
                            <p className="mb-0 text-gray">
                              ID SFA: {detail.id}
                            </p>
                          </div>
                        </div>
                        {/* <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                                                <strong className="mb-0 text-primary"><small>{languages.status}</small></strong>
                                                <span className={`badge ${detail.sales_status === 'Unregistered' ? 'badge-gray' : 'badge-status'}`}>{detail.sales_status}</span>
                                            </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="card-body border-top">
                    <div className="col-12">
                      <div className="row">
                        <p className="">Informasi Salesman</p>
                      </div>
                      <div className="row">
                        <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Ho. Hp</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.phone_number}
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Sales Type</small>
                          </strong>
                          <p className="mb-0">{detail.sales_type}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>SubArea</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.villages}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mt-3 border-top">
                      <div className="row">
                        <p className=" mt-3">Informasi Kegiatan Harian</p>
                      </div>
                      <div className="row mb-2">
                        <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Akusisi</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.akusisi}</p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>NOO</small>
                          </strong>
                          <p className="mb-0">{detail.noo}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Todo List</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.todolist_count}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Success Call</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.success_callplan_count}
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Total Call</small>
                          </strong>
                          <p className="mb-0">{detail.total_callplan_count}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Success Callplan (%)</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.success_callplan_percentage
                              ? detail.success_callplan_percentage
                              : 0}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Amount</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            <CurrencyFormat
                              value={detail.amount}
                              thousandSeparator={"."}
                              decimalSeparator={","}
                              prefix={"Rp "}
                              displayType={"text"}
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <form className="form-inline" onSubmit={this.filterTodolist}>
                    <div className="card-body">
                      <h6>Todo List ({todoListCount})</h6>

                      <div className="row mt-3">
                        <div className="col-sm">
                          <p className="mb-2 text-dark-gray">
                            Apa yang dicari?
                          </p>
                          <div className="form-group input-action-2 mr-3 w-100">
                            <IconSearch />
                            <input
                              placeholder="Cari nama / MID / ID todo"
                              className="form-control form-control-line"
                              name="keywordTodoList"
                              value={keywordTodoList}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-sm">
                          <p className="mb-2 text-dark-gray">Ketegori</p>
                          <div className="ml-7">
                            <SelectComponent
                              options={category_list.data}
                              initValue={kategoriTodolist.label}
                              handleChange={(id) =>
                                this.setState({
                                  kategoriTodolist: id.value.toString(),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-sm">
                          <p className="mb-2 text-dark-gray">Status</p>
                          <div className="ml-7">
                            <SelectComponent
                              options={statuses}
                              initValue={statusTodolist.label}
                              handleChange={(status) =>
                                this.setState({ statusTodolist: status.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-sm">
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

                  <div className="table-fixed">
                    <table className="table table-header table-striped">
                      <thead>
                        <tr>
                          <th width="">#</th>
                          <th width="">Hari/Tanggal</th>
                          <th width="">Nama Merchant</th>
                          <th width="">MID</th>
                          <th width="">Merchant Type</th>
                          <th width="">ID Todo</th>
                          <th width="">Kategori</th>
                          <th width="">Status</th>
                          <th width=""></th>
                        </tr>
                      </thead>
                      {/* {detail.Todolist.loading ?
                                            <tbody>
                                                <tr>
                                                <td colSpan={9}>
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <LoadingDots color="black" />
                                                    </div>
                                                </td>
                                                </tr>
                                            </tbody>
                                            : */}
                      <tbody>
                        {todolist.data &&
                          todolist.data.map((value, idx) => {
                            const date = moment(
                              value.date,
                              "YYYY-MM-DD"
                            ).format("ddd, DD MMM YYYY");
                            return (
                              <tr key={idx}>
                                <td>{idx + 1}</td>

                                <td className="text-capitalize">{date}</td>
                                <td className="text-capitalize">
                                  {value.merchant_name}
                                </td>
                                <td className="text-capitalize">{value.mid}</td>
                                <td className="text-capitalize">
                                  {value.merchant_type_name}
                                </td>
                                <td>{value.id}</td>
                                <td className="text-capitalize">
                                  {value.category}
                                </td>
                                <td className="text-capitalize">
                                  {this.renderStatus(value.status)}
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-rounded-2 btn-more-new"
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
                                        to={`/activities/${this.props.match.params.id}/todo-list/${value.id}`}
                                        className="dropdown-item"
                                        style={style.link}
                                      >
                                        Lihat Detail
                                      </Link>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                      {/* }
                                        {(!detail.Todolist.loading && isEmpty(detail.Todolist.data)) &&
                                            <tbody>
                                                <tr>
                                                    <td colSpan={9} className="text-center">Tidak Ada Data</td>
                                                </tr>
                                            </tbody>
                                        } */}
                    </table>
                  </div>

                  <div className="card-body border-top">
                    <Pagination
                      pages={todolist.meta}
                      routeName={`call-plan/${detail.call_plan_id}`}
                      maxRaw="15"
                      handleClick={(pageNumber) =>
                        this.fetchTodolist(pageNumber)
                      }
                    />
                  </div>
                </div>

                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <form className="form-inline" onSubmit={this.filterCallplan}>
                    <div className="card-body">
                      <h6>Call Plan ({callplanCount})</h6>
                      <div className="col-12 mt-3">
                        <div className="row">
                          <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                            <strong className="mb-0 text-gray">
                              <small>Coverage Area</small>
                            </strong>
                            <p className="mb-0 canSelect">
                              {detail.sub_area ? detail.sub_area : "-"}
                            </p>
                          </div>
                          <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                            <strong className="mb-0 text-gray">
                              <small>SAC</small>
                            </strong>
                            <p className="mb-0 canSelect">
                              {detail.sac ? detail.sac : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-sm-5">
                          <p className="mb-2 text-dark-gray">
                            Apa yang dicari?
                          </p>
                          <div className="form-group input-action-2 mr-3 w-100">
                            <IconSearch />
                            <input
                              placeholder="Cari nama / MID"
                              className="form-control form-control-line"
                              name="keywordCallplan"
                              value={keywordCallplan}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <p className="mb-2 text-dark-gray">Status</p>
                          <div className="ml-7">
                            <SelectComponent
                              options={callplanStatuses}
                              initValue={statusCallplan.label}
                              handleChange={(status) =>
                                this.setState({ statusCallplan: status.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-sm">
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

                  <div className="table-fixed">
                    <table className="table table-header table-striped">
                      <thead>
                        <tr>
                          <th width="5%">#</th>
                          <th width="">Hari/Tanggal</th>
                          <th width="">Nama Merchant</th>
                          <th width="">MID</th>
                          <th width="">Merchant Type</th>
                          <th width="">Status Merchant</th>
                          <th width="">Kelurahan</th>
                          <th width="">Status</th>
                          <th width=""></th>
                        </tr>
                      </thead>
                      {/* {detail.call_plan.loading ?
                                            <tbody>
                                                <tr>
                                                <td colSpan={9}>
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <LoadingDots color="black" />
                                                    </div>
                                                </td>
                                                </tr>
                                            </tbody>
                                            : */}
                      <tbody>
                        {callplan.data &&
                          callplan.data.map((value, idx) => {
                            const date = moment(
                              value.action_date,
                              "YYYY-MM-DD"
                            ).format("ddd, DD MMM YYYY");
                            return (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td className="text-capitalize">{date}</td>
                                <td className="text-capitalize">
                                  {value.merchant_name
                                    ? value.merchant_name
                                    : "-"}
                                </td>
                                <td className="text-capitalize">
                                  {value.mid ? value.mid : "-"}
                                </td>
                                <td className="text-capitalize">
                                  {value.merchant_status
                                    ? value.merchant_status
                                    : "-"}
                                </td>
                                <td className="text-capitalize">
                                  {value.merchant_type_name
                                    ? value.merchant_type_name
                                    : "-"}
                                </td>
                                <td className="text-capitalize">
                                  {value.kelurahan ? value.kelurahan : "-"}
                                </td>
                                <td className="text-capitalize">
                                  {this.renderStatusCallplan(value.status)}
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-circle btn-more dropdown-toggle"
                                      type="button"
                                      onClick={() =>
                                        this.toggleDropdown(
                                          `showCallplan${value.id}`
                                        )
                                      }
                                      onBlur={() =>
                                        this.hide(`showCallplan${value.id}`)
                                      }
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
                                        this.state[`showCallplan${value.id}`]
                                          ? "show"
                                          : ""
                                      }`}
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <Link
                                        to={`/activities/${id}/call-plan/${value.id}`}
                                        className="dropdown-item"
                                        style={style.link}
                                      >
                                        Lihat Detail
                                      </Link>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                      {/* }
                                        {(!detail.Todolist.loading && isEmpty(detail.Todolist.data)) &&
                                            <tbody>
                                                <tr>
                                                    <td colSpan={9} className="text-center">Tidak Ada Data</td>
                                                </tr>
                                            </tbody>
                                        } */}
                    </table>
                  </div>

                  <div className="card-body border-top">
                    <Pagination
                      pages={callplan.meta}
                      routeName={`call-plan/${detail.call_plan_id}`}
                      maxRaw="10"
                      handleClick={(pageNumber) =>
                        this.fetchMerchant(pageNumber)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 mb-0">
                <hr className="content-hr" />
                <div className="col-12 row">
                  <div className="col-12 row form-inline">
                    <div className="col-lg-10 row">
                      <Link to="/activities" className="btn btn-default w-20">
                        Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      )
    );
  }
}

export default connect(
  ({ auth, todolist, category_list }) => ({ auth, todolist, category_list }),
  {
    getActivityDetail,
    getTodolist,
    getCallplans,
    getCategoryList,
  }
)(Detail);
