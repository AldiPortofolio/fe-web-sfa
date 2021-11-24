import React from "react";
import { find, isNaN } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { editSale, getSale, getSaleV2 } from "../../actions/sale";
import { getCities } from "../../actions/city";
import { getDistricts } from "../../actions/district";
import { getVillages } from "../../actions/village";
import {
  NotAuthorize,
  ModalConfirm,
  SelectLineComponent,
  DatePicker,
  SelectMultiple,
} from "../../components";
import axios from "../../actions/config";
import { ind, en } from "../../languages/sales";
import { IconCollapse } from "../../components/Icons";

// const salesTypes = [
//   { value: 'Salesman', label: 'Salesman'},
//   { value: 'Tester', label: 'Tester'},
// ]

class Edit extends React.Component {
  state = {
    id: null,
    first_name: "",
    last_name: "",
    id_number: "",
    email: "",
    province: "",
    city: "",
    dob: "",
    phone_number: "",
    phone_area: "+62",
    occupation: "",
    work_date: "",
    selectedGender: {},
    selectedCompCode: {},
    selectedProvince: {},
    selectedCity: {},
    sales_type_ids: [],
    sales_id: "",
    locations: [],
    upload: null,
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
    status: "",
    id_card_pic: "",
    birth_place: "",
    expandCard: false,
    address: "",
    languages: {},
    sales_type_id: "",
  };

  componentWillMount() {
    const {
      auth: { access_token },
      getSaleV2,
      match,
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.edit });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.edit });
    }

    getSaleV2(match.params.id).then((data) => {
      var newSalestypes = [];

      let salesman = data.data;
      let selectedGender = find(this.props.genders.data, {
        label: salesman.gender,
      })
        ? find(this.props.genders.data, { label: salesman.gender })
        : {};
      let selectedCompCode = find(this.props.company_codes.data, {
        label: salesman.company_code,
      });
      let phone_area = salesman.phone_area;
      let dob = salesman.dob;

      let sales_type_id = find(this.props.sales_types.data, {
        value: salesman.sales_type_id,
      });
      // let sales_type_id =  find(sales_types.data, {label: salesman.sales_type}) ? find(sales_types.data, {label: salesman.sales_type}) : {}

      // let sales_type_ids = salesman.sales_types;
      // let sales_type_id = {};
      // if (sales_type_ids.length > 0) {
      //   sales_type_ids.map(
      //     (type, idx) =>
      //       newSalestypes.push({ value: type.id, label: type.name }),
      //     (sales_type_id = {
      //       value: sales_type_ids[0].id,
      //       label: sales_type_ids[0].name,
      //     })
      //   );
      // }

      // let selectedProvince = (salesman.area_aquisitions && salesman.area_aquisitions.province) ? find(this.props.provinces.data, {label: salesman.area_aquisitions.province}) : {}
      // let locations = (salesman.area_aquisitions && salesman.area_aquisitions.locations) ? salesman.area_aquisitions.locations : this.state.locations
      // var selectedCity

      var phone_number = salesman.phone;
      while (phone_number.charAt(0) === "0") {
        phone_number = phone_number.substr(1);
      }

      // if(selectedProvince !== undefined){
      //   this.props.getCities(selectedProvince.value).then((data) => {
      //     selectedCity = find(data, {label: salesman.area_aquisitions.city})

      //     this.setState({
      //       ...salesman,
      //       selectedCity
      //     })
      //   })
      // }

      this.setState({
        ...salesman,
        id_number: salesman.id_number,
        pin: "",
        pin_confirmation: "",
        dob,
        phone_number,
        phone_area,
        selectedGender,
        selectedCompCode,
        sales_type_id,
        // id_card,
      });
    });
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

  componentDidMount() {
    document.title = "SFA OTTO - Change Registered Sales";
  }

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

  addDistrict = (e) => {
    if (this.state.locations.length < 5) {
      this.setState((prevState) => ({
        locations: [...prevState.locations, { district: "", village: [""] }],
      }));
    } else {
      alert("Anda sudah mencapai batas maximum menambah kecamatan");
    }
  };

  addVillage = (district, idx) => {
    this.state.locations.forEach((loc, sIdx) => {
      if (idx !== sIdx) {
        return loc;
      } else {
        if (loc.village.length < 20) {
          let newVillage = loc.village.push({});

          return { ...loc, district, village: newVillage };
        } else {
          alert("Anda sudah mencapai batas maximum menambah kelurahan");
        }
      }
    });
  };

  showDistrictsByCity = (city) => {
    let districts = this.props.getDistricts(city);

    this.setState({ districts: districts });
  };

  showVillagesByDistrict = (district) => {
    let villages = this.props.getVillages(district);

    this.setState({ villages: villages });
  };

  removeDistrict = (idx) => {
    let location = this.state.locations;
    let district = location.indexOf(idx);

    if (district > -1) {
      location.splice(district, 1);
    }
  };

  removeVillage = (vill, idx) => {
    let location = this.state.locations;
    let district = location[idx];

    if (vill > -1) {
      district.village.splice(vill, 1);
    }
  };

  render() {
    let allFilled = false;
    const { auth, genders, company_codes, editSale, history, sales_types } =
      this.props;
    const {
      id,
      first_name,
      last_name,
      email,
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
      id_number,
      dob,
      phone_number,
      phone_area,
      occupation,
      work_date,
      selectedGender,
      selectedCompCode,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      sales_id,
      status,
      id_card_pic,
      birth_place,
      address,
      languages,
      sales_type_ids,
      sales_type_id,
    } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["recruitment_sales"] === "" ||
        auth.authority["recruitment_sales"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    let pin = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;
    let pin_confirmation =
      pinConf1 + pinConf2 + pinConf3 + pinConf4 + pinConf5 + pinConf6;

    if (
      first_name &&
      last_name &&
      email &&
      phone_number &&
      id_number &&
      dob &&
      selectedGender.label &&
      address &&
      sales_type_ids
    ) {
      allFilled = true;
    } else if (
      first_name &&
      last_name &&
      id_number &&
      pin &&
      pin === pin_confirmation &&
      dob &&
      selectedGender.label &&
      sales_type_ids
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

    const style = {
      minHeight: "100px",
    };

    return (
      <div className="container mb-5">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            confirmClose={() =>
              this.setState({ confirmIsOpen: false, loading: false })
            }
            confirmSuccess={() => history.push("/sales/")}
            textSuccess={textSuccess}
            textError={textError}
            textReason={textReason}
            type={type}
          />
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              console.log(allFilled);

              let sales_types = [];
              sales_type_ids.map((district) =>
                sales_types.push(parseInt(district.value, 10))
              );

              if (allFilled) {
                editSale({
                  id,
                  first_name,
                  last_name,
                  email,
                  id_number,
                  dob,
                  phone_area,
                  birth_place,
                  address,
                  sales_id,
                  work_date,
                  occupation,
                  pin,
                  pin_confirmation,
                  phone_number:
                    phone_number.charAt(0) === "0"
                      ? phone_number.substr(1)
                      : phone_number,
                  gender: selectedGender.label,
                  company_code: selectedCompCode.value,
                  sales_type_id: sales_type_id.value,
                })
                  .then((data) => {
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
                  })
                  .catch((e) => {
                    this.setState({
                      confirmIsOpen: true,
                      type: "error",
                      textError: "Edit data sales gagal",
                      textReason: e.message,
                    });
                  });
              } else {
                this.setState({
                  confirmIsOpen: true,
                  type: "error",
                  textError: "Edit data sales gagal",
                  textReason: "Please check all field",
                });
              }
            }}
          >
            <div className="row">
              <div className="col-12 mb-4">
                <h2>
                  {languages.header} {status} {languages.sales}
                </h2>
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
                            type="text"
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
                              required
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                          <label>{languages.tempatLahir}</label>
                          <input
                            type="text"
                            className="form-control form-control-line"
                            onChange={(e) =>
                              this.setState({ birth_place: e.target.value })
                            }
                            value={birth_place}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label>{languages.idNumber}</label>
                          <input
                            type="text"
                            className="form-control form-control-line"
                            onChange={(e) => {
                              if (e.target.value.length < 17) {
                                this.setState({ id_number: e.target.value });
                              }
                            }}
                            value={id_number}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label>{languages.alamat}</label>
                          <textarea
                            className="form-control form-control-line"
                            style={style}
                            value={address}
                            placeholder="Masukan alamat sales..."
                            onChange={(e) => {
                              this.setState({ address: e.target.value });
                            }}
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label>{languages.gender}</label>
                          <SelectLineComponent
                            options={genders.form}
                            initValue={selectedGender}
                            handleChange={(selectedGender) =>
                              this.setState({ selectedGender })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label>{languages.salesType}</label>
                          <SelectLineComponent
                            options={sales_types.data}
                            initValue={sales_type_id}
                            handleChange={(sales_type_id) =>
                              this.setState({ sales_type_id })
                            }
                            required
                          />
                          {/* <SelectMultiple initValue={sales_type_ids} options={sales_types.data} 
                          handleChange={(sales_type_ids) => {
                            this.setState({sales_type_ids})
                          }}/> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-4 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.status}</h6>
                    <div className="col-12 mt-4">
                      <div className="row">
                        <div className="col-12 col-lg-6 p-lg-0 text-left">
                          <span
                            className={`badge ${
                              status === "Unregistered"
                                ? "badge-gray"
                                : "badge-status"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.idCard}</h6>
                    <div className="col-12 mt-4">
                      <div className="row">
                        <div className="col-12 col-lg-6 p-lg-0 text-left">
                          <div className="id-card d-flex flex-row align-items-center pt-1">
                            <i className="la la-image text-gray mr-2"></i>
                            {id_card_pic === "" ? (
                              <small className="text-gray mb-0">
                                {languages.didNot}
                              </small>
                            ) : (
                              <span
                                className="text-danger text-bold"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  let newExpand = this.state.expandCard
                                    ? false
                                    : true;
                                  this.setState({ expandCard: newExpand });
                                }}
                              >
                                {languages.lihat}{" "}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.expandCard && (
                  <div id="card-image" className="card expand-card">
                    <div className="card-body text-center pb-2">
                      <h4 className="text-uppercase">{languages.fotoKtp}</h4>
                      <div className="actions text-right">
                        <button
                          className="btn btn-link text-gray text-left"
                          onClick={() => {
                            let newExpand = this.state.expandCard
                              ? false
                              : true;
                            this.setState({ expandCard: newExpand });
                          }}
                        >
                          <div className="d-inline-flex align-items-center">
                            {/* <span className="mr-2">{languages.collapseFoto}</span> */}
                            <IconCollapse />
                          </div>
                        </button>
                      </div>
                      <img src={id_card_pic} className="img-fluid" alt="" />
                    </div>
                  </div>
                )}
              </div>

              <div className="col-12 mb-3">
                <hr className="content-hr" />
                <div className="form-group d-flex justify-content-between">
                  <Link to="/sales" className="btn btn-default">
                    {languages.cancel}
                  </Link>
                  <button type="submit" className="btn btn-danger">
                    {languages.save}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({
    auth,
    genders,
    company_codes,
    provinces,
    cities,
    districts,
    villages,
    sales,
    sales_types,
  }) => ({
    auth,
    genders,
    company_codes,
    provinces,
    cities,
    districts,
    villages,
    sales,
    sales_types,
  }),
  { editSale, getSale, getCities, getDistricts, getVillages, getSaleV2 }
)(Edit);
