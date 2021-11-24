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
  SelectComponentLoad,
  SelectMultiple,
} from "../../components";
import { ModalAddLink } from "../../components";
import { connect } from "react-redux";
import { getCategories } from "../../actions/task_category";
import { getAdminsV2_1 } from "../../actions/admin";
import { debounce, isEmpty, result } from "lodash";
import moment from "moment";
import "moment/locale/id";
import {
  createTaskManagement,
  getTaskManagement,
  getDetailTaskManagement,
  getCheckAdmin,
  getRecipientList,
  editTaskManagement,
} from "../../actions/task_manegement";
import { find } from "lodash";
import { NEWAPI_V2_3 } from "../../actions/constants";
import axios from "../../actions/config";
import { ProgressBar } from "react-bootstrap";

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

class Edit extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
    this.showFileUpload = this.showFileUpload.bind(this);
  }

  state = {
    id: "",
    isLoading: false,
    name: "",
    jobCategoryId: {},
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
    jobDescriptions: [],

    selectedFile: "",
    selectedFileName: "",
    listFilename: [],
    description: "",
    addLinkIsOpen: false,
    urlAddress: "",
    displayText: "",
    descImage: [],
    descLink: [],
    listAdmins: [],
    listCategory: [],
    progress: "",
    status: 0,
    assigment_role: "",
  };

  componentDidMount() {
    this.props
      .getDetailTaskManagement(this.props.match.params.id)
      .then((data) => {
        const obj = data.data;

        this.fetchCategory(obj.jobCategoryId);
        this.fetchAdmin(obj.recipientId);

        let jobPriority =
          find(listPrioritas, {
            value: obj.jobPriority,
          }) || "";

        this.setState({ ...obj, jobPriority });
      })
      .catch((e) => {});

    this.props.getCheckAdmin().then((data) => {
      this.setState({
        assignment_role: data.data.assignmentRole,
      });
    });
  }

  fetchAdmin = (recipientId) => {
    this.props.getRecipientList().then((data) => {
      let listAdmins = [];
      data.data.map((obj, idx) => {
        listAdmins.push({
          value: obj.id,
          label: obj.firstName + " " + obj.lastName + ` (${obj.email})`,
        });

        if (obj.id == recipientId) {
          this.setState({
            recipientId: {
              value: obj.id,
              label: obj.firstName + " " + obj.lastName + ` (${obj.email})`,
            },
          });
        }
      });

      this.setState({ listAdmins });
    });
  };

  fetchCategory = (jobCategoryId) => {
    this.props
      .getCategories({
        id: 0,
        name: "",
        page: 1,
        limit: 25,
      })
      .then((data) => {
        if (data) {
          let listCategory = [];
          data.data.map((obj, idx) => {
            listCategory.push({ value: obj.id, label: obj.name });
            if (obj.id == jobCategoryId) {
              this.setState({
                jobCategoryId: { value: obj.id, label: obj.name },
              });
            }
          });
          this.setState({
            listCategory,
          });
        }
      });
  };

  filterAdmins = async (inputValue, recipientId = "") => {
    let newAdmins = [];
    let keyword = inputValue.toString();

    if (keyword.length > 0) {
      newAdmins.push({ value: "", label: "Searching...", disabled: true });
      this.setState({ listAdmins: newAdmins });

      this.props.getRecipientList({ keyword: keyword }).then((data) => {
        let newAdmins = [];
        if (data.data != null) {
          data.data.map((newAdmin) => {
            if (newAdmin.id == recipientId) {
              this.setState({
                recipientId: {
                  value: newAdmin.id,
                  label:
                    newAdmin.firstName +
                    " " +
                    newAdmin.lastName +
                    ` (${newAdmin.email})`,
                },
              });
            }
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

    this.submitAttachment(arrImage);
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
      id,
      name,
      jobCategoryId,
      jobPriority,
      deadline,
      description,
      recipientId,
      descLink,
      assignmentDate,
      status,
      jobDescriptions,
    } = this.state;

    let jobDescriptionsNew = jobDescriptions;

    let job =
      jobDescriptionsNew.length > 0
        ? jobDescriptionsNew[jobDescriptionsNew.length - 1]
        : {};

    jobDescriptionsNew = jobDescriptionsNew.filter((x) => x.id != job.id);

    jobDescriptionsNew.push({
      descLink: descLink.length > 0 ? descLink : job.descLink,
      description: description == "" ? job.description : description,
      id: job.id,
      jobManagementId: job.jobManagementId,
      note: "",
      noteLink: [],
    });

    const req = {
      id,
      name,
      jobCategoryId: parseInt(jobCategoryId.value),
      recipientId: recipientId.value,
      jobPriority: jobPriority.value,
      deadline: moment(deadline, "YYYY-MM-DD").format("YYYY-MM-DD"),
      statusStorage: false,
      jobDescriptions: jobDescriptionsNew,
      assignmentDate: moment().format("YYYY-MM-DD H:mm"),
      status: status,
    };

    this.props
      .editTaskManagement(req)
      .then(() => {
        this.setState({
          confirm: true,
          textSuccessConfirm: "Anda telah berhasil menambah penugasan",
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
              isLoading: true,
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
      id,
      isLoading,
      name,
      senderId,
      jobCategoryId,
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
      listCategory,

      jobDescriptions,
      progress,
      assignment_role,
      status,
    } = this.state;
    const { task_category, auth, history } = this.props;

    moment().locale("id");
    const dateFrom = moment().format("DD-MM-YYYY");

    const role = ["hq", "rsm", "bsm"];

    if (id != "" && !role.includes(assignment_role)) {
      return <NotAuthorize />;
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
                id,
                name,
                jobCategoryId,
                jobPriority,
                deadline,
                descImage,
                description,
                recipientId,
                isDraft,
                status,
                descLink,
                jobDescriptions,
                assignmentDate,
              } = this.state;

              let jobDescriptionsNew = jobDescriptions;

              let job =
                jobDescriptionsNew.length > 0
                  ? jobDescriptionsNew[jobDescriptionsNew.length - 1]
                  : {};

              jobDescriptionsNew = jobDescriptionsNew.filter(
                (x) => x.id != job.id
              );

              jobDescriptionsNew.push({
                descLink: descLink.length > 0 ? descLink : job.descLink,
                description: description == "" ? job.description : description,
                id: job.id,
                jobManagementId: job.jobManagementId,
                note: "",
                noteLink: [],
              });

              this.props
                .editTaskManagement({
                  id,
                  name,
                  jobCategoryId: parseInt(jobCategoryId.value),
                  recipientId: recipientId.value,
                  jobPriority: jobPriority.value,
                  deadline: moment(deadline, "YYYY-MM-DD").format("YYYY-MM-DD"),
                  statusStorage: true,
                  jobDescriptions: jobDescriptionsNew,
                  assignmentDate: moment().format("YYYY-MM-DD H:mm"),
                  status,
                })
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
                        "Anda telah berhasil menyimpan tugas dalam draft",
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
                <h2>Tambah Tugas Baru</h2>
              </div>
              <div className="col-12 col-lg-12 mb-3">
                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <div className="card-body" style={{ borderRadius: "15px" }}>
                    <div className="col-sm-12">
                      <div className="row">
                        <div className="col-sm-4">
                          <h4>Informasi Tugas</h4>
                          <span>
                            Isi data informasi tugas yang ingin diberikan kepada
                            Jr. Supervisor
                          </span>
                        </div>
                        <div className="col-sm-8">
                          <div className="form-group">
                            <label className="">Nama</label>
                            {status == 6 ? (
                              <input
                                onChange={this.handleChange}
                                value={name}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                                readOnly
                              />
                            ) : (
                              <input
                                onChange={this.handleChange}
                                value={name}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                          <div className="form-group">
                            <label className="">Kategori</label>
                            {status == 6 ? (
                              <input
                                onChange={this.handleChange}
                                value={jobCategoryId.label}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                maxLength={50}
                                readOnly
                              />
                            ) : (
                              <SelectLineComponent
                                options={listCategory}
                                initValue={jobCategoryId}
                                handleChange={(jobCategoryId) => {
                                  this.setState({
                                    jobCategoryId: jobCategoryId,
                                  });
                                }}
                              />
                            )}
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
                            {status != 6 ? (
                              <SelectLineComponent
                                initValue={recipientId}
                                options={listAdmins}
                                handleChange={(recipientId) => {
                                  this.setState({ recipientId });
                                }}
                                required
                              />
                            ) : (
                              <input
                                onChange={this.handleChange}
                                value={recipientId.label}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                                disabled
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                          <div className="form-group">
                            <label className="">Prioritas</label>
                            {status == 6 ? (
                              <input
                                onChange={this.handleChange}
                                value={jobPriority.label}
                                name="name"
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Masukan nama"
                                maxLength={50}
                                disabled
                              />
                            ) : (
                              <SelectLineComponent
                                options={listPrioritas}
                                initValue={jobPriority}
                                handleChange={(jobPriority) => {
                                  this.setState({
                                    jobPriority: jobPriority,
                                  });
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-sm-12">
                          <hr />
                        </div>
                        <div className="col-sm-4">
                          <h4>Periode Penugasan</h4>
                          <span>
                            Pilih periode penugasan yang ingin diberikan kepada
                            Jr. Supervisor
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
                            <label className="">Tanggal Akhir Penugasan</label>
                            {status != 6 ? (
                              <DatePickerSelect
                                handleChange={(deadline) =>
                                  this.setState({ deadline })
                                }
                                value={deadline}
                                required
                                readOnly
                                disablePastDate={true}
                              />
                            ) : (
                              <input
                                type="text"
                                className="form-control"
                                value={moment(deadline, "YYYY-MM-DD").format(
                                  "DD-MM-YYYY"
                                )}
                                readOnly
                              />
                            )}
                          </div>
                        </div>
                        {jobDescriptions.map((obj, idx) => {
                          if (jobDescriptions.length - 1 == idx) return;
                          return (
                            <div key={idx} className="col-sm-12 row">
                              <div className="col-sm-12">
                                <hr />
                              </div>
                              <div className="col-sm-4">
                                <h4>Deskripsi Tugas</h4>
                              </div>
                              <div className="col-sm-8">
                                <div className="form-group">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: obj.description
                                        ? obj.description
                                        : "-",
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
                                            }}
                                          >
                                            {obj.fileName}{" "}
                                            <span style={{ color: "#000000" }}>
                                              &nbsp;({obj.size})
                                            </span>
                                            <span style={{ color: "#000000" }}>
                                              &nbsp; &nbsp;
                                              <a
                                                href={obj.url}
                                                className=""
                                                rel="noopener noreferrer"
                                                download
                                                target="_blank"
                                              >
                                                <IconDownload />
                                              </a>
                                            </span>
                                          </span>
                                        </div>
                                      </>
                                    ))}
                                </div>
                              </div>
                              <div className="col-sm-12">
                                <hr />
                              </div>
                              <div className="col-sm-4">
                                <h4>Catatan Tugas</h4>
                              </div>
                              <div className="col-sm-8">
                                <div className="form-group">
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
                                            }}
                                          >
                                            {obj.fileName}{" "}
                                            <span style={{ color: "#000000" }}>
                                              &nbsp;({obj.size})
                                            </span>
                                            <span style={{ color: "#000000" }}>
                                              &nbsp; &nbsp;
                                              <a
                                                href={obj.url}
                                                className=""
                                                rel="noopener noreferrer"
                                                download
                                                target="_blank"
                                              >
                                                <IconDownload />
                                              </a>
                                            </span>
                                          </span>
                                        </div>
                                      </>
                                    ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div className="col-sm-12">
                          <hr />
                        </div>
                        <div className="col-sm-4">
                          <h4>Deskripsi Tugas</h4>
                          <span>
                            Isi data deskripsi tugas yang ingin diberikan kepada
                            Jr. Supervisor
                          </span>
                        </div>
                        <div className="col-sm-8">
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
                                    })
                                  }
                                >
                                  {isLoading ? <LoadingDots /> : "Kirim Tugas"}
                                </button>
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
    getCheckAdmin,
    getRecipientList,
    editTaskManagement,
  }
)(Edit);
