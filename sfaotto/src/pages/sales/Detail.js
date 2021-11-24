import React from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getSale, verifySale, getSaleV2 } from "../../actions/sale";
import { ModalConfirm, Lightbox } from "../../components";
import axios from "../../actions/config";
import moment from "moment";
import { ind, en } from "../../languages/sales";

// const svgStyle = {
//   height: '18px',
//   width: '18px'
// }

class Detail extends React.Component {
  state = {
    id: null,
    first_name: "",
    last_name: "",
    gender: "",
    sales_level: "",
    sales_type: "",
    sales_types: [],
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
    sales_type_id: "",
    sales_type_name: "",
  };

  componentWillMount() {
    const {
      auth: { access_token },
      getSale,
      getSaleV2,
    } = this.props;

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.detail });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.detail });
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    getSaleV2(this.props.match.params.id).then((data) => {
      let salesman = data.data;
      let phone_number = salesman.phone;
      let dob = salesman.dob;
      let positions = salesman.positions ? salesman.positions : [];
      // let id_card = salesman.id_card_pic
      let created_at = salesman.created_at;
      let updated_at = salesman.updated_at;

      this.setState({
        ...salesman,
        dob,
        // id_card,
        phone_number,
        positions,
        created_at,
        updated_at,
      });
    });
  }

  getData = async () => {
    try {
      await this.props.getCountries();
      await this.props.getCities();
      await this.props.getProvinces();
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    document.title = "SFA OTTO - Detail Sales";
  }

  render() {
    const { history } = this.props;
    const {
      id,
      first_name,
      last_name,
      gender,
      photo,
      id_card_pic,
      email,
      birth_place,
      company_code,
      id_number,
      sfa_id,
      dob,
      work_date,
      occupation,
      sales_id,
      phone_number,
      confirmIsOpen,
      type,
      address,
      sales_level,
      sales_types,
      textSuccess,
      textError,
      positions,
      status,
      created_at,
      updated_at,
      languages,
      isOpen,
      isOpen2,
      sales_type_id,
      sales_type_name,
    } = this.state;

    let month_names = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return (
      // <div className="container mb-5 noSelect">
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({ confirmIsOpen: false })}
            confirmSuccess={() => history.push("/sales/verifications")}
            textSuccess={textSuccess}
            textError={textError}
          />

          <div className="col-12 mb-5">
            <h2>{languages.header}</h2>
          </div>

          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-9 p-0 text-center d-flex flex-row align-items-center">
                          <div className="avatar mr-3 d-flex justify-content-center align-items-center">
                            {photo === "" ? (
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
                                src={photo}
                                className="avatar justify-content-center align-items-center pointerYes"
                                alt=""
                              />
                            )}
                            <Lightbox
                              isOpen={isOpen}
                              images={photo}
                              confirmClose={() =>
                                this.setState({ isOpen: false })
                              }
                            />
                          </div>
                          <div className="d-flex flex-column align-items-start">
                            <p className="mb-0">
                              <strong>
                                {first_name} {last_name}
                              </strong>
                            </p>
                            <p className="mb-0 text-gray">
                              {languages.idSfa} {sfa_id}
                            </p>
                          </div>
                        </div>
                        <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                          <strong className="mb-0 text-primary">
                            <small>{languages.status}</small>
                          </strong>
                          <span
                            className={`badge ${
                              status === "Unregistered"
                                ? "badge-gray"
                                : "badge-status"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer border-top">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-6 d-flex flex-column">
                          <small>
                            <strong className="mb-0">{languages.dob}</strong>
                          </small>
                          {dob !== ""
                            ? moment(dob, "DD-MM-YYYY").format("DD MMM YYYY")
                            : "-"}
                        </div>
                        <div className="col-12 col-lg-6 d-flex flex-column">
                          <small>
                            <strong className="mb-0">{languages.idCard}</strong>
                          </small>
                          <div className="d-flex flex-row align-items-center">
                            <i
                              onClick={() => this.setState({ isOpen2: true })}
                              className="la la-image text-gray mr-2 pointerYes"
                            ></i>
                            {
                              id_card_pic === "" ? (
                                <small className="text-gray mb-0 pointerYes">
                                  {languages.didNot}
                                </small>
                              ) : (
                                <small
                                  onClick={() =>
                                    this.setState({ isOpen2: true })
                                  }
                                  className="text-gray mt-1 pointerYes"
                                >
                                  Uploaded
                                </small>
                              )
                              // <a className="text-danger text-bold" onClick={()=>{
                              //   let newExpand = this.state.expandCard ? false : true
                              //   this.setState({expandCard: newExpand})
                              // }}>{languages.lihat} </a>
                            }
                            <Lightbox
                              isOpen={isOpen2}
                              images={id_card_pic}
                              confirmClose={() =>
                                this.setState({ isOpen2: false })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div id="card-image" className={`card ${expandCard ? 'expand-card' : 'd-none'}`}>
                    <div className="card-body text-center pb-2">
                      <h4 className="text-uppercase">{languages.fotoKtp}</h4>
                      <div className="actions text-right">
                        <button className="btn btn-link text-gray text-left" onClick={()=>{
                          let newExpand = this.state.expandCard ? false : true 
                          this.setState({expandCard: newExpand})
                        }}>
                          <div className="d-inline-flex align-items-center">
                        
                            <IconCollapse />
                          </div>
                        </button>
                      </div>
                      <img src={id_card_pic} className="img-fluid" />
                    </div>
                  </div> */}
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.header2}</h6>
                    <div className="col-12 mt-3">
                      <div className="row">
                        <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>{languages.email}</small>
                          </strong>
                          <p className="mb-0 canSelect">{email}</p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>{languages.jabatan}</small>
                          </strong>
                          <p className="mb-0">
                            {occupation ? occupation : "-"}
                          </p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>{languages.phone}</small>
                          </strong>
                          <p className="mb-0 canSelect">
                            {phone_number ? phone_number : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body border-top">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>{languages.companyCode}</small>
                          </strong>
                          <p>{company_code}</p>
                        </div>
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>{languages.salesLevel}</small>
                          </strong>
                          <p>{sales_level ? sales_level : "-"}</p>
                        </div>
                        <div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
                          <strong className="mb-0 text-gray">
                            <small>{languages.idSales}</small>
                          </strong>
                          <p className="mb-0">{sales_id ? sales_id : "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h6 className="mb-0">{languages.header3}</h6>
                  </div>
                  <div className="card-body border-top">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            <strong>{languages.noKtp}</strong>
                          </p>
                        </div>
                        <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">{id_number ? id_number : "-"}</p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            <strong>{languages.tempatLahir}</strong>
                          </p>
                        </div>
                        <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            {birth_place ? birth_place : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            <strong>{languages.tanggalLahir}</strong>
                          </p>
                        </div>
                        <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            {dob
                              ? moment(dob, "DD-MM-YYYY").format("DD MMM YYYY")
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            <strong>{languages.tanggalMasuk}</strong>
                          </p>
                        </div>
                        <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            {work_date
                              ? moment(work_date, "DD-MM-YYYY").format(
                                  "DD MMM YYYY"
                                )
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            <strong>{languages.salesType}</strong>
                          </p>
                        </div>
                        <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                          {/* <p className="mb-0">{sales_types ? sales_types.name : "-"}</p> */}
                          <p className="mb-0">{sales_type_name}</p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            <strong>{languages.gender}</strong>
                          </p>
                        </div>
                        <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">{gender ? gender : "-"}</p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">
                            <strong>{languages.address}</strong>
                          </p>
                        </div>
                        <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0">{address ? address : "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!isEmpty(positions) &&
                  positions.map((position, i) => (
                    <div className="card mb-4" key={i}>
                      <div className="card-body">
                        <h6 className="mb-0">{languages.header4}</h6>
                      </div>
                      <div className="card-body border-top">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.region}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {position.region ? position.region : "-"}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.branch}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {position.branch ? position.branch : "-"}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.branchOffice}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {position.branch_office
                                  ? position.branch_office
                                  : "-"}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.area}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {position.area ? position.area : "-"}
                              </p>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                <strong>{languages.subArea}</strong>
                              </p>
                            </div>
                            <div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
                              <p className="mb-0">
                                {position.sub_area ? position.sub_area : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="col-12 col-lg-4 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.header5}</h6>
                    <div className="col-12 mt-4">
                      <div className="row">
                        <div className="col-12 col-lg-6 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0 text-gray">
                            {languages.totalAkuisisi}
                          </p>
                        </div>
                        <div className="col-12 col-lg-6 p-lg-0 text-right d-flex flex-column">
                          <p className="mb-0">-</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="row">
                        <div className="col-12 col-lg-6 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0 text-gray">
                            {languages.pencapaian}
                          </p>
                        </div>
                        <div className="col-12 col-lg-6 p-lg-0 text-right d-flex flex-column">
                          <p className="mb-0">-</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="row">
                        <div className="col-12 col-lg-6 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0 text-gray">
                            {languages.tanggalRegis}
                          </p>
                        </div>
                        <div className="col-12 col-lg-6 p-lg-0 text-right d-flex flex-column">
                          <p className="mb-0">
                            {new Date(created_at).getDate()}{" "}
                            {month_names[new Date(created_at).getMonth()]}{" "}
                            {new Date(created_at).getFullYear()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="row">
                        <div className="col-12 col-lg-6 p-lg-0 text-left d-flex flex-column">
                          <p className="mb-0 text-gray">
                            {languages.tanggalRubah}
                          </p>
                        </div>
                        <div className="col-12 col-lg-6 p-lg-0 text-right d-flex flex-column">
                          <p className="mb-0">
                            {new Date(updated_at).getDate()}{" "}
                            {month_names[new Date(updated_at).getMonth()]}{" "}
                            {new Date(updated_at).getFullYear()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mb-0">
                <hr className="content-hr" />
                <div className="form-group d-flex justify-content-end mb-0">
                  <Link to={`/sales/edit/${id}`} className="btn btn-danger">
                    {languages.edit}
                  </Link>
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
  verifySale,
  getSale,
  getSaleV2,
})(Detail);
