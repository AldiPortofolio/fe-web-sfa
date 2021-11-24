import React, { Component } from "react";
import { debounce, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { IconDownload, IconArrowDoubleDown } from "../../components/Icons";
import {
  DatePickerSelect,
  SelectComponent,
  LoadingDots,
  Pagination,
  DateTime,
} from "../../components/";
import {
  IconUpload,
  IconFileEarMarkRuled,
  IconPlus,
  IconSearch,
  IconDoubleChevronDown,
  IconDoubleChevronUp,
} from "../../components/Icons";
import { Collapse } from "react-bootstrap";
import { getAttendHistoryV23 } from "../../actions/attendance_history";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import { NEWAPI_V2_3 } from "../../actions/constants";
import axios from "../../actions/config";

const style = {
  link: {
    cursor: "pointer",
  },
};

class Manage extends Component {
  state = {
    keyword: "",
    cetegory: "",
    categoryOption: [],
    date_from: "",
    date_to: "",
    open: false,
    tipe: "",
    languagesFilter: "",
    status: "",
    notes: "",
    sales_name: "",
    sales_phone: "",
  };

  componentDidMount() {
    document.title = "SFA OTTO - Sales Attendance";
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
      tipe,
      date_from,
      date_to,
      notes,
      status,
      keyword,
    } = this.state;

    let page = "?page=1";
    let pages = 0;
    if (pageNumber) {
      page = pageNumber.includes("page") ? pageNumber : "?page=1";
      pages = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getAttendHistoryV23(
      {
        keyword,
        category: category ? category.value : "",
        date_from,
        date_to,
        id,
        limit: 25,
        notes,
        sales_name,
        sales_phone,
        status: status ? status.value : "",
        type: tipe ? tipe.value : "",
        page: parseInt(pages),
      },
      page
    );
  };

  filterAttendHistory = (e) => {
    e.preventDefault();
    const {
      id,
      sales_phone,
      sales_name,
      category,
      tipe,
      date_from,
      date_to,
      notes,
      status,
      keyword,
    } = this.state;

    let page = "?page=1";

    this.props.getAttendHistoryV23(
      {
        keyword,
        category: category ? category.value : "",
        date_from,
        date_to,
        id,
        limit: 25,
        notes,
        sales_name,
        sales_phone,
        status: status ? status.value : "",
        type: tipe ? tipe.value : "",
        page: 1,
      },
      page
    );
  };

  renderStatus(param) {
    switch (param) {
      case "Validasi":
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
      case "Diterima":
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
      case "Ditolak":
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
        return <span>-</span>;
    }
  }

  toggleDropdown(toggle) {
    let obj = {};
    obj[toggle] = !this.state[toggle];
    this.setState(obj);
  }

  export = () => {
    const {
      id,
      sales_phone,
      sales_name,
      category,
      tipe,
      date_from,
      date_to,
      notes,
      status,
      keyword,
    } = this.state;
    let req = {
      category: category ? category.value : "",
      date_from,
      date_to,
      id,
      limit: 10000000,
      notes,
      sales_name,
      sales_phone,
      status: status ? status.value : "",
      type: tipe ? tipe.value : "",
      page: 1,
    };

    axios.post(NEWAPI_V2_3 + `/attendances/export`, req).then((response) => {
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
      a.download = "export_attandeces.csv";
      a.click();
    });
  };

  render() {
    const {
      keyword,
      category,
      categoryOption,
      date_from,
      date_to,
      open,
      tipe,
      status,
    } = this.state;

    const { attendance_history } = this.props;

    const types = [
      { value: "", label: "Semua" },
      { value: "In", label: "Masuk" },
      { value: "Out", label: "Keluar" },
    ];

    const statuses = [
      { value: "1", label: "Validate" },
      { value: "2", label: "Approve" },
      { value: "3", label: "Reject" },
    ];

    const categories = [
      { value: "Absen Harian", label: "Absen Harian" },
      { value: "Izin", label: "Izin" },
      { value: "Cuti", label: "Cuti" },
      { value: "Event", label: "Event" },
      { value: "Sakit", label: "Sakit" },
    ];

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <h2>Riwayat Kehadiran</h2>
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
                    className="btn btn-link btn-outline-primary text-primary"
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => this.export()}
                  >
                    <IconDownload />
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 mb-2">
              <div className="card noSelect">
                <div className="card-body">
                  <form className="" onSubmit={this.filterAttendHistory}>
                    <div className="row">
                      <div className="col-12 mb-1">
                        <h4>Daftar Riwayat Kehadiran</h4>
                        <div className="col-12 p-0 mt-4">
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-2 text-dark-gray">
                                Apa yang dicari?
                              </p>
                              <div className="form-group input-action-2 mr-3 w-100">
                                <IconSearch />
                                <input
                                  placeholder="Cari nama / ID Sales / Nomor HP"
                                  className="form-control form-control-line"
                                  value={keyword}
                                  onChange={(e) =>
                                    this.setState({ keyword: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-sm-2">
                              <p className="mb-2 text-dark-gray">Kategori</p>
                              <div className="ml-7">
                                <SelectComponent
                                  options={categories}
                                  initValue={category}
                                  handleChange={(category) =>
                                    this.setState({ category })
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <p className="mb-2 text-dark-gray">
                                Periode Tanggal
                              </p>
                              <div className="d-flex input-filter">
                                <DateTime
                                  placeholder="01/01/2021 00:00"
                                  handleChange={(date_from) =>
                                    this.setState({ date_from })
                                  }
                                  value={date_from}
                                />
                                <p className="my-2 mx-2 text-dark-gray">to</p>
                                <DateTime
                                  placeholder="01/01/2021 12:50"
                                  handleChange={(date_to) =>
                                    this.setState({ date_to })
                                  }
                                  value={date_to}
                                />
                              </div>
                            </div>
                            <div className="col-sm-3">
                              <p className="mb-2 text-dark-gray">&nbsp;</p>
                              <div className="form-inline">
                                <div
                                  className="btn-group mr-4"
                                  role="group"
                                  aria-label="Second group"
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                      this.setState({ open: !open })
                                    }
                                  >
                                    {open ? (
                                      <IconDoubleChevronUp />
                                    ) : (
                                      <IconDoubleChevronDown />
                                    )}
                                  </button>
                                </div>
                                <div
                                  className="btn-group"
                                  role="group"
                                  aria-label="Second group"
                                >
                                  <button
                                    type="submit"
                                    className="btn btn-primary active"
                                    onClick={() => {
                                      this.setState({ page: 1 }, () => {});
                                    }}
                                    style={{ fontSize: "11pt" }}
                                  >
                                    Terapkan
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Collapse in={open}>
                          <div className="col-12 p-0">
                            <div className="row">
                              <div className="col-sm">
                                <p className="mb-2 text-dark-gray">Tipe</p>
                                <div className="ml-7">
                                  <SelectComponent
                                    options={types}
                                    initValue={tipe}
                                    handleChange={(tipe) =>
                                      this.setState({ tipe })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-sm">
                                <p className="mb-2 text-dark-gray">Status</p>
                                <div className="ml-7">
                                  <SelectComponent
                                    options={statuses}
                                    initValue={status}
                                    handleChange={(status) =>
                                      this.setState({ status })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Collapse>
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
                        <th width="">Jam</th>
                        <th width="">Nama Sales</th>
                        <th width="">ID Sales</th>
                        <th width="">Nomor Hp</th>
                        <th width="">Ketegori</th>
                        <th width="">Tipe</th>
                        <th width="">Status</th>
                        <th width=""></th>
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
                            moment().locale("id");
                            const date = moment(
                              history.date,
                              "YYYY-MM-DD"
                            ).format("ddd, DD MMM YYYY");
                            const time = moment(
                              history.date,
                              "YYYY-MM-DD H:mm"
                            ).format("H:mm");
                            return (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{date}</td>
                                <td>{time}</td>
                                <td>{history.sales_name}</td>
                                <td>{history.sales_id}</td>
                                <td>{history.sales_phone}</td>
                                <td>{history.attend_category}</td>
                                <td>
                                  {history.type_attendance === ""
                                    ? "Semua"
                                    : history.type_attendance === "In"
                                    ? "Masuk"
                                    : history.type_attendance === "Out"
                                    ? "Keluar"
                                    : "-"}
                                </td>
                                <td>
                                  {this.renderStatus(history.status_name)}
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-rounded-2 btn-more-new"
                                      type="button"
                                      onClick={() =>
                                        this.toggleDropdown(`show${idx}`)
                                      }
                                      // onBlur={(e) => this.hide(e, `show${idx}`)}
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
                                        to={`/attendance/history/${history.id}`}
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
                    )}
                  </table>
                </div>
                <div className="card-body border-top">
                  <Pagination
                    pages={attendance_history.meta}
                    routeName="attendance/history"
                    handleClick={(pageNumber) =>
                      this.fetchAttendance(pageNumber)
                    }
                  />
                </div>
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
  { getAttendHistoryV23 }
)(Manage);
