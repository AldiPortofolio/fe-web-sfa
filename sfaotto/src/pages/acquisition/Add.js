import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  SelectLineComponent,
  SelectMultiple,
  Dropzone,
  LoadingDots,
  ModalConfirm,
  SelectComponentLoad,
} from "../../components/";
import { createAcquisition } from "../../actions/acquisition";
import { getMerchantTypes } from "../../actions/merchant_type";
import { getSalesRetails } from "../../actions/sales_retail";
import { getBusinessTypes } from "../../actions/business_type";
import { getMerchantGroup } from "../../actions/merchant_group";
import { getMerchantCategory } from "../../actions/merchant_category";

class Add extends Component {
  state = {
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

  componentDidMount() {
    document.title = "SFA OTTO - Add Acquisition";

    // if (this.props.auth.language === "in"){
    // this.setState({languagesFilter: ind.filter, languagesTable: ind.table})
    // } else if (this.props.auth.language === "en"){
    // this.setState({languagesFilter: en.filter, languagesTable: en.table})
    // }
    this.getComboList();
  }

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

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleChangeOption = (value, name) => {
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      isLoading,
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
    const { createAcquisition } = this.props;
    this.setState({ textError: "", isLoading: true });

    createAcquisition({
      rose_merchant_type: rose_merchant_type.value,
      rose_merchant_group:
        rose_merchant_group.value && rose_merchant_group.value.toString(),
      rose_merchant_category: rose_merchant_category.value,
      name,
      sequence: parseInt(sequence.value),
      sales_retails,
      business_types,
      register_using_id: register_using_id === "true",
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
            textSuccess: "Tambah data acquisition sukses",
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
      groupMerchantRoseOptions,
      kategoriMerchantRoseOptions,
      sequenceOptions,
    } = this.state;
    const { history } = this.props;

    return (
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
                <h2>Add Acquisition List</h2>
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
                              handleChange={(rose_merchant_type) => {
                                this.setState({ rose_merchant_type });
                              }}
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
                                  options={salesRetailOption}
                                  placeholder={"Pilih sales retail"}
                                  handleChange={(sales_type) => {
                                    let sales_type_ids = [];
                                    sales_type.map((type) =>
                                      sales_type_ids.push(type.value.toString())
                                    );

                                    this.setState({
                                      sales_retails: sales_type_ids,
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
                                  options={tipeBisnisOptions}
                                  placeholder={"Pilih tipe bisnis"}
                                  handleChange={(business_types) => {
                                    let business_types_ids = [];
                                    business_types.map((type) =>
                                      business_types_ids.push(type.value)
                                    );
                                    this.setState({
                                      business_types: business_types_ids,
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
                    <Link to="/task-management/" className="btn btn-default">
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

export default connect(
  ({ auth, merchant_types }) => ({ auth, merchant_types }),
  {
    createAcquisition,
    getMerchantTypes,
    getSalesRetails,
    getBusinessTypes,
    getMerchantGroup,
    getMerchantCategory,
  }
)(Add);
