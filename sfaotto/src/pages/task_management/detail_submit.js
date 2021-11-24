import React from "react";
import { isEmpty, result } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getDetailTaskManagement,
  createTaskManagement,
  getCheckAdmin,
  editTaskManagement,
} from "../../actions/task_manegement";
import {
  Lightbox,
  Pagination,
  LoadingDots,
  NotAuthorize,
  ModalReasonAttandance,
  ModalDelete,
  ModalConfirm,
  ModalAddLink,
} from "../../components";
import axios from "../../actions/config";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import "moment/locale/id";
import { IconDownload, IconPaperClip, IconLink } from "../../components/Icons";
import { ProgressBar } from "react-bootstrap";
import { NEWAPI_V2_3 } from "../../actions/constants";
import DownloadLink from "react-download-link";

const style = {
  link: {
    cursor: "pointer",
  },
};

class DetailSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
    this.showFileUpload = this.showFileUpload.bind(this);
  }

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

    selectedFile: "",
    selectedFileName: "",
    listFilename: [],
    description: "",
    addLinkIsOpen: false,
    urlAddress: "",
    displayText: "",
    descImage: [],
    listAdmins: [],
    descLink: [],
    progress: "",

    confirmBatalIsOpen: false,
    resultBatalIsOpen: false,
    confirmBatalText: false,

    confirmValidation: false,
    typeConfirmValidation: "error",
    textSuccessConfirmValidation: "",
    textErrorConfirmValidation: "",
  };

  componentWillMount() {
    document.title = "SFA OTTO - Detail Sales";

    const {
      auth: { access_token },
      getDetailTaskManagement,
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    getDetailTaskManagement(this.props.match.params.id).then((data) => {
      this.setState({
        detail: data.data,
      });
    });
  }

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

  showFileUpload() {
    this.fileUpload.current.click();
  }

  getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  handleselectedFile = async (event) => {
    const { listFilename, descImage } = this.state;
    const fileName = event.target.files[0].name;
    let size = event.target.files[0].size;
    size = this.formatBytes(size);
    const base64 = await this.getBase64(event.target.files[0]);

    let arrImage = { fileName: fileName, image: base64, size };

    await this.submitAttachment(arrImage);

    listFilename.push({ size, fileName });
    descImage.push(arrImage);
    this.setState({
      listFilename,
      descImage,
    });
  };

  change(e) {
    let tmpArr = this.state.arr;
    tmpArr = e.target.innerHTML;
    this.setState({ description: tmpArr });
  }

  deleteImage = (filename) => {
    const { listFilename, descImage, descLink } = this.state;
    const list = listFilename.filter((x) => x.fileName != filename);
    const listImage = descImage.filter((x) => x.fileName != filename);
    const listLink = descLink.filter((x) => x.fileName != filename);
    this.setState({
      listFilename: list,
      descImage: listImage,
      descLink: listLink,
    });
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { detail, status, descLink, description } = this.state;
    const { auth } = this.props;

    this.setState({ rejectIsOpen: false }, () => {
      let rows = detail.jobDescriptions.length;

      let jobDescription = {};
      let jobDescriptions = [];

      if (
        auth.first_name == detail.recipientName?.firstName &&
        auth.last_name == detail.recipientName?.lastName
      ) {
        jobDescription = detail.jobDescriptions[rows - 1];

        jobDescriptions = detail.jobDescriptions.filter(
          (x) => x.id != jobDescription.id
        );
        jobDescription.note = description;
        jobDescription.noteLink = descLink;
        jobDescriptions.push(jobDescription);
      } else {
        jobDescriptions = detail.jobDescriptions;
      }

      if (description == "" && status != 4) {
        let textError = "Descriprion is required";
        if (
          auth.first_name == detail.recipientName?.firstName &&
          auth.last_name == detail.recipientName?.lastName
        ) {
          textError = "Catatan is required";
        }
        this.setState({
          confirmValidation: true,
          textErrorConfirmValidation: textError,
        });
        return null;
      }

      const req = {
        ...detail,
        status,
        jobDescriptions,
      };

      this.props
        .editTaskManagement(req)
        .then((data) => {
          if (data.meta.status == false) {
            this.setState({
              confirm: true,
              textErrorConfirm: "Tugas gagal dikirimkan",
              typeConfirm: "error",
            });
          } else {
            this.setState({
              confirm: true,
              textSuccessConfirm:
                status == 3
                  ? "Anda telah berhasil mengirim tugas."
                  : status == 5
                  ? "Tugas berhasil dibatalkan"
                  : status == 4
                  ? "Tugas berhasil diterima"
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

  submitAttachment = async (obj) => {
    const { descLink } = this.state;
    this.setState({ isLoading: true });
    axios
      .post(
        NEWAPI_V2_3 + "/upload-image",
        {
          BucketName: "ottodigital",
          NameFile: obj.fileName,
          Data: obj.image,
          ContentType: obj.fileName.split(".").pop(),
        },
        {
          onUploadProgress: (data) => {
            this.setState({
              progress: Math.round((100 * data.loaded) / data.total),
            });
          },
        }
      )
      .then((data) => {
        let list = descLink;
        if (result(data, "data")) {
          list.push({
            url: data.data.data.Url,
            fileName: obj.fileName,
            size: obj.size,
          });
          this.setState({ descLink: list, isLoading: false });
        }
      });
  };

  renderLabelStatusAndDate = (param) => {
    const { detail } = this.state;
    switch (param) {
      case 1:
        return (
          <div>
            <p className="mb-2 text-dark-gray">Tugas Diterima</p>
            <div className="" style={{ color: "#056EB5" }}>
              -
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <p className="mb-2 text-dark-gray">Tugas Diproses</p>
            <div className="" style={{ color: "#056EB5" }}>
              {detail.acceptDate != "0001-01-01T00:00:00Z"
                ? moment(detail.acceptDate, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"
                : moment(detail.updatedAt, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="mb-2 text-dark-gray">Tugas Diverifikasi</p>
            <div className="" style={{ color: "#056EB5" }}>
              {detail.deliverDate != "0001-01-01T00:00:00Z"
                ? moment(detail.deliverDate, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"
                : moment(detail.updatedAt, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="mb-2 text-dark-gray">Tugas Diterima</p>
            <div className="" style={{ color: "#056EB5" }}>
              {detail.completeDate != "0001-01-01T00:00:00Z"
                ? moment(detail.completeDate, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"
                : moment(detail.updatedAt, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <p className="mb-2 text-dark-gray">Tugas Dibatalkan</p>
            <div className="" style={{ color: "#056EB5" }}>
              {detail.cancelDate != "0001-01-01T00:00:00Z"
                ? moment(detail.cancelDate, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"
                : moment(detail.updatedAt, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"}
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <p className="mb-2 text-dark-gray">Ditugaskan Ulang</p>
            <div className="" style={{ color: "#056EB5" }}>
              {detail.resendDate != "0001-01-01T00:00:00Z"
                ? moment(detail.resendDate, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"
                : moment(detail.updatedAt, "YYYY-MM-DD, H:mm").format(
                    "dddd, DD MMM YYYY, H:mm"
                  ) + " WIB"}
            </div>
          </div>
        );
      default:
        return <span>-</span>;
    }
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
      description,
      listFilename,
      addLinkIsOpen,
      urlAddress,
      displayText,
      progress,
      confirmBatalIsOpen,
      resultBatalIsOpen,
      confirmBatalText,
      confirmValidation,
      typeConfirmValidation,
      textSuccessConfirmValidation,
      textErrorConfirmValidation,
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

    let validateButtonKirim = false;
    if (
      (detail.status == 2 || detail.status == 6) &&
      auth.first_name == detail.recipientName?.firstName &&
      auth.last_name == detail.recipientName?.lastName
    )
      validateButtonKirim = true;

    let validateButtonTerima = false;
    let validateButtonUlang = false;

    if (
      detail.status == 3 &&
      auth.first_name == detail.senderName?.firstName &&
      auth.last_name == detail.senderName?.lastName
    ) {
      validateButtonTerima = true;
      validateButtonUlang = true;
    }

    let validateButtonBatal = false;
    if (
      detail.status != 5 &&
      detail.status != 4 &&
      detail.status != 2 &&
      auth.first_name == detail.senderName?.firstName &&
      auth.last_name == detail.senderName?.lastName
    ) {
      validateButtonBatal = true;
    }

    return (
      <>
        <ModalAddLink
          open={addLinkIsOpen}
          confirmClose={() => this.setState({ addLinkIsOpen: false })}
          handleChange={this.handleChange}
          handleBack={() => this.setState({ addLinkIsOpen: false })}
          handleSubmit={() => {
            const { description, urlAddress, displayText } = this.state;
            let content = `
              ${description} <a href="${urlAddress}" target="_blank" >${displayText}</a>
            `;
            this.setState({
              description: content,
              addLinkIsOpen: false,
              urlAddress: "",
              displayText: "",
            });
          }}
          urlAddress={urlAddress}
          displayText={displayText}
        />
        <ModalConfirm
          confirmIsOpen={confirm}
          type={typeConfirm}
          confirmClose={() => this.setState({ confirm: false })}
          confirmSuccess={() => history.push("/task-management/")}
          textSuccess={textSuccessConfirm}
          textError={textErrorConfirm}
        />
        <ModalConfirm
          confirmIsOpen={confirmValidation}
          type={typeConfirmValidation}
          confirmClose={() => this.setState({ confirmValidation: false })}
          confirmSuccess={() => this.setState({ confirmValidation: false })}
          textSuccess={textSuccessConfirmValidation}
          textError={textErrorConfirmValidation}
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
          confirmYes={() =>
            history.push(`/task-management/reassign/${detail.id}`)
          }
          resultText={resultText}
        />

        <ModalDelete
          confirmIsOpen={confirmBatalIsOpen}
          resultIsOpen={resultBatalIsOpen}
          type={type}
          confirmText={confirmBatalText}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          resultClose={() => this.setState({ resultIsOpen: false })}
          confirmYes={() => {
            if (isReject) {
              this.setState({ rejectIsOpen: true, confirmBatalIsOpen: false });
              return;
            }
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
                            {this.renderLabelStatusAndDate(detail.status)}
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
                                          }}
                                        >
                                          <span
                                            style={{
                                              color: "#056EB5",
                                              alignItems: "center",
                                              display: "flex",
                                              whiteSpace: "nowrap",
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
                                {!obj.note &&
                                auth.first_name ==
                                  detail.recipientName?.firstName &&
                                auth.last_name ==
                                  detail.recipientName?.lastName &&
                                detail.status != 4 &&
                                detail.status != 5 ? (
                                  <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                    <div className="form-group">
                                      <label className="">Catatan Tugas</label>
                                      <div
                                        style={{
                                          width: "100%",
                                          height: "200px",
                                          margin: "0 auto",
                                          overflow: "auto",
                                          border: "1px solid black",
                                          padding: "5px 10px",
                                          textAlign: "justify",
                                          background: "transparent",
                                          resize: "both",
                                          position: "relative",
                                          borderRadius: "5px",
                                        }}
                                        // contentEditable={true}
                                        // suppressContentEditableWarning={true}
                                      >
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            margin: "0 auto",
                                            overflow: "auto",
                                            textAlign: "justify",
                                            background: "transparent",
                                            resize: "both",
                                            boxShadow: "none",
                                            outline: "none",
                                          }}
                                          ref="textarea"
                                          dangerouslySetInnerHTML={{
                                            __html: description,
                                          }}
                                          onBlur={(e) => this.change(e)}
                                          contentEditable={true}
                                          suppressContentEditableWarning={true}
                                        ></div>

                                        <div
                                          style={{
                                            position: "absolute",
                                            bottom: "0px",
                                            left: "0",
                                            padding: "5px 10px",
                                          }}
                                        >
                                          {listFilename &&
                                            listFilename.map((obj, idx) => (
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
                                                  }}
                                                >
                                                  <span
                                                    align="center"
                                                    style={{
                                                      position: "absolute",
                                                      top: "-7px",
                                                      right: "-7px",
                                                      backgroundColor:
                                                        "#E93535",
                                                      borderRadius: "60%",
                                                      width: "15px",
                                                      height: "15px",
                                                      color: "#ffffff",
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                      this.deleteImage(
                                                        obj.fileName
                                                      )
                                                    }
                                                  >
                                                    &times;
                                                  </span>
                                                  <span
                                                    style={{
                                                      color: "#056EB5",
                                                      alignItems: "center",
                                                      display: "flex",
                                                    }}
                                                  >
                                                    {obj.fileName}{" "}
                                                    <span
                                                      style={{
                                                        color: "#000000",
                                                      }}
                                                    >
                                                      &nbsp;({obj.size})
                                                    </span>
                                                  </span>
                                                </div>
                                              </>
                                            ))}
                                        </div>
                                      </div>

                                      <div className="mt-2">
                                        {progress && progress != 100 && (
                                          <ProgressBar
                                            now={progress}
                                            label={`${progress}%`}
                                          />
                                        )}
                                      </div>

                                      <div className="mt-2">
                                        <span
                                          style={style.link}
                                          onClick={this.showFileUpload}
                                        >
                                          <IconPaperClip />
                                          <input
                                            type="file"
                                            id="my_file"
                                            style={{ display: "none" }}
                                            ref={this.fileUpload}
                                            onChange={this.handleselectedFile}
                                          />
                                        </span>
                                        <span
                                          style={style.link}
                                          className="ml-2"
                                          onClick={() =>
                                            this.setState({
                                              addLinkIsOpen: true,
                                            })
                                          }
                                        >
                                          <IconLink />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                    <div>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: obj.note,
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
                                                  whiteSpace: "nowrap",
                                                  marginTop: "-12px",
                                                }}
                                              >
                                                {obj.fileName}{" "}
                                                <span
                                                  style={{ color: "#000000" }}
                                                >
                                                  &nbsp;({obj.size})
                                                </span>
                                                <span
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
                                )}
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
                                              confirmBatalIsOpen: true,
                                              confirmBatalText:
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
                                  {validateButtonUlang && (
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
                                              // isReject: true,
                                            },
                                            () => {}
                                          )
                                        }
                                      >
                                        Tugaskan Ulang
                                      </button>
                                    </div>
                                  )}
                                  {validateButtonKirim && (
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
                                                status: 3,
                                              },
                                              () => {}
                                            );
                                          }}
                                        >
                                          {isLoading ? (
                                            <LoadingDots />
                                          ) : (
                                            "Kirim Tugas"
                                          )}
                                        </button>
                                      </form>
                                    </div>
                                  )}
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
                                                // confirm: true,
                                                // textSuccessConfirm:
                                                //   "Anda telah berhasil menerima tugas",
                                                status: 4,
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
    createTaskManagement,
    getCheckAdmin,
    editTaskManagement,
  }
)(DetailSubmit);
