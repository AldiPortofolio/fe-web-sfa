import React from "react";
import { connect } from "react-redux";
import {
  NotAuthorize,
  Lightbox,
  ModalDelete,
  ModalConfirm,
  ModalReason,
  ModalReasonAttandance,
} from "../../components";
import { IconDownload, IconSearchMaps } from "../../components/Icons";
import axios from "../../actions/config";
import { ind, en } from "../../languages/attendance_history";
import {
  getHistoryDetailV23,
  validateAttendance,
} from "../../actions/attendance_history";
import moment from "moment";
import "moment/locale/id";
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

class Detail extends React.Component {
  state = {
    isOpen: false,
    valuePhoto: "",
    detail: {},
    confirmIsOpen: false,
    resultIsOpen: false,
    type: "success",
    confirmText: "",
    resultText: "",
    confirm: false,
    typeConfirm: "success",
    textSuccessConfirm: "",
    textErrorConfirm: "",
    isReject: false,
    rejectIsOpen: false,
    textReason: "",
  };

  componentWillMount() {
    const {
      auth: { access_token },
      getHistoryDetailV23,
      match,
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.detail });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.detail });
    }

    getHistoryDetailV23(match.params.id).then((data) => {
      this.setState({ detail: data.data });
    });
  }

  componentDidMount() {
    document.title = "SFA OTTO - Attendance History Detail";
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

  renderStatus(param) {
    switch (param) {
      case 2:
        return (
          <span
            className=""
            style={{
              color: "#2CC995",
            }}
          >
            Diterima
          </span>
        );
      case 1:
        return (
          <span
            className=""
            style={{
              color: "#E89634",
            }}
          >
            Validasi
          </span>
        );
      case 3:
        return (
          <span
            className=""
            style={{
              color: "#E93535",
            }}
          >
            Ditolak
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
            -
          </span>
        );
    }
  }

  render() {
    const {
      isOpen,
      valuePhoto,
      detail,
      confirmIsOpen,
      resultIsOpen,
      type,
      confirmText,
      resultText,
      confirm,
      typeConfirm,
      textSuccessConfirm,
      textErrorConfirm,
      isReject,
      rejectIsOpen,
      textReason,
    } = this.state;
    const { validateAttendance, history } = this.props;
    moment().locale("id");

    // const timeValidate =
    //   (moment(detail.clocktime_local, "YYYY-MM-DD HH:mm").isBefore(moment("13:00", "H:mm")) ||
    //     moment(detail.clocktime_local, "YYYY-MM-DD HH:mm").isAfter(moment("13:59", "H:mm"))) &&
    //   detail.attend_category == "Event";
    // const timeValidate2 =
    //     (moment(detail.clocktime_local, "YYYY-MM-DD HH:mm").isAfter(moment("13:59", "H:mm"))) &&
    //   detail.attend_category == "Event";
    // const timeValidate3 = detail.attend_category == "Absen Harian";

    // console.log(moment(detail.clocktime_local, "YYYY-MM-DD HH:mm"))
    // console.log("timeValidate", timeValidate, timeValidate2);

    return (
      <>
        <ModalReasonAttandance
          rejectIsOpen={rejectIsOpen}
          confirmClose={() => this.setState({ rejectIsOpen: false })}
          handleChange={(e) => this.setState({ textReason: e.target.value })}
          handleBack={() => this.setState({ rejectIsOpen: false })}
          handleSubmit={(e) => {
            e.preventDefault();
            this.setState({ rejectIsOpen: false }, () => {
              validateAttendance({
                attendance_id: detail.id.toString(),
                status_after: 3,
                status_before: 1,
                reason: textReason,
              })
                .then((data) => {
                  if (data.meta.status == false) {
                    this.setState({
                      confirm: true,
                      textErrorConfirm: "attendance gagal ditolak",
                      typeConfirm: "error",
                    });
                  } else {
                    this.setState({
                      confirm: true,
                      textSuccessConfirm: "attendance berhasil ditolak",
                    });
                  }
                })
                .catch((e) =>
                  this.setState({
                    confirm: true,
                    textErrorConfirm: e,
                    typeConfirm: "error",
                  })
                );
            });
          }}
          textReason={textReason}
        />
        <ModalConfirm
          confirmIsOpen={confirm}
          type={typeConfirm}
          confirmClose={() => this.setState({ confirm: false })}
          confirmSuccess={() => history.push("/attendance/history")}
          textSuccess={textSuccessConfirm}
          textError={textErrorConfirm}
        />
        <Lightbox
          isOpen={isOpen}
          images={valuePhoto}
          confirmClose={() => this.setState({ isOpen: false })}
        />
        <ModalDelete
          confirmIsOpen={confirmIsOpen}
          resultIsOpen={resultIsOpen}
          type={type}
          confirmText={confirmText}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          resultClose={() => this.setState({ resultIsOpen: false })}
          confirmYes={() => {
            if (isReject) {
              this.setState({ rejectIsOpen: true, confirmIsOpen: false });
              return;
            }

            this.setState({ confirmIsOpen: false }, () => {
              validateAttendance({
                attendance_id: detail.id.toString(),
                status_after: 2,
                status_before: 1,
                reason: "",
              })
                .then((data) => {
                  if (data.meta.status == false) {
                    this.setState({
                      confirm: true,
                      textErrorConfirm: "attendance gagal diterima",
                      typeConfirm: "error",
                    });
                  } else {
                    this.setState({
                      confirm: true,
                      textSuccessConfirm: "attendance berhasil diterima",
                    });
                  }
                })
                .catch((e) =>
                  this.setState({
                    confirm: true,
                    textErrorConfirm: e,
                    typeConfirm: "error",
                  })
                );
            });
          }}
          resultText={resultText}
        />

        <div className="container mb-5 noSelect">
          <div className="row">
            <div className="col-12 mb-1">
              <div className="col-12 mb-5">
                <h2>Detail Validasi Absen</h2>
              </div>
              <div className="col-12 mb-3">
                <div className="card mb-4" style={{ borderRadius: "15px" }}>
                  <div className="card-header-blue-light">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-10 p-0 text-center d-flex flex-row align-items-center">
                          <div className="d-flex flex-column align-items-start">
                            <strong className="mb-0">
                              <small>Tanggal Validasi</small>
                            </strong>
                            <p className="mb-0 text-primary">
                              <div className="" style={{ color: "#056EB5" }}>
                                {detail.status == 2 || detail.status == 3
                                  ? moment(
                                      detail.updated_at,
                                      "YYYY-MM-DD H:mm"
                                    ).format("dddd, DD MMMM YYYY, H:mm") +
                                    " WIB"
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
                            className="text-dark-gray"
                            style={{ fontWeight: "bold" }}
                          >
                            Informasi Salesmen
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Nama Sales</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.sales_name}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Nomer HP</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.sales_phone}</p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>ID Sales</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.sales_id}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tipe Sales Retail</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.sales_type ? detail.sales_type : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Regional</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.region ? detail.region[0] : "-"}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Sub Area Channel</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {" "}
                            {detail.region ? detail.sub_area_channel[0] : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-6 border-top">
                      <div className="row my-4 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p
                            className="text-dark-gray"
                            style={{ fontWeight: "bold" }}
                          >
                            Informasi Absensi
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Kategori Absensi</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.attend_category}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tipe Absensi</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {detail.type_attendance}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Foto Selfie</small>
                          </strong>
                          <div>
                            <p className="mb-0 canSelect mt-2">
                              <img
                                onClick={() =>
                                  this.setState({
                                    isOpen: true,
                                    valuePhoto: detail.selfie,
                                  })
                                }
                                src={detail.selfie}
                                className="rounded"
                                alt={detail.sales_name}
                                style={style.image}
                              />
                            </p>
                            <strong className="mt-2">
                              <small>
                                <DownloadLink
                                  label={<IconDownload />}
                                  filename={
                                    detail.selfie
                                      ? detail.selfie.split("/").pop()
                                      : ""
                                  }
                                  exportFile={() =>
                                    Promise.resolve(
                                      this.getDataFromURL(detail.selfie)
                                    )
                                  }
                                />
                              </small>
                            </strong>
                          </div>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Catatan</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.notes}</p>
                        </div>
                      </div>
                      <div className="row mb-3 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column"></div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Tanggal Absensi</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {moment(
                              detail.clocktime_local,
                              "YYYY-MM-DD HH:mm"
                            ).format("dddd, DD MMMM YYYY, HH:mm")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-6 border-top">
                      <div className="row my-4 mr-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p
                            className="text-dark-gray"
                            style={{ fontWeight: "bold" }}
                          >
                            Informasi Lokasi
                          </p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Lokasi</small>
                          </strong>
                          <p className="mb-0 canSelect">{detail.location}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 ml-lg-2 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>Koordinat</small>
                          </strong>
                          <p className="mb-0 canSelect">{`${detail.latitude},${detail.longitude}`}</p>
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
                    </div>
                    {detail.status == 1 && (
                      <div className="col-12 mt-6 border-top">
                        <div className="row my-4">
                          <div className="col-12">
                            <div className="actions d-flex justify-content-end mb-3">
                              <div
                                className="btn-group mr-2"
                                role="group"
                                aria-label="Second group"
                              >
                                <button
                                  className="btn btn-link btn-outline-primary text-primary "
                                  // disabled={disabledStatusExport}
                                  style={{ backgroundColor: "transparent" }}
                                  onClick={() =>
                                    this.setState(
                                      {
                                        confirmIsOpen: true,
                                        confirmText:
                                          "apakah anda yakin ingin menolak validasi absen ini?",
                                        isReject: true,
                                      },
                                      () => {}
                                    )
                                  }
                                >
                                  Tolak
                                </button>
                              </div>
                              <div
                                className="btn-group"
                                role="group"
                                aria-label="Second group"
                              >
                                <button
                                  type="button"
                                  className="btn btn-primary w-100"
                                  style={{}}
                                  onClick={() => {
                                    this.setState(
                                      {
                                        confirmIsOpen: true,
                                        confirmText:
                                          "apakah anda yakin ingin menerima validasi absen ini?",
                                        isReject: false,
                                      },
                                      () => {}
                                    );
                                  }}
                                >
                                  Terima
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(({ auth }) => ({ auth }), {
  getHistoryDetailV23,
  validateAttendance,
})(Detail);
