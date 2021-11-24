import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { isNaN } from "lodash";
import { createSale } from "../../actions/sale";
import {
  NotAuthorize,
  ModalConfirm,
  SelectLineComponent,
  DatePicker,
  SelectMultiple,
} from "../../components";
import BulkCreate from "../../components/sales/BulkCreate";
import axios from "../../actions/config";
import { ind, en } from "../../languages/sales";

// const salesTypes = [
//   { value: 'Salesman', label: 'Salesman'},
//   { value: 'Tester', label: 'Tester'},
// ]

class Register extends React.Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    id_number: "",
    dob: "",
    phone_number: "",
    address: "",
    sales_type: [],
    phone_area: "+62",
    province: "",
    city: "",
    sales_id: "",
    occupation: "",
    work_date: "",
    selectedGender: {},
    selectedCompCode: "",
    selectedProvince: {},
    selectedCity: {},
    locations: [
      {
        district: {},
        village: [{}],
      },
    ],
    pin1: "",
    pin2: "",
    pin3: "",
    pin4: "",
    pin5: "",
    pin6: "",
    pinConf1: "",
    pinConf2: "",
    pinConf3: "",
    pinConf4: "",
    pinConf5: "",
    pinConf6: "",
    confirmIsOpen: false,
    type: "success",
    textSuccess: "",
    textError: "",
    textReason: "",
    languages: {},
    sales_type_id: "",
  };

  componentWillMount() {
    const {
      auth: { access_token },
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  }

  componentDidMount() {
    document.title = "SFA OTTO - Register Sales";

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.recruit });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.recruit });
    }
  }

  getData = async () => {
    try {
      await this.props.getCountries();
      await this.props.getCities();
      await this.props.getProvinces();
    } catch (e) {
      console.log(e);
    }
  };

  setPin = (val, pos) => {
    let obj = {};
    if (isNaN(Number(val)) || !val) {
      obj[`pin${pos}`] = "";
      this.setState(obj);
      return;
    }
    obj[`pin${pos}`] = val;
    this.setState(obj, () => pos < 6 && this.refs[`pin${pos + 1}`].focus());
  };

  setPinConfirm = (val, pos) => {
    let obj = {};
    if (isNaN(Number(val)) || !val) {
      obj[`pinConf${pos}`] = "";
      this.setState(obj);
      return;
    }
    obj[`pinConf${pos}`] = val;
    this.setState(obj, () => pos < 6 && this.refs[`pinConf${pos + 1}`].focus());
  };

  uploadSalesBulk = () => {
    if (this.refs.file.files) {
      this.setState({ uploadStatus: "Uploading File..." });

      const data = new FormData();
      data.append("file", this.state.upload[0]);
      axios
        .post("/sales/bulk", data)
        .then((data) => {
          let result = data.data;
          if (result.meta.status === false) {
            this.setState({
              confirmIsOpen: true,
              type: "error",
              textError: "Upload fail!",
              textReason: result.meta.message,
              uploadStatus: "Upload File",
            });
          } else {
            this.setState({
              confirmIsOpen: true,
              type: "success",
              textError: "",
              textSuccess: "Success",
              uploadStatus: "Upload File",
            });
          }
        })
        .catch((e) => {
          this.setState({
            confirmIsOpen: true,
            type: "error",
            textReason: e.message,
            textError: "Upload fail!",
            uploadStatus: "Upload File",
          });
        });
    }
  };

  render() {
    let allFilled = false;
    const { auth, company_codes, createSale, sales_types, history } =
      this.props;
    const {
      first_name,
      last_name,
      email,
      dob,
      phone_number,
      id_number,
      address,
      sales_id,
      occupation,
      work_date,
      sales_type,
      pin1,
      pin2,
      pin3,
      pin4,
      pin5,
      pin6,
      pinConf1,
      pinConf2,
      pinConf3,
      pinConf4,
      pinConf5,
      pinConf6,
      selectedCompCode,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      languages,
      sales_type_id,
    } = this.state;

    let pin = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;
    let pin_confirmation =
      pinConf1 + pinConf2 + pinConf3 + pinConf4 + pinConf5 + pinConf6;

    if (
      first_name &&
      last_name &&
      email &&
      pin &&
      pin === pin_confirmation &&
      phone_number &&
      address &&
      id_number &&
      dob &&
      selectedCompCode.label &&
      sales_type
    ) {
      allFilled = true;
    }

    let notMatch = false;
    if (
      pin.split("").length === 6 &&
      pin_confirmation.split("").length === 6 &&
      pin !== pin_confirmation
    ) {
      notMatch = true;
    }

    if (
      auth.isAuthenticated &&
      (auth.authority["recruitment_sales"] === "" ||
        auth.authority["recruitment_sales"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    const style = {
      minHeight: "100px",
    };

    return (
      <div className="container mb-5">
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          confirmSuccess={() => history.push("/sales/")}
          textSuccess={textSuccess}
          textError={textError}
          textReason={textReason}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (allFilled) {
              createSale({
                first_name,
                email,
                pin,
                pin_confirmation,
                last_name,
                dob,
                sales_id,
                work_date,
                occupation,
                id_number,
                address,
                phone_number:
                  phone_number.charAt(0) === "0"
                    ? phone_number.substr(1)
                    : phone_number,
                company_code: selectedCompCode.value,
                sales_type_id,
              })
                .then((data) => {
                  if (data.meta.status === false) {
                    this.setState({
                      confirmIsOpen: true,
                      type: "error",
                      textError: "Create Sales Fail!",
                      textReason: data.meta.message,
                    });
                  } else {
                    this.setState({
                      confirmIsOpen: true,
                      type: "success",
                      textError: "",
                      textSuccess:
                        "Tambah data sales berhasil, menunggu persetujuan.",
                    });
                  }
                })
                .catch((e) => {
                  this.setState({
                    confirmIsOpen: true,
                    type: "error",
                    textError: "Tambah data sales gagal",
                    textReason: e.message,
                  });
                });
            } else {
              this.setState({
                confirmIsOpen: true,
                type: "error",
                textError: "Tambah data sales gagal",
                textReason: "Lengkapi data Anda.",
              });
            }
          }}
        >
          <div className="row">
            <div className="col-12 mb-4">
              <h2>{languages.header}</h2>
            </div>

            <div className="col-12 col-lg-8 mb-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h6>{languages.header2}</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.firstName}</label>
                        <input
                          onChange={(e) =>
                            this.setState({ first_name: e.target.value })
                          }
                          value={first_name}
                          type="text"
                          name="first-name"
                          className="form-control form-control-line"
                          placeholder="Masukan nama"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.lastName}</label>
                        <input
                          onChange={(e) =>
                            this.setState({ last_name: e.target.value })
                          }
                          value={last_name}
                          type="text"
                          name="last-name"
                          className="form-control form-control-line"
                          placeholder="Masukan nama"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.email}</label>
                        <input
                          onChange={(e) =>
                            this.setState({ email: e.target.value })
                          }
                          value={email}
                          type="email"
                          name="email"
                          className="form-control form-control-line"
                          placeholder="Masukan email"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.noHp}</label>
                        <input
                          onChange={(e) => {
                            if (
                              isNaN(Number(e.target.value)) ||
                              e.target.value.split("").length > 16
                            ) {
                              return;
                            }
                            this.setState({ phone_number: e.target.value });
                          }}
                          value={phone_number}
                          type="number"
                          name="first-name"
                          className="form-control form-control-line"
                          placeholder="812 3456 7890"
                          maxLength="12"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.kode}</label>
                        <div className="custom-select-line">
                          <SelectLineComponent
                            options={company_codes.form}
                            initValue={selectedCompCode}
                            handleChange={(selectedCompCode) =>
                              this.setState({ selectedCompCode })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.tanggalMasuk}</label>
                        <div className="custom-select-line">
                          <DatePicker
                            handleChange={(work_date) =>
                              this.setState({ work_date })
                            }
                            value={work_date}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.salesID}</label>
                        <div className="custom-select-line">
                          <input
                            onChange={(e) =>
                              this.setState({ sales_id: e.target.value })
                            }
                            value={sales_id}
                            type="text"
                            name="sales-id"
                            className="form-control form-control-line"
                            placeholder="Masukan Sales ID"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.ktp}</label>
                        <input
                          onChange={(e) => {
                            if (
                              isNaN(Number(e.target.value)) ||
                              e.target.value.split("").length > 16
                            ) {
                              return;
                            }
                            this.setState({ id_number: e.target.value });
                          }}
                          value={id_number}
                          type="number"
                          name="id_number"
                          className="form-control form-control-line"
                          placeholder="10 50 24 570890 0001"
                          maxLength="16"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{languages.pin}</label>
                            <div className="form-row form-control-pin">
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPin(e.target.value, 1)
                                  }
                                  value={pin1}
                                  ref="pin1"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                  required
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPin(e.target.value, 2)
                                  }
                                  value={pin2}
                                  ref="pin2"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPin(e.target.value, 3)
                                  }
                                  value={pin3}
                                  ref="pin3"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPin(e.target.value, 4)
                                  }
                                  value={pin4}
                                  ref="pin4"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPin(e.target.value, 5)
                                  }
                                  value={pin5}
                                  ref="pin5"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPin(e.target.value, 6)
                                  }
                                  value={pin6}
                                  ref="pin6"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              {notMatch && (
                                <small className="text-danger">
                                  <i>ups! PIN tidak sesuai</i>
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{languages.pin2}</label>
                            <div className="form-row form-control-pin">
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPinConfirm(e.target.value, 1)
                                  }
                                  value={pinConf1}
                                  ref="pinConf1"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPinConfirm(e.target.value, 2)
                                  }
                                  value={pinConf2}
                                  ref="pinConf2"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPinConfirm(e.target.value, 3)
                                  }
                                  value={pinConf3}
                                  ref="pinConf3"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPinConfirm(e.target.value, 4)
                                  }
                                  value={pinConf4}
                                  ref="pinConf4"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPinConfirm(e.target.value, 5)
                                  }
                                  value={pinConf5}
                                  ref="pinConf5"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  onChange={(e) =>
                                    this.setPinConfirm(e.target.value, 6)
                                  }
                                  value={pinConf6}
                                  ref="pinConf6"
                                  type="password"
                                  className="form-control form-control-line text-center"
                                  placeholder="0"
                                  maxLength="1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mb4">
                <div className="card-body">
                  <h6>{languages.header3}</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.dob}</label>
                        <DatePicker
                          handleChange={(dob) => this.setState({ dob })}
                          value={dob}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.jabatan}</label>
                        <div className="custom-select-line">
                          <input
                            onChange={(e) =>
                              this.setState({ occupation: e.target.value })
                            }
                            value={occupation}
                            type="text"
                            name="sales-id"
                            className="form-control form-control-line"
                            placeholder="Masukan Jabatan"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.alamat}</label>
                        <textarea
                          className="form-control form-control-line"
                          style={style}
                          value={address}
                          placeholder={languages.pAlamat}
                          onChange={(e) => {
                            this.setState({ address: e.target.value });
                          }}
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.salesType}</label>
                        <div className="custom-select-line">
                          {/* <SelectLineComponent options={sales_types.data} initValue={sales_type.value}
                            handleChange={(sales_type) => this.setState({sales_type: sales_type.value}) } required
                          /> */}
                          <SelectLineComponent
                            options={sales_types.data}
                            handleChange={(sales_type) => {
                              this.setState({
                                sales_type_id: sales_type.value,
                              });
                            }}
                          />
                          {/* <SelectMultiple options={sales_types.data} placeholder={"Select"} 
                          handleChange={(sales_type) => {
                            let sales_type_ids = [];
                            sales_type.map((type) => sales_type_ids.push(type.value))
                            this.setState({sales_type: sales_type_ids})
                          }}/> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 mb-3">
              <BulkCreate history={history} />
            </div>

            <div className="col-12 mb-3">
              <hr className="content-hr" />
              <div className="form-group d-flex justify-content-between">
                <Link to="/sales" className="btn btn-outline-danger">
                  {languages.cancel}
                </Link>
                {auth.authority["recruitment_sales"] === "Full Access" && (
                  <button type="submit" className="btn btn-danger">
                    {languages.save}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  ({ auth, genders, company_codes, sales, sales_types }) => ({
    auth,
    genders,
    company_codes,
    sales,
    sales_types,
  }),
  { createSale }
)(Register);
