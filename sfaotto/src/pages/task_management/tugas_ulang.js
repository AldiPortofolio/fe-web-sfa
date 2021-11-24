import React, { Component } from "react";
import { IconPaperClip, IconLink, IconDownload } from "../../components/Icons";
import {
  ModalDelete,
  ModalConfirm,
  Pagination,
  LoadingDots,
  NotAuthorize,
  SelectLineComponent,
  SelectRequired,
  DatePickerSelect,
} from "../../components";
import { ModalAddLink } from "../../components";
import { connect } from "react-redux";
import { getCategories } from "../../actions/task_category";
import { getAdminsV2_1 } from "../../actions/admin";
import { debounce, isEmpty, find, result } from "lodash";
import moment from "moment";
import "moment/locale/id";
import {
  createTaskManagement,
  getTaskManagement,
  getDetailTaskManagement,
  editTaskManagement,
  getRecipientList,
} from "../../actions/task_manegement";
import { ProgressBar } from "react-bootstrap";
import { NEWAPI_V2_3 } from "../../actions/constants";
import axios from "../../actions/config";

const style = {
  link: {
    cursor: "pointer",
  },
};

const listPrioritas = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

class TugasUlang extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
    this.showFileUpload = this.showFileUpload.bind(this);
  }

  state = {
    detail: "",
    isLoading: false,
    name: "",
    jobCategoryId: "",
    senderId: "",
    recipientId: "",
    jobPriority: "",
    assignmentDate: "",
    deadline: "",
    confirmIsOpen: false,
    resultIsOpen: "",
    type: "success",
    confirmText: "",
    resultText: "",
    confirm: false,
    typeConfirm: "success",
    textSuccessConfirm: "",
    textErrorConfirm: "",
    isDraft: false,

    selectedFile: "",
    selectedFileName: "",
    listFilename: [],
    description: "",
    addLinkIsOpen: false,
    urlAddress: "",
    displayText: "",
    descImage: [],
    listAdmins: [],
    listCategory: [],
    progress: "",

    descLink: [],
    status: "",
    jobDescriptions: [],
  };

  componentWillMount() {
    this.props.getCategories({
      id: 0,
      name: "",
      page: 1,
      limit: 25,
    });

    const { task_category, listAdmins } = this.props;

    this.props.getRecipientList().then((data) => {
      let listAdmins = [];
      data.data.map((obj, idx) => {
        listAdmins.push({
          value: obj.id,
          label: obj.firstName + " " + obj.lastName + ` (${obj.email})`,
        });
      });

      this.setState({ listAdmins });
    });

    this.props
      .getDetailTaskManagement(this.props.match.params.id)
      .then((data) => {
        const obj = data.data;
        this.setState({ ...obj, detail: obj });
      })
      .catch((e) => {});
  }

  downloadImage = (url, filename) => {
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

  filterAdmins = async (inputValue) => {
    let newAdmins = [];
    let keyword = inputValue.toString();

    if (keyword.length > 0) {
      newAdmins.push({ value: "", label: "Searching...", disabled: true });
      this.setState({ listAdmins: newAdmins });

      this.props.getRecipientList({ keyword: keyword }).then((data) => {
        let newAdmins = [];
        if (data.data != null) {
          data.data.map((newAdmin) => {
            return newAdmins.push({
              value: newAdmin.id,
              label: `${newAdmin.firstName} ${newAdmin.lastName} (${newAdmin.email})`,
            });
          });
        }
        this.setState({ listAdmins: newAdmins });
      });
    } else {
      newAdmins.push({ value: "", label: "No Options", disabled: true });
      this.setState({ listAdmins: newAdmins });
    }
  };

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

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
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

  handleSubmit = (e) => {
    e.preventDefault();
    moment().locale("id");
    const {
      name,
      jobCategoryId,
      jobPriority,
      deadline,
      descImage,
      description,
      recipientId,
      isDraft,
      status,
      detail,
      descLink,
      jobDescriptions,
    } = this.state;

    // let jobDescriptions = detail.jobDescriptions;
    // jobDescriptions.push({
    //   descLink: descLink,
    //   description,
    //   id: 0,
    //   jobManagementId: 0,
    //   note: "",
    //   noteLink: [],
    // });

    let jobDescriptionsNew = jobDescriptions;

    let job =
      jobDescriptionsNew.length > 0
        ? jobDescriptionsNew[jobDescriptionsNew.length - 1]
        : {};

    jobDescriptionsNew.push({
      descLink: descLink.length > 0 ? descLink : job.descLink,
      description: description == "" ? job.description : description,
      id: 0,
      jobManagementId: job.jobManagementId,
      note: "",
      noteLink: [],
    });

    const req = {
      ...detail,
      status,
      jobDescriptions: jobDescriptionsNew,
    };

    this.props
      .editTaskManagement(req)
      .then(() => {
        this.setState({
          confirm: true,
          textSuccessConfirm: "Penugasan ulang telah berhasil",
          textErrorConfirm: "",
        });
      })
      .catch((e) => {
        this.setState({
          confirm: false,
          textSuccessConfirm: "",
          textErrorConfirm: e,
          typeConfirm: "error",
        });
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

  render() {
    const {
      isLoading,
      name,
      jobCategoryId,
      senderId,
      recipientId,
      jobPriority,
      deadline,
      isDraft,

      confirmIsOpen,
      resultIsOpen,
      type,
      confirmText,
      resultText,
      confirm,
      typeConfirm,
      textSuccessConfirm,
      textErrorConfirm,

      addLinkIsOpen,
      listFilename,
      description,
      urlAddress,
      displayText,
      listAdmins,
      assignmentDate,
      detail,
      progress,
      jobDescriptions,
    } = this.state;
    const { task_category, auth, history } = this.props;

    moment().locale("id");
    const dateFrom = moment().format("DD-MM-YYYY");
    let listCategory = [];
    if (!task_category.loading) {
      if (task_category.data) {
        task_category.data.map((obj, idx) => {
          listCategory.push({ value: obj.id, label: obj.name });
          if (obj.id == jobCategoryId) {
            this.setState({
              jobCategoryId: { value: obj.id, label: obj.name },
            });
          }
        });
      }
    }

    const recipient =
      find(listAdmins, {
        value: detail.recipientId,
      }) || "";

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
        <ModalDelete
          confirmIsOpen={confirmIsOpen}
          resultIsOpen={resultIsOpen}
          type={type}
          confirmText={confirmText}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          resultClose={() => this.setState({ resultIsOpen: false })}
          confirmYes={() => {
            this.setState({ confirmIsOpen: false }, () => {
              const {
                name,
                jobCategoryId,
                jobPriority,
                deadline,
                descImage,
                description,
                recipientId,
                isDraft,
                descLink,
              } = this.state;

              let jobDescriptionsNew = jobDescriptions;

              let job =
                jobDescriptionsNew.length > 0
                  ? jobDescriptionsNew[jobDescriptionsNew.length - 1]
                  : {};

              jobDescriptionsNew.push({
                descLink: descLink.length > 0 ? descLink : job.descLink,
                description: description == "" ? job.description : description,
                id: 0,
                jobManagementId: job.jobManagementId,
                note: "",
                noteLink: [],
              });

              let req = {
                ...detail,
                recipientId: detail.recipientId,
                statusStorage: true,
                jobDescriptions: jobDescriptionsNew,
                status: 6,
                assignmentDate: moment(
                  detail.assignmentDate,
                  "YYYY-MM-DD H:mm"
                ).format("YYYY-MM-DD H:mm"),
                deadline: moment(detail.deadline, "YYYY-MM-DD").format(
                  "YYYY-MM-DD"
                ),
              };

              this.props
                .editTaskManagement(req)
                .then((data) => {
                  if (data.meta.status == false) {
                    this.setState({
                      resultIsOpen: true,
                      type: "error",
                      resultText: data.meta.message,
                    });
                  } else {
                    this.setState({
                      confirm: true,
                      textSuccessConfirm:
                        "Berhasil menyimpan tugas dalam draft",
                      type: "success",
                    });
                  }
                })
                .catch((e) => {
                  this.setState({
                    confirm: false,
                    textSuccessConfirm: "",
                    textErrorConfirm: e,
                    typeConfirm: "error",
                  });
                });
            });
          }}
          resultText={resultText}
        />
        <form onSubmit={this.handleSubmit}>
          <div className="container mb-5 mt-3">
            <div className="row">
              <div className="col-12 mb-3">
                <h2>Penugasan Ulang</h2>
              </div>
              <div className="col-12 col-lg-12 mb-3">
                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <div className="card-body" style={{ borderRadius: "15px" }}>
                    <form onSubmit={() => {}}>
                      <div className="col-sm-12">
                        <div className="row">
                          <div className="col-sm-4">
                            <h4>Informasi Tugas</h4>
                            <span>
                              Isi data informasi tugas yang ingin diberikan
                              kepada Jr. Supervisor
                            </span>
                          </div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">Nama</label>
                              <input
                                onChange={this.handleChange}
                                value={name}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-sm-4"></div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">Kategori</label>
                              <input
                                onChange={this.handleChange}
                                value={jobCategoryId.label}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-sm-4"></div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">Pemberi Tugas</label>
                              <input
                                onChange={this.handleChange}
                                value={`${auth.first_name} ${auth.last_name} (${auth.email})`}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-sm-4"></div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">Penerima Tugas</label>
                              <input
                                onChange={this.handleChange}
                                value={recipient.label}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-sm-4"></div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">Prioritas</label>
                              <input
                                onChange={this.handleChange}
                                value={detail.jobPriority}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-sm-12">
                            <hr />
                          </div>
                          <div className="col-sm-4">
                            <h4>Periode Penugasan</h4>
                            <span>
                              Pilih periode penugasan yang ingin diberikan
                              kepada Jr. Supervisor
                            </span>
                          </div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">Tanggal Awal Penugasan</label>
                              <input
                                type="text"
                                className="form-control"
                                value={dateFrom}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-sm-4"></div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">
                                Tanggal Akhir Penugasan
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={moment(
                                  detail.deadline,
                                  "YYYY-MM-DD"
                                ).format("DD-MM-YYYY")}
                                readOnly
                              />
                            </div>
                          </div>
                          {detail.jobDescriptions &&
                            detail.jobDescriptions.map((obj, idx) => {
                              return (
                                <>
                                  <div className="col-12 mt-3 border-top">
                                    <div className="row my-4 mr-3">
                                      <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column ml-2">
                                        <p
                                          className="mb-0 pb-0 text-dark-gray"
                                          style={{
                                            fontWeight: "bold",
                                            marginBottom: "0",
                                          }}
                                        >
                                          <h5>Deskripsi Tugas</h5>
                                        </p>
                                      </div>
                                      <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column ml-4">
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
                                                          obj.url
                                                            .split("/")
                                                            .pop()
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
                                      <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column ml-2">
                                        <p
                                          className="mb-0 pb-0 text-dark-gray"
                                          style={{
                                            fontWeight: "bold",
                                            marginBottom: "0",
                                          }}
                                        >
                                          <h5>Catatan Tugas</h5>
                                        </p>
                                      </div>

                                      <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column ml-4">
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
                                                    <span
                                                      style={{
                                                        color: "#000000",
                                                      }}
                                                    >
                                                      &nbsp;({obj.size})
                                                    </span>
                                                    <span
                                                      style={{
                                                        color: "#000000",
                                                      }}
                                                    >
                                                      &nbsp; &nbsp;
                                                      {/* <a
                                                        href={obj.url}
                                                        className=""
                                                        rel="noopener noreferrer"
                                                        download
                                                        target="_blank"
                                                      >
                                                        <IconDownload />
                                                      </a> */}
                                                      <button
                                                        type="button"
                                                        className="btn btn-link text-primary"
                                                        onClick={() =>
                                                          this.downloadImage(
                                                            obj.url,
                                                            obj.url
                                                              .split("/")
                                                              .pop()
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
                                  </div>
                                </>
                              );
                            })}
                          <div className="col-12 mt-3 border-top">
                            <div className="row my-4 mr-3">
                              <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column ml-2">
                                <p
                                  className="mb-0 pb-0 text-dark-gray"
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0",
                                  }}
                                >
                                  <h5>Deskripsi Tugas</h5>
                                </p>
                                <span>
                                  Isi data deskripsi tugas yang ingin diberikan
                                  kepada Jr. Supervisor
                                </span>
                              </div>
                              <div className="col-12 col-lg-7 p-lg-0 text-left d-flex flex-column ml-4">
                                <div className="form-group">
                                  <label className="">Deskripsi Tugas</label>
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
                                        __html: description
                                          ? description
                                          : jobDescriptions.length > 0
                                          ? jobDescriptions[
                                              jobDescriptions.length - 1
                                            ].description
                                          : "",
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
                                      {jobDescriptions.length > 0 &&
                                        jobDescriptions[
                                          jobDescriptions.length - 1
                                        ].descLink &&
                                        jobDescriptions[
                                          jobDescriptions.length - 1
                                        ].descLink.map((obj, idx) => (
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
                                                  backgroundColor: "#E93535",
                                                  borderRadius: "60%",
                                                  width: "15px",
                                                  height: "15px",
                                                  color: "#ffffff",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  this.deleteImage(obj.fileName)
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

                                      {listFilename &&
                                        listFilename.map((obj, idx) => (
                                          <>
                                            <span>&nbsp;</span>
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
                                                  backgroundColor: "#E93535",
                                                  borderRadius: "60%",
                                                  width: "15px",
                                                  height: "15px",
                                                  color: "#ffffff",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  this.deleteImage(obj.fileName)
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
                                        this.setState({ addLinkIsOpen: true })
                                      }
                                    >
                                      <IconLink />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-12">
                            <hr />
                          </div>
                          <div className="col-sm-12">
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
                                  <button
                                    className="btn btn-link btn-outline-primary text-primary"
                                    style={{ backgroundColor: "transparent" }}
                                    onClick={() =>
                                      this.setState({
                                        confirmIsOpen: true,
                                        confirmText:
                                          "Apakah anda yakin ingin simpan tugas draft ini",
                                        isDraft: true,
                                        status: 6,
                                      })
                                    }
                                    type="button"
                                  >
                                    Simpan di Draft
                                  </button>
                                </div>
                                <div
                                  className="btn-group mr-2"
                                  role="group"
                                  aria-label="Second group"
                                >
                                  <button
                                    type="submit"
                                    className={`btn btn-primary d-flex align-items-center float-right ${
                                      isLoading ? "disabled" : ""
                                    }`}
                                    onClick={() =>
                                      this.setState({
                                        isLoading: true,
                                        isDraft: false,
                                        status: 6,
                                      })
                                    }
                                  >
                                    {isLoading ? (
                                      <LoadingDots />
                                    ) : (
                                      "Kirim Tugas"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }
}

export default connect(
  ({ task_category, auth, admins }) => ({ task_category, auth, admins }),
  {
    getCategories,
    getAdminsV2_1,
    createTaskManagement,
    getTaskManagement,
    getDetailTaskManagement,
    editTaskManagement,
    getRecipientList,
  }
)(TugasUlang);
