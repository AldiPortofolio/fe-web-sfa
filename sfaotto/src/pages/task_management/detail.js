import React from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getDetailTaskManagement,
  editTaskManagement,
  getCheckAdmin,
} from "../../actions/task_manegement";
import {
  Lightbox,
  Pagination,
  LoadingDots,
  NotAuthorize,
  ModalReasonAttandance,
  ModalDelete,
  ModalConfirm,
} from "../../components";
import axios from "../../actions/config";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import "moment/locale/id";
import { IconDownload } from "../../components/Icons";
import JsFileDownloader from "js-file-downloader";
import DownloadLink from "react-download-link";

const style = {
  link: {
    cursor: "pointer",
  },
};

class Detail extends React.Component {
  state = {
    isLoading: false,
    detail: {},
    callplan: [],
    todolist: [],
    id: "",

    confirmIsOpen: false,
    expandCard: false,
    type: "success",
    textSuccess: "",
    textError: "",
    isOpen: false,
    isOpen2: false,

    resultIsOpen: false,
    type: "success",
    confirmText: "",
    isReject: false,
    rejectIsOpen: false,
    textReason: "",
    resultText: "",

    confirm: false,
    typeConfirm: "success",
    textSuccessConfirm: "",
    textErrorConfirm: "",

    status: 0,
  };

  componentWillMount() {
    document.title = "SFA OTTO - Detail Sales";

    const {
      auth: { access_token },
      getDetailTaskManagement,
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    getDetailTaskManagement(this.props.match.params.id).then((data) => {
      if (data.data.status != 1) {
        this.props.history.push(
          `/task-management/detail-submit/${this.props.match.params.id}`
        );
        return;
      }
      this.setState({
        detail: data.data,
      });
    });
  }

  componentDidUpdate(prevProps, nextProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const { getDetailTaskManagement } = this.props;
      getDetailTaskManagement(this.props.match.params.id).then((data) => {
        this.setState({
          detail: data.data,
        });
      });
    }
  }

  getDataFromURL = (url) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(url)
          .then((response) => response.text())
          .then((data) => {
            resolve(data);
          });
      });
    }, 2000);

  downloadImage = (url, filename) => {
    // console.log("url", url);
    fetch(url)
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        let url2 = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url2;
        a.download = filename;
        a.click();
      });
  };

  renderPrioritas(param) {
    switch (param) {
      case "High":
        return <span style={{ color: "#E93535" }}>High</span>;
      case "Medium":
        return <span style={{ color: "#E89634" }}>Medium</span>;
      case "Low":
        return <span style={{ color: "#056EB5" }}>Low</span>;
      default:
        return "-";
    }
  }

  renderStatus(param) {
    switch (param) {
      case 1:
        return (
          <span
            className=""
            style={{
              // backgroundColor: "#EBF7FF",
              color: "#056EB5",
              // borderRadius: "0px",
            }}
          >
            Tugas Baru
          </span>
        );
      case 6:
        return (
          <span
            className=""
            style={{
              // backgroundColor: "#EBF7FF",
              color: "#056EB5",
              // borderRadius: "0px",
            }}
          >
            Ditugaskan ulang
          </span>
        );
      case 2:
        return (
          <span
            className=""
            style={{
              //   backgroundColor: "#FDF6ED",
              color: "#E89634",
              //   borderRadius: "0px",
            }}
          >
            Tugas Diproses
          </span>
        );
      case 3:
        return (
          <span
            className=""
            style={{
              //   backgroundColor: "#FDF6ED",
              color: "#E89634",
              //   borderRadius: "0px",
            }}
          >
            Tugas Diverifikasi
          </span>
        );
      case 4:
        return (
          <span
            className=""
            style={{
              //   backgroundColor: "#EEFBF7",
              color: "#2CC995",
              //   borderRadius: "0px",
            }}
          >
            Tugas Selesai
          </span>
        );
      case 5:
        return (
          <span
            className=""
            style={{
              //   backgroundColor: "#FDEDED",
              color: "#E93535",
              //   borderRadius: "0px",
            }}
          >
            Dibatalkan
          </span>
        );
      default:
        return <span>-</span>;
    }
  }

  downloadFile = (fileUrl) => {
    new JsFileDownloader({
      url: fileUrl,
    })
      .then(function () {
        // Called when download ended
      })
      .catch(function (error) {
        // Called when an error occurred
      });
  };

  handleSubmit = (e) => {
    const { detail } = this.state;
    e.preventDefault();
    this.setState({ rejectIsOpen: false }, () => {
      let recipientId = [];
      recipientId.push(detail.recipientId);

      const { status } = this.state;

      const req = {
        ...detail,
        status,
      };

      this.props
        .editTaskManagement(req)
        .then((data) => {
          if (data.meta.status == false) {
            this.setState({
              confirm: true,
              textErrorConfirm: "Gagal menerima tugas",
              typeConfirm: "error",
            });
          } else {
            this.setState({
              confirm: true,
              textSuccessConfirm:
                status == 2
                  ? "Anda telah berhasil menerima tugas, Harap perhatikan tanggal akhir tugas."
                  : status == 5
                  ? "Tugas berhasil di batalkan"
                  : "",
              textErrorConfirm: "",
            });
          }
        })
        .catch((e) =>
          this.setState({
            confirm: true,
            textErrorConfirm: e,
            typeConfirm: "error",
          })
        );
    });
  };

  render() {
    const { auth } = this.props;
    const {
      isLoading,
      detail,
      confirmIsOpen,
      resultIsOpen,
      type,
      confirmText,
      isReject,
      rejectIsOpen,
      textReason,
      resultText,
      confirm,
      typeConfirm,
      textSuccessConfirm,
      textErrorConfirm,
    } = this.state;

    const { history } = this.props;

    // if (
    //   auth.isAuthenticated &&
    //   (auth.authority["call_plan"] === "" ||
    //     auth.authority["call_plan"] === "No Access")
    // ) {
    //   return <NotAuthorize />;
    // }

    moment().locale("id");

    let validateButtonTerima = true;
    if (
      detail.status == 5 ||
      (auth.first_name == detail.senderName?.firstName &&
        auth.last_name == detail.senderName?.lastName)
    )
      validateButtonTerima = false;

    let validateButtonUlang = true;
    if (
      auth.first_name == detail.recipientName?.firstName &&
      auth.last_name == detail.recipientName?.lastName &&
      detail.status != 1
    )
      validateButtonUlang = false;

    let validateButtonBatal = true;
    if (
      detail.status == 5 ||
      (auth.first_name == detail.recipientName?.firstName &&
        auth.last_name == detail.recipientName?.lastName)
    )
      validateButtonBatal = false;

    return (
      <>
        <ModalConfirm
          confirmIsOpen={confirm}
          type={typeConfirm}
          confirmClose={() => this.setState({ confirm: false })}
          confirmSuccess={() => history.push("/task-management/")}
          textSuccess={textSuccessConfirm}
          textError={textErrorConfirm}
        />
        <ModalReasonAttandance
          placeholder="Masukan alasan pembatalan"
          headerTitle="Alasan Pembatalan Tugas"
          desc="Masukan alasan pembatalan"
          rejectIsOpen={rejectIsOpen}
          confirmClose={() => this.setState({ rejectIsOpen: false })}
          handleChange={(e) => this.setState({ textReason: e.target.value })}
          handleBack={() => this.setState({ rejectIsOpen: false })}
          handleSubmit={(e) => {
            e.preventDefault();
            this.setState({ rejectIsOpen: false }, () => {
              const { status } = this.state;
              this.props
                .editTaskManagement({
                  ...detail,
                  status,
                  reason: textReason,
                })
                .then((data) => {
                  if (data.meta.status == false) {
                    this.setState({
                      confirm: true,
                      textErrorConfirm: "Tugas gagal dibatalkan",
                      typeConfirm: "error",
                    });
                  } else {
                    this.setState({
                      confirm: true,
                      textSuccessConfirm: "Tugas berhasil di batalkan",
                      textErrorConfirm: "",
                    });
                  }
                })
                .catch((e) =>
                  this.setState({
                    confirm: true,
                    textErrorConfirm: e,
                    typeConfirm: "error",
                  })
                );
            });
          }}
          textReason={textReason}
        />
        <ModalDelete
          confirmIsOpen={confirmIsOpen}
          resultIsOpen={resultIsOpen}
          type={type}
          confirmText={confirmText}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          resultClose={() => this.setState({ resultIsOpen: false })}
          confirmYes={() => {
            if (isReject) {
              this.setState({ rejectIsOpen: true, confirmIsOpen: false });
              return;
            }

            // this.setState({ confirmIsOpen: false }, () => {
            //   validateAttendance({
            //     attendance_id: detail.id.toString(),
            //     status_after: 2,
            //     status_before: 1,
            //     reason: "",
            //   })
            //     .then((data) => {
            //       if (data.meta.status == false) {
            //         this.setState({
            //           confirm: true,
            //           textErrorConfirm: "attendance gagal diterima",
            //           typeConfirm: "error",
            //         });
            //       } else {
            //         this.setState({
            //           confirm: true,
            //           textSuccessConfirm: "attendance berhasil diterima",
            //         });
            //       }
            //     })
            //     .catch((e) =>
            //       this.setState({
            //         confirm: true,
            //         textErrorConfirm: e,
            //         typeConfirm: "error",
            //       })
            //     );
            // });
          }}
          resultText={resultText}
        />
        <div className="container mb-5 noSelect">
          <div className="row">
            <div className="col-12 mb-1">
              <div className="col-12 mb-5">
                <h2>Detail Task Management</h2>
              </div>
              <div className="col-12 mb-3">
                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <div className="card-header-blue-light">
                    <div className="col-12">
                      <div className="row justify-content-md-center">
                        <div className="col-sm">
                          <p className="mb-2 text-dark-gray">Tugas Dikirim</p>
                          <div className="" style={{ color: "#056EB5" }}>
                            {detail.assignmentDate
                              ? moment(
                                  detail.assignmentDate,
                                  "YYYY-MM-DD, H:mm"
                                ).format("dddd, DD MMM YYYY, H:mm") + " WIB"
                              : "-"}
                          </div>
                        </div>
                        <div className="col-md-auto">
                          <div style={{ margin: "0 auto" }}>
                            <p className="mb-2 text-dark-gray">&nbsp;</p>
                            <div className="" style={{ color: "#056EB5" }}>
                              &nbsp;
                            </div>
                          </div>
                        </div>
                        <div className="col-sm">
                          <div style={{ float: "right" }}>
                            <p className="mb-2 text-dark-gray">
                              Tugas Diterima
                            </p>
                            <div className="">
                              {detail.acceptDate != "0001-01-01T00:00:00Z"
                                ? moment(
                                    detail.acceptDate,
                                    "YYYY-MM-DD, H:mm"
                                  ).format("dddd, DD MMM YYYY, H:mm") + " WIB"
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="col-12">
                      <div className="row my-4 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p
                            className="text-dark-gray"
                            style={{ fontWeight: "bold" }}
                          >
                            Informasi Tugas
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Nama Tugas</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.name}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Kategori Tugas</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.jobCategoryName
                              ? detail.jobCategoryName.name
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Pemberi Tugas</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.senderName
                              ? `${detail.senderName.firstName} ${detail.senderName.lastName} (${detail.senderName.email})`
                              : "-"}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Penerima Tugas</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.recipientName
                              ? `${detail.recipientName.firstName} ${detail.recipientName.lastName} (${detail.recipientName.email})`
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tanggal Mulai Penugasan</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.assignmentDate != "0001-01-01T00:00:00Z"
                              ? moment(
                                  detail.assignmentDate,
                                  "YYYY-MM-DD"
                                ).format("dddd, DD MMM YYYY") + " WIB"
                              : "-"}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tanggal Akhir Penugsan</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.deadline != "0001-01-01T00:00:00Z"
                              ? moment(detail.deadline, "YYYY-MM-DD").format(
                                  "dddd, DD MMM YYYY"
                                ) + " WIB"
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Prioritas</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {this.renderPrioritas(detail.jobPriority)}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Status</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {this.renderStatus(detail.status)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {detail.jobDescriptions &&
                      detail.jobDescriptions.map((obj, idx) => {
                        return (
                          <>
                            <div className="col-12 mt-3 border-top">
                              <div className="row my-4 mr-3">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p
                                    className="mb-0 pb-0 text-dark-gray"
                                    style={{
                                      fontWeight: "bold",
                                      marginBottom: "0",
                                    }}
                                  >
                                    Deskripsi Tugas
                                  </p>
                                </div>
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: obj.description,
                                    }}
                                    className="mb-5"
                                  ></div>

                                  {obj.descLink &&
                                    obj.descLink.map((obj, idx) => (
                                      <>
                                        {idx > 0 && <span>&nbsp;</span>}
                                        <div
                                          key={idx}
                                          style={{
                                            backgroundColor: "#f0f2f0",
                                            height: "20px",
                                            padding: "3px",
                                            position: "relative",
                                            borderRadius: "4px",
                                            fontSize: "10px",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          <span
                                            style={{
                                              color: "#056EB5",
                                              alignItems: "center",
                                              display: "flex",
                                              marginTop: "-12px",
                                            }}
                                          >
                                            {obj.fileName}{" "}
                                            <span style={{ color: "#000000" }}>
                                              &nbsp;({obj.size})
                                            </span>
                                            <span
                                              className=""
                                              style={{ color: "#000000" }}
                                            >
                                              &nbsp; &nbsp;
                                              <button
                                                type="button"
                                                className="btn btn-link text-primary"
                                                onClick={() =>
                                                  this.downloadImage(
                                                    obj.url,
                                                    obj.fileName
                                                  )
                                                }
                                              >
                                                <IconDownload />
                                              </button>
                                            </span>
                                          </span>
                                        </div>
                                      </>
                                    ))}
                                </div>
                              </div>
                            </div>
                            <div className="col-12 mt-3 border-top">
                              <div className="row my-4 mr-3">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p
                                    className="mb-0 pb-0 text-dark-gray"
                                    style={{
                                      fontWeight: "bold",
                                      marginBottom: "0",
                                    }}
                                  >
                                    Catatan Tugas
                                  </p>
                                </div>
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: obj.note ? obj.note : "-",
                                    }}
                                    className="mb-5"
                                  ></div>

                                  {obj.noteLink &&
                                    obj.noteLink.map((obj, idx) => (
                                      <>
                                        {idx > 0 && <span>&nbsp;</span>}
                                        <div
                                          key={idx}
                                          style={{
                                            backgroundColor: "#f0f2f0",
                                            height: "20px",
                                            padding: "3px",
                                            position: "relative",
                                            borderRadius: "4px",
                                            fontSize: "10px",
                                          }}
                                        >
                                          <span
                                            style={{
                                              color: "#056EB5",
                                              alignItems: "center",
                                              display: "flex",
                                              marginTop: "-12px",
                                            }}
                                          >
                                            {obj.fileName}{" "}
                                            <span style={{ color: "#000000" }}>
                                              &nbsp;({obj.size})
                                            </span>
                                            <span style={{ color: "#000000" }}>
                                              &nbsp; &nbsp;
                                              <button
                                                type="button"
                                                className="btn btn-link text-primary"
                                                onClick={() =>
                                                  this.downloadImage(
                                                    obj.url,
                                                    obj.fileName
                                                  )
                                                }
                                              >
                                                <IconDownload />
                                              </button>
                                            </span>
                                          </span>
                                        </div>
                                      </>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    <div className="col-12 mt-6 border-top">
                      <div className="row my-4">
                        <div className="col-12">
                          <div className="row">
                            {validateButtonBatal && (
                              <div className="col-sm">
                                <div className="row">
                                  <div className="actions d-flex justify-content-start mb-3">
                                    <div
                                      className="btn-group mr-2"
                                      role="group"
                                      aria-label="Second group"
                                    >
                                      <button
                                        className="btn btn-outline-primary text-primary "
                                        // disabled={disabledStatusExport}
                                        style={{
                                          backgroundColor: "transparent",
                                        }}
                                        onClick={() =>
                                          this.setState(
                                            {
                                              confirmIsOpen: true,
                                              confirmText:
                                                "apakah anda yakin ingin membatalkan tugas ini?",
                                              isReject: true,
                                              status: 5,
                                            },
                                            () => {}
                                          )
                                        }
                                      >
                                        Batalkan Tugas
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="col-sm">
                              <div className="float-right row">
                                <div
                                  className="actions d-flex justify-content-end mb-3"
                                  style={{ float: "right" }}
                                >
                                  {/* {validateButtonUlang && (
                                    <div
                                      className="btn-group mr-2"
                                      role="group"
                                      aria-label="Second group"
                                    >
                                      <button
                                        className="btn btn-link btn-outline-primary text-primary "
                                        // disabled={disabledStatusExport}
                                        style={{
                                          backgroundColor: "transparent",
                                        }}
                                        onClick={() =>
                                          this.setState(
                                            {
                                              confirmIsOpen: true,
                                              confirmText:
                                                "apakah anda yakin ingin menugaskan ulang tugas?",
                                              isReject: true,
                                            },
                                            () => {}
                                          )
                                        }
                                      >
                                        Tugaskan Ulang
                                      </button>
                                    </div>
                                  )} */}
                                  {validateButtonTerima && (
                                    <div
                                      className="btn-group"
                                      role="group"
                                      aria-label="Second group"
                                    >
                                      <form onSubmit={this.handleSubmit}>
                                        <button
                                          type="submit"
                                          className={`btn btn-primary w-100 ${
                                            isLoading ? "disabled" : ""
                                          }`}
                                          style={{}}
                                          onClick={() => {
                                            this.setState(
                                              {
                                                confirm: true,
                                                textSuccessConfirm:
                                                  "Anda telah berhasil menerima tugas, Harap perhatikan tanggal akhir tugas.",
                                                status: 2,
                                              },
                                              () => {}
                                            );
                                          }}
                                        >
                                          {isLoading ? (
                                            <LoadingDots />
                                          ) : (
                                            "Terima Tugas"
                                          )}
                                        </button>
                                      </form>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 mb-0">
                <hr className="content-hr" />
                <div className="col-12 row">
                  <div className="col-12 row form-inline">
                    <div className="col-lg-10 row">
                      <button
                        onClick={() => history.push("/task-management/")}
                        className="btn btn-default w-20"
                      >
                        Back
                      </button>
                    </div>
                  </div>
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
  ({ auth, task_management }) => ({ auth, task_management }),
  {
    getDetailTaskManagement,
    editTaskManagement,
    getCheckAdmin,
  }
)(Detail);
