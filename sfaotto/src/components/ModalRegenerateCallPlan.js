import React from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import {
  ModalConfirm,
  DatePickerSelect,
  ModalConfirmCallPlan,
} from "../components";
import moment from "moment";
import {
  validateNoHP,
  regenerateAllCallplan,
  regenerateSpesificCallplan,
} from "../actions/call_plan";

class ModalRegenerateCallPlan extends React.Component {
  state = {
    openTextNumber: false,
    salesNotFound: false,
    salesFound: false,
    message: "",
    validation: false,
    noHp: "",
    confirmIsOpenStatus: false,
    resultIsOpenStatus: false,
    type: "success",
    confirmTextStatus: "",
    resultTextStatus: "",
    isAll: false,
    sales: "",
    sales_id: "",
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  validateHP = async () => {
    const { noHp } = this.state;
    const data = await this.props.validateNoHP({ phone_number: noHp });
    if (data.meta.code == 200) {
      const name =
        data.data.first_name +
        " " +
        data.data.last_name +
        " (ID: " +
        data.data.sales_id +
        ")";
      this.setState({
        salesFound: true,
        salesNotFound: false,
        message: "Nomor HP ditemukan",
        validation: true,
        sales: name,
        sales_id: data.data.sales_id,
      });
    } else {
      this.setState({
        salesFound: false,
        salesNotFound: true,
        message: "Nomor HP tidak ditemukan",
      });
    }
  };

  render() {
    const {
      openTextNumber,
      salesNotFound,
      salesFound,
      message,
      validation,
      confirmIsOpenStatus,
      resultIsOpenStatus,
      type,
      confirmTextStatus,
      resultTextStatus,
      isAll,
      sales,
      sales_id,
    } = this.state;
    const { toggle, history } = this.props;
    return (
      <React.Fragment>
        <ModalConfirmCallPlan
          confirmIsOpen={confirmIsOpenStatus}
          resultIsOpen={resultIsOpenStatus}
          type={type}
          confirmText={confirmTextStatus}
          confirmSuccess={() => history.push("/call-plan")}
          confirmClose={() => {
            toggle();
            this.setState({ confirmIsOpenStatus: false });
          }}
          resultClose={() => {
            toggle();
            this.setState({ resultIsOpenStatus: false });
          }}
          confirmYes={() => {
            if (isAll) {
              this.props
                .regenerateAllCallplan()
                .then((data) => {
                  this.setState({
                    resultIsOpenStatus: true,
                    confirmIsOpenStatus: false,
                    resultTextStatus:
                      "Anda telah berhasil meregenerate call plan secara keseluruhan Mohon cek email secara berkala untuk mendapatkan update lebih lanjut",
                  });
                })
                .catch((e) =>
                  this.setState({
                    resultIsOpenStatus: true,
                    type: "error",
                    confirmTextStatus: e,
                    resultTextStatus: "",
                  })
                );
            } else {
              this.props
                .regenerateSpesificCallplan({ sales_id: sales_id.toString() })
                .then((data) => {
                  this.setState({
                    resultIsOpenStatus: true,
                    confirmIsOpenStatus: false,
                    resultTextStatus:
                      "Anda telah berhasil meregenerate call plan salesman " +
                      sales +
                      ". Mohon cek email secara berkala untuk mendapatkan update",
                  });
                })
                .catch((e) =>
                  this.setState({
                    resultIsOpenStatus: true,
                    type: "error",
                    confirmTextStatus: e,
                    resultTextStatus: "",
                  })
                );
            }
          }}
          resultText={resultTextStatus}
          isAll={isAll}
          data={sales}
        />
        <div
          className="card mb-2 mr-2 mt-2 ml-2"
          style={{ borderRadius: "1rem" }}
        >
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>Regenerate Call Plan</h4>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <span>Untuk siapa regenerate call plan ditunjukkan?</span>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    onChange={() => {
                      this.setState({
                        openTextNumber: false,
                        validation: true,
                        isAll: true,
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    Keseluruhan Salesman
                  </label>
                </div>
              </div>
              <div className="col-12 mt-2">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    onChange={() =>
                      this.setState({
                        openTextNumber: true,
                        validation: false,
                        isAll: false,
                      })
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    Spesifik Salesman
                  </label>
                </div>
              </div>
              {openTextNumber && (
                <>
                  <div className="col-12 mt-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <span>Nomor HP Sales</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="form-row">
                      <div className="form-group col-md-8">
                        <input
                          type="text"
                          className="form-control form-control-line"
                          placeholder="Masukan nomor hp"
                          name="noHp"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <button
                          className="btn btn-primary btn-lg btn-block"
                          onClick={this.validateHP}
                        >
                          Check
                        </button>
                      </div>
                      {salesNotFound && (
                        <div className="form-group col-md-12">
                          <span className="text-danger">{message}</span>
                        </div>
                      )}
                      {salesFound && (
                        <div className="form-group col-md-12">
                          <span className="text-primary">{message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              <div className="col-12 mt-3">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <button
                      className="btn btn-outline-primary btn-lg btn-block"
                      onClick={toggle}
                    >
                      Batal
                    </button>
                  </div>
                  {validation ? (
                    <div className="form-group col-md-6">
                      <button
                        className="btn btn-primary btn-lg btn-block"
                        onClick={() => {
                          this.setState({ confirmIsOpenStatus: true });
                        }}
                      >
                        Lanjut
                      </button>
                    </div>
                  ) : (
                    <div className="form-group col-md-6">
                      <button
                        className="btn btn-primary btn-lg btn-block"
                        disabled
                      >
                        Lanjut
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(({}) => ({}), {
  validateNoHP,
  regenerateAllCallplan,
  regenerateSpesificCallplan,
})(ModalRegenerateCallPlan);
