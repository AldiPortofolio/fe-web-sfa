import React from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { isNaN } from "lodash";
import { getRegions } from "../../actions/region";
import { searchBranch } from "../../actions/branch";
import { searchAreas } from "../../actions/area";
import {
  getSale,
  getSalesRoles,
  findSales,
  getSalesManagementDetail,
  positionAssignment,
  relationCheck,
} from "../../actions/sale";
import {
  findInstitution,
  createNewRecruitment,
  maxMinParameter,
} from "../../actions/recruitment";
import {
  findSAC,
  getSubAreaChannels_ByVillage,
  searchSubAreas,
} from "../../actions/subarea";
import { findProvince } from "../../actions/province";
import { findCity } from "../../actions/city";
import { findDistrict } from "../../actions/district";
import { findVillage } from "../../actions/village";
import { NotAuthorize, ModalConfirm, SelectRequired } from "../../components";
import BulkErrorFileV2 from "../../components/BulkErrorFileV221";
import { ind, en } from "../../languages/recruitment";

class NewRecruitment extends React.Component {
  state = {
    confirmIsOpen: false,
    expandCard: false,
    type: "success",
    textSuccess: "",
    textError: "",
    textReason: "",
    language: {},
    merchant_name: "",
    owner_name: "",
    institution_code: "",
    customer_code: "",
    phone_number: "",
    id_card: "",
    address: "",
    province: "",
    city: "",
    district: "",
    village: "",
    sub_area_channel: "",
    longitude: "",
    latitude: "",
    min: 0,
    max: 0,
    institutions: [],
    subAreaChannels: [],
    provinces: [],
    cities: [],
    districts: [],
    villages: [],
    phone_number_validation: false,
  };

  componentDidMount() {
    document.title = "SFA OTTO - New Recruitment";
    if (this.props.auth.language === "in") {
      this.setState({ language: ind.new });
    } else if (this.props.auth.language === "en") {
      this.setState({ language: en.new });
    }

    this.filterInstitusi("");
    this.filterProvince("");
    this.fetchParameterMaxMin();
  }

  fetchParameterMaxMin() {
    this.props.maxMinParameter().then((data) => {
      if (data.data !== null) {
        data.data.forEach((parameter) => {
          if (parameter.name === "max_char_merchant_phone") {
            this.setState({ max: parameter.param_value });
          } else {
            this.setState({ min: parameter.param_value });
          }
        });
      }
    });
  }

  filterInstitusi = (inputValue) => {
    let institutions = [];
    institutions.push({ value: "", label: "Searching...", disabled: true });

    this.props.findInstitution({ keyword: inputValue }).then((data) => {
      let institutions = [];
      if (data.data !== null) {
        data.data.forEach((ins) => {
          institutions.push({
            value: ins.id,
            label: `${ins.name}`,
            code: ins.code,
          });
        });
      }

      this.setState({ institutions: institutions });
    });
  };

  filterSubAreaChannel = (village_id, inputValue) => {
    let newSac = [];
    newSac.push({ value: "", label: "Searching...", disabled: true });

    this.props
      .getSubAreaChannels_ByVillage(village_id, { keyword: inputValue })
      .then((data) => {
        let newSac = [];
        if (data.data !== null) {
          data.data.forEach((sac) => {
            newSac.push({ value: sac.ID, label: `${sac.name}` });
          });
        }
        this.setState({ subAreaChannels: newSac });
      });
  };

  filterProvince = (inputValue) => {
    let newData = [];
    newData.push({ value: "", label: "Searching...", disabled: true });

    this.props.findProvince({ keyword: inputValue }).then((data) => {
      let newData = [];
      if (data.data !== null) {
        data.data.forEach((province) => {
          newData.push({ value: province.id, label: `${province.name}` });
        });
      }
      this.setState({ provinces: newData });
    });
  };

  filterCity = (province_id, inputValue) => {
    let newData = [];
    newData.push({ value: "", label: "Searching...", disabled: true });

    this.props.findCity(province_id, { keyword: inputValue }).then((data) => {
      let newData = [];
      if (data.data !== null) {
        data.data.forEach((city) => {
          newData.push({ value: city.id, label: `${city.name}` });
        });
      }
      this.setState({ cities: newData });
    });
  };

  filterDistrict = (id_city, inputValue) => {
    let newData = [];
    newData.push({ value: "", label: "Searching...", disabled: true });

    this.props.findDistrict(id_city, { keyword: inputValue }).then((data) => {
      let newData = [];
      if (data.data !== null) {
        data.data.forEach((district) => {
          newData.push({ value: district.id, label: `${district.name}` });
        });
      }
      this.setState({ districts: newData });
    });
  };

  filterVillage = (id_district, inputValue) => {
    let newData = [];
    newData.push({ value: "", label: "Searching...", disabled: true });

    this.props
      .findVillage(id_district, { keyword: inputValue })
      .then((data) => {
        let newData = [];
        if (data.data !== null) {
          data.data.forEach((village) => {
            newData.push({ value: village.id, label: `${village.name}` });
          });
        }
        this.setState({ villages: newData });
      });
  };

  render() {
    const { auth, history, createNewRecruitment } = this.props;
    const {
      phone_number_validation,
      max,
      min,
      merchant_name,
      owner_name,
      institution_code,
      customer_code,
      phone_number,
      id_card,
      institutions,
      address,
      province,
      city,
      district,
      village,
      sub_area_channel,
      longitude,
      latitude,
      subAreaChannels,
      provinces,
      cities,
      districts,
      villages,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      language,
    } = this.state;

    if (
      auth.authority["recruitment"] === "" ||
      auth.authority["recruitment"] === "No Access"
    ) {
      return <NotAuthorize />;
    }

    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({ confirmIsOpen: false })}
            confirmSuccess={() => history.push("/recruitment")}
            textSuccess={textSuccess}
            textError={textError}
            textReason={textReason}
          />
          <form
            className="col-12"
            onSubmit={(e) => {
              e.preventDefault();

              let formData = {
                name: merchant_name,
                customer_code: customer_code,
                phone_number: phone_number,
                institution_code: institution_code.code,
                sub_area_channel_id: sub_area_channel.value,
                sub_area_channel_name: sub_area_channel.label,
                owner_name: owner_name,
                address: address,
                longitude: longitude,
                latitude: latitude,
                province_id: province.value,
                city_id: city.value,
                district_id: district.value,
                village_id: village.value,
                id_card: id_card,
              };

              if (phone_number) {
                if (
                  phone_number.substring(0, 2) !== "08" ||
                  phone_number.length < min
                ) {
                  this.setState({
                    phone_number_validation: true,
                    disabled: false,
                  });
                  this.setState({
                    confirmIsOpen: true,
                    type: "error",
                    textError: "Ups!",
                    textReason: "Pastikan nomor HP yang di masukan sesuai.",
                  });
                } else {
                  if (formData) {
                    createNewRecruitment(formData)
                      .then((data) => {
                        if (data.meta.status === false) {
                          this.setState({
                            confirmIsOpen: true,
                            type: "error",
                            textError: "Create New Recruitment fail",
                            textReason: data.meta.message,
                          });
                        } else {
                          this.setState({
                            confirmIsOpen: true,
                            type: "success",
                            textSuccess: "Create New Recruitment success",
                            textError: "",
                          });
                        }
                      })
                      .catch((e) => {
                        this.setState({
                          confirmIsOpen: true,
                          type: "error",
                          textError: "Create New Recruitment fail",
                          textReason: e.message,
                        });
                      });
                  } else {
                    this.setState({
                      confirmIsOpen: true,
                      type: "error",
                      textError: "Create New Recruitment fail",
                      textReason: "Please make sure all are filled.",
                    });
                  }
                }
              } else {
                if (formData) {
                  createNewRecruitment(formData)
                    .then((data) => {
                      if (data.meta.status === false) {
                        this.setState({
                          confirmIsOpen: true,
                          type: "error",
                          textError: "Create New Recruitment fail",
                          textReason: data.meta.message,
                        });
                      } else {
                        this.setState({
                          confirmIsOpen: true,
                          type: "success",
                          textSuccess: "Create New Recruitment success",
                          textError: "",
                        });
                      }
                    })
                    .catch((e) => {
                      this.setState({
                        confirmIsOpen: true,
                        type: "error",
                        textError: "Create New Recruitment fail",
                        textReason: e.message,
                      });
                    });
                } else {
                  this.setState({
                    confirmIsOpen: true,
                    type: "error",
                    textError: "Create New Recruitment fail",
                    textReason: "Please make sure all are filled.",
                  });
                }
              }
            }}
          >
            <div className="row">
              <div className="col-12 mb-5">
                <h2>{language.header}</h2>
              </div>
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12 mt-3">
                      <h6>{language.header1}</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.mName}</label>
                            <input
                              onChange={(e) => {
                                var regex = /^[a-zA-Z ]*$/;
                                if (
                                  Number(e.target.value) ||
                                  !regex.test(e.target.value)
                                ) {
                                  return;
                                }
                                this.setState({
                                  merchant_name: e.target.value,
                                });
                              }}
                              value={merchant_name}
                              type="text"
                              name="merchant-name"
                              className="form-control form-control-line"
                              placeholder="Masukan nama merchant"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.noHp}</label>
                            <input
                              onChange={(e) => {
                                if (
                                  isNaN(Number(e.target.value)) ||
                                  e.target.value.split("").length > max
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
                              maxLength={max}
                              // required={customer_code ? false : true}
                            />
                            {phone_number_validation && (
                              <small className="text-validation text-danger">
                                {language.noHp_validation}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.ownerName}</label>
                            <input
                              onChange={(e) => {
                                var regex = /^[a-zA-Z ]*$/;
                                if (
                                  Number(e.target.value) ||
                                  !regex.test(e.target.value)
                                ) {
                                  return;
                                }
                                this.setState({ owner_name: e.target.value });
                              }}
                              value={owner_name}
                              type="text"
                              name="owner-name"
                              className="form-control form-control-line"
                              placeholder="Masukan nama pemilik"
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.institusi}</label>
                            <div className="custom-select-line">
                              <SelectRequired
                                placeholder="Select..."
                                value={institution_code}
                                options={institutions}
                                onChange={(ins) => {
                                  this.setState({ institution_code: ins });
                                }}
                                onInputChange={debounce((value) => {
                                  if (value !== "") {
                                    this.filterInstitusi(value);
                                  }
                                }, 500)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.noCustomer}</label>
                            <input
                              onChange={(e) =>
                                this.setState({ customer_code: e.target.value })
                              }
                              value={customer_code}
                              type="text"
                              name="customer-code"
                              maxLength="30"
                              className="form-control form-control-line"
                              placeholder="Masukan nomor"
                              required
                              // required={phone_number ? false : true}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>NIK</label>
                            <input
                              onChange={(e) => {
                                if (
                                  isNaN(Number(e.target.value)) ||
                                  e.target.value.split("").length > 16
                                ) {
                                  return;
                                }
                                this.setState({ id_card: e.target.value });
                              }}
                              value={id_card}
                              type="number"
                              name="id_card"
                              className="form-control form-control-line"
                              placeholder="10 50 24 570890 0001"
                              maxLength="16"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12 mt-3">
                      <h6>{language.header2}</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.province}</label>
                            <div className="custom-select-line">
                              <SelectRequired
                                placeholder="Select..."
                                value={province}
                                options={provinces}
                                onChange={(province) => {
                                  this.setState({ province });
                                  this.filterCity(province.value, "");
                                }}
                                onInputChange={debounce((value) => {
                                  if (value !== "") {
                                    this.filterProvince(value);
                                  }
                                }, 500)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.city}</label>
                            <div className="custom-select-line">
                              <SelectRequired
                                placeholder="Select..."
                                value={city}
                                options={cities}
                                onChange={(city) => {
                                  this.setState({ city });
                                  this.filterDistrict(city.value, "");
                                }}
                                onInputChange={debounce((value) => {
                                  if (value !== "") {
                                    this.filterCity(province.value, value);
                                  }
                                }, 500)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.district}</label>
                            <div className="custom-select-line">
                              <SelectRequired
                                placeholder="Select..."
                                value={district}
                                options={districts}
                                onChange={(district) => {
                                  this.setState({ district });
                                  this.filterVillage(district.value, "");
                                }}
                                onInputChange={debounce((value) => {
                                  if (value !== "") {
                                    this.filterDistrict(city.value, value);
                                  }
                                }, 500)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.subDistrict}</label>
                            <div className="custom-select-line">
                              <SelectRequired
                                placeholder="Select..."
                                value={village}
                                options={villages}
                                onChange={(village) => {
                                  this.setState({ village });
                                  this.filterSubAreaChannel(village.value, "");
                                }}
                                onInputChange={debounce((value) => {
                                  if (value !== "") {
                                    this.filterVillage(district.value, value);
                                  }
                                }, 500)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.longitude}</label>
                            <input
                              onChange={(e) =>
                                this.setState({ longitude: e.target.value })
                              }
                              value={longitude}
                              type="text"
                              name="longitude"
                              className="form-control form-control-line"
                              placeholder="Longitude"
                              required={latitude ? true : false}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <label>{language.latitude}</label>
                            <input
                              onChange={(e) =>
                                this.setState({ latitude: e.target.value })
                              }
                              value={latitude}
                              type="text"
                              name="latitude"
                              className="form-control form-control-line"
                              placeholder="Latitude"
                              required={longitude ? true : false}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-12">
                          <div className="form-group">
                            <label>{language.sac}</label>
                            <div className="custom-select-line">
                              <SelectRequired
                                placeholder="Select..."
                                value={sub_area_channel}
                                options={subAreaChannels}
                                onChange={(sac) => {
                                  this.setState({ sub_area_channel: sac });
                                }}
                                onInputChange={debounce((value) => {
                                  if (value !== "") {
                                    this.filterSubAreaChannel(
                                      village.value,
                                      value
                                    );
                                  }
                                }, 500)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-12">
                          <div className="form-group">
                            <label>{language.address}</label>
                            <textarea
                              className="form-control form-control-line"
                              value={address}
                              placeholder={language.pAddress}
                              onChange={(e) => {
                                this.setState({ address: e.target.value });
                              }}
                              style={{ minHeight: "100px" }}
                              required
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4 mb-3">
                <BulkErrorFileV2
                  auth={auth}
                  title={"New Recruitment"}
                  actionUrl={"merchants-new-recruitment"}
                  history={history}
                />
              </div>

              {auth.authority["assignment_sales"] === "Full Access" && (
                <div className="col-12 mb-3">
                  <hr className="content-hr" />
                  <div className="form-group d-flex justify-content-between">
                    <Link to="/recruitment" className="btn btn-default">
                      {language.cancel}
                    </Link>
                    <button type="submit" className="btn btn-danger">
                      {language.save}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ auth, sales, regions, branches, areas }) => ({
    auth,
    sales,
    regions,
    branches,
    areas,
  }),
  {
    createNewRecruitment,
    findInstitution,
    findSAC,
    findProvince,
    findCity,
    findDistrict,
    findVillage,
    getSale,
    getSalesRoles,
    findSales,
    getSalesManagementDetail,
    getSubAreaChannels_ByVillage,
    maxMinParameter,
    getRegions,
    searchBranch,
    searchAreas,
    searchSubAreas,
    positionAssignment,
    relationCheck,
  }
)(NewRecruitment);
