import React from "react";
import { find, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getAcquisitions,
  deleteAcquisition,
  changeStatusAcquisition,
} from "../../actions/acquisition";
import { getSalesRetails } from "../../actions/sales_retail";
import {
  ModalDelete,
  NotAuthorize,
  SelectComponent,
  LoadingDots,
  Pagination,
} from "../../components";
import {
  IconTrash,
  IconEdit,
  IconSearch,
  IconEye,
  IconEyeOff,
} from "../../components/Icons";
import { ind, en } from "../../languages/admin";

const style = {
  link: {
    cursor: "pointer",
  },
};

class Manage extends React.Component {
  state = {
    id: "",
    groupMerchant: "",
    categoryMerchant: "",
    name: "",
    confirmIsOpen: false,
    confirmText: "",
    resultIsOpen: false,
    confirmIsOpenStatus: false,
    confirmTextStatus: "",
    resultIsOpenStatus: false,
    type: "success",
    show_in_app: "Inactive",
    resultTextStatus: "",
    salesRetailOption: [],
  };

  componentWillMount() {
    this.getComboList();
    this.fetchAcquisition(window.location.search);
  }

  componentDidMount() {
    document.title = "SFA OTTO - Manage Acquisition";

    // if (this.props.auth.language === "in"){
    // this.setState({languagesFilter: ind.filter, languagesTable: ind.table})
    // } else if (this.props.auth.language === "en"){
    // this.setState({languagesFilter: en.filter, languagesTable: en.table})
    // }

    this.getComboList();
    this.fetchAcquisition(window.location.search);
  }
  getComboList = async () => {
    await this.props.getSalesRetails().then((data) => {
      let newSalesRetailOptions = [];
      data.data.map((obj) => {
        newSalesRetailOptions.push({ value: obj.id, label: obj.name });
      });
      this.setState({ salesRetailOption: newSalesRetailOptions });
    });
  };

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchAcquisition(this.props.location.search);
    }
  }

  fetchAcquisition = (pageNumber) => {
    const { groupMerchant, categoryMerchant, name } = this.state;
    let page = "1";
    if (pageNumber) {
      page = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getAcquisitions({
      merchant_category: categoryMerchant,
      merchant_group: groupMerchant,
      name: name,
      page: parseInt(page),
    });
  };

  filterAcquisition = (e) => {
    e.preventDefault();
    const { groupMerchant, categoryMerchant, name } = this.state;
    this.props.getAcquisitions({
      merchant_category: categoryMerchant,
      merchant_group: groupMerchant,
      name: name,
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

  hide(e, toggle) {
    setTimeout(() => {
      let obj = {};
      obj[toggle] = !this.state[toggle];
      this.setState(obj);
    }, 200);
  }

  render() {
    const {
      id,
      groupMerchant,
      categoryMerchant,
      name,
      confirmIsOpen,
      confirmText,
      resultIsOpen,
      type,
      confirmIsOpenStatus,
      confirmTextStatus,
      resultIsOpenStatus,
      show_in_app,
      resultTextStatus,
      salesRetailOption,
    } = this.state;

    let {
      acquisitions,
      getAcquisitions,
      deleteAcquisition,
      auth,
      changeStatusAcquisition,
    } = this.props;
    return (
      <div className="container">
        <ModalDelete
          confirmIsOpen={confirmIsOpen}
          resultIsOpen={resultIsOpen}
          type={type}
          confirmText={confirmText}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          resultClose={() => this.setState({ resultIsOpen: false })}
          confirmYes={() => {
            this.setState({ confirmIsOpen: false }, () => {
              deleteAcquisition(id)
                .then((data) =>
                  this.setState({ resultIsOpen: true }, () =>
                    this.fetchAcquisition()
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
        <ModalDelete
          confirmIsOpen={confirmIsOpenStatus}
          resultIsOpen={resultIsOpenStatus}
          type={type}
          confirmText={confirmTextStatus}
          confirmClose={() => this.setState({ confirmIsOpenStatus: false })}
          resultClose={() => this.setState({ resultIsOpenStatus: false })}
          confirmYes={() => {
            this.setState({ confirmIsOpenStatus: false }, () => {
              const data = {
                id: id.toString(),
                status: show_in_app,
              };
              changeStatusAcquisition(data)
                .then((data) =>
                  this.setState({ resultIsOpenStatus: true }, () =>
                    this.fetchAcquisition()
                  )
                )
                .catch((e) =>
                  this.setState({
                    resultIsOpenStatus: true,
                    type: "error",
                    confirmTextStatus: e,
                  })
                );
            });
          }}
          resultText={resultTextStatus}
        />
        <div className="row">
          <div className="col-12 mb-3">
            <h2>Acquisition List</h2>
            {auth.authority["acquisition"] === "Full Access" && (
              <Link
                to="/system-configuration/acquisition/add"
                className="btn btn-danger btn-rounded d-flex align-items-center float-right"
              >
                Add Acquisition List
              </Link>
            )}
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-12">
                    <form
                      className="form-inline"
                      onSubmit={this.filterAcquisition}
                    >
                      <div className="form-group input-action-custom col-sm-6 mb-3">
                        <label
                          htmlFor="staticGroupMerchant"
                          className="col-sm-3 col-form-label"
                        >
                          Group Merchant
                        </label>
                        <div className="col-sm-9">
                          <input
                            placeholder="Masukan merchant group"
                            className="form-control form-control-line"
                            name="groupMerchant"
                            value={groupMerchant}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="form-group input-action-custom col-sm-6 mb-3">
                        <label
                          htmlFor="staticCategoryMerchant"
                          className="col-sm-4 col-form-label"
                        >
                          Ketegori Merchant
                        </label>
                        <div className="col-sm-8">
                          <input
                            placeholder="Masukan ketegori merchant"
                            className="form-control form-control-line"
                            name="categoryMerchant"
                            value={categoryMerchant}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="form-group input-action-custom col-sm-6 mb-3">
                        <label
                          htmlFor="staticNama"
                          className="col-sm-3 float-left"
                        >
                          Nama
                        </label>
                        <div className="col-sm-9">
                          <input
                            placeholder="Masukan nama"
                            className="form-control form-control-line"
                            name="name"
                            value={name}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="form-group input-action-custom col-sm-6 mb-3">
                        <label
                          htmlFor="staticGroupMerchant"
                          className="col-sm-4 col-form-label"
                        ></label>
                        <div className="col-sm-3">
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
                    </form>
                  </div>
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header mb-0">
                  <thead>
                    <tr>
                      <th width="20%">ID</th>
                      <th width="20%">Tipe Merchant Rose</th>
                      <th width="20%">Group Merchant Rose</th>
                      <th width="20%">Ketegori Merchant Rose</th>
                      <th width="20%">Nama</th>
                      <th width="20%">Sales Retail</th>
                      <th width="20%">Bussiness Type</th>
                      <th width="20%">Sequence</th>
                      <th width="20%">Show in App</th>
                      <th width="20%">Action</th>
                    </tr>
                  </thead>
                  {acquisitions.loading ? (
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
                      {acquisitions.data.map((data) => {
                        const business_types = data.business_types.split(",");
                        const sales_retails = data.sales_retails.split(",");
                        console.log("sales_retails", sales_retails);
                        return (
                          <tr key={data.id}>
                            <td>
                              <Link
                                to={`/system-configuration/acquisition/detail/${data.id}`}
                                style={style.link}
                              >
                                {data.id}
                              </Link>
                            </td>
                            <td>{data.rose_merchant_type}</td>
                            <td>{data.rose_merchant_group}</td>
                            <td>{data.rose_merchant_category}</td>
                            <td>{data.name}</td>
                            <td>
                              {sales_retails.map((val, idx) => {
                                // const sales_retail =
                                //   find(salesRetailOption, {
                                //     label: parseInt(val),
                                //   }) || "";
                                return (
                                  <>
                                    {idx > 0 && <span>, </span>}
                                    {val}
                                  </>
                                );
                              })}
                            </td>
                            <td>
                              {business_types.map((value) => {
                                return (
                                  <span
                                    className={`badge`}
                                    style={{
                                      backgroundColor: "#faeded",
                                      color: "red",
                                    }}
                                  >
                                    {value}
                                  </span>
                                );
                              })}
                            </td>
                            <td>{data.sequence}</td>
                            <td>
                              {data.show_in_app == "Active" ? (
                                <span style={{ color: "#86debd" }}>Yes</span>
                              ) : (
                                <span style={{ color: "red" }}>No</span>
                              )}
                            </td>
                            <td className="d-flex">
                              <div className="dropdown">
                                <button
                                  className="btn btn-circle btn-more dropdown-toggle"
                                  type="button"
                                  onClick={() =>
                                    this.toggleDropdown(`show${data.id}`)
                                  }
                                  onBlur={(e) => this.hide(e, `show${data.id}`)}
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
                                    this.state[`show${data.id}`] ? "show" : ""
                                  }`}
                                  aria-labelledby="dropdownMenuButton"
                                >
                                  <Link
                                    to={`/system-configuration/acquisition/edit/${data.id}`}
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
                                        id: data.id,
                                        confirmIsOpen: true,
                                        confirmText:
                                          "Apakah Anda yakin untuk menghapus data ini?",
                                      })
                                    }
                                  >
                                    <IconTrash />
                                    Hapus
                                  </span>
                                  <span
                                    className="dropdown-item"
                                    style={style.link}
                                    onClick={() =>
                                      this.setState({
                                        id: data.id,
                                        confirmIsOpenStatus: true,
                                        show_in_app:
                                          data.show_in_app == "Active"
                                            ? "Inactive"
                                            : "Active",
                                        resultTextStatus:
                                          data.show_in_app == "Active"
                                            ? "Berhasil di Non-aktifkan"
                                            : "Berhasil di Aktifkan",
                                        confirmTextStatus:
                                          data.show_in_app == "Active"
                                            ? "Apakah Anda yakin untuk mengnonaktifkan data ini?"
                                            : "Apakah Anda yakin untuk mengaktifkan data ini?",
                                      })
                                    }
                                  >
                                    {data.show_in_app == "Active" ? (
                                      <>
                                        <IconEyeOff />
                                        Status Inactive
                                      </>
                                    ) : (
                                      <>
                                        <IconEye />
                                        Status Active
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
                  {!acquisitions.loading && isEmpty(acquisitions.data) && (
                    <tbody>
                      <tr>
                        <td colSpan={10} className="text-center">
                          There is no Acquisition
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination
                  pages={acquisitions.meta}
                  routeName="system-configuration/acquisition"
                  handleClick={(pageNumber) => {
                    this.fetchAcquisition(pageNumber);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ acquisitions, auth }) => ({ acquisitions, auth }), {
  getAcquisitions,
  deleteAcquisition,
  changeStatusAcquisition,
  getSalesRetails,
})(Manage);
