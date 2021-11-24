import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import Clock from "react-live-clock";
import "moment-timezone";
import { Link } from "react-router-dom";
import { getFeedingLonglat } from "../../actions/salesmen_location";
import { connect } from "react-redux";
import {
  Lightbox,
  Pagination,
  LoadingDots,
  NotAuthorize,
  SelectLineComponent,
} from "../../components";
import moment from "moment";
import "moment/locale/id";
import {
  REACT_APP_API_KEY_GOOGLE_MAP,
  REACT_APP_DEFAULT_LATITUDE,
  REACT_APP_DEFAULT_LONGITUDE,
} from "../../actions/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { geolocated } from "react-geolocated";

const style = {
  link: {
    cursor: "pointer",
  },
};

const mapStyles = {
  width: "99%",
  height: "100%",
};

export class Index extends Component {
  state = {
    search: "",
    defaultZoom: 13,
    defauktCoordinates: {
      lat: REACT_APP_DEFAULT_LATITUDE,
      lng: REACT_APP_DEFAULT_LONGITUDE,
    },
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    currentLocation: { lat: 0, lng: 0 },
    markers: [],
    bounds: null,
    sales_type_id: "",
    listItem: [],
    pages: 1,
  };

  com;

  componentDidMount() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(this.getLatLong);
    //   navigator.geolocation.watchPosition(this.getLatLong);
    // }
    this.fetchFeedingLongLat();
    moment().locale("id");
  }

  getLatLong = (position) => {
    this.setState({
      defauktCoordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
    });
  };

  fetchFeedingLongLat = () => {
    const { search, sales_type_id, listItem, pages } = this.state;

    let page = 1;
    if (listItem.length > 0) {
      let countRows = listItem.length;
      page = Math.ceil(countRows / 25);
      page += 1;
    }

    this.setState({
      defaultZoom: 13,
    });

    if (pages == page && page != 1) {
      return;
    }

    this.props
      .getFeedingLonglat({
        keyword: search,
        sales_type_id: sales_type_id ? parseInt(sales_type_id) : 0,
        latitude: "",
        longitude: "",
        from_date: "",
        to_date: "",
        page,
      })
      .then((data) => {
        this.setState({ listItem: listItem.concat(data.data.sales_feeds) });
      });
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  filterData = (e) => {
    e.preventDefault();
    const { search, sales_type_id } = this.state;
    this.setState({
      defaultZoom: 13,
    });

    this.props
      .getFeedingLonglat({
        keyword: search,
        latitude: "",
        longitude: "",
        sales_type_id: sales_type_id ? parseInt(sales_type_id) : 0,
        from_date: "",
        to_date: "",
        page: 1,
      })
      .then((data) => {
        this.setState({ listItem: data.data.sales_feeds });
      });
  };

  focusFeedingLongLat = (lat, long) => {
    const { search, sales_type_id } = this.state;
    this.setState({
      defauktCoordinates: { lat: lat, lng: long },
      defaultZoom: 18,
    });

    this.props
      .getFeedingLonglat({
        keyword: search,
        latitude: "",
        longitude: "",
        sales_type_id: sales_type_id ? parseInt(sales_type_id) : 0,
        from_date: "",
        to_date: "",
        page: 1,
      })
      .then((data) => {
        this.setState({ listItem: data.data.sales_feeds });
      });
  };

  render() {
    const {
      search,
      defauktCoordinates,
      defaultZoom,
      sales_type_id,
      listItem,
      isFilter,
    } = this.state;
    const { salesmen_location, sales_types } = this.props;
    moment().locale("id");
    const currentLocation = {
      lat: this.props.coords?.latitude,
      lng: this.props.coords?.longitude,
    };
    return (
      <>
        <div className="row mr-1">
          <div className="col-sm-9">
            {salesmen_location.loading ? (
              <LoadingDots />
            ) : (
              <Map
                google={this.props.google}
                zoom={defaultZoom}
                style={mapStyles}
                initialCenter={
                  this.props.coords && isFilter == false
                    ? currentLocation
                    : defauktCoordinates
                }
                onClick={this.onMapClicked}
              >
                <Marker
                  position={{
                    lat:
                      this.props.coords && isFilter == false
                        ? this.props.coords?.latitude
                        : defauktCoordinates.lat,
                    lng:
                      this.props.coords && isFilter == false
                        ? this.props.coords?.longitude
                        : defauktCoordinates.lng,
                  }}
                  onClick={this.onMarkerClick}
                  name={"Your current location"}
                  coordinat={`${
                    this.props.coords && isFilter == false
                      ? this.props.coords?.latitude
                      : defauktCoordinates.lat
                  },${
                    this.props.coords && isFilter == false
                      ? this.props.coords?.longitude
                      : defauktCoordinates.lng
                  }`}
                  phone={""}
                  address={""}
                  key={0}
                />
                {listItem.map((obj, idx) => {
                  return (
                    <Marker
                      position={{ lat: obj.latitude, lng: obj.longitude }}
                      onClick={this.onMarkerClick}
                      name={obj.sales_name}
                      coordinat={`${obj.latitude},${obj.longitude}`}
                      phone={obj.sales_phone}
                      address={obj.address}
                      key={idx + 1}
                    />
                  );
                })}

                <InfoWindow
                  marker={this.state.activeMarker}
                  visible={this.state.showingInfoWindow}
                >
                  <div className="row">
                    <div className="col-8">
                      <strong>{this.state.selectedPlace.name}</strong>
                    </div>
                    <div className="col-8">
                      {this.state.selectedPlace.phone}
                    </div>
                    <div
                      className="col-8"
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {this.state.selectedPlace.address}
                    </div>
                  </div>
                </InfoWindow>
              </Map>
            )}
          </div>
          <div className="col-sm-3">
            <div className="row justify-content-md-center">
              <div
                className="w-100 col-md-auto"
                style={{ background: "#EBF7FF" }}
              >
                <div className="mt-4 mb-4">
                  <div className="row">
                    <div className="col-8" style={{ fontSize: "11px" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-calendar-week"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"></path>
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"></path>
                      </svg>
                      &nbsp; {moment().format("ddd, DD MMM YYYY")}
                    </div>
                    <div className="col-4">
                      <div style={{ float: "right", fontSize: "11px" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-clock"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path>
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"></path>
                        </svg>{" "}
                        <Clock
                          format={"HH:mm"}
                          ticking={true}
                          timezone={"Asia/Jakarta"}
                        />
                        {" WIB"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form className="form-inline" onSubmit={this.filterData}>
              <div className="row justify-content-md-center">
                <div
                  className="w-100 col-md-auto"
                  style={{ background: "#FFFFFF" }}
                >
                  <div className="mt-4 mb-4">
                    <div className="row">
                      <div className="col-7" style={{ fontSize: "12pt" }}>
                        <b>Lokasi Salesmen</b>
                      </div>
                      <div className="col-5">
                        <Link
                          to={`/sfa-team-leader/salesmen-location/list`}
                          style={{ float: "right" }}
                        >
                          Lihat semua
                        </Link>
                      </div>
                      <div className="col-12 input-action-custom mt-2">
                        <input
                          placeholder="Cari Nama / ID / Lokasi"
                          className="form-control form-control-line"
                          name="search"
                          value={search}
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="col-8 mt-2">
                        <div className="custom-select-line">
                          <SelectLineComponent
                            options={sales_types.data}
                            value={sales_type_id}
                            handleChange={(sales_type) => {
                              this.setState({
                                sales_type_id: sales_type.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-4 mt-2">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          style={{}}
                          onClick={(e) => {
                            this.setState({ page: 1, isFilter: true }, () =>
                              this.filterData(e)
                            );
                          }}
                        >
                          Cari
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="row justify-content-md-center">
              <div
                className="w-100 col-md-auto"
                style={{ background: "#FFFFFF" }}
              >
                <div
                  className="mt-3 mb-3"
                  style={{
                    overflowY: "scroll",
                    minHeight: "450px",
                    maxHeight: "450px",
                  }}
                >
                  <InfiniteScroll
                    dataLength={listItem.length}
                    next={this.fetchFeedingLongLat}
                    hasMore={true}
                    height={450}
                    loader={
                      salesmen_location.loading ? (
                        <span style={{ textAlign: "center" }} className="mt-2">
                          <b>
                            <h5>Loading...</h5>
                          </b>
                        </span>
                      ) : (
                        ""
                      )
                    }
                  >
                    {listItem.map((salesman, index) => {
                      return (
                        <div
                          key={index}
                          style={style.link}
                          onClick={() =>
                            this.focusFeedingLongLat(
                              salesman.latitude,
                              salesman.longitude
                            )
                          }
                        >
                          {index > 0 && (
                            <div className="mt-2 mb-2">
                              <hr></hr>
                            </div>
                          )}

                          <div className="row">
                            <div className="col-12">
                              <strong>
                                {salesman.sales_name
                                  ? salesman.sales_name
                                  : "-"}
                              </strong>
                            </div>
                            <div className="col-10">
                              {salesman.sales_id ? salesman.sales_id : "-"}
                            </div>
                            <div className="col-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-chevron-right"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                ></path>
                              </svg>
                            </div>
                            <div
                              className="col-10"
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {`${salesman.latitude},${salesman.longitude}`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const connector = connect(
  ({ salesmen_location, auth, sales_types }) => ({
    salesmen_location,
    auth,
    sales_types,
  }),
  {
    getFeedingLonglat,
  }
)(Index);

const googleExport = GoogleApiWrapper({
  apiKey: REACT_APP_API_KEY_GOOGLE_MAP,
})(connector);

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity,
  },
  watchPosition: true,
})(googleExport);
