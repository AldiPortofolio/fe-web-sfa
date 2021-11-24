import React from 'react';
import { find, includes } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isNaN } from 'lodash'
import { getSale, verifySale } from '../../actions/sale'
import { getCities } from '../../actions/city'
import { getDistricts } from '../../actions/district'
import { getVillages } from '../../actions/village'
import { ModalConfirm, SelectLineComponent, LoadingSpinner, DatePicker, SelectComponentLoad } from '../../components'
import axios from '../../actions/config'

const svgStyle = {
  height: '18px',
  width: '18px'
}

class Edit extends React.Component {
  state = {
    id: null,
    first_name: '',
    last_name: '',
    gender: '',
    id_number: '',
    email: '',
    birth_place: '',
    company_code: '',
    province: '',
    city: '',
    phone_number: '',
    id_card: '',
    city: '',
    district: '',
    village: '',
    address: '',
    sales_id: '',
    locations: [
      {
        "district": {},
        "village": [
          {}
        ]
      }
    ],
    upload: null,
    check: false,
    confirmIsOpen: false,
    expandCard: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    status: '',
    regionalProvince: '',
    regionalCity: ''
  }

  componentWillMount() {
    const { auth: {access_token}, getSale } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    getSale(this.props.match.params.id)
      .then(({data: {salesman}}) => {
        let regionalProvince = salesman.area_aquisitions.province
        let regionalCity = salesman.area_aquisitions.city
        let phone_area = salesman.phone_area
        let phone_number = salesman.phone
        let dob = salesman.dob
        let locations = salesman.area_aquisitions.locations ? salesman.area_aquisitions.locations : this.state.locations

        var id_card
        if(salesman.id_card_pic){
          if(window.location.host === 'localhost:3000'){
            id_card = "http://localhost:3001" + salesman.id_card_pic
          }else if(window.location.host === '45.126.132.61'){
            id_card = "http://45.126.132.61:5000" + salesman.id_card_pic
          }else{
            id_card = "http://apisfa.ottopay.id" + salesman.id_card_pic
          }
        }

        this.setState({
          ...salesman,
          dob,
          id_card,
          phone_number,
          phone_area,
          regionalProvince,
          regionalCity,
          locations
        })
      })
  }

  getData = async () => {
    try {
      await this.props.getCountries()
      await this.props.getCities()
      await this.props.getProvinces()
    } catch(e) {
      console.log(e)
    }
  }

  componentDidMount(){
    document.title = "SFA OTTO - Edit Sales"
  }

  render() {
    const { auth, sales, history, verifySale } = this.props
    const { id,
      upload,
      first_name,
      last_name,
      gender,
      email,
      birth_place,
      company_code,
      id_number,
      dob,
      sales_id,
      phone_number,
      id_card,
      confirmIsOpen,
      type,
      check,
      textSuccess,
      textError,
      selectedProvince,
      selectedCity,
      province,
      expandCard,
      city,
      district,
      village,
      address,
      status,
      regionalProvince,
      regionalCity,
      locations } = this.state
    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/sales/verifications')}
            textSuccess={textSuccess}
            textError={textError}
          />

          <div className="col-12">
            <nav className="d-flex justify-content-between" aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/sales/" className="d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Kembali ke list
                  </Link>
                </li>
              </ol>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/sales/verifications">Manage Sales</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Profile</li>
              </ol>
            </nav>
          </div>
          <div className="col-12 col-lg-4 mb-4">
            <div className="card mb-4">
              <div className="card-header card-header-gray text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="170" height="170" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user mr-2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="card-body">
                <div className="card-info">
                  <h4 className="text-uppercase">{first_name} {last_name}</h4>
                  <div className={`status d-flex align-items-center ${status === 'Verified' && 'text-success'} ${status === 'Registered' && 'text-blue'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user mr-2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {status}
                  </div>
                </div>
                <div className="card-info d-flex justify-content-between align-items-center mt-4">
                  <div className="ktp-pict d-flex align-items-center">
                    <img src="/img/icon-ktp.png" className="mr-2" alt="logo" width="24px" height="17px" />
                    <p className="mb-0 mr-2 text-blue">Foto KTP</p>
                    { id_card != null && <p className="mb-0 text-gray"> • Uploaded</p>}
                  </div>
                  { id_card === null ?
                  <p className="text-gray mb-0">No Image</p>
                  :
                  <button className="btn btn-outline-danger btn-sm btn-rounded" onClick={()=>{
                    let newExpand = this.state.expandCard ? false : true 
                    this.setState({expandCard: newExpand})
                  }}>Lihat </button>
                  }
                </div>
              </div>
            </div>
            <div id="card-image" className={`card ${expandCard ? 'expand-card' : 'd-none'}`}>
              <div className="card-body text-center pb-2">
                <h4 className="text-uppercase">Foto Ktp</h4>
                <img src={id_card} className="img-fluid" />
                <div className="actions text-right">
                  <button className="btn btn-link text-gray text-left" onClick={()=>{
                    let newExpand = this.state.expandCard ? false : true 
                    this.setState({expandCard: newExpand})
                  }}>
                    <div className="d-inline-flex align-items-center">
                      <span className="mr-2">Collapse Foto</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minimize-2" style={svgStyle}>
                        <polyline points="4 14 10 14 10 20"></polyline>
                        <polyline points="20 10 14 10 14 4"></polyline>
                        <line x1="14" y1="10" x2="21" y2="3"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <p className="mb-0">Ubah data sales</p>
                <Link to={`/sales/edit/${id}`} className="btn btn-rounded btn-danger btn-sm">
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8 mb-4">
            <div className="card mb-4">
              <div className="card-header p-3">
                <h5 className="text-uppercase mb-0">Data Akun</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Nama Depan</label>
                      <p className="text-blue">{first_name}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Nama Belakang</label>
                      <p className="text-blue">{last_name}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Email</label>
                      <p className="text-blue">{email}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">No Handphone</label>
                      <p className="text-blue">{phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-header p-3 rounded-0">
                <h5 className="text-uppercase mb-0">Data Sales</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">No KTP</label>
                      <p className="text-blue">{id_number}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Kode Perusahaan</label>
                      <p className="text-blue">{company_code}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Sales ID</label>
                      <p className="text-blue">{sales_id}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Tempat Lahir</label>
                      <p className="text-blue">{birth_place}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Tanggal Lahir</label>
                      <p className="text-blue">{dob}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Jenis Kelamin</label>
                      <p className="text-blue">{gender}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-12">
                    <div className="form-group py-2">
                      <hr/>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Provinsi</label>
                      <p className="text-blue">{province}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Kabupaten</label>
                      <p className="text-blue">{city}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Kecamatan</label>
                      <p className="text-blue">{district.label}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Kelurahan</label>
                      <p className="text-blue">{village.label}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Alamat</label>
                      <p className="text-blue">{address}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-header p-3 rounded-0">
                <h5 className="text-uppercase mb-0">Data Regional</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Provinsi</label>
                      <p className="text-blue">{regionalProvince}</p>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label className="text-uppercase">Kabupaten</label>
                      <p className="text-blue">{regionalCity}</p>
                    </div>
                  </div>
                  {/* Dynamic View */}
                  {
                    locations.map((location, idx) => {
                      let district = location.district;

                      return (
                        <div className="col-12 mb-3" key={'district-' + idx}>
                          <div className="row">
                            <div className="col-12 col-lg-6">
                              <div className="form-group">
                                <label className="text-uppercase">Kecamatan {idx + 1}</label>
                                <p className="text-blue">{location.district.label}</p>
                              </div>
                            </div>
                            <div className="col-12 col-lg-6">
                              {
                                location.village.map((village, idx_v) => {
                                  let vill = location.village[idx_v];

                                  return (
                                    <div className="form-group" key={'village-' + idx_v}>
                                      <label className="text-uppercase">Kelurahan {idx_v + 1}</label>
                                      <p className="text-blue">{vill.label}</p>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                  {/* Dynamic View */}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center text-md-left">
                <div className="row">
                  <div className="col-12 col-lg-8 text-gray">
                    <h5 className="mb-0">Atur Sales OttoPay</h5>
                    <small className="mb-0">Lihat daftar sales dan lakukan perubahan data sesuai yang dibutuhkan</small>
                  </div>
                  <div className="col-12 col-lg-4 d-flex align-items-center mt-4 mt-lg-0 justify-content-center justify-content-lg-end">
                    <Link to="/sales/" className="btn btn-rounded btn-danger">Manage Sales</Link>
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

export default connect(
  ({auth, sales}) => ({ auth, sales }),
  {verifySale, getSale}
)(Edit)
