import React from "react";
import { debounce, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getMerchants,
  setStatusMerchant,
  getMerchantsV2,
} from "../../actions/merchant";
import {
  NotAuthorize,
  SelectComponent,
  ModalDelete,
  LoadingDots,
  Pagination,
  MerchantBulk,
} from "../../components";
import axios from "../../actions/config";
import { IconDownload, IconUpload } from "../../components/Icons";
import { ind, en } from "../../languages/merchant";
import { NEWAPI } from "../../actions/constants";
// import MerchantBulk from '../../components/MerchantBulk'
import {
  Modal,
  // ModalBody,
  // ModalFooter,
} from "reactstrap";

const style = {
  link: {
    cursor: "pointer",
  },
};

const statuses = [
  { value: "", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Dormant", label: "Dormant" },
];

// const type_list = [
//   {value: '', label: 'All'},
//   {value: 'OP', label: 'OP'},
//   {value: 'PGMI', label: 'PGMI'},
// ]

const initState = {
  selectedStatus: [],
  keyword: "",
  id: "",
  mid: "",
  status: "",
  merchant_type: "",
  merchant_name: "",
  merchant_phone: "",
  sales_phone: "",
  // params: '',
  confirmIsOpen: false,
  resultIsOpen: false,
  confirmText: "",
  resultText: "",
  type: "success",
  languages: {},
  TemplateBulk: "load",

  bulkIsOpen: false,
  resultBulkIsOpen: false,
  confirmUploadText: "",
  resultUploadText: "",
  type_upload: "success",
  merchantTypeList: [],
};

class Index extends React.Component {
  state = initState;

  componentDidMount() {
    document.title = "SFA OTTO - Merchant";

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.list });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.list });
    }

    axios
      .get(`/merchant/download_template`)
      .then((data) => {
        let result = data.data;
        if (result.meta.status !== false) {
          if (result.data.template) {
            let fullURL = `${process.env.REACT_APP_IMAGE_URL}${result.data.template}`;
            this.setState({ TemplateBulk: fullURL });
          }
        }
      })
      .catch((e) => {
        this.setState({
          TemplateBulk: "",
          confirmIsOpen: true,
          typeDownlaod: "error",
          textError: `Get bulk template for calendar fail`,
          uploadStatus: "Upload",
        });
      });

    this.fetchMerchantType();
    this.fetchMerchant(window.location.search);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchMerchant(this.props.location.search);
    }
  }

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

  filterMerchant = debounce(() => {
    const {
      mid,
      merchant_name,
      merchant_type,
      sales_phone,
      merchant_phone,
      status,
    } = this.state;
    let mType = "";

    if (merchant_type.label === "All") {
      mType = "";
    } else {
      mType = merchant_type.label;
    }

    this.props.getMerchantsV2({
      mid,
      merchant_name,
      merchant_type: mType,
      sales_phone,
      merchant_phone,
      status: status.value,
    });
  }, 350);

  fetchMerchant = (pageNumber) => {
    const {
      mid,
      merchant_name,
      merchant_type,
      sales_phone,
      merchant_phone,
      status,
    } = this.state;
    let page = "?page=1";
    let mType = "";

    if (merchant_type.label === "All") {
      mType = "";
    } else {
      mType = merchant_type.label;
    }

    let pages = 0;
    if (pageNumber) {
      page = pageNumber.includes("page") ? pageNumber : "?page=1";
      pages = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getMerchantsV2(
      {
        mid,
        merchant_name,
        merchant_type: mType,
        sales_phone,
        merchant_phone,
        status: status.value,
        page: parseInt(pages),
      },
      page
    );
  };

  fetchMerchantType() {
    axios.get(NEWAPI + `/merchants/merchant_types`).then((data) => {
      let result = data.data;
      if (result.meta.status !== false) {
        if (result.data) {
          const form = result.data.map((c) => ({ value: c.id, label: c.name }));
          form.unshift({ value: "", label: "All" });
          this.setState({ merchantTypeList: form });
        }
      }
    });
  }

  render() {
    const { auth, merchants, setStatusMerchant, history } = this.props;
    const {
      id,
      confirmIsOpen,
      resultIsOpen,
      type,
      confirmText,
      resultText,
      mid,
      status,
      merchant_type,
      merchant_phone,
      merchant_name,
      sales_phone,
      languages,
      TemplateBulk,
      bulkIsOpen,
      merchantTypeList,
    } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["merchant_list"] === "" ||
        auth.authority["merchant_list"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    let newParams = "";

    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmText={confirmText}
            resultText={resultText}
            confirmClose={() => this.setState({ confirmIsOpen: false })}
            resultClose={() => this.setState({ resultIsOpen: false })}
            confirmYes={() => {
              this.setState(
                { confirmIsOpen: false, confirmText: confirmText },
                () => {
                  setStatusMerchant({ id, status })
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
                          () => this.fetchMerchant()
                        );
                      }
                    })
                    .catch((e) => {
                      this.setState({
                        resultIsOpen: true,
                        type: "error",
                        resultText: "Update status merchant gagal.",
                      });
                    });
                }
              );
            }}
          />
          {/* <ModalBulkUpload
            confirmIsOpen={bulkIsOpen}
            resultIsOpen={resultBulkIsOpen}
            type={type_upload}
            confirmText={confirmUploadText}
            resultText={resultUploadText}
            confirmClose={() => this.setState({bulkIsOpen: false})}
            resultClose={() => this.setState({resultBulkIsOpen: false})}
            confirmYes={(a) => {
              const data = new FormData();
              data.append('file', a[0]);
              axios.post(NEWAPI + `/merchants/bulk_status`, data)
              .then(data => {
                if(data.meta.status === false){
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: data.meta.message, textReason: ''})
                }else{
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: `Bulk upload set status merchant sukses`, textReason: ''})
                }
                  this.setState({bulkIsOpen: true, type_upload: 'success', textSuccess: `Bulk upload set status merchant sukses`, uploadStatus: 'Upload'})
              })
              .catch(e => {
                this.setState({confirmIsOpen: true, type_upload: 'error', textSuccess: `Bulk upload set status merchant gagal`, uploadStatus: 'Upload'})
              })
            }}
          /> */}

          <Modal
            className="modal-confirmation d-flex align-items-center justify-content-center"
            size="sm"
            isOpen={bulkIsOpen}
            toggle={() => this.setState({ bulkIsOpen: false })}
          >
            <MerchantBulk history={history} />
          </Modal>
          <div className="col-12">
            <h2>{languages.header}</h2>
            <div className="actions d-flex justify-content-end mb-3">
              <a className="btn btn-link text-danger" href={TemplateBulk}>
                <IconDownload />
                {languages.download}
              </a>
              {/* <a className="btn btn-link text-danger" href={bulkTemplate}><IconDownload/>{languages.download}</a> */}
              {auth.authority["merchant_list"] === "Full Access" && (
                <button
                  className="btn btn-danger btn-rounded ml-3"
                  onClick={() => this.setState({ bulkIsOpen: true })}
                >
                  <IconUpload />
                  {languages.upload}
                </button>
              )}
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="row mt-2">
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-4 d-flex">
                            <label className="col-form-label">
                              {languages.mid}
                            </label>
                          </div>
                          <div className="col-lg-8 input-filter">
                            <input
                              type="text"
                              name="id"
                              className="form-control form-control-line w-30"
                              placeholder={languages.pMid}
                              onChange={(e) => {
                                this.setState({ mid: e.target.value });
                              }}
                              value={mid}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-4 d-flex">
                            <label className="col-form-label">
                              {languages.type}
                            </label>
                          </div>
                          <div className="col-lg-8 input-filter ">
                            <SelectComponent
                              options={merchantTypeList}
                              initValue={merchant_type}
                              handleChange={(merchant_type) =>
                                this.setState({ merchant_type })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-4 d-flex">
                            <label className="col-form-label">
                              {languages.noMerchant}
                            </label>
                          </div>
                          <div className="col-lg-8 input-filter">
                            <input
                              type="number"
                              name="sales_phone"
                              className="form-control form-control-line w-30"
                              placeholder={languages.pNoMerchant}
                              onChange={(e) => {
                                if (
                                  isNaN(Number(e.target.value)) ||
                                  e.target.value.split("").length > 16
                                ) {
                                  return;
                                }
                                this.setState({
                                  merchant_phone: e.target.value,
                                });
                              }}
                              value={merchant_phone}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-4 d-flex">
                            <label className="col-form-label">
                              {languages.noSales}
                            </label>
                          </div>
                          <div className="col-lg-8 input-filter">
                            <input
                              type="text"
                              name="sales_name"
                              className="form-control form-control-line w-30"
                              placeholder={languages.pNoSales}
                              onChange={(e) => {
                                if (
                                  isNaN(Number(e.target.value)) ||
                                  e.target.value.split("").length > 16
                                ) {
                                  return;
                                }
                                this.setState({ sales_phone: e.target.value });
                              }}
                              value={sales_phone}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-4 d-flex">
                            <label className="col-form-label">
                              {languages.merchant}
                            </label>
                          </div>
                          <div className="col-lg-8 input-filter">
                            <input
                              type="text"
                              name="notes"
                              className="form-control form-control-line w-20"
                              placeholder={languages.pName}
                              onChange={(e) => {
                                this.setState({
                                  merchant_name: e.target.value,
                                });
                              }}
                              value={merchant_name}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-4 d-flex">
                            <label className="col-form-label">
                              {languages.status}
                            </label>
                          </div>
                          <div className="col-lg-8 input-filter">
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
                      <div className="col-12">
                        <div className="form-inline mt-3">
                          <div className="col-10"></div>
                          <div className="col-lg-2">
                            <Link to={`?page=1`} aria-label="Previous">
                              <button
                                type="submit"
                                className="btn btn-danger w-100"
                                onClick={() => {
                                  this.filterMerchant();
                                }}
                              >
                                {languages.search}
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header table-striped mb-0">
                  <thead>
                    <tr>
                      <th width="10%">{languages.id}</th>
                      <th width="10%">{languages.mid}</th>
                      <th width="15%">{languages.noMerchant}</th>
                      <th width="18%">{languages.merchant}</th>
                      <th width="12%">{languages.type}</th>
                      <th width="15%">{languages.noSales}</th>
                      <th width="10%">{languages.status}</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  {merchants.loading ? (
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
                      {merchants.data &&
                        merchants.data.map((merchant, idx) => {
                          let merchantStatus;

                          if (merchant.status === "Inactive") {
                            merchantStatus = "badge-gray";
                          } else {
                            merchantStatus = "badge-status";
                          }

                          return (
                            <tr key={idx}>
                              <td className="text-capitalize">{merchant.id}</td>
                              <td className="text-capitalize">
                                {merchant.merchant_id}
                              </td>
                              <td className="text-capitalize">
                                {merchant.merchant_phone}
                              </td>
                              <td className="text-capitalize">
                                {merchant.merchant_name}
                              </td>
                              <td className="text-capitalize">
                                {merchant.merchant_type}
                              </td>
                              <td className="text-capitalize">
                                {merchant.phone_sales}
                              </td>
                              <td>
                                <span
                                  className={`badge w-100 ${merchantStatus}`}
                                >
                                  {merchant.status}
                                </span>
                              </td>
                              {auth.authority["merchant_list"] ===
                              "Full Access" ? (
                                <td>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-circle btn-more dropdown-toggle"
                                      type="button"
                                      onClick={() =>
                                        this.toggleDropdown(
                                          `show${merchant.id}`
                                        )
                                      }
                                      onBlur={(e) =>
                                        this.hide(e, `show${merchant.id}`)
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
                                        this.state[`show${merchant.id}`]
                                          ? "show"
                                          : ""
                                      }`}
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <span
                                        className="dropdown-item"
                                        style={style.link}
                                        onClick={() =>
                                          this.setState({
                                            id: merchant.id.toString(),
                                            status:
                                              merchant.status === "Active"
                                                ? "Inactive"
                                                : merchant.status === "Inactive"
                                                ? "Active"
                                                : "Active",
                                            confirmText: `${
                                              languages.confirmText
                                            } ${
                                              merchant.status === "Active"
                                                ? "Inactive"
                                                : merchant.status === "Inactive"
                                                ? "Active"
                                                : "Active"
                                            } ?`,
                                            confirmIsOpen: true,
                                          })
                                        }
                                      >
                                        {languages.setStatus}{" "}
                                        {merchant.status === "Active"
                                          ? "Inactive"
                                          : merchant.status === "Inactive"
                                          ? "Active"
                                          : "Active"}
                                      </span>
                                      <span
                                        className="dropdown-item"
                                        style={style.link}
                                        onClick={() =>
                                          this.setState({
                                            id: merchant.id.toString(),
                                            status:
                                              merchant.status === "Active"
                                                ? "Dormant"
                                                : merchant.status === "Inactive"
                                                ? "Dormant"
                                                : "Inactive",
                                            confirmText: `${
                                              languages.confirmText
                                            } ${
                                              merchant.status === "Active"
                                                ? "Dormant"
                                                : merchant.status === "Inactive"
                                                ? "Dormant"
                                                : "Inactive"
                                            } ?`,
                                            confirmIsOpen: true,
                                          })
                                        }
                                      >
                                        {languages.setStatus}{" "}
                                        {merchant.status === "Active"
                                          ? "Dormant"
                                          : merchant.status === "Inactive"
                                          ? "Dormant"
                                          : "Inactive"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              ) : (
                                <td></td>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  )}
                  {!merchants.loading && isEmpty(merchants.data) && (
                    <tbody>
                      <tr>
                        <td colSpan={8} className="text-center">
                          There is no Merchant
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination
                  pages={merchants.meta}
                  routeName="merchant"
                  parameter={newParams}
                  handleClick={(pageNumber) => this.fetchMerchant(pageNumber)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ auth, merchants }) => ({ auth, merchants }), {
  getMerchants,
  setStatusMerchant,
  getMerchantsV2,
})(Index);
