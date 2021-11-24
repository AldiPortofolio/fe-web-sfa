import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  IconUpload,
  IconFileEarMarkRuled,
  IconPlus,
  IconSearch,
  IconDoubleChevronDown,
  IconDoubleChevronUp,
  IconArrowUp,
  IconArrowDown,
  IconArrowUpDown,
  IconTrash,
} from "../../components/Icons";
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
  ModalDelete,
} from "../../components";
import moment from "moment";
import { connect } from "react-redux";
import {
  getDraft,
  deleteTaskManagement,
  getCheckAdmin,
} from "../../actions/task_manegement";
import "moment/locale/id";

const style = {
  link: {
    cursor: "pointer",
  },
};

class Draft extends Component {
  state = {
    id: "",
    keyword: "",
    confirmIsOpen: "",
    resultIsOpen: "",
    type: "success",
    confirmText: "",
    assignment_role: "",
  };

  componentWillMount() {
    this.fetchTaskManagement();
    this.props.getCheckAdmin().then((data) => {
      this.setState({
        assignment_role: data.data.assignmentRole,
      });
    });
  }

  fetchTaskManagement = (pageNumber) => {
    const { keyword } = this.state;
    let page = "1";
    if (pageNumber) {
      page = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getDraft({
      keyword: keyword,
      page: parseInt(page),
    });
  };

  filterTaskManagement = (e) => {
    e.preventDefault();
    const { keyword } = this.state;

    this.props.getDraft({
      keyword: keyword,
      page: 1,
    });
  };

  toggleDropdown(toggle) {
    let obj = {};
    obj[toggle] = !this.state[toggle];
    this.setState(obj);
  }

  hide(e, toggle) {
    setTimeout(() => {
      let obj = {};
      obj[toggle] = !this.state[toggle];
      this.setState(obj);
    }, 200);
  }

  render() {
    const {
      keyword,
      id,
      confirmIsOpen,
      resultIsOpen,
      type,
      confirmText,
      assignment_role,
    } = this.state;
    const { task_management } = this.props;
    moment().locale("id");

    const role = ["hq", "rsm", "bsm"];

    if (task_management.loading == false && !role.includes(assignment_role)) {
      return <NotAuthorize />;
    }

    return (
      <>
        <ModalDelete
          confirmIsOpen={confirmIsOpen}
          resultIsOpen={resultIsOpen}
          type={type}
          confirmText={confirmText}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          resultClose={() => this.setState({ resultIsOpen: false })}
          confirmYes={() => {
            this.setState({ confirmIsOpen: false }, () => {
              this.props
                .deleteTaskManagement(id)
                .then((data) =>
                  this.setState({ resultIsOpen: true }, () =>
                    this.fetchTaskManagement()
                  )
                )
                .catch((e) =>
                  this.setState({
                    resultIsOpen: true,
                    type: "error",
                    confirmText: e,
                  })
                );
            });
          }}
          resultText="Berhasil dihapus"
        />
        <div className="container">
          <div className="row">
            <div className="col-12 mt-4">
              <div className="row">
                <div className="col-sm">
                  <div className="float-left">
                    <h2>List Draft</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mb-4 mt-4" style={{ borderRadius: "15px" }}>
              <div className="card noSelect" style={{ borderRadius: "15px" }}>
                <div className="card-body ">
                  <div className="col-sm-12">
                    <div className="row align-items-start">
                      <div className="col">
                        <h5>Daftar draft</h5>
                      </div>
                      <div className="col" style={{ float: "right" }}>
                        <div className="form-group input-action-2 mr-3 w-100 float-right">
                          <IconSearch />
                          <input
                            placeholder="Cari nama / kategori tugas"
                            className="form-control form-control-line"
                            value={keyword}
                            onKeyUp={(e) => {
                              this.setState({ keyword: e.target.value });
                              this.filterTaskManagement(e);
                            }}
                            onChange={(e) => {
                              this.setState({ keyword: e.target.value });
                              this.filterTaskManagement(e);
                            }}
                            onBlur={(e) => {
                              this.setState({ keyword: e.target.value });
                              this.filterTaskManagement(e);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-fixed mb-3">
                  <table className="table table-header mb-0">
                    <thead className="thead-light">
                      <tr>
                        <th width="">#</th>
                        <th width="">Hari/Tanggal</th>
                        <th width="">Nama Tugas</th>
                        <th width="">Kategori</th>
                        <th width=""></th>
                      </tr>
                    </thead>
                    {task_management.loading && (
                      <tbody>
                        <tr>
                          <td colSpan={10}>
                            <div className="d-flex justify-content-center align-items-center">
                              <LoadingDots color="black" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    )}
                    {!task_management.loading && (
                      <tbody>
                        {task_management.data.map((obj, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>
                                {moment(
                                  obj.assignment_date,
                                  "YYYY-MM-DD"
                                ).format("ddd, DD MMM YYYY") == "Invalid date"
                                  ? "-"
                                  : moment(
                                      obj.assignment_date,
                                      "YYYY-MM-DD"
                                    ).format("ddd, DD MMM YYYY")}
                              </td>
                              <td>{obj.name}</td>
                              <td>{obj.job_category_name}</td>
                              <td className="d-flex">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-circle btn-more dropdown-toggle"
                                    type="button"
                                    onClick={() =>
                                      this.toggleDropdown(`show${obj.id}`)
                                    }
                                    onBlur={(e) =>
                                      this.hide(e, `show${obj.id}`)
                                    }
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    <svg
                                      enableBackground="new 0 0 512 512"
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
                                      this.state[`show${obj.id}`] ? "show" : ""
                                    }`}
                                    aria-labelledby="dropdownMenuButton"
                                  >
                                    <Link
                                      to={`/task-management/edit/${obj.id}`}
                                      className="dropdown-item"
                                      style={style.link}
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
                                        <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
                                        <line
                                          x1="3"
                                          y1="22"
                                          x2="21"
                                          y2="22"
                                        ></line>
                                      </svg>
                                      Edit
                                    </Link>
                                    <span
                                      className="dropdown-item"
                                      style={style.link}
                                      onClick={() =>
                                        this.setState({
                                          id: obj.id,
                                          confirmIsOpen: true,
                                          confirmText:
                                            "Apakah Anda yakin ingin menghapus draft tugas ini?",
                                        })
                                      }
                                    >
                                      <IconTrash />
                                      Hapus
                                    </span>
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
                    pages={task_management.meta}
                    routeName="/task-management/draft"
                    handleClick={(pageNumber) => {}}
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
  ({ task_management, auth, task_category }) => ({
    task_management,
    auth,
    task_category,
  }),
  {
    getDraft,
    deleteTaskManagement,
    getCheckAdmin,
  }
)(Draft);
