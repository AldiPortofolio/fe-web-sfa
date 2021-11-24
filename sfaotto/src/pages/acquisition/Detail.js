import React, { Component } from "react";
import { find, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getAcquisitions,
  deleteAcquisition,
  changeStatusAcquisition,
  getDetailAcquisition,
} from "../../actions/acquisition";
import { getSalesRetails } from "../../actions/sales_retail";
import { ind, en } from "../../languages/admin";

class Detail extends Component {
  state = {
    id: "",
    rose_merchant_type: "",
    rose_merchant_type_name: "",
    rose_merchant_group: "",
    rose_merchant_group_name: "",
    rose_merchant_category: "",
    rose_merchant_category_name: "",
    name: "",
    logo: "",
    register_using_id: false,
    sequence: 1,
    show_in_app: "Inactive",
    sales_retails: [],
    business_types: [],
    salesRetailOption: [],
  };
  componentDidMount = async () => {
    document.title = "SFA OTTO - Add Acquisition";
    const { getDetailAcquisition, match } = this.props;

    // if (this.props.auth.language === "in"){
    // this.setState({languagesFilter: ind.filter, languagesTable: ind.table})
    // } else if (this.props.auth.language === "en"){
    // this.setState({languagesFilter: en.filter, languagesTable: en.table})
    // }
    // this.getComboList();
    await getDetailAcquisition(match.params.id);
    await this.mappingToState();
    this.getComboList();
  };

  getComboList = async () => {
    await this.props.getSalesRetails().then((data) => {
      let newSalesRetailOptions = [];
      data.data.map((obj) => {
        newSalesRetailOptions.push({ value: obj.id, label: obj.name });
      });
      this.setState({ salesRetailOption: newSalesRetailOptions });
    });
  };

  mappingToState = async () => {
    const { acquisitions } = this.props;

    if (acquisitions.isLoading) return;
    this.setState({ ...acquisitions.one });
  };

  render() {
    const {
      id,
      rose_merchant_type,
      rose_merchant_type_name,
      rose_merchant_group,
      rose_merchant_group_name,
      rose_merchant_category,
      rose_merchant_category_name,
      name,
      logo,
      register_using_id,
      sequence,
      show_in_app,
      sales_retails,
      business_types,
      salesRetailOption,
    } = this.state;
    const { match } = this.props;

    return (
      <div className="container mb-5 mt-3">
        <div className="row">
          <div className="col-12 mb-3">
            <h2>Detail Acquisition</h2>
          </div>
          <div className="col-12 col-lg-8 mb-3">
            <div className="card mb-4">
              <div className="card-body">
                <div className="row mr-2">
                  <table width="100%">
                    <tr>
                      <td
                        rowSpan={2}
                        style={{ textAlign: "center" }}
                        width="100"
                      >
                        <img
                          class="rounded-circle"
                          alt="100x100"
                          src={logo}
                          data-holder-rendered="true"
                          height={70}
                          width={70}
                        />
                      </td>
                      <td style={{ verticalAlign: "bottom" }}>{name}</td>
                      <td
                        style={{ verticalAlign: "bottom", textAlign: "center" }}
                      >
                        <span className="">Status</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <label
                          htmlFor="staticGroupMerchant"
                          className="col-form-label"
                        >
                          ID: {match.params.id}
                        </label>
                      </td>
                      <td style={{ verticalAlign: "top", textAlign: "center" }}>
                        <span className="">
                          <span
                            className={`badge`}
                            style={{
                              backgroundColor: "#faeded",
                              color: "red",
                            }}
                          >
                            {show_in_app}
                          </span>
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="row mt-2">
                  <div className="col-sm-6">
                    <label
                      htmlFor="staticGroupMerchant"
                      className="col-form-label"
                    >
                      Register Using ID
                    </label>
                  </div>
                  <div className="col-sm-6">
                    <label
                      htmlFor="staticGroupMerchant"
                      className="col-form-label"
                    >
                      Sequence
                    </label>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-6">
                    {register_using_id ? (
                      <span style={{ color: "#86debd" }}>Yes</span>
                    ) : (
                      <span style={{ color: "red" }}>No</span>
                    )}
                  </div>
                  <div className="col-sm-6">
                    <strong>{sequence}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8 mb-3">
            <div className="card mb-4">
              <div className="card-body">
                <h6 className="mb-4">Detail Merchant Rose</h6>
                <div className="row mt-2">
                  <div className="col-sm-4">
                    <label
                      htmlFor="staticGroupMerchant"
                      className="col-form-label"
                    >
                      Tipe Merchant Rose
                    </label>
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="staticGroupMerchant"
                      className="col-form-label"
                    >
                      Grup Merchant Rose
                    </label>
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="staticGroupMerchant"
                      className="col-form-label"
                    >
                      Ketegori Merchant Rose
                    </label>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4">
                    <strong>
                      {rose_merchant_type_name || rose_merchant_type}
                    </strong>
                  </div>
                  <div className="col-sm-4">
                    <strong>{rose_merchant_group_name}</strong>
                  </div>
                  <div className="col-sm-4">
                    <strong>
                      {rose_merchant_category_name || rose_merchant_category}
                    </strong>
                  </div>
                </div>
                <hr className="content-hr" />
                <div className="row mt-2">
                  <div className="col-sm-6">
                    <label
                      htmlFor="staticGroupMerchant"
                      className="col-form-label"
                    >
                      Sales retail
                    </label>
                  </div>
                  <div className="col-sm-6">
                    <label
                      htmlFor="staticGroupMerchant"
                      className="col-form-label"
                    >
                      Tipe Bisnis
                    </label>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-6">
                    {sales_retails.map((val, idx) => {
                      // const sales_retail =
                      //   find(salesRetailOption, {
                      //     value: parseInt(val),
                      //   }) || "";
                      return (
                        <>
                          {idx > 0 && <span>, </span>}
                          {val}
                        </>
                      );
                    })}
                  </div>
                  <div className="col-sm-6">
                    {business_types.map((val, idx) => (
                      <>
                        {idx > 0 && <strong>, &nbsp;</strong>}
                        <strong>{val}</strong>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 text-right mb-5">
            <div className="border-top pt-3">
              <div className="form-group d-flex justify-content-between">
                <Link
                  to="/system-configuration/acquisition"
                  className="btn btn-default"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ acquisitions, auth }) => ({ acquisitions, auth }), {
  getDetailAcquisition,
  getSalesRetails,
})(Detail);
