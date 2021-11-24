import React from "react";
import { connect } from "react-redux";
import { ModalConfirm, DatePickerSelect } from "../components";
import moment from "moment";
import {
  exportCallplanAction,
  exportMerchantCallPlan,
  parameterLastDate,
} from "../actions/call_plan";

var dateNow = new Date();
var dateNow2 = moment(dateNow, "DDMMYYYY");
dateNow2 = dateNow2.format("DDMMYYYY");

class ModalExportCallPlan extends React.Component {
  state = {
    confirmIsOpen: false,
    TemplateBulk: "load",
    type: "",
    textSuccess: "",
    textError: "",
    textReason: "",
    exportFile: "",
    exportStatus: "Export",
    error_url: "",
    exportCallplan: "",
    exportMerchant: "",
    startDate: "",
    toDate: "",
    maxDate: "",
    maxToDate: "",
  };

  componentDidMount() {
    this.props.parameterLastDate().then((data) => {
      if (data.meta.status === false) {
        this.setState({
          confirmIsOpen: true,
          type: "error",
          textError: "Ups!",
          textReason: data.meta.message,
        });
      } else {
        this.setState({ maxToDate: data.data, maxDate: data.data });
      }
    });
  }

  exportBulk = () => {
    const { exportMerchantCallPlan, exportCallplanAction } = this.props;
    const { exportCallplan, exportMerchant } = this.state;

    if (exportCallplan === "on") {
      const { date, to, cluster, sales_id, sales_phone, sales_name, sub_area } =
        this.props.state;
      this.setState({ exportStatus: "Loading ..." });

      let dateFrom = "";
      let dateTo = "";
      if (to !== "" || date !== "") {
        dateFrom = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
        dateTo = moment(to, "DD-MM-YYYY").format("YYYY-MM-DD");
      }

      exportCallplanAction({
        date: dateFrom,
        to: dateTo,
        cluster: cluster.label,
        sales_id,
        sales_phone,
        sales_name,
        sub_area: sub_area.label,
        limit: 100000,
      }).then((data) => {
        this.setState({ disabledStatusExport: false });
        if (data.meta.status === false) {
          this.setState({
            confirmIsOpen: true,
            type: "error",
            textError: "Ups!",
            textReason: data.meta.message,
          });
        } else {
          this.setState({
            confirmIsOpen: true,
            type: "success",
            textSuccess: data.meta.message,
            textError: "",
          });
        }
      });
    } else if (exportMerchant === "on") {
      const { startDate, toDate } = this.state;

      exportMerchantCallPlan({ date: startDate, to: toDate }).then((data) => {
        this.setState({ disabledStatusExport: false });
        if (data.meta.status === false) {
          this.setState({
            confirmIsOpen: true,
            type: "error",
            textError: "Ups!",
            textReason: data.meta.message,
          });
        } else {
          this.setState({
            confirmIsOpen: true,
            type: "success",
            textError: "",
            textSuccess: data.meta.message,
          });
        }
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

  dateValidation(startDate) {
    var d = new Date(startDate);
    // d.setMonth(d.getMonth()+1);
    d.setDate(d.getDate() + 15);

    if (this.state.maxDate > moment(d, "DD/MM/YYYY").format("YYYY-MM-DD")) {
      this.setState({
        maxToDate: moment(d, "DD/MM/YYYY").format("YYYY-MM-DD"),
      });
    } else {
      this.setState({ maxToDate: this.state.maxDate });
    }
  }

  render() {
    const { exportIsOpen } = this.props;
    const {
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      exportStatus,
      exportMerchant,
      exportCallplan,
      startDate,
      toDate,
      maxDate,
      maxToDate,
    } = this.state;

    return (
      <React.Fragment>
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          confirmClose={() =>
            this.setState({ confirmIsOpen: false, loading: false }, () =>
              exportIsOpen()
            )
          }
          confirmSuccess={() =>
            this.setState({ confirmIsOpen: false }, () => exportIsOpen())
          }
          textSuccess={textSuccess}
          textError={textError}
          textReason={textReason}
          type={type}
        />

        <div className="card">
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-12">
                <h6>Export Call Plan</h6>
                <div className="form-check mt-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exportOption"
                    id="exportCallplan"
                    onChange={(e) => {
                      this.setState({
                        exportCallplan: e.currentTarget.value,
                        exportMerchant: "off",
                      });
                    }}
                  />
                  <label className="form-check-label" htmlFor="exportCallplan">
                    Call Plan Report
                  </label>
                </div>
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exportOption"
                    id="exportMerchant"
                    onChange={(e) => {
                      this.setState({
                        exportMerchant: e.currentTarget.value,
                        exportCallplan: "off",
                      });
                    }}
                  />
                  <label className="form-check-label" htmlFor="exportMerchant">
                    Merchant Call Plan
                  </label>
                </div>
                {exportMerchant === "on" ? (
                  <div className="col-12" style={{ padding: "0 0" }}>
                    <div className="form-inline mt-3">
                      <div className="col-6">
                        <DatePickerSelect
                          className="input-export-option"
                          handleChange={(startDate) =>
                            this.setState(
                              { startDate },
                              this.dateValidation(startDate)
                            )
                          }
                          value={startDate}
                          maxDate={maxDate}
                          placeholder="From date"
                        />
                        {/* <i className="la la-calendar-o icon-input"/> */}
                      </div>
                      <div className="col-6">
                        <DatePickerSelect
                          className="input-export-option"
                          handleChange={(toDate) => this.setState({ toDate })}
                          value={toDate}
                          maxDate={maxToDate}
                          required
                          placeholder="To date"
                        />
                        {/* <i className="la la-calendar-o icon-input"/> */}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <a
              href="#"
              className={`btn btn-block ${
                exportCallplan === "" && exportMerchant === ""
                  ? "btn-danger disabled"
                  : "btn-danger"
              } ${
                exportStatus === "Export" ? "btn-danger" : "btn-danger disabled"
              }`}
              onClick={() => {
                this.exportBulk();
              }}
            >
              {exportStatus}
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(({}) => ({}), {
  exportCallplanAction,
  exportMerchantCallPlan,
  parameterLastDate,
})(ModalExportCallPlan);
