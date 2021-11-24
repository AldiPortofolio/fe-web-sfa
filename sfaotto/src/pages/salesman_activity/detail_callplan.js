import React from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getDetailCallplan } from "../../actions/salesman_activity";
import {
  Lightbox,
  Pagination,
  LoadingDots,
  NotAuthorize,
} from "../../components";
import axios from "../../actions/config";
import moment from "moment";
import dataJson from "./data-detail.json";
import CurrencyFormat from "react-currency-format";
import "moment/locale/id";
import { IconDownload } from "../../components/Icons";

const style = {
  link: {
    cursor: "pointer",
  },
  image: {
    cursor: "pointer",
    borderRadius: "30%",
    width: "80px",
    height: "80px",
  },
};

class DetailCallPlan extends React.Component {
  state = {
    detail: {},
    callplan: [],
    todolist: [],
    sales_name: "",
    photo_sales: "",
    phone_number: "",
    id: "",
    sales_type: "",
    subarea: "",
    akusisi: "",
    noo: "",
    todolist: "",
    success_call: "",
    total_call: "",
    amount: "",
    date: "",

    confirmIsOpen: false,
    expandCard: false,
    type: "success",
    textSuccess: "",
    textError: "",
    isOpen: false,
    isOpen2: false,
    valuePhoto: "",
  };

  componentWillMount() {
    document.title = "SFA OTTO - Detail Sales";

    const {
      auth: { access_token },
      getDetailCallplan,
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    getDetailCallplan(this.props.match.params.callPlanId).then((data) => {
      this.setState({
        detail: data.data,
      });
    });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchTodolist(this.props.location.search);
      this.fetchCallPlan(window.location.search);
    }
  }

  downloadImage = (url, filename) => {
    fetch(url)
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        let url2 = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url2;
        a.download = filename;
        a.click();
      });
  };

  fetchTodolist = (pageNumber) => {
    let page = "?page=1";

    if (pageNumber) {
      page = pageNumber.includes("page") ? pageNumber : "?page=1";
    }

    this.props.getTodolist(page, this.props.match.params.id);
  };

  fetchCallPlan = (pageNumber) => {
    let page = "?page=1";

    if (pageNumber) {
      page = pageNumber.includes("page") ? pageNumber : "?page=1";
    }

    this.props.getCallPlan(page, this.props.match.params.id);
  };

  renderStatusCallplan(param) {
    switch (param) {
      case "Incompleted":
        return (
          <span
            className=""
            style={{
              color: "#859DAD",
            }}
          >
            {param}
          </span>
        );
      case "Completed":
        return (
          <span
            className=""
            style={{
              color: "#2CC995",
            }}
          >
            {param}
          </span>
        );
      case "Visited":
        return (
          <span
            className=""
            style={{
              color: "#E89634",
            }}
          >
            {param}
          </span>
        );
      default:
        return (
          <span
            className=""
            style={{
              color: "#2CC995",
            }}
          >
            {param}
          </span>
        );
    }
  }

  render() {
    const { auth } = this.props;
    const { detail, todolist, callplan, isOpen, valuePhoto } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["call_plan"] === "" ||
        auth.authority["call_plan"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    moment().locale("id");

    return (
      <>
        <Lightbox
          isOpen={isOpen}
          images={valuePhoto}
          confirmClose={() => this.setState({ isOpen: false })}
        />
        <div className="container mb-5 noSelect">
          <div className="row">
            <div className="col-12 mb-1">
              <div className="col-12 mb-5">
                <h2>Detail Callplan</h2>
              </div>
              <div className="col-12 mb-3">
                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <div className="card-header-blue-light">
                    <div className="col-12">
                      <div className="row justify-content-md-center">
                        <div className="col-sm">
                          <p className="mb-2 text-dark-gray">
                            Tanggal Aksi Dilakukan
                          </p>
                          <div className="" style={{ color: "#056EB5" }}>
                            {detail.action_date
                              ? moment(
                                  detail.action_date,
                                  "YYYY-MM-DD H:mm"
                                ).format("dddd, DD MMM YYYY, H:mm") + " WIB"
                              : "-"}
                          </div>
                        </div>
                        <div className="col-md-auto">
                          <div style={{ margin: "0 auto" }}>
                            <p className="mb-2 text-dark-gray">Clock Time</p>
                            <div className="" style={{ color: "#056EB5" }}>
                              {detail.clock_time && detail.action_date
                                ? moment(
                                    detail.action_date,
                                    "YYYY-MM-DD H:mm"
                                  ).format("H:mm") +
                                  " - " +
                                  moment(
                                    detail.clock_time,
                                    "YYYY-MM-DD H:mm"
                                  ).format("H:mm")
                                : "-"}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm">
                          <div style={{ float: "right" }}>
                            <p className="mb-2 text-dark-gray">Status</p>
                            <div className="">
                              {this.renderStatusCallplan(detail.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="col-12">
                      <div className="row my-4 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p
                            className="text-dark-gray"
                            style={{ fontWeight: "bold" }}
                          >
                            Informasi Merchant
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Nama Merchant</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.merchant_name}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>MID</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.mid}</p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Pemilik Toko</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.owner_name}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tipe Merchant</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.merchant_type_name}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Alamat Merchant</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.address}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Koordinat</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.latitude},{detail.longitude}
                          </p>
                          {/* {latitude && longitude ? */}
                          <strong className="mt-2">
                            <small>
                              <a
                                href={
                                  "https://www.google.com/maps/search/?api=1&query=" +
                                  detail.latitude +
                                  "," +
                                  detail.longitude
                                }
                                target="_blank"
                                className="btn btn-link btn-sm"
                                rel="noopener noreferrer"
                                style={{
                                  border: "none",
                                  padding: "0 0",
                                  fontSize: "100%",
                                }}
                              >
                                Lihat Map
                              </a>
                            </small>
                          </strong>
                        </div>
                      </div>
                      <div className="row mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Status Merchant</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.merchant_status
                              ? detail.merchant_status
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mt-3 border-top">
                      <div className="row my-4 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p
                            className="mb-0 pb-0 text-dark-gray"
                            style={{ fontWeight: "bold", marginBottom: "0" }}
                          >
                            Informasi Aksi
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tanggal Callplan</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {moment(detail.call_plan_date, "YYYY-MM-DD").format(
                              "DD MMMM YYYY"
                            )}
                          </p>
                        </div>
                        {detail.notes && (
                          <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                            <strong className="mb-0 text-gray">
                              <small>Deskripsi</small>
                            </strong>
                            <p className="mb-0 canSelect">{detail.notes}</p>
                          </div>
                        )}
                      </div>
                      {detail.photo_location && (
                        <div className="row my-4 mr-3">
                          <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                            <p
                              className="mb-0 pb-0 text-dark-gray"
                              style={{ fontWeight: "bold", marginBottom: "0" }}
                            >
                              &nbsp;
                            </p>
                          </div>
                          <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                            <strong className="mb-0 text-gray">
                              <small>Foto Lokasi</small>
                            </strong>
                            <div>
                              <p className="mb-0 canSelect mt-2">
                                <img
                                  onClick={() =>
                                    this.setState({
                                      isOpen: true,
                                      valuePhoto: detail.photo_location,
                                    })
                                  }
                                  src={detail.photo_location}
                                  className="rounded"
                                  alt={detail.photo_location}
                                  style={style.image}
                                />
                              </p>
                              <strong className="mt-2">
                                <small>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <button
                                    className="btn btn-link text-primary"
                                    onClick={() =>
                                      this.downloadImage(
                                        detail.photo_location,
                                        detail.photo_location.split("/").pop()
                                      )
                                    }
                                  >
                                    <IconDownload />
                                  </button>
                                </small>
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {detail.call_plan_actions &&
                      detail.call_plan_actions.map((obj, idx) => (
                        <div className="col-12 mt-3 border-top">
                          <div className="row my-4 mr-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p
                                className="mb-0 pb-0 text-dark-gray"
                                style={{
                                  fontWeight: "bold",
                                  marginBottom: "0",
                                }}
                              >
                                Detail Aksi {idx + 1}
                              </p>
                            </div>
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>Aksi {idx + 1}</small>
                              </strong>
                              <p className="mb-0 canSelect">{obj.action}</p>
                            </div>
                            <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>Produk</small>
                              </strong>
                              <p className="mb-0 canSelect">{obj.product}</p>
                            </div>
                          </div>
                          <div className="row mb-3 mr-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>Hasil</small>
                              </strong>
                              <p className="mb-0 canSelect">
                                {obj.result ? "Iya" : "Tidak"}
                              </p>
                            </div>
                            <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>Aksi Merchant</small>
                              </strong>
                              <p className="mb-0 canSelect">
                                {obj.merchant_action
                                  ? obj.merchant_action
                                  : "-"}
                              </p>
                            </div>
                          </div>
                          <div className="row mb-3 mr-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>Jumlah Transaksi</small>
                              </strong>
                              <p className="mb-0 canSelect">
                                <CurrencyFormat
                                  value={obj.amount}
                                  thousandSeparator={"."}
                                  decimalSeparator={","}
                                  prefix={"Rp "}
                                  displayType={"text"}
                                />
                              </p>
                            </div>
                            <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>Catatan</small>
                              </strong>
                              <p className="mb-0 canSelect">
                                {obj.note ? obj.note : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="col-12 mb-0">
                <hr className="content-hr" />
                <div className="col-12 row">
                  <div className="col-12 row form-inline">
                    <div className="col-lg-10 row">
                      <Link
                        to={`/activities/${
                          this.props.match.params.id
                        }/date/${moment(
                          detail.action_date,
                          "YYYY-MM-DD"
                        ).format("YYYY-MM-DD")}`}
                        className="btn btn-default w-20"
                      >
                        Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </>
    );
  }
}

export default connect(({ auth, todolist }) => ({ auth, todolist }), {
  getDetailCallplan,
})(DetailCallPlan);
