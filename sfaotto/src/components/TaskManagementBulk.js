import React from "react";
import { ModalDownload } from "../components";
import moment from "moment";
import axios from "../actions/config";
import {
  NEWAPI,
  NEWAPI_CALL_PLAN_v23,
  NEWAPI_V2_2,
  NEWAPI_V2_3,
} from "../actions/constants";

var dateNow = new Date();
var dateNow2 = moment(dateNow, "DDMMYYYY");
dateNow2 = dateNow2.format("DDMMYYYY");

class TaskManagementBulk extends React.Component {
  state = {
    confirmIsOpen: false,
    TemplateBulk: "load",
    type: "",
    textSuccess: "",
    textError: "",
    upload: "",
    uploadStatus: "Upload",
    error_url: "",
  };

  componentDidMount() {
    // axios.get(`/todolist/download_template`)
    // .then(data => {
    //   let result = data.data;
    //   if(result.meta.status !== false){
    //     if(result.data.template){
    //       let fullURL = `${process.env.REACT_APP_IMAGE_URL}${result.data.template}`
    //       this.setState({TemplateBulk: fullURL})
    //     }
    //   }
    // })
    // .catch(e => {
    //   this.setState({TemplateBulk: "", confirmIsOpen: true, type: 'error', textSuccess: `Get bulk template for To-do list fail`, uploadStatus: 'Upload'})
    // })
  }

  uploadBulk = () => {
    if (this.refs.file.files) {
      this.setState({ uploadStatus: "Uploading File..." });

      const data = new FormData();
      data.append("file", this.state.upload[0]);
      axios
        .post(NEWAPI_V2_3 + `/job-management/upload`, data)
        .then((data) => {
          let result = data.data;
          if (result.meta.status === false) {
            this.setState({
              confirmIsOpen: true,
              type: "error",
              textError:
                result.meta.message + " Silahkan ubah dan upload ulang file.",
              uploadStatus: "Upload",
              error_url: result.data.error_file,
            });
          } else {
            this.setState({
              confirmIsOpen: true,
              type: "success",
              textSuccess: `Bulk upload managemen tugas sukses, report akan dikirmkan melalui email`,
              uploadStatus: "Upload",
              confirmSuccess: true,
            });
          }
        })
        .catch((e) => {
          this.setState({
            confirmIsOpen: true,
            type: "error",
            textSuccess: `Bulk upload managemen tugas gagal`,
            uploadStatus: "Upload",
            confirmSuccess: false,
          });
        });
    }
  };

  downloadError = () => {
    const url = this.state.error_url;
    if (url !== "") {
      fetch(url)
        .then((res) => res.blob()) // Gets the response and returns it as a blob
        .then((blob) => {
          let url2 = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url2;
          a.download = "error_file_set_status_merchant_" + dateNow2 + ".csv";
          a.click();
        });
    }
  };

  render() {
    const { history } = this.props;
    const {
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      upload,
      uploadStatus,
    } = this.state;

    return (
      <React.Fragment>
        <ModalDownload
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          confirmSuccess={() => window.location.reload()}
          textSuccess={textSuccess}
          textError={textError}
          download={() => this.downloadError()}
        />

        <div className="card">
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-12">
                <h6>Upload Management Tugas</h6>
                <div className="form-group mt-4 mb-2">
                  <input
                    type="file"
                    ref="file"
                    onChange={(e) => this.setState({ upload: e.target.files })}
                    accept=".csv"
                  />
                </div>
              </div>
            </div>
            <a
              href="#"
              className={`btn btn-block ${
                upload === "" ? "btn-danger disabled" : "btn-danger"
              } ${
                uploadStatus === "Uploading File..."
                  ? "btn-danger disabled"
                  : "btn-danger"
              }`}
              onClick={() => {
                this.uploadBulk();
              }}
            >
              {uploadStatus}
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TaskManagementBulk;
