import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import {
  getRequestDetail,
  changeRequestStatus,
  changeRequestStatusV2,
} from "../../actions/request";
import {
  ModalConfirm,
  ModalReason,
  LoadingDots,
  Lightbox,
  ModalDelete,
} from "../../components";
import moment from "moment";
import { ind, en } from "../../languages/request";

// const svgStyle = {
//   height: '18px',
//   width: '18px'
// }

class Detail extends React.Component {
  state = {
    id: null,
    salesman: {},
    changes: {},
    positions: {},
    meta: [],
    requestStatus: "badge-gray",
    userRole: "",
    confirmIsOpen: false,
    rejectIsOpen: false,
    expandCard: false,
    type: "success",
    textSuccess: "",
    textReason: "",
    textError: "",
    status: "",
    regionalProvince: "",
    regionalCity: "",
    isLoading: false,
    languages: {},
    isOpen: false,
    isOpen2: false,
    isOpenChange: false,
    isOpenChange2: false,
    confirmIsOpenStatus: false,
    resultIsOpenStatus: false,
    confirmTextStatus: "",
    resultTextStatus: "",
  };

  componentDidMount() {
    const { auth, getRequestDetail } = this.props;
    document.title = "SFA OTTO - Detail Sales";

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.detail });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.detail });
    }

    let userRole;

    if (!isEmpty(auth.position)) {
      userRole =
        auth.position.toLowerCase() === "checker" ? "checker" : "maker";
    } else {
      userRole = auth.role.toLowerCase() === "checker" ? "checker" : "maker";
    }

    this.setState({ userRole: userRole });

    getRequestDetail(this.props.match.params.id).then((data) => {
      if (!isEmpty(data.data.salesman)) {
        let meta = data.data.meta;
        let requestStatus;
        let changes = isEmpty(meta.changes) ? [] : meta.changes;
        let newPositions = isEmpty(data.data.salesman.positions)
          ? []
          : data.data.salesman.positions;

        if (meta.status === "Rejected") {
          requestStatus = "badge-danger";
        } else if (meta.status === "Approved") {
          requestStatus = "badge-status";
        } else {
          requestStatus = "badge-gray";
        }

        this.setState({
          salesman: data.data.salesman,
          changes: changes,
          position: data.data.salesman.position,
          positions: newPositions,
          meta: meta,
          requestStatus: requestStatus,
        });
      }
    });
  }

  handleChanges(actionType, merchant_exist = false) {
    let id = this.state.meta.id.toString();
    let requestChange = {
      id: id,
      status: actionType,
      note: "",
      merchant_exist: merchant_exist,
    };
    // var requestChangeMessage = "Request Aproved"

    if (actionType === 2) {
      requestChange["note"] = this.state.textReason;
      // requestChangeMessage = "Request Rejected"
    }

    this.props.changeRequestStatusV2(requestChange).then((data) => {
      if (data.meta.status === false) {
        if (data.meta.code === 424) {
          this.setState({
            confirmIsOpenStatus: true,
            type: "success",
            isLoading: false,
            confirmTextStatus:
              "Nomor HP Salesman telah terdaftar sebagai merchant. Apakah anda ingin melanjutkan proses registrasi?",
          });
        } else {
          this.setState({
            confirmIsOpen: true,
            type: "error",
            isLoading: false,
            textError: data.meta.message,
          });
        }
      } else {
        this.setState({
          confirmIsOpen: true,
          type: "success",
          isLoading: false,
          textSuccess: data.meta.message,
        });
      }
    });
  }

  render() {
    const { history } = this.props;
    const {
      salesman,
      changes,
      meta,
      requestStatus,
      positions,
      userRole,
      confirmIsOpen,
      rejectIsOpen,
      type,
      textSuccess,
      textReason,
      textError,
      isLoading,
      languages,
      isOpen,
      isOpen2,
      isOpenChange,
      isOpenChange2,
      confirmIsOpenStatus,
      resultIsOpenStatus,
      confirmTextStatus,
      resultTextStatus,
    } = this.state;

    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({ confirmIsOpen: false })}
            confirmSuccess={() => history.push("/requests")}
            textSuccess={textSuccess}
            textError={textError}
          />

          <ModalReason
            rejectIsOpen={rejectIsOpen}
            confirmClose={() => this.setState({ rejectIsOpen: false })}
            handleChange={(e) => this.setState({ textReason: e.target.value })}
            handleSubmit={() =>
              this.setState({ rejectIsOpen: false }, this.handleChanges("2"))
            }
            textReason={textReason}
          />

          <ModalDelete
            confirmIsOpen={confirmIsOpenStatus}
            resultIsOpen={resultIsOpenStatus}
            type={type}
            confirmText={confirmTextStatus}
            confirmClose={() => this.setState({ confirmIsOpenStatus: false })}
            resultClose={() => this.setState({ resultIsOpenStatus: false })}
            confirmYes={() => {
              this.handleChanges("1", true);
            }}
            resultText={resultTextStatus}
          />

          {!isEmpty(salesman) && (
            <React.Fragment>
              <div className="col-12 mb-5">
                <h2>{languages.header}</h2>
              </div>

              <div className="col-12 mb-3">
                <div className="row">
                  <div className="col-12 col-lg-8 mb-3">
                    <div className="card mb-4">
                      <div className="card-body">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-lg-9 p-0 text-center d-flex flex-row align-items-center">
                              <div
                                className={`avatar d-flex justify-content-center align-items-center`}
                              >
                                {salesman["photo"] === "" ? (
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
                                    onClick={() =>
                                      this.setState({ isOpen: true })
                                    }
                                    src={salesman["photo"]}
                                    className="avatar justify-content-center align-items-center pointerYes"
                                    alt=""
                                  />
                                )}
                                <Lightbox
                                  isOpen={isOpen}
                                  images={salesman["photo"]}
                                  confirmClose={() =>
                                    this.setState({ isOpen: false })
                                  }
                                />
                              </div>
                              {changes["photo"] && (
                                <React.Fragment>
                                  <div className="text-center d-flex flex-column align-items-center justify-content-center">
                                    <span className="text-blue">
                                      <i className="la la-arrow-right mx-2"></i>
                                    </span>
                                  </div>
                                  <div className="avatar d-flex justify-content-center align-items-center">
                                    <span className="text-blue">
                                      <img
                                        onClick={() =>
                                          this.setState({ isOpenChange: true })
                                        }
                                        src={changes["photo"]}
                                        className="avatar justify-content-center align-items-center pointerYes"
                                        alt=""
                                      />
                                    </span>
                                    <Lightbox
                                      isOpen={isOpenChange}
                                      images={changes["photo"]}
                                      confirmClose={() =>
                                        this.setState({ isOpenChange: false })
                                      }
                                    />
                                  </div>
                                </React.Fragment>
                              )}
                              <div className="d-flex ml-3 flex-column align-items-start">
                                <p className="mb-0">
                                  <strong>
                                    {salesman["first_name"]}{" "}
                                    {salesman["last_name"]}
                                  </strong>
                                </p>
                                {/* <p className="mb-0 text-gray">ID SFA {salesman["sfa_id"]}</p> */}
                                <p className="mb-0 text-gray">
                                  {languages.idSfa}{" "}
                                  {meta["id"] ? meta["id"] : " -"}{" "}
                                </p>
                              </div>
                            </div>
                            <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                              <strong className="mb-0 text-primary">
                                <small>{languages.status}</small>
                              </strong>
                              <span
                                className={`badge ${
                                  [
                                    "Unregistered",
                                    "Inactive",
                                    undefined,
                                  ].includes(salesman["status"])
                                    ? "badge-gray"
                                    : "badge-status"
                                }`}
                              >
                                {meta["status"] ? meta["status"] : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card-footer border-top">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-lg-6 d-flex flex-column"></div>
                            <div className="col-12 col-lg-6 d-flex flex-column">
                              <small>
                                <strong className="mb-0">
                                  {languages.idCard}
                                </strong>
                              </small>
                              <div className="id-card d-flex flex-row align-items-center mt-1">
                                {/* <i onClick={() => this.setState({isOpen2: true})} className="la la-image text-gray mr-2 pointerYes"></i> */}
                                <img
                                  onClick={() =>
                                    this.setState({ isOpen2: true })
                                  }
                                  src={salesman["id_card_pic"]}
                                  className="id-card justify-content-center align-items-center pointerYes"
                                  alt=""
                                />
                                <Lightbox
                                  isOpen={isOpen2}
                                  images={salesman["id_card_pic"]}
                                  confirmClose={() =>
                                    this.setState({ isOpen2: false })
                                  }
                                />

                                {changes["id_card"] && (
                                  <React.Fragment>
                                    <span className="text-blue">
                                      <i className="la la-arrow-right mx-2"></i>
                                    </span>

                                    <span className="text-blue">
                                      <img
                                        onClick={() =>
                                          this.setState({ isOpenChange2: true })
                                        }
                                        src={changes["id_card"]}
                                        className="id-card justify-content-center align-items-center pointerYes"
                                        alt=""
                                      />
                                    </span>
                                    <Lightbox
                                      isOpen={isOpenChange2}
                                      images={changes["id_card"]}
                                      confirmClose={() =>
                                        this.setState({ isOpenChange2: false })
                                      }
                                    />
                                  </React.Fragment>
                                )}
                              </div>
                              {/* {changes["id_card"] && 
                              <React.Fragment>
                                <div className="text-center d-flex flex-column">
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                  </span>
                                </div>
                                <div className="id-card d-flex">
                                  <span className="text-blue">
                                    <img onClick={() => this.setState({isOpenChange: true})} src={changes["id_card"]} className="id-card justify-content-center align-items-center pointerYes" />
                                  </span>
                                  <Lightbox isOpen={isOpenChange} images={changes["id_card"]} confirmClose={() => this.setState({isOpenChange: false})}/>
                                </div>
                              </React.Fragment>
                              } */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4">
                      <div className="card-body">
                        <h6>{languages.header2}</h6>
                        <div className="col-12 mt-3">
                          <div className="row">
                            <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>{languages.email}</small>
                              </strong>
                              <p className="mb-0 canSelect">
                                {salesman["email"]}
                                {changes["email"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["email"]}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>{languages.jabatan}</small>
                              </strong>
                              <p className="mb-0">
                                {salesman["occupation"]
                                  ? salesman["occupation"]
                                  : "N/A"}
                                {changes["occupation"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["occupation"]}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>{languages.phone}</small>
                              </strong>
                              <p className="mb-0 canSelect">
                                {salesman["phone"]}
                                {changes["phone_number"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["phone_number"]}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body border-top">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-lg-6 p-lg-0 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>{languages.companyCode}</small>
                              </strong>
                              <p>
                                {salesman["company_code"]}
                                {changes["company_code"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["company_code"]}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="col-12 col-lg-6 p-lg-0 text-right d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>{languages.idSales}</small>
                              </strong>
                              <p>
                                {salesman["sales_id"]
                                  ? salesman["sales_id"]
                                  : "N/A"}
                                {changes["sales_id"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["sales_id"]}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4">
                      <div className="card-body">
                        <h6>{languages.header3}</h6>
                        <div className="col-12 mt-4">
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.noKtp}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {salesman["id_number"]
                                  ? salesman["id_number"]
                                  : "N/A"}
                                {changes["id_number"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["id_number"]}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.tempatLahir}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {salesman["birth_place"]
                                  ? salesman["birth_place"]
                                  : "N/A"}
                                {changes["birth_place"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["birth_place"]}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.tanggalLahir}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {/* moment(salesman["dob"], "DD-MM-YYYY").format("DD MMM YYYY")  */}
                                {salesman["dob"]
                                  ? moment(
                                      salesman["dob"],
                                      "DD-MM-YYYY"
                                    ).format("DD MMM YYYY")
                                  : "N/A"}
                                {changes["dob"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {moment(
                                      changes["dob"],
                                      "DD-MM-YYYY"
                                    ).format("DD MMM YYYY")}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.tanggalMasuk}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {salesman["work_date"]
                                  ? moment(
                                      salesman["work_date"],
                                      "DD-MM-YYYY"
                                    ).format("DD MMM YYYY")
                                  : "N/A"}
                                {changes["work_date"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {moment(
                                      changes["work_date"],
                                      "DD-MM-YYYY"
                                    ).format("DD MMM YYYY")}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.salesType}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {salesman["sales_types"].length !== 0
                                  ? salesman["sales_types"].map(
                                      (salestype, i) =>
                                        salestype.name +
                                        `${
                                          salesman["sales_types"].length > 1 ||
                                          (salesman["sales_types"].length > 1 &&
                                            i ===
                                              salesman["sales_types"].length -
                                                1)
                                            ? ", "
                                            : ""
                                        }`
                                    )
                                  : "-"}
                                {changes["sales_type_names"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["sales_type_names"].join(", ")}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.gender}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {salesman["gender"]
                                  ? salesman["gender"]
                                  : "N/A"}
                                {changes["gender"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["gender"]}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.address}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {salesman["address"]
                                  ? salesman["address"]
                                  : "-"}
                                {changes["address"] && (
                                  <span className="text-blue">
                                    <i className="la la-arrow-right mx-2"></i>
                                    {changes["address"]}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isEmpty(positions) &&
                      positions.map((position) => (
                        <div className="card mb-4">
                          <div className="card-body">
                            <h6 className="mb-0">{languages.header4}</h6>
                          </div>
                          <div className="card-body border-top">
                            <div className="col-12">
                              <div className="row">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    <strong>{languages.region}</strong>
                                  </p>
                                </div>
                                <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    {position.region ? position.region : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    <strong>{languages.branch}</strong>
                                  </p>
                                </div>
                                <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    {position.branch ? position.branch : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    <strong>{languages.area}</strong>
                                  </p>
                                </div>
                                <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    {position.area ? position.area : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    <strong>{languages.subArea}</strong>
                                  </p>
                                </div>
                                <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    {position.sub_area
                                      ? position.sub_area
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="mb-3">{languages.header5}</h6>
                        <div className="form-group">
                          <small className="text-gray">Name</small>
                          <p className="mb-0">{meta.maker}</p>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="form-group">
                              <small className="text-gray">
                                {languages.actionType}
                              </small>
                              <p className="mb-0">{meta.action_type}</p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-group mb-0">
                              <small className="text-gray">
                                {languages.date}
                              </small>
                              <p className="mb-0">
                                {moment(meta.request_date).format(
                                  "ddd, DD MMM YYYY"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <small className="text-gray">
                            {languages.module}
                          </small>
                          <p className="mb-0">{meta.module}</p>
                        </div>
                        <div className="form-group">
                          <small className="text-gray">
                            {languages.status}
                          </small>
                          <p className="mb-0">
                            <span className={`badge ${requestStatus}`}>
                              {meta.status}
                            </span>
                          </p>
                        </div>
                        {meta.status === "Rejected" && (
                          <div className="form-group">
                            <small className="text-gray">
                              {languages.reason}
                            </small>
                            <p className="mb-0">
                              {meta["note"] ? meta["note"] : "-"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {userRole === "checker" && meta.status === "Pending" && (
                <div className="col-12 mb-0">
                  <hr className="content-hr" />
                  <div className="form-group d-flex justify-content-end mb-0">
                    <button
                      className="btn btn-outline-danger mr-4"
                      onClick={() => this.setState({ rejectIsOpen: true })}
                    >
                      {languages.reject}
                    </button>
                    <button
                      className={`btn btn-danger ${
                        isLoading ? "disabled" : ""
                      }`}
                      disabled={isLoading}
                      onClick={() =>
                        this.setState(
                          { isLoading: true },
                          this.handleChanges("1")
                        )
                      }
                    >
                      {isLoading ? <LoadingDots /> : languages.verify}
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default connect(({ auth, sales }) => ({ auth, sales }), {
  getRequestDetail,
  changeRequestStatus,
  changeRequestStatusV2,
})(Detail);
