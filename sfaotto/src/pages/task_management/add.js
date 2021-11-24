import React, { Component } from "react";
import { IconPaperClip, IconLink } from "../../components/Icons";
import {
  ModalDelete,
  ModalConfirm,
  Pagination,
  LoadingDots,
  NotAuthorize,
  SelectLineComponent,
  SelectRequired,
  DatePickerSelect,
  SelectMultiple,
} from "../../components";
import { ModalAddLink } from "../../components";
import { connect } from "react-redux";
import { getCategories } from "../../actions/task_category";
import { getAdminsV2_1 } from "../../actions/admin";
import { debounce, isEmpty, result } from "lodash";
import moment, { updateLocale } from "moment";
import "moment/locale/id";
import {
  createTaskManagement,
  getCheckAdmin,
  getRecipientList,
} from "../../actions/task_manegement";
import { minioUpload } from "../../actions/minio";
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

class Add extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
    this.showFileUpload = this.showFileUpload.bind(this);
  }

  state = {
    senderID: "",
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
    descLink: [],
    progress: "",
    assignment_role: "",
    recipientIds: [],
  };

  componentWillMount() {
    this.props.getCategories({
      id: 0,
      name: "",
      page: 1,
      limit: 25,
    });

    const { history } = this.props;

    this.props.getRecipientList().then((data) => {
      let listAdmins = [];
      data.data.map((obj, idx) => {
        listAdmins.push({
          value: obj.id,
          label: obj.firstName + " " + obj.lastName + ` (${obj.email})`,
        });
      });

      this.props.getCheckAdmin().then((data) => {
        this.setState({
          assignment_role: data.data.assignmentRole,
        });
        const role = ["hq", "rsm", "bsm"];
        if (!role.includes(data.data.assignmentRole)) {
          history.push("/task-management/");
        }
      });
      this.setState({ listAdmins });
    });
  }

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

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const responseAttachment = await Promise.all([this.submitData()]);
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

  submitData = async () => {
    moment().locale("id");
    const {
      name,
      jobCategoryId,
      jobPriority,
      deadline,
      description,
      recipientId,
      senderID,
      descLink,
      recipientIds,
    } = this.state;

    let jobDescriptions = [];
    jobDescriptions.push({
      descLink: descLink,
      description,
      id: 0,
      jobManagementId: 0,
      note: "",
      noteLink: [],
    });

    this.props
      .createTaskManagement({
        id: 0,
        name,
        jobCategoryId: parseInt(jobCategoryId),
        recipientId: recipientIds,
        jobPriority,
        deadline,
        statusStorage: false,
        jobDescriptions,
        acceptDate: "",
        assignmentDate: moment().format("YYYY-MM-DD H:mm"),
        cancelDate: "",
        completeDate: "",
        deliverDate: "",
        resendDate: "",
        senderId: senderID,
        status: 1,
      })
      .then((data) => {
        if (data.meta.status == false) {
          this.setState({
            isLoading: false,
            confirm: true,
            textSuccessConfirm: "",
            textErrorConfirm: data.meta.message,
            typeConfirm: "error",
          });
        } else {
          this.setState({
            confirm: true,
            textSuccessConfirm: "Anda telah berhasil menambah penugasan",
            textErrorConfirm: "",
            typeConfirm: "success",
          });
        }
      })
      .catch((e) => {
        this.setState({
          confirm: true,
          textSuccessConfirm: "",
          textErrorConfirm: e,
          typeConfirm: "error",
        });
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
      progress,
      assignment_role,
      recipientIds,
    } = this.state;
    const { task_category, auth, history } = this.props;

    let listCategory = [];
    if (!task_category.loading) {
      task_category.data.map((obj, idx) => {
        listCategory.push({ value: obj.id, label: obj.name });
      });
    }

    moment().locale("id");
    const dateFrom = moment().format("DD-MM-YYYY");

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
                senderID,
                descLink,
                recipientIds,
              } = this.state;

              let jobDescriptions = [];
              jobDescriptions.push({
                descLink: descLink,
                description,
                id: 0,
                jobManagementId: 0,
                note: "",
                noteLink: [],
              });

              this.props
                .createTaskManagement({
                  id: 0,
                  name,
                  jobCategoryId: parseInt(jobCategoryId),
                  recipientId: recipientIds,
                  jobPriority,
                  deadline,
                  statusStorage: true,
                  jobDescriptions,
                  acceptDate: "",
                  assignmentDate: moment().format("YYYY-MM-DD H:mm"),
                  cancelDate: "",
                  completeDate: "",
                  deliverDate: "",
                  resendDate: "",
                  senderId: senderID,
                  status: 1,
                })
                .then(() => {
                  this.setState({
                    confirm: true,
                    textSuccessConfirm:
                      "Anda telah berhasil menambah penugasan sebagai draft",
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
                                required
                              />
                            </div>
                          </div>
                          <div className="col-sm-4"></div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">Kategori</label>
                              <SelectLineComponent
                                options={listCategory}
                                value={jobCategoryId}
                                handleChange={(jobCategoryId) => {
                                  this.setState({
                                    jobCategoryId: jobCategoryId.value,
                                  });
                                }}
                                required={true}
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
                              <SelectMultiple
                                options={listAdmins}
                                placeholder={"Select"}
                                handleChange={(recipientId) => {
                                  let recipientIds = [];
                                  recipientId.map((type) =>
                                    recipientIds.push(type.value)
                                  );
                                  this.setState({
                                    recipientIds: recipientIds,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-sm-4"></div>
                          <div className="col-sm-8">
                            <div className="form-group">
                              <label className="">Prioritas</label>
                              <SelectLineComponent
                                options={listPrioritas}
                                value={jobPriority}
                                handleChange={(jobPriority) => {
                                  this.setState({
                                    jobPriority: jobPriority.value,
                                  });
                                }}
                                required={true}
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
                              <DatePickerSelect
                                handleChange={(deadline) =>
                                  this.setState({ deadline })
                                }
                                value={deadline}
                                required={true}
                                readOnly
                                disablePastDate={true}
                              />
                            </div>
                          </div>
                          <div className="col-sm-12">
                            <hr />
                          </div>
                          <div className="col-sm-4">
                            <h4>Deskripsi Tugas</h4>
                            <span>
                              Isi data deskripsi tugas yang ingin diberikan
                              kepada Jr. Supervisor
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
                                            <span style={{ color: "#000000" }}>
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
                                    className={`btn btn-link btn-outline-primary text-primary ${
                                      isLoading || (progress && progress != 100)
                                        ? "disabled"
                                        : ""
                                    }`}
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
                                      isLoading || (progress && progress != 100)
                                        ? "disabled"
                                        : ""
                                    }`}
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
  ({ task_category, auth, admins, minio }) => ({
    task_category,
    auth,
    admins,
    minio,
  }),
  {
    getCategories,
    getAdminsV2_1,
    createTaskManagement,
    minioUpload,
    getCheckAdmin,
    getRecipientList,
  }
)(Add);
