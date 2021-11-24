import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ModalDelete,
  NotAuthorize,
  SelectComponent,
  LoadingDots,
  Pagination,
} from "../../components";
import { getCategories, deleteCategory } from "../../actions/task_category";
import { connect } from "react-redux";
import {
  IconTrash,
  IconEdit,
  IconSearch,
  IconEye,
  IconEyeOff,
} from "../../components/Icons";

const style = {
  link: {
    cursor: "pointer",
  },
};

class Index extends Component {
  state = {
    id: "",
    idSearch: "",
    name: "",
    confirmIsOpen: "",
    confirmText: "",
    resultIsOpen: "",
    type: "",
    resultText: "",
  };

  componentWillMount() {
    this.fetchCategories();
  }

  filterCategories = (e) => {
    e.preventDefault();
    const { idSearch, name } = this.state;
    this.props.getCategories({
      id: parseInt(idSearch),
      name: name,
      page: 1,
      limit: 25,
    });
  };

  fetchCategories = (pageNumber) => {
    const { idSearch, name } = this.state;
    let page = "1";
    if (pageNumber) {
      page = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getCategories({
      id: parseInt(idSearch),
      name: name,
      page: parseInt(page),
      limit: 25,
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

  render() {
    const {
      idSearch,
      id,
      name,
      confirmIsOpen,
      confirmText,
      resultIsOpen,
      type,
      resultText,
    } = this.state;
    let { task_category, deleteCategory } = this.props;
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
              deleteCategory(id)
                .then((data) => {
                  if (data.meta.status == false) {
                    this.setState({
                      resultIsOpen: true,
                      type: "error",
                      resultText: data.meta.message,
                    });
                    this.setState({ resultIsOpen: true }, () =>
                      this.fetchCategories()
                    );
                  } else {
                    this.setState({ resultIsOpen: false }, () =>
                      this.fetchCategories()
                    );
                  }
                })
                .catch((e) =>
                  this.setState({
                    resultIsOpen: true,
                    type: "error",
                    confirmText: e,
                  })
                );
            });
          }}
          resultText={resultText}
        />
        <div className="container">
          <div className="row">
            <div className="col-12 mt-4">
              <div className="row">
                <div className="col-sm">
                  <div className="float-left">
                    <h2>Kategori Tugas</h2>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="float-right">
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
                        <Link
                          to="/system-configuration/task-category/add"
                          className="btn btn-danger d-flex align-items-center float-right"
                          style={{ borderRadius: "15px" }}
                        >
                          Tambah Kategori Tugas
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mb-4 mt-4" style={{ borderRadius: "15px" }}>
              <div className="card noSelect" style={{ borderRadius: "15px" }}>
                <div className="card-body pb-0">
                  <div className="mb-4 mt-2 text-dark-gray">
                    <form
                      className="form-inline"
                      onSubmit={this.filterCategories}
                    >
                      <div className="col-12 p-0 mt-4">
                        <div className="row form-inline">
                          <div className="form-group input-action-custom col-sm-5">
                            <label
                              htmlFor="staticGroupMerchant"
                              className="col-sm-2 row"
                            >
                              ID
                            </label>
                            <div className="col-sm-10 row">
                              <input
                                placeholder="Masukan ID"
                                className="form-control form-control-line"
                                name="idSearch"
                                value={idSearch}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                          <div className="form-group input-action-custom col-sm-5">
                            <label
                              htmlFor="staticGroupMerchant"
                              className="col-sm-3 row"
                            >
                              Name
                            </label>
                            <div className="col-sm-9 row">
                              <input
                                placeholder="Masukan Nama"
                                className="form-control form-control-line"
                                name="name"
                                value={name}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                          <div className="form-group input-action-custom col-sm-2">
                            <div className="col-sm-9 row">
                              <button
                                type="submit"
                                className="btn btn-danger w-100"
                                onClick={() => {
                                  this.setState({ page: 1 }, () => {});
                                }}
                              >
                                Search
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="table-fixed">
                  <table className="table table-header mb-0">
                    <thead>
                      <tr>
                        <th width="">ID Number</th>
                        <th width="">Task Category Name</th>
                        <th width="">Description</th>
                        <th width="">Action</th>
                      </tr>
                    </thead>
                    {task_category.loading && (
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

                    {!task_category.loading && (
                      <tbody>
                        {task_category.data.length > 0 &&
                          task_category.data.map((obj, idx) => {
                            return (
                              <tr key={idx + 1}>
                                <td>{obj.id}</td>
                                <td>{obj.name}</td>
                                <td>{obj.description}</td>
                                <td className="d-flex">
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
                                        this.state[`show${obj.id}`]
                                          ? "show"
                                          : ""
                                      }`}
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <Link
                                        to={`/system-configuration/task-category/edit/${obj.id}`}
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
                                              "Apakah Anda yakin untuk menghapus data ini?",
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
                    pages={task_category.meta}
                    routeName="system-configuration/task-category"
                    handleClick={(pageNumber) => {
                      this.fetchCategories(pageNumber);
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

export default connect(({ task_category, auth }) => ({ task_category, auth }), {
  getCategories,
  deleteCategory,
})(Index);
