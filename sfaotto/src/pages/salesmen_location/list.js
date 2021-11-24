import React, { Component } from "react";
import { NEWAPI_FEEDING_LONGLAT } from "./../../actions/constants";
import { Link } from "react-router-dom";
import { IconDownload } from "../../components/Icons";
import {
  DatePickerSelect,
  SelectLineComponent,
  LoadingDots,
  Pagination,
  ModalConfirm,
} from "../../components/";
import {
  getFeedingLonglatAll,
  getDetail,
} from "../../actions/salesmen_location";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import axios from "../../actions/config";

const style = {
  link: {
    cursor: "pointer",
  },
};

// const dateFrom = moment().subtract(2, "months").format("YYYY-MM-DD");
// const dateTo = moment().format("YYYY-MM-DD");

class List extends Component {
  state = {
    search: "",
    typeSales: "",
    typeSalesOptions: [],
    periodFrom: "",
    periodTo: "",
    confirm: false,
    typeConfirm: "success",
    textSuccessConfirm: "",
    textErrorConfirm: "",
    maxDate: "",
  };

  componentDidMount() {
    this.fetchFeedingLongLat();
  }

  componentDidUpdate(prevProps, nextProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchFeedingLongLat(this.props.location.search);
    }
  }

  fetchFeedingLongLat = (pageNumber) => {
    const { search, periodFrom, periodTo, typeSales } = this.state;
    let page = "1";
    if (pageNumber) {
      page = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.setState({
      defaultZoom: 13,
    });

    this.props.getFeedingLonglatAll({
      keyword: search,
      latitude: "",
      longitude: "",
      sales_type_id: typeSales ? parseInt(typeSales) : 0,
      from_date: periodFrom,
      to_date: periodTo,
      page: parseInt(page),
    });
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  toggleDropdown(toggle) {
    let obj = {};
    obj[toggle] = !this.state[toggle];
    this.setState(obj);
  }

  hide(toggle) {
    setTimeout(() => {
      let obj = {};
      obj[toggle] = false;
      this.setState(obj);
    }, 200);
  }

  filterData = (e) => {
    e.preventDefault();
    const { search, typeSales, periodFrom, periodTo } = this.state;

    this.props.getFeedingLonglatAll({
      keyword: search,
      latitude: "",
      longitude: "",
      sales_type_id: typeSales ? parseInt(typeSales) : 0,
      from_date: periodFrom,
      to_date: periodTo,
      page: 1,
    });
  };

  passOblDetail = (obj = {}) => {
    this.props.getDetail(obj);
  };

  export = () => {
    const { periodFrom, periodTo } = this.state;
    let req = {
      from_date: periodFrom,
      to_date: periodTo,
    };

    axios
      .post(
        NEWAPI_FEEDING_LONGLAT + `/web-sfa-mongo/location-sales/export`,
        req
      )
      .then((response) => {
        this.setState({
          confirm: true,
          textSuccessConfirm:
            "Export sales location sedang di proses dan akan dikirimkan melalui email.",
        });
      });
  };

  render() {
    const {
      search,
      typeSales,
      typeSalesOptions,
      periodFrom,
      periodTo,
      confirm,
      typeConfirm,
      textSuccessConfirm,
      textErrorConfirm,
      maxDate,
    } = this.state;

    const { salesmen_location, sales_types, history } = this.props;
    return (
      <>
        <ModalConfirm
          confirmIsOpen={confirm}
          type={typeConfirm}
          confirmClose={() => this.setState({ confirm: false })}
          confirmSuccess={() =>
            history.push("/sfa-team-leader/salesmen-location/list")
          }
          textSuccess={textSuccessConfirm}
          textError={textErrorConfirm}
        />
        <div className="container">
          <div className="row">
            <div className="col-12 mb-3">
              <h2>Lokasi Salesmen</h2>
              <div className="actions d-flex justify-content-end mb-3">
                <div
                  className="btn-toolbar"
                  role="toolbar"
                  aria-label="Toolbar with button groups"
                >
                  <div
                    className="btn-group mr-2"
                    role="group"
                    aria-label="Second group"
                  >
                    <button
                      className="btn btn-link btn-outline-primary text-primary"
                      style={{ backgroundColor: "transparent" }}
                      onClick={() => this.export()}
                    >
                      <IconDownload />
                      Export
                    </button>
                  </div>
                  <div
                    className="btn-group mr-2"
                    role="group"
                    aria-label="Second group"
                  >
                    <Link
                      to="/sfa-team-leader/salesmen-location"
                      className="btn btn-primary d-flex align-items-center float-right"
                    >
                      Lihat Map
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mb-4">
              <div className="card noSelect">
                <div className="card-body">
                  <form className="form-inline" onSubmit={this.filterData}>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <h4>Daftar Lokasi Salesmen</h4>
                      </div>
                      <div className="col-12 form-inline">
                        <div className="col-4">
                          <div className="row">
                            <div className="col-12 row">Apa yang dicari?</div>
                            <div className="col-12 input-action-custom mt-2 row">
                              <input
                                placeholder="Cari Nama / ID Sales / Nomor Hp / Lokasi"
                                className="form-control form-control-line"
                                name="search"
                                value={search}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-2">
                          <div className="row">
                            <div className="col-12 row">Tipe Sales</div>
                            <div className="col-12 mt-2 row input-filter">
                              <SelectLineComponent
                                options={sales_types.data}
                                value={typeSales}
                                handleChange={(sales_type) => {
                                  this.setState({
                                    typeSales: sales_type.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="row">
                            <div className="col-12 row">Periode Tanggal</div>
                            <div className="col-12 input-filter mt-2 row">
                              <div className="col-sm-6 input-filter row">
                                <DatePickerSelect
                                  handleChange={(periodFrom) => {
                                    const maxDate = moment(
                                      periodFrom,
                                      "YYYY-MM-DD"
                                    )
                                      .add(60, "days")
                                      .format("YYYY-MM-DD");

                                    this.setState({ periodFrom, maxDate });
                                  }}
                                  value={periodFrom}
                                />
                              </div>
                              <div className="d-flex ml-2 mr-2">
                                <label className="col-form-label">to</label>
                              </div>
                              <div className="col-sm-6 input-filter row">
                                <DatePickerSelect
                                  maxDate={maxDate}
                                  handleChange={(periodTo) =>
                                    this.setState({ periodTo })
                                  }
                                  value={periodTo}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-1">
                          <div className="row">
                            <div className="col-12 row">{""}</div>
                            <div className="col-12 mt-4 row">
                              <button className="btn btn-primary">
                                Terapkan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="table-fixed mt-3">
                  <table className="table table-header mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Hari/Tanggal</th>
                        <th>Jam</th>
                        <th>Nama Sales</th>
                        <th>ID Sales</th>
                        <th>Tipe SR</th>
                        <th>Nomer HP</th>
                        <th>Lokasi</th>
                        <th></th>
                      </tr>
                    </thead>
                    {salesmen_location.loading ? (
                      <tbody>
                        <tr>
                          <td colSpan={11}>
                            <div className="d-flex justify-content-center align-items-center">
                              <LoadingDots color="black" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {salesmen_location.data.map((obj, idx) => {
                          moment().locale("id");
                          let date = moment(
                            obj.created_at,
                            "YYYY-MM-DD"
                          ).format("ddd, DD MMM YYYY");
                          let time = moment(
                            obj.created_at,
                            "YYYY-MM-DD H:mm"
                          ).format("H:mm");
                          return (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{date}</td>
                              <td>{time}</td>
                              <td>{obj.sales_name}</td>
                              <td>{obj.sales_id}</td>
                              <td>{obj.sales_type}</td>
                              <td>{obj.sales_phone}</td>
                              <td>{`${obj.latitude},${obj.longitude}`}</td>
                              <td>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-circle btn-more dropdown-toggle"
                                    type="button"
                                    onClick={() =>
                                      this.toggleDropdown(`show${idx}`)
                                    }
                                    onBlur={() => this.hide(`show${idx}`)}
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="1"></circle>
                                      <circle cx="19" cy="12" r="1"></circle>
                                      <circle cx="5" cy="12" r="1"></circle>
                                    </svg>
                                  </button>

                                  <div
                                    className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${
                                      this.state[`show${idx}`] ? "show" : ""
                                    }`}
                                    aria-labelledby="dropdownMenuButton"
                                  >
                                    <Link
                                      to={`/sfa-team-leader/salesmen-location/detail`}
                                      className="dropdown-item"
                                      style={style.link}
                                      onClick={() => this.passOblDetail(obj)}
                                    >
                                      Detail Sales
                                    </Link>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table>
                </div>
                <div className="card-body border-top">
                  <Pagination
                    pages={salesmen_location.meta}
                    routeName="sfa-team-leader/salesmen-location/list"
                    handleClick={(pageNumber) =>
                      this.fetchFeedingLongLat(pageNumber)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  ({ salesmen_location, auth, sales_types }) => ({
    salesmen_location,
    auth,
    sales_types,
  }),
  {
    getFeedingLonglatAll,
    getDetail,
  }
)(List);
