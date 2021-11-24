import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { find, isNaN } from "lodash";
import {
  SelectLineComponent,
  SelectMultiple,
  Dropzone,
  LoadingDots,
  ModalConfirm,
  LoadingSpinner,
  SelectComponentLoad,
} from "../../components/";
import { getAcquisition, editAcquisition } from "../../actions/acquisition";
import { getMerchantTypes } from "../../actions/merchant_type";
import { getSalesRetails } from "../../actions/sales_retail";
import { getBusinessTypes } from "../../actions/business_type";
import { getMerchantGroup } from "../../actions/merchant_group";
import { getMerchantCategory } from "../../actions/merchant_category";

class Edit extends Component {
  state = {
    id: "",
    isLoading: false,
    rose_merchant_type: "",
    rose_merchant_group: "",
    rose_merchant_category: "",
    name: "",
    sequence: "",
    sales_retails: [],
    business_types: [],
    register_using_id: false,
    show_in_app: "Inactive",
    logo: "",
    logoUrl: "",
    confirmIsOpen: false,
    type: "success",
    textSuccess: "",
    textError: "",
    typeMerchantRoseOptions: [],
    salesRetailOption: [],
    tipeBisnisOptions: [],
    groupMerchantRoseOptions: [],
    kategoriMerchantRoseOptions: [],
    sequenceOptions: [],
  };

  componentDidMount = async () => {
    document.title = "SFA OTTO - Add Acquisition";

    // if (this.props.auth.language === "in"){
    // this.setState({languagesFilter: ind.filter, languagesTable: ind.table})
    // } else if (this.props.auth.language === "en"){
    // this.setState({languagesFilter: en.filter, languagesTable: en.table})
    // }
    // this.getComboList();
    await this.getComboList();
    await this.mappingToState();
  };

  getComboList = async () => {
    await this.props.getMerchantTypes().then((data) => {
      let newTypeMerchantRoseOptions = [];
      data.data.map((obj) => {
        newTypeMerchantRoseOptions.push({ value: obj.code, label: obj.name });
      });
      this.setState({ typeMerchantRoseOptions: newTypeMerchantRoseOptions });
    });

    await this.props.getSalesRetails().then((data) => {
      let newSalesRetailOptions = [];
      data.data.map((obj) => {
        newSalesRetailOptions.push({ value: obj.id, label: obj.name });
      });
      this.setState({ salesRetailOption: newSalesRetailOptions });
    });

    await this.props.getBusinessTypes().then((data) => {
      let newTipeBisnisOptions = [];
      data.data.map((obj) => {
        newTipeBisnisOptions.push({ value: obj.code, label: obj.name });
      });
      this.setState({ tipeBisnisOptions: newTipeBisnisOptions });
    });

    await this.props.getMerchantCategory().then((data) => {
      let newMerchantCategoryOptions = [];
      data.data.map((obj) => {
        newMerchantCategoryOptions.push({ value: obj.code, label: obj.name });
      });
      this.setState({
        kategoriMerchantRoseOptions: newMerchantCategoryOptions,
      });
    });

    this.generateSequenceOptions();
  };

  generateSequenceOptions = () => {
    let sequenceOptions = [];
    for (let index = 1; index <= 100; index++) {
      sequenceOptions.push({ value: index, label: index });
    }
    this.setState({ sequenceOptions });
  };

  mappingToState = async () => {
    const {
      typeMerchantRoseOptions,
      salesRetailOption,
      tipeBisnisOptions,
      kategoriMerchantRoseOptions,
      sequenceOptions,
    } = this.state;
    const { getAcquisition, match } = this.props;

    // Get data dteail
    await getAcquisition(match.params.id);

    // Set State
    const { acquisitions } = this.props;
    if (acquisitions.isLoading) return;
    const data = acquisitions.one;
    this.setState({ ...data, id: match.params.id });

    const rose_merchant_type =
      find(typeMerchantRoseOptions, {
        value: data.rose_merchant_type,
      }) || "";
    this.setState({ rose_merchant_type });

    let sales_retails = [];
    data.sales_retails.map((val) => {
      const sales_retail =
        find(salesRetailOption, {
          value: parseInt(val),
        }) || "";
      sales_retails.push(sales_retail);
    });
    this.setState({ sales_retails });

    let business_types = [];
    data.business_types.map((val) => {
      const business_type =
        find(tipeBisnisOptions, {
          value: val,
        }) || "";
      business_types.push(business_type);
    });
    this.setState({ business_types });

    this.props
      .getMerchantGroup({
        merchant_type: data.rose_merchant_type,
      })
      .then((val) => {
        let newMerchantGroupOptions = [];
        let new_rose_merchant_group = {};
        if (val.meta.code != 400) {
          val.data.map((obj) => {
            if (obj.id == data.rose_merchant_group) {
              new_rose_merchant_group = {
                value: obj.id,
                label: obj.merchant_group_name,
              };
            }

            newMerchantGroupOptions.push({
              value: obj.id,
              label: obj.merchant_group_name,
            });
          });
          this.setState({
            groupMerchantRoseOptions: newMerchantGroupOptions,
            rose_merchant_group: new_rose_merchant_group,
          });
        }
      });

    const rose_merchant_category =
      find(kategoriMerchantRoseOptions, {
        value: data.rose_merchant_category,
      }) || "";
    this.setState({ rose_merchant_category });

    const sequence =
      find(sequenceOptions, {
        value: data.sequence,
      }) || "";
    this.setState({ sequence });
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleChangeOption = (value, name) => {
    this.setState({ [name]: value });
  };

  getBase64Image = (imgUrl) =>
    new Promise((resolve, reject) => {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.setAttribute("crossOrigin", "anonymous"); //
      img.src = imgUrl;
    });

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      isLoading,
      id,
      rose_merchant_type,
      rose_merchant_group,
      rose_merchant_category,
      name,
      sequence,
      sales_retails,
      business_types,
      register_using_id,
      show_in_app,
      logo,
    } = this.state;
    const { editAcquisition } = this.props;
    this.setState({ textError: "", isLoading: true });

    let newSalesRetail = [];
    sales_retails.map((value) => {
      newSalesRetail.push(value.value.toString());
    });

    let newBusinessTypes = [];
    business_types.map((value) => {
      newBusinessTypes.push(value.value);
    });

    editAcquisition({
      id: parseInt(id),
      rose_merchant_type: rose_merchant_type.value,
      rose_merchant_group: rose_merchant_group.value.toString(),
      rose_merchant_category: rose_merchant_category.value,
      name,
      sequence: parseInt(sequence.value),
      sales_retails: newSalesRetail,
      business_types: newBusinessTypes,
      register_using_id:
        register_using_id === "true" || register_using_id === true,
      show_in_app,
      logo,
    })
      .then((data) => {
        if (data.meta.status === false) {
          this.setState({
            isLoading: false,
            confirmIsOpen: true,
            type: "error",
            textError: data.meta.message,
          });
        } else {
          this.setState({
            isLoading: false,
            confirmIsOpen: true,
            type: "success",
            textSuccess: "Edit data acquisition sukses",
          });
        }
      })
      .catch((e) =>
        this.setState({
          isLoading: false,
          confirmIsOpen: true,
          type: "error",
          textSuccess: "Tambah data acquisition gagal",
        })
      );
  };

  render() {
    const {
      isLoading,
      rose_merchant_type,
      rose_merchant_group,
      rose_merchant_category,
      name,
      sequence,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      typeMerchantRoseOptions,
      salesRetailOption,
      tipeBisnisOptions,
      sales_retails,
      business_types,
      groupMerchantRoseOptions,
      kategoriMerchantRoseOptions,
      sequenceOptions,
      logo,
      register_using_id,
      show_in_app,
    } = this.state;
    const { history, acquisitions } = this.props;
    return acquisitions.isLoading ? (
      <LoadingSpinner />
    ) : (
      <>
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          confirmSuccess={() =>
            history.push("/system-configuration/acquisition")
          }
          textSuccess={textSuccess}
          textError={textError}
        />
        <div className="container mb-5 mt-3">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-12 mb-3">
                <h2>Edit Acquisition List</h2>
              </div>
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6 className="mb-4">Rose Merchant</h6>
                    <div className="row">
                      <div className="col-12 col-lg-12">
                        <div className="form-group">
                          <label className="">Tipe Merchant Rose</label>
                          <div className="custom-select-line">
                            <SelectLineComponent
                              options={typeMerchantRoseOptions}
                              initValue={rose_merchant_type}
                              placeholder="Pilih tipe merchant"
                              handleChange={(rose_merchant_type) =>
                                this.setState({ rose_merchant_type })
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="">Group Merchant Rose</label>
                          <div className="custom-select-line">
                            <SelectComponentLoad
                              options={groupMerchantRoseOptions}
                              initValue={rose_merchant_group}
                              placeholder="Pilih group merchant"
                              onFocus={() => {
                                this.props
                                  .getMerchantGroup({
                                    merchant_type: rose_merchant_type.value,
                                  })
                                  .then((data) => {
                                    let newMerchantGroupOptions = [];
                                    if (data.meta.code != 400) {
                                      data.data.map((obj) => {
                                        newMerchantGroupOptions.push({
                                          value: obj.id,
                                          label: obj.merchant_group_name,
                                        });
                                      });
                                      this.setState({
                                        groupMerchantRoseOptions:
                                          newMerchantGroupOptions,
                                      });
                                    }
                                  });
                              }}
                              handleChange={(rose_merchant_group) =>
                                this.setState({ rose_merchant_group })
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="">Kategori Merchant Rose</label>
                          <div className="custom-select-line">
                            <SelectLineComponent
                              options={kategoriMerchantRoseOptions}
                              initValue={rose_merchant_category}
                              placeholder="Pilih kategori merchant"
                              handleChange={(rose_merchant_category) =>
                                this.setState({ rose_merchant_category })
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-lg-6">
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
                              />
                            </div>
                          </div>
                          <div className="col-12 col-lg-6">
                            <div className="form-group">
                              <label className="">Sequence</label>
                              <div className="custom-select-line">
                                <SelectLineComponent
                                  options={sequenceOptions}
                                  initValue={sequence}
                                  placeholder="Pilih sequence"
                                  handleChange={(sequence) =>
                                    this.setState({ sequence })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-lg-6">
                            <div className="form-group">
                              <label className="">Sales Retail</label>
                              <div className="custom-select-line">
                                <SelectMultiple
                                  key={2}
                                  initValue={sales_retails}
                                  options={salesRetailOption}
                                  placeholder={"Pilih sales retail"}
                                  handleChange={(sales_retails) => {
                                    this.setState({
                                      sales_retails,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-lg-6">
                            <div className="form-group">
                              <label className="">Tipe Bisnis</label>
                              <div className="custom-select-line">
                                <SelectMultiple
                                  key={1}
                                  initValue={business_types}
                                  options={tipeBisnisOptions}
                                  placeholder={"Pilih tipe bisnis"}
                                  handleChange={(business_types) => {
                                    this.setState({
                                      business_types,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-lg-12">
                            <div className="form-group">
                              <label className="">Pendaftaran Via ID</label>
                            </div>
                            <div className="form-group">
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="register_using_id"
                                  id={`yes`}
                                  value={true}
                                  onChange={this.handleChange}
                                  checked={
                                    register_using_id === true ||
                                    register_using_id === "true"
                                  }
                                />
                                <label className="form-check-label" htmlFor="">
                                  &nbsp;Iya
                                </label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="register_using_id"
                                  id={`no`}
                                  value={false}
                                  onChange={this.handleChange}
                                  checked={
                                    register_using_id === false ||
                                    register_using_id === "false"
                                  }
                                />
                                <label className="form-check-label" htmlFor="">
                                  &nbsp;Tidak
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-lg-12">
                            <div className="form-group">
                              <label className="">Tampilkan di aplikasi</label>
                            </div>
                            <div className="form-group">
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="show_in_app"
                                  id={`yes`}
                                  value="Active"
                                  onChange={this.handleChange}
                                  checked={show_in_app === "Active"}
                                />
                                <label className="form-check-label" htmlFor="">
                                  &nbsp;Iya
                                </label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="show_in_app"
                                  id={`no`}
                                  value="Inactive"
                                  onChange={this.handleChange}
                                  checked={show_in_app !== "Active"}
                                />
                                <label className="form-check-label" htmlFor="">
                                  &nbsp;Tidak
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-lg-12">
                            <div className="form-group">
                              <label className="">Logo</label>
                            </div>
                            <Dropzone
                              maxSize={5}
                              handleChange={this.handleChangeOption}
                              name="logo"
                              initialValue={logo}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* {auth.authority["add_admin"] === "Full Access" && ( */}
              <div className="col-12 text-right mb-5">
                <div className="border-top pt-3">
                  <div className="form-group d-flex justify-content-between">
                    <Link
                      to="/system-configuration/acquisition"
                      className="btn btn-default"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className={`btn btn-danger ${
                        isLoading ? "disabled" : ""
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingDots /> : "save"}
                    </button>
                  </div>
                </div>
              </div>
              {/* )} */}
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default connect(({ auth, acquisitions }) => ({ auth, acquisitions }), {
  getAcquisition,
  getMerchantTypes,
  getSalesRetails,
  getBusinessTypes,
  getMerchantGroup,
  getMerchantCategory,
  editAcquisition,
})(Edit);
