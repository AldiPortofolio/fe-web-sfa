import React, { Component } from "react";
import Clock from "react-live-clock";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import {
  REACT_APP_API_KEY_GOOGLE_MAP,
  REACT_APP_DEFAULT_LATITUDE,
  REACT_APP_DEFAULT_LONGITUDE,
} from "../../actions/constants";

const mapStyles = {
  width: "100%",
  height: "100%",
};

class Detail extends Component {
  state = {
    defaultZoom: 15,
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

  render() {
    const { defaultZoom } = this.state;
    const { salesmen_location } = this.props;
    const detail = salesmen_location.one;
    moment().locale("id");
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <h2>Detail Salesman</h2>
          </div>
          <div className="col-12 mb-4">
            <div className="row">
              <div className="col-sm">
                <div className="col-12">
                  <div className="row justify-content-md-center">
                    <div
                      className="w-100 col-md-auto"
                      style={{ background: "#EBF7FF" }}
                    >
                      <div className="mt-4 mb-4">
                        <div className="row">
                          <div className="col-7">
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
                            &nbsp;{" "}
                            {moment(detail.mobile_time, "YYYY-MM-DD").format(
                              "ddd, DD MMM YYYY"
                            )}
                          </div>
                          <div className="col-5">
                            <div style={{ float: "right" }}>
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
                              {moment(
                                detail.created_at,
                                "YYYY-MM-DD H:mm"
                              ).format("H:mm")}
                              {/* <Clock
                                format={"HH:mm"}
                                ticking={true}
                                timezone={"Asia/Jakarta"}
                              /> */}
                              {" WIB"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12" style={{ height: "70vh" }}>
                  <div className="row">
                    <Map
                      google={this.props.google}
                      zoom={defaultZoom}
                      style={mapStyles}
                      initialCenter={{
                        lat: detail.latitude,
                        lng: detail.longitude,
                      }}
                      onClick={this.onMapClicked}
                    >
                      <Marker
                        position={{
                          lat: detail.latitude,
                          lng: detail.longitude,
                        }}
                        onClick={this.onMarkerClick}
                        name={detail.sales_name}
                      />
                      <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}
                      >
                        <div className="row">
                          <div className="col-8">
                            <strong>{this.state.selectedPlace.name}</strong>
                          </div>
                          <div className="col-8">{detail.sales_phone}</div>
                          <div
                            className="col-8"
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {detail.address}
                          </div>
                        </div>
                      </InfoWindow>
                    </Map>
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <div className="card noSelect">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <h4>Informasi Salesman</h4>
                      </div>
                      <div className="col-sm">
                        <div className="row">
                          <div className="col-12">Nama Sales</div>
                          <div className="col-12">
                            <strong>{detail.sales_name}</strong>
                          </div>
                          <div className="col-12 mt-4">ID Sales</div>
                          <div className="col-12">
                            <strong>{detail.sales_id}</strong>
                          </div>
                          <div className="col-12 mt-4">Regional</div>
                          <div className="col-12">
                            <strong>{detail.region}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm">
                        <div className="row">
                          <div className="col-12">No Hp</div>
                          <div className="col-12">
                            <strong>{detail.sales_phone}</strong>
                          </div>
                          <div className="col-12 mt-4">Tipe SR</div>
                          <div className="col-12">
                            <strong>{detail.sales_type}</strong>
                          </div>
                          <div className="col-12 mt-4">Sub Area Channel</div>
                          <div className="col-12">
                            <strong>{detail.sub_area}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 mt-3 mb-3">
                        <hr></hr>
                      </div>
                      <div className="col-12 mb-3">
                        <h4>Informasi Lokasi</h4>
                      </div>
                      <div className="col-sm">
                        <div className="row">
                          <div className="col-12">Hari/Tanggal</div>
                          <div className="col-12">
                            <strong>
                              {moment(detail.created_at, "YYYY-MM-DD").format(
                                "ddd, DD MMM YYYY"
                              )}
                            </strong>
                          </div>
                          <div className="col-12 mt-4">Lokasi</div>
                          <div className="col-12">
                            <strong>{detail.address}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm">
                        <div className="row">
                          <div className="col-12">Jam</div>
                          <div className="col-12">
                            <strong>
                              {" "}
                              {moment(
                                detail.created_at,
                                "YYYY-MM-DD H:mm"
                              ).format("H:mm")}
                            </strong>
                          </div>
                          <div className="col-12 mt-4">Koordinat</div>
                          <div className="col-12">
                            <strong>{`${detail.latitude},${detail.longitude}`}</strong>
                          </div>
                        </div>
                      </div>
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

const connector = connect(
  ({ salesmen_location, auth, sales_types }) => ({
    salesmen_location,
    auth,
    sales_types,
  }),
  {}
)(Detail);

export default GoogleApiWrapper({
  apiKey: REACT_APP_API_KEY_GOOGLE_MAP,
})(connector);
