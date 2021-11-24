import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getMerchantDetail } from "../../actions/call_plan";
import { Lightbox, NotAuthorize } from "../../components";
import axios from "../../actions/config";
import moment from "moment";
import { ind, en } from "../../languages/call_plan";

import { IconDownload } from "../../components/Icons";

// const svgStyle = {
//   height: '18px',
//   width: '18px'
// }

class Detail extends React.Component {
  state = {
    merchant: {},
    actions: [],

    id: null,
    first_name: "",
    last_name: "",
    gender: "",
    id_number: "",
    sfa_id: "",
    email: "",
    dob: "",
    photo: "",
    work_date: "",
    occupation: "",
    birth_place: "",
    company_code: "",
    province: "",
    city: "",
    phone_number: "",
    id_card_pic: "",
    district: "",
    village: "",
    address: "",
    sales_id: "",
    positions: "",
    locations: [
      {
        district: {},
        village: [{}],
      },
    ],
    upload: null,
    check: false,
    confirmIsOpen: false,
    expandCard: false,
    type: "success",
    textSuccess: "",
    textError: "",
    status: "",
    regionalProvince: "",
    regionalCity: "",
    created_at: "",
    updated_at: "",
    languages: {},
    isOpen: false,
    isOpen2: false,
  };

  componentWillMount() {
    const {
      auth: { access_token },
      getMerchantDetail,
    } = this.props;

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.merchant });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.merchant });
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    getMerchantDetail(this.props.match.params.id).then((data) => {
      let all = data.data;
      let action = all.call_plan_actions;

      this.setState({
        merchant: all,
        actions: action,
      });
    });
  }

  componentDidMount() {
    document.title = "SFA OTTO - Detail Sales";
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    // if (this.props.location.search !== prevProps.location.search) {
    //   this.fetchMerchant(this.props.location.search);
    // }
  }

  downloadImage = (url, sub_cat_name) => {
    var catName = this.state.merchant.merchant_name.split(" ").join("");

    fetch(url)
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        let url2 = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url2;
        a.download = "photo_location_" + catName + ".jpg";
        a.click();
      });
  };

  render() {
    const { auth } = this.props;
    const { merchant, actions, languages, isOpen, isOpen2 } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["call_plan"] === "" ||
        auth.authority["call_plan"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <div className="col-12 mb-5">
            <h2>
              {languages.header} (ID - {merchant.id})
            </h2>
          </div>

          <div className="col-12 mb-1">
            <div className="row">
              <div className="col-12 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-9 p-0 text-center d-flex flex-row align-items-center">
                          <div className="avatar mr-3 d-flex justify-content-center align-items-center">
                            {merchant.image_merchant === "" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-user"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            ) : (
                              <img
                                onClick={() => this.setState({ isOpen: true })}
                                src={merchant.image_merchant}
                                className="avatar justify-content-center align-items-center pointerYes"
                                alt=""
                              />
                            )}
                            <Lightbox
                              isOpen={isOpen}
                              images={merchant.image_merchant}
                              confirmClose={() =>
                                this.setState({ isOpen: false })
                              }
                            />
                          </div>
                          <div className="d-flex flex-column align-items-start">
                            <p className="mb-0">
                              <strong>{merchant.merchant_name}</strong>
                            </p>
                            <p className="mb-0 text-gray">
                              {languages.id} {merchant.merchant_id}
                            </p>
                            <p className="mb-0 text-gray">MID {merchant.mid}</p>
                          </div>
                        </div>
                        <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                          <strong className="mb-0 text-primary">
                            <small>{languages.status}</small>
                          </strong>
                          <span
                            className={`badge ${
                              merchant.status === "Unregistered"
                                ? "badge-gray"
                                : "badge-status"
                            }`}
                          >
                            {merchant.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer border-top">
                    <div className="col-12">
                      <div className="row mb-2 mt-2">
                        <div className="col-12 col-lg-3 d-flex flex-column">
                          <small className="text-gray">{languages.noHp}</small>
                          {merchant.merchant_phone !== ""
                            ? merchant.merchant_phone
                            : "-"}
                        </div>
                        <div className="col-12 col-lg-5 d-flex flex-column">
                          <small className="text-gray">{languages.mType}</small>
                          {merchant.merchant_type_id !== ""
                            ? merchant.merchant_type_id
                            : "-"}
                        </div>
                        <div className="col-12 col-lg-4 d-flex flex-column">
                          <small className="text-gray">
                            {languages.mStatus}
                          </small>
                          {merchant.merchant_status !== ""
                            ? merchant.merchant_status
                            : "-"}
                        </div>
                      </div>
                      <div className="row  mb-2">
                        <div className="col-12 col-lg-3 d-flex flex-column">
                          <small className="text-gray">
                            {languages.actionDate}
                          </small>
                          {merchant.action_date !== ""
                            ? moment(merchant.action_date, "YYYY-MM-DD").format(
                                "DD MMM YYYY"
                              )
                            : "-"}
                        </div>
                        <div className="col-12 col-lg-5 d-flex flex-column">
                          <small className="text-gray">
                            {languages.priority}
                          </small>
                          {merchant.priority !== "" ? merchant.priority : "-"}
                        </div>
                        <div className="col-12 col-lg-4 d-flex flex-column">
                          <small className="text-gray">
                            {languages.longlat}
                          </small>
                          <a
                            href={
                              "https://www.google.com/maps/search/?api=1&query=" +
                              merchant.latitude +
                              "," +
                              merchant.longitude
                            }
                            rel="noopener noreferrer"
                            target="_blank"
                            className="btn btn-link text-left btn-sm"
                          >
                            {merchant.latitude
                              ? merchant.latitude + ", " + merchant.longitude
                              : "-"}
                          </a>
                        </div>
                      </div>
                      <div className="row  mb-2">
                        <div className="col-12 col-lg-3 d-flex flex-column">
                          <small className="text-gray">{languages.clock}</small>
                          {merchant.clock_time !== ""
                            ? moment(
                                merchant.action_date,
                                "YYYY-MM-DD H:mm"
                              ).format("H:mm") +
                              " - " +
                              moment(
                                merchant.clock_time,
                                "YYYY-MM-DD H:mm"
                              ).format("H:mm")
                            : "-"}
                        </div>
                        <div className="col-12 col-lg-5 d-flex flex-column">
                          <small className="text-gray">
                            {languages.address}
                          </small>
                          {merchant.merchant_address !== ""
                            ? merchant.merchant_address
                            : "-"}
                        </div>
                        <div className="col-12 col-lg-4 d-flex flex-column">
                          <small className="text-gray">{languages.notes}</small>
                          {merchant.notes !== "" ? merchant.notes : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.header2}</h6>
                    {merchant.photo_location ? (
                      <div className="row ml-3 mt-3">
                        <div
                          className="col-12 col-lg-3 p-lg-0 text-left"
                          style={{ marginRight: "5rem" }}
                        >
                          <p className="mb-0 ">{languages.fotoLokasi}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 text-left text-primary">
                          <img
                            onClick={() => this.setState({ isOpen2: true })}
                            src={merchant.photo_location}
                            className="image-task pointerYes"
                            alt=""
                          />
                          <Lightbox
                            isOpen={isOpen2}
                            images={merchant.photo_location}
                            confirmClose={() =>
                              this.setState({ isOpen2: false })
                            }
                          />
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-primary">
                          <button
                            className="btn btn-link text-danger"
                            onClick={() =>
                              this.downloadImage(
                                merchant.photo_location,
                                "Foto Lokasi"
                              )
                            }
                          >
                            <IconDownload />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <React.Fragment>
                        {actions &&
                          actions.map((action, idx) => (
                            <div
                              className={
                                idx > 0
                                  ? "col-12 mt-3 border-top"
                                  : "col-12 mt-3"
                              }
                              key={idx}
                            >
                              <div className="form-inline mb-2 mt-3">
                                <label className="text-primary">
                                  {languages.action} {idx + 1}
                                </label>
                              </div>
                              <div className="form-inline">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">{languages.action}</p>
                                </div>
                                <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    {action.action ? action.action : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="form-inline mt-2">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0 ">{languages.product}</p>
                                </div>
                                <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    {action.product ? action.product : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="form-inline mt-2">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">{languages.result}</p>
                                </div>
                                <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    {action.result === true ? "Ya" : "Tidak"}
                                  </p>
                                </div>
                              </div>
                              {action.result === true ? (
                                <React.Fragment>
                                  <div className="form-inline mt-2">
                                    <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                      <p className="mb-0">
                                        {languages.mAction}
                                      </p>
                                    </div>
                                    <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                      <p className="mb-0">
                                        {action.merchant_action
                                          ? action.merchant_action
                                          : "-"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="form-inline mt-2">
                                    <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                      <p className="mb-0">
                                        {languages.nilaiTrx}
                                      </p>
                                    </div>
                                    <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                      <p className="mb-0">
                                        {action.amount ? action.amount : "-"}
                                      </p>
                                    </div>
                                  </div>
                                </React.Fragment>
                              ) : (
                                <div className="form-inline mt-2">
                                  <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                    <p className="mb-0">{languages.reason}</p>
                                  </div>
                                  <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                    <p className="mb-0">
                                      {action.reason ? action.reason : "-"}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="form-inline mt-2">
                                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">{languages.note}</p>
                                </div>
                                <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                                  <p className="mb-0">
                                    {action.note ? action.note : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 mb-0">
                <hr className="content-hr" />
                <div className="col-12">
                  <div className="col-12 form-inline">
                    <div className="col-lg-10">
                      <Link
                        to={`/call-plan/${merchant.call_plan_id}`}
                        className="btn btn-default w-20"
                      >
                        {languages.back}{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ auth, sales }) => ({ auth, sales }), {
  getMerchantDetail,
})(Detail);
