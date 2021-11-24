import React from "react";
import moment from "moment";
import { ModalConfirm, LoadingDots } from "../../components";
import axios from "../../actions/config";
import { NEWAPI, NEWAPI_V2_1 } from "../../actions/constants";

// import bulkFormat from '../../Sample_bulk_upload_salesman.csv';
var dateNow = new Date();
var dateNow2 = moment(dateNow, "DDMMYYYY");
dateNow2 = dateNow2.format("DDMMYYYY");

class BulkCreate extends React.Component {
  state = {
    confirmIsOpen: false,
    type: "",
    textSuccess: "",
    textReason: "",
    upload: "",
    uploadStatus: "Upload",
    TemplateBulk: "load",
    error_url: "",
  };

  componentDidMount() {
    axios
      .get(`sales/download_template`)
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
          type: "error",
          textSuccess: `Get bulk template for Sales fail`,
          uploadStatus: "Upload",
        });
      });
  }

  uploadSalesBulk = () => {
    if (this.refs.file.files) {
      this.setState({ uploadStatus: "Uploading File..." });

      const data = new FormData();
      data.append("file", this.state.upload[0]);
      axios
        .post(NEWAPI_V2_1 + "/sales/bulk", data)
        .then((data) => {
          let result = data.data;
          if (result.meta.status === false) {
            console.log(">===>>", result.meta);
            // this.setState({confirmIsOpen: true, type: 'error', textError: result.meta.message + ' Silahkan ubah dan upload ulang file.', uploadStatus: 'Upload', error_url: result.body.error_file})
            this.setState({
              confirmIsOpen: true,
              type: "error",
              textError: result.meta.message,
              uploadStatus: "Upload",
            });
          } else {
            this.setState({
              confirmIsOpen: true,
              type: "success",
              textError: "",
              textSuccess: "Bulk upload sales sukses",
              uploadStatus: "Upload",
            });
          }
        })
        .catch((e) => {
          this.setState({
            confirmIsOpen: true,
            type: "error",
            textSuccess: "Bulk upload sales gagal",
            uploadStatus: "Upload",
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
          a.download = "error_file_salesman_" + dateNow2 + ".csv";
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
      TemplateBulk,
    } = this.state;

    return (
      <React.Fragment>
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          confirmSuccess={() => history.push("/sales")}
          textSuccess={textSuccess}
          textError={textError}
          // download={() => this.downloadError()}
        />

        <div className="card mb-5">
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-12 col-lg-6">
                <h6>Add Sales Bulk</h6>
                <div className="form-group mt-4 mb-2">
                  <input
                    type="file"
                    ref="file"
                    onChange={(e) => this.setState({ upload: e.target.files })}
                  />
                </div>
              </div>
            </div>
            <a
              href="#"
              className={`btn btn-block ${
                upload === "" ? "btn-danger disabled" : "btn-danger"
              }`}
              onClick={() => {
                this.uploadSalesBulk();
              }}
            >
              {uploadStatus}
            </a>
          </div>

          {TemplateBulk.length > 0 && TemplateBulk !== "load" && (
            <div className="card-footer card-footer-button text-center">
              <a href={TemplateBulk} target="_blank">
                Download file template
              </a>
            </div>
          )}
          {TemplateBulk.length === "load" && (
            <div className="card-footer card-footer-button text-center d-flex align-items-center justify-content-center">
              <LoadingDots color="black" />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default BulkCreate;
