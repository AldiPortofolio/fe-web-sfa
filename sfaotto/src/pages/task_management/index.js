import React, { Component } from "react";
import { Collapse } from "react-bootstrap";
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
  IconDownload,
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
  TaskManagementBulk,
} from "../../components";
import { connect } from "react-redux";
import {
  getTaskManagement,
  getCheckAdmin,
} from "../../actions/task_manegement";
import { getCategories } from "../../actions/task_category";
import moment from "moment";
import "moment/locale/id";
import tempalateUpload from "../../Template_Upload_Penugasan.csv";
import {
  Modal,
  // ModalBody,
  // ModalFooter,
} from "reactstrap";
import DownloadLink from "react-download-link";

const listPrioritas = [
  { value: "", label: "Semua" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

const listStatus = [
  { value: "0", label: "Semua" },
  { value: "1", label: "Tugas Baru" },
  { value: "2", label: "Tugas Diproses" },
  { value: "3", label: "Tugas Di Verifikasi/ Submit" },
  { value: "4", label: "Tugas Selesai / Diapprove" },
  { value: "5", label: "Tugas Dibatalkan" },
  { value: "6", label: "Ditugaskan ulang" },
];

const style = {
  link: {
    cursor: "pointer",
  },
};

class Index extends Component {
  state = {
    keyword: "",
    category: "",
    date_from: "",
    date_to: "",
    prioritas: "",
    status: "",
    open: false,
    bulkIsOpen: false,
    assignmentRole: "",
  };

  componentWillMount() {
    this.props.getCategories({
      id: 0,
      name: "",
      page: 1,
      limit: 25,
    });
    this.fetchTaskManagement();
    this.props.getCheckAdmin().then((data) => {
      this.setState({ assignmentRole: data.data.assignmentRole });
    });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchTaskManagement(this.props.location.search);
    }
  }

  fetchTaskManagement = (pageNumber) => {
    const { keyword, category, date_from, date_to, prioritas, status } =
      this.state;
    let page = "1";
    if (pageNumber) {
      page = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getTaskManagement({
      dateEnd: date_to,
      dateStart: date_from,
      name: keyword,
      jobCategoryId: parseInt(category.value),
      jobPriority: prioritas.value,
      limit: 25,
      id: 0,
      page: parseInt(page),
      status: status ? parseInt(status.value) : 0,
      statusStorage: false,
    });
  };

  filterTaskManagement = (e) => {
    e.preventDefault();
    const { keyword, category, date_from, date_to, prioritas, status } =
      this.state;
    this.props.getTaskManagement({
      dateEnd: date_to,
      dateStart: date_from,
      name: keyword,
      jobCategoryId: parseInt(category.value),
      jobPriority: prioritas.value,
      limit: 25,
      id: 0,
      page: 1,
      status: status ? parseInt(status.value) : 0,
      statusStorage: false,
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

  renderPrioritas(param) {
    switch (param) {
      case "High":
        return (
          <span style={{ color: "#E93535" }}>
            <IconArrowUp /> High
          </span>
        );
      case "Medium":
        return (
          <span style={{ color: "#E89634" }}>
            <IconArrowUpDown /> Medium
          </span>
        );
      case "Low":
        return (
          <span style={{ color: "#056EB5" }}>
            <IconArrowDown /> Low
          </span>
        );
      default:
        return "-";
    }
  }

  renderStatus(param) {
    switch (param) {
      case 1:
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#EBF7FF",
              color: "#056EB5",
              borderRadius: "0px",
            }}
          >
            Tugas Baru
          </span>
        );
      case 6:
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#EBF7FF",
              color: "#056EB5",
              borderRadius: "0px",
            }}
          >
            Ditugaskan ulang
          </span>
        );
      case 2:
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#FDF6ED",
              color: "#E89634",
              borderRadius: "0px",
            }}
          >
            Tugas Diproses
          </span>
        );
      case 3:
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#FDF6ED",
              color: "#E89634",
              borderRadius: "0px",
            }}
          >
            Tugas Diverifikasi
          </span>
        );
      case 4:
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#EEFBF7",
              color: "#2CC995",
              borderRadius: "0px",
            }}
          >
            Tugas Selesai
          </span>
        );
      case 5:
        return (
          <span
            className="badge badge-primary"
            style={{
              backgroundColor: "#FDEDED",
              color: "#E93535",
              borderRadius: "0px",
            }}
          >
            Dibatalkan
          </span>
        );
      default:
        return <span>-</span>;
    }
  }

  render() {
    const {
      keyword,
      category,
      date_from,
      date_to,
      open,
      loading,
      prioritas,
      status,
      bulkIsOpen,
      assignmentRole,
    } = this.state;
    const { task_management, task_category, auth, history } = this.props;

    let listCategory = [];
    if (!task_category.loading) {
      if (task_category.data.length > 0) {
        task_category.data.map((obj, idx) => {
          listCategory.push({ value: obj.id, label: obj.name });
        });
      }
    }

    const role = ["hq", "rsm", "bsm"];

    let buttonAllow = false;
    if (role.includes(assignmentRole)) {
      buttonAllow = true;
    }

    return (
      <>
        <Modal
          className="modal-confirmation d-flex align-items-center justify-content-center"
          size="sm"
          isOpen={bulkIsOpen}
          toggle={() => this.setState({ bulkIsOpen: false })}
        >
          <TaskManagementBulk history={history} />
        </Modal>
        <div className="container">
          <div className="row">
            <div className="col-12 mt-4">
              <div className="row">
                <div className="col-sm-4">
                  <div className="float-left">
                    <h2>Manajemen Tugas</h2>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="float-right">
                    <div
                      className="btn-toolbar"
                      role="toolbar"
                      aria-label="Toolbar with button groups"
                    >
                      {buttonAllow && (
                        <>
                          <div
                            className="btn-group mr-2"
                            role="group"
                            aria-label="Second group"
                          >
                            <Link
                              to="/task-management/draft"
                              className="btn btn-outline-primary text-primary"
                              style={{ backgroundColor: "transparent" }}
                              // onClick={() => this.setState({ exportIsOpen: true })}
                            >
                              <IconFileEarMarkRuled />
                              Draft
                            </Link>
                          </div>
                          <div
                            className="btn-group mr-2"
                            role="group"
                            aria-label="Second group"
                          >
                            <a
                              href={tempalateUpload}
                              className="btn btn-outline-primary text-primary"
                              style={{ backgroundColor: "transparent" }}
                              download
                              // onClick={() => this.setState({ exportIsOpen: true })}
                            >
                              <IconDownload />
                              Download Template
                            </a>
                          </div>
                          <div
                            className="btn-group mr-2"
                            role="group"
                            aria-label="Second group"
                          >
                            <button
                              className="btn btn-outline-primary text-primary"
                              style={{ backgroundColor: "transparent" }}
                              onClick={() =>
                                this.setState({ bulkIsOpen: true })
                              }
                            >
                              <IconUpload />
                              Upload
                            </button>
                          </div>

                          <div
                            className="btn-group mr-2"
                            role="group"
                            aria-label="Second group"
                          >
                            <Link
                              to="/task-management/add"
                              className="btn btn-primary d-flex align-items-center float-right"
                            >
                              <IconPlus />
                              Tugas Baru
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mb-4 mt-4" style={{ borderRadius: "15px" }}>
              <div className="card noSelect" style={{ borderRadius: "15px" }}>
                <div className="card-body pb-0">
                  <div className="mb-4 mt-2 text-dark-gray">
                    <h5>Daftar Manajemen Tugas</h5>
                    <div className="col-12 p-0 mt-4">
                      <div className="row">
                        <div className="col-lg-3">
                          <p className="mb-2 text-dark-gray">
                            Apa yang dicari?
                          </p>
                          <div className="form-group input-action-2 mr-3 w-100">
                            <IconSearch />
                            <input
                              placeholder="Cari nama"
                              className="form-control form-control-line"
                              value={keyword}
                              onChange={(e) =>
                                this.setState({ keyword: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <p className="mb-2 text-dark-gray">Kategori</p>
                          <div className="ml-7">
                            <SelectComponent
                              options={listCategory}
                              initValue={category}
                              handleChange={(category) =>
                                this.setState({ category })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <p className="mb-2 text-dark-gray">Periode Tanggal</p>
                          <div className="d-flex">
                            <DatePickerSelect
                              placeholder="01/01/2021"
                              handleChange={(date_from) =>
                                this.setState({ date_from })
                              }
                              value={date_from}
                            />
                            <p className="my-2 mx-2 text-dark-gray">to</p>
                            <DatePickerSelect
                              placeholder="01/01/2021"
                              handleChange={(date_to) =>
                                this.setState({ date_to })
                              }
                              value={date_to}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <p className="mb-2 text-dark-gray">&nbsp;</p>
                          <div
                            className="btn-group mr-3"
                            role="group"
                            aria-label="Second group"
                          >
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => this.setState({ open: !open })}
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
                              onClick={(e) => this.filterTaskManagement(e)}
                              style={{ fontSize: "11pt" }}
                            >
                              Terapkan
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Collapse in={open}>
                      <div className="col-12 p-0 mt-2">
                        <div className="row">
                          <div className="col-sm">
                            <p className="mb-2 text-dark-gray">Prioritas</p>
                            <div className="ml-7">
                              <SelectComponent
                                options={listPrioritas}
                                initValue={prioritas}
                                handleChange={(prioritas) =>
                                  this.setState({ prioritas: prioritas })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-sm">
                            <p className="mb-2 text-dark-gray">Status</p>
                            <div className="ml-7">
                              <SelectComponent
                                options={listStatus}
                                initValue={status}
                                handleChange={(status) =>
                                  this.setState({ status: status })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
                <div className="table-fixed mb-3">
                  <table className="table table-header mb-0">
                    <thead className="thead-light">
                      <tr>
                        <th width="">#</th>
                        <th width="">Nama Tugas</th>
                        <th width="">Kategori</th>
                        <th width="">Pemberi</th>
                        <th width="">Penerima</th>
                        <th width="">Deadline</th>
                        <th width="">Prioritas</th>
                        <th width="">Status</th>
                        <th width=""></th>
                      </tr>
                    </thead>

                    {task_management.loading ? (
                      <tbody>
                        <tr>
                          <td colSpan={10}>
                            <div className="d-flex justify-content-center align-items-center">
                              <LoadingDots color="black" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {task_management.data &&
                          task_management.data.map((obj, idx) => {
                            return (
                              <tr key={obj.id}>
                                <td>{idx + 1}</td>
                                <td>{obj.name}</td>
                                <td>
                                  {obj.jobCategoryName
                                    ? obj.jobCategoryName.name
                                    : "-"}
                                </td>
                                <td>{`${obj.senderName?.firstName} ${obj.senderName?.lastName}`}</td>
                                <td>
                                  {obj.recipientName
                                    ? `${obj.recipientName?.firstName} ${obj.recipientName?.lastName}`
                                    : "-"}
                                </td>
                                <td>
                                  {moment(obj.deadline, "YYYY-MM-DD").format(
                                    "ddd, DD MMM YYYY"
                                  )}
                                </td>
                                <td>{this.renderPrioritas(obj.jobPriority)}</td>
                                <td>{this.renderStatus(obj.status)}</td>
                                <td>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-circle btn-more dropdown-toggle"
                                      type="button"
                                      onClick={() =>
                                        this.toggleDropdown(`show${obj.id}`)
                                      }
                                      onBlur={() => this.hide(`show${obj.id}`)}
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
                                        this.state[`show${obj.id}`]
                                          ? "show"
                                          : ""
                                      }`}
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <Link
                                        to={
                                          obj.status != 1
                                            ? `/task-management/detail-submit/${obj.id}`
                                            : `/task-management/detail/${obj.id}`
                                        }
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
                    pages={task_management.meta}
                    routeName="task-management/"
                    handleClick={(pageNumber) => {
                      this.fetchTaskManagement(pageNumber);
                    }}
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
    getTaskManagement,
    getCategories,
    getCheckAdmin,
  }
)(Index);
