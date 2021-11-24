import React from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getDetailTodolist } from "../../actions/salesman_activity";
import {
  Lightbox,
  Pagination,
  LoadingDots,
  NotAuthorize,
} from "../../components";
import axios from "../../actions/config";
import moment from "moment";
import dataJson from "./data-detail.json";
import "moment/locale/id";
import { IconDownload } from "../../components/Icons";
import DownloadLink from "react-download-link";

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

class DetailTodolist extends React.Component {
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
      getDetailTodolist,
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    getDetailTodolist(this.props.match.params.todoListId).then((data) => {
      this.setState({
        detail: data.data,
      });
    });
  }

  getDataFromURL = (url) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(url)
          .then((response) => response.text())
          .then((data) => {
            resolve(data);
          });
      });
    }, 2000);

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

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchTodolist(this.props.location.search);
      this.fetchCallPlan(window.location.search);
    }
  }

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

  renderStatus(param) {
    switch (param) {
      case "Not Exist":
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
      case "Done":
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
      case "Pending":
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
      case "Verified":
        return (
          <span
            className=""
            style={{
              color: "#056EB5",
            }}
          >
            {param}
          </span>
        );
      case "Reject":
        return (
          <span
            className=""
            style={{
              color: "#E93535",
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

  renderTask = (data) => {
    let count = data.length - 1;
    count = Math.ceil(count / 2);

    for (let index = 0; index < count; index++) {
      return (
        <div className="row my-4 mr-3" key={index}>
          <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
          {data.map((val, idx) => {
            if (idx == 0) return;

            if (idx % 2 != 0) {
              return (
                <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                  <strong className="mb-0 text-gray">
                    <small>{val.label}</small>
                  </strong>

                  {val.content_type == "Image" ? (
                    <div>
                      <p className="mb-0 canSelect mt-2">
                        <img
                          onClick={() =>
                            this.setState({
                              isOpen: true,
                              valuePhoto: val.body,
                            })
                          }
                          src={val.body}
                          className="rounded"
                          alt={val.label}
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
                                val.body,
                                val.body.split("/").pop()
                              )
                            }
                          >
                            <IconDownload />
                          </button>
                        </small>
                      </strong>
                    </div>
                  ) : (
                    <p className="mb-0 canSelect mt-2">{val.body}</p>
                  )}
                </div>
              );
            } else {
              return (
                <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                  <strong className="mb-0 text-gray">
                    <small>{val.label}</small>
                  </strong>

                  {val.content_type == "Image" ? (
                    <div>
                      <p className="mb-0 canSelect mt-2">
                        <img
                          onClick={() =>
                            this.setState({
                              isOpen: true,
                              valuePhoto: val.body,
                            })
                          }
                          src={val.body}
                          className="rounded"
                          alt={val.label}
                          style={style.image}
                        />
                      </p>
                      <strong className="mt-2">
                        <small>
                          <button
                            className="btn btn-link text-primary"
                            onClick={() =>
                              this.downloadImage(
                                val.body,
                                val.body.split("/").pop()
                              )
                            }
                          >
                            <IconDownload />
                          </button>
                        </small>
                      </strong>
                    </div>
                  ) : (
                    <p className="mb-0 canSelect mt-2">{val.body}</p>
                  )}
                </div>
              );
            }
          })}
        </div>
      );
    }
  };

  render() {
    const { auth } = this.props;
    const { detail, valuePhoto, todolist, callplan, isOpen, isOpen2 } =
      this.state;

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
                <h2>
                  {detail.todolist_category
                    ? detail.todolist_category.name
                    : ""}{" "}
                  (ID - {detail.id})
                </h2>
              </div>
              {/* <div className="row"> */}
              <div className="col-12 mb-3">
                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <div className="card-header-blue-light">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-10 p-0 text-center d-flex flex-row align-items-center">
                          <div className="d-flex flex-column align-items-start">
                            <strong className="mb-0">
                              <small>Tanggal Tugas dilakukan</small>
                            </strong>
                            <p className="mb-0 text-primary">
                              <div className="" style={{ color: "#056EB5" }}>
                                {new Date("0001-01-01T00:00:00Z") !=
                                new Date(detail.action_date)
                                  ? moment(
                                      detail.action_date,
                                      "YYYY-MM-DD"
                                    ).format("DD MMMM YYYY")
                                  : "-"}
                              </div>
                            </p>
                          </div>
                        </div>
                        <div className="col-12 col-lg-2 text-right d-flex flex-column">
                          <strong className="mb-0">
                            <small>Status</small>
                          </strong>
                          {this.renderStatus(detail.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="col-12">
                      <div className="row my-4 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p
                            classNmae="text-dark-gray"
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
                            {detail.merchant_name ? detail.merchant_name : "-"}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>MID</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.mid ? detail.mid : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Pemilik Toko</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.owner_name ? detail.owner_name : "-"}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tipe Merchant</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.merchant_type_name
                              ? detail.merchant_type_name
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Alamat Merchant</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.address ? detail.address : "-"}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Catatan</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.notes ? detail.notes : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mt-6 border-top">
                      <div className="row my-4 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p
                            classNmae="mb-0 pb-0 text-dark-gray"
                            style={{ fontWeight: "bold", marginBottom: "0" }}
                          >
                            Informasi tugas
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tanggal Tugas Dibuat</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {moment(detail.created_at, "YYYY-MM-DD").format(
                              "DD MMMM YYYY"
                            )}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tanggal Tugas Berakhir</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {moment(detail.task_date, "YYYY-MM-DD").format(
                              "DD MMMM YYYY"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Koordinat</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.latitude && detail.longitude
                              ? `${detail.latitude},${detail.longitude}`
                              : "-"}
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
                        {detail.todolist_histories &&
                          detail.status == "Not Exist" && (
                            <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                              <strong className="mb-0 text-gray">
                                <small>Tanggal Tugas Dilakukan</small>
                              </strong>
                              <p className="mb-0 canSelect">
                                {new Date("0001-01-01T00:00:00Z") !=
                                new Date(detail.action_date)
                                  ? moment(
                                      detail.action_date,
                                      "YYYY-MM-DD"
                                    ).format("DD MMMM YYYY")
                                  : "-"}
                              </p>
                            </div>
                          )}
                      </div>
                      {detail.todolist_histories &&
                        detail.status == "Not Exist" && (
                          <div>
                            <div className="row mb-3 mr-3">
                              <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                              <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                <strong className="mb-0 text-gray">
                                  <small>Aksi Dilakukan Oleh</small>
                                </strong>
                                <p className="mb-0 canSelect">
                                  {detail.action_by}
                                </p>
                              </div>
                              <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                                <strong className="mb-0 text-gray">
                                  <small>Description</small>
                                </strong>
                                <p className="mb-0 canSelect">
                                  {detail.todolist_histories &&
                                    detail.todolist_histories[0].description}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3 mr-3">
                              <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
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
                                          valuePhoto:
                                            detail.todolist_histories[0]
                                              .foto_location,
                                        })
                                      }
                                      src={
                                        detail.todolist_histories[0]
                                          .foto_location
                                      }
                                      className="rounded"
                                      alt={
                                        detail.todolist_histories[0]
                                          .foto_location
                                      }
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
                                            detail.todolist_histories[0]
                                              .foto_location,
                                            detail.todolist_histories[0]
                                              .foto_location
                                              ? detail.todolist_histories[0].foto_location
                                                  .split("/")
                                                  .pop()
                                              : ""
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
                          </div>
                        )}
                    </div>
                    <div className="col-12 mt-6 border-top">
                      {detail.tasks &&
                        detail.tasks.map((obj, idx) => (
                          <div key={idx}>
                            <div className="row my-4 mr-3">
                              <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                <p
                                  classNmae="mb-0 pb-0 text-dark-gray"
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "0",
                                  }}
                                >
                                  Detail Tugas {idx + 1}
                                </p>
                              </div>
                              <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                <strong className="mb-0 text-gray">
                                  <small>Tugas {idx + 1}</small>
                                </strong>
                                <p className="mb-0 canSelect">
                                  {obj.todolist_sub_category &&
                                    obj.todolist_sub_category.name}
                                </p>
                              </div>
                              {obj.follow_ups.length > 0 && (
                                <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                                  <strong className="mb-0 text-gray">
                                    <small>{obj.follow_ups[0].label}</small>
                                  </strong>

                                  {obj.follow_ups[0].content_type == "Image" ? (
                                    <div>
                                      <p className="mb-0 canSelect mt-2">
                                        <img
                                          onClick={() =>
                                            this.setState({
                                              isOpen: true,
                                              valuePhoto:
                                                obj.follow_ups[0].body,
                                            })
                                          }
                                          src={obj.follow_ups[0].body}
                                          className="rounded"
                                          alt={obj.follow_ups[0].label}
                                          style={style.image}
                                        />
                                      </p>
                                      <strong className="mt-2">
                                        <small>
                                          <button
                                            className="btn btn-link text-primary"
                                            onClick={() =>
                                              this.downloadImage(
                                                obj.follow_ups[0].body,
                                                obj.follow_ups[0].body
                                                  ? obj.follow_ups[0].body
                                                      .split("/")
                                                      .pop()
                                                  : ""
                                              )
                                            }
                                          >
                                            <IconDownload />
                                          </button>
                                        </small>
                                      </strong>
                                    </div>
                                  ) : (
                                    <p className="mb-0 canSelect mt-2">
                                      {obj.follow_ups[0].body}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            {obj.follow_ups.length > 1 &&
                              this.renderTask(obj.follow_ups)}
                            <div className="row my-4 mr-3">
                              <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                              <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                                <strong className="mb-0 text-gray">
                                  <small>Aksi Dilakukan Oleh</small>
                                </strong>
                                <p className="mb-0 canSelect">
                                  {obj.action_by_name
                                    ? obj.action_by_name.first_name +
                                      " " +
                                      obj.action_by_name.last_name
                                    : "-"}
                                </p>
                              </div>
                              <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                                <strong className="mb-0 text-gray">
                                  <small>Tanggal Tugas Dilakukan</small>
                                </strong>
                                <p className="mb-0 canSelect">
                                  {"01 Januari 0001" !=
                                  moment(obj.action_date, "YYYY-MM-DD").format(
                                    "DD MMMM YYYY"
                                  )
                                    ? moment(
                                        obj.action_date,
                                        "YYYY-MM-DD"
                                      ).format("DD MMMM YYYY")
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
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
  getDetailTodolist,
})(DetailTodolist);
