import React from 'react';
import { find } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isNaN } from 'lodash'
import { verifySale, getSale } from '../../actions/sale'
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
    id_number: '',
    email: '',
    province: '',
    city: '',
    dob: '',
    phone_number: '',
    phone_area: '+62',
    selectedGender: {},
    selectedCompCode: {},
    selectedProvince: {},
    selectedCity: {},
    salesProvince: {},
    salesCity: {},
    salesDistrict: {},
    salesVillage: {},
    address: '',
    postcode: '',
    birth_place: '',
    locationProvince: {},
    locationCity: {},
    locations: [
      {
        "district": {},
        "village": [
          {}
        ]
      }
    ],
    rt: '',
    rw: '',
    upload: null,
    check: false,
    status: '',
    id_card: '',
    photo: '',
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    expandCard: false
  }

  componentWillMount() {
    const { auth: {access_token}, getSale } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    getSale(this.props.match.params.id)
      .then(({data: {salesman}}) => {
        let selectedProvince = salesman.area_aquisitions.province ? find(this.props.provinces.data, {label: salesman.area_aquisitions.province}) : {}
        let salesProvince = salesman.province ? find(this.props.provinces.data, {label: salesman.province}) : {}
        let selectedGender = find(this.props.genders.data, {label: salesman.gender})
        let selectedCompCode = find(this.props.company_codes.data, {label: salesman.company_code})
        let phone_area = salesman.phone_area ? salesman.phone_area : '+62'
        let dob = salesman.dob
        let salesDistrict = salesman.district
        let salesVillage = salesman.village
        let locations = salesman.area_aquisitions.locations ? salesman.area_aquisitions.locations : this.state.locations
        var selectedCity, salesCity;

        var phone_number = salesman.phone
        while(phone_number.charAt(0) === '0')
        {
         phone_number = phone_number.substr(1);
        }

        if(selectedProvince !== undefined){
          this.props.getCities(selectedProvince.value).then((data) => {
            selectedCity = find(data, {label: salesman.area_aquisitions.city})
            salesCity = find(data, {label: salesman.city})

            this.setState({
              ...salesman,
              selectedCity,
              salesCity
            })
          })

          this.props.getCities(salesProvince.value).then((data) => {
            salesCity = find(data, {label: salesman.city})

            this.setState({
              ...salesman,
              salesCity
            })
          })
        }
        
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
          id_number: salesman.id_number,
          dob,
          phone_number,
          phone_area,
          selectedProvince,
          selectedCity,
          selectedGender,
          selectedCompCode,
          salesProvince,
          salesCity,
          salesDistrict,
          salesVillage,
          id_card,
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

  addDistrict = (e) => {
    if(this.state.locations.length < 3){
      this.setState((prevState) => ({
        locations: [...prevState.locations, {district:"", village:[""]}],
      }));
    }else{
      alert("Anda sudah mencapai batas maximum menambah kecamatan")
    }
  }

  addVillage = (district, idx) => {
    this.state.locations.forEach((loc, sIdx) => {
      if (idx !== sIdx){
        return loc;
      }else{
        if(loc.village.length < 6){
          let newVillage = loc.village.push({})

          return { ...loc, district, village: newVillage };
        }else{
          alert("Anda sudah mencapai batas maximum menambah kelurahan")
        }
      }
    })
  }

  showCitiesByProvince = (province) => {
    if(province !== undefined){
      let cities = this.props.getCities(province.value)

      this.setState({cities: cities})
    }
  }

  showDistrictsByCity = (city) => {
    if(city !== undefined){
      let districts = this.props.getDistricts(city.value)

      this.setState({districts: districts})
    }
  }

  showVillagesByDistrict = (district) => {
    if(district !== undefined){
      let villages = this.props.getVillages(district.value)

      this.setState({villages: villages})
    }
  }

  render() {
    let allFilled = false
    const { auth, sales, genders, company_codes, provinces, verifySale, getCities, getDistricts, getVillages, history, cities, districts, villages } = this.props
    const { id,
      first_name,
      last_name,
      email,
      id_number,
      dob,
      phone_number,
      phone_area,
      selectedGender,
      selectedCompCode,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      selectedProvince,
      selectedCity,
      salesProvince,
      salesCity,
      salesDistrict,
      salesVillage,
      address,
      birth_place,
      check,
      rt,
      rw,
      status,
      id_card,
      expandCard,
      locations } = this.state

    if (first_name && last_name && email && phone_number && id_number && selectedGender.value && selectedCompCode.value && address && check && birth_place && dob && 
       (selectedProvince.value >= 0) &&
       (salesProvince.value >= 0) &&
       (salesCity.value >= 0) &&
       (salesDistrict.value >= 0) &&
       (salesVillage.value >= 0)
    ) {
      allFilled = true
    }

    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false, loading: false})}
            confirmSuccess={() => history.push('/sales/')}
            textSuccess={textSuccess}
            textError={textError}
          />

          <div className="col-12">
            <nav className="d-flex justify-content-between" aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/sales/verifications" className="d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Kembali ke list
                  </Link>
                </li>
              </ol>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/sales/verifications">Verifikasi sales</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Edit Sales Perorang</li>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user mr-2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {status}
                  </div>
                </div>
                <div className="card-info d-flex justify-content-between align-items-center mt-4">
                  <div className="ktp-pict d-flex align-items-center">
                    <img src="/img/icon-ktp.png" className="mr-2" alt="logo" width="24px" height="17px" />
                    <p className="mb-0 mr-2 text-primary">Foto KTP</p>
                    { id_card !== null && <p className="mb-0 text-gray"> • Uploaded</p>}
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
                <img src={id_card} className="img-fluid" alt=""/>
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
          </div>

          <div className="col-12 col-lg-8 mb-4">
            <div className="card mb-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (allFilled) {
                    verifySale(id, {first_name, email, last_name, id_number, dob, phone_area, birth_place, address, rt, rw,
                      phone_number: (phone_number.charAt(0) === '0' ? phone_number.substr(1) : phone_number),
                      gender: selectedGender.label,
                      company_code: selectedCompCode.value,
                      province_id:  salesProvince.value,
                      city_id:      salesCity.value,
                      district_id:  salesDistrict.value,
                      village_id:   salesVillage.value,
                      area_attributes: {
                        province_id: selectedProvince.value,
                        city_id: selectedCity.value,
                        locations: locations
                      }
                    })
                    .then(data => {
                      if(data.meta.status === false){
                        this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
                      }else{
                        this.setState({confirmIsOpen: true, type: 'success', textSuccess: `Sales dengan nama <br/><strong>${first_name} ${last_name}</strong><br/> telah berhasil diverifikasi`})
                      }
                    })
                    .catch(e => {
                      this.setState({confirmIsOpen: true, type: 'error', textError: `Sales dengan nama <br/><strong>${first_name} ${last_name}</strong><br/> telah berhasil diverifikasi`})
                    })
                  }
                }}>
                <div className="card-header">
                  <h4 className="text-uppercase mb-0">Data Akun</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Nama Depan</label>
                        <input onChange={e => this.setState({first_name: e.target.value})} value={first_name} type="text" name="first-name" className="form-control form-control-line" placeholder="Masukan nama" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Nama Belakang</label>
                        <input onChange={e => this.setState({last_name: e.target.value})} value={last_name} type="text" name="last-name" className="form-control form-control-line" placeholder="Masukan nama" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Email</label>
                        <input onChange={e => this.setState({email: e.target.value})} value={email} type="text" name="email" className="form-control form-control-line" placeholder="Masukan email" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">No Handphone</label>
                        <div className="form-row">
                          <div className="col-3 col-lg-3">
                            <select className="custom-select-line text-center" onChange={e => this.setState({phone_area: e.target.value})} value={phone_area}>
                              <option value='+62'>+62</option>
                            </select>
                          </div>
                          <div className="col-9">
                            <input
                              onChange={e => {
                                if (isNaN(Number(e.target.value)) || e.target.value.split('').length > 16) {
                                  return
                                }
                                this.setState({phone_number: e.target.value})
                              }}
                              value={phone_number} type="number" name="first-name" className="form-control form-control-line" placeholder="812 3456 7890" maxLength="12" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-header">
                  <h4 className="text-uppercase mb-0">Data Sales</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">No KTP</label>
                        <input
                          onChange={e => {
                            if (isNaN(Number(e.target.value)) || e.target.value.split('').length > 16) {
                              return
                            }
                            this.setState({id_number: e.target.value})
                          }}
                          value={id_number} type="number" name="first-name" className="form-control form-control-line" placeholder="Masukan no ktp" maxLength="16" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Kode Perusahaan</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={company_codes.form} initValue={selectedCompCode}
                            handleChange={(selectedCompCode) => this.setState({selectedCompCode}) }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Tempat Lahir</label>
                        <input onChange={e => this.setState({birth_place: e.target.value})} value={birth_place} type="text" name="birth place" className="form-control form-control-line" placeholder="Masukan tempat lahir" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Tanggal Lahir</label>
                        <DatePicker handleChange={dob => this.setState({dob})} value={dob} />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Jenis Kelamin</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={genders.form} initValue={selectedGender}
                            handleChange={(selectedGender) => this.setState({selectedGender}) }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-12">
                      <div className="form-group py-3">
                        <hr/>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Provinsi</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={provinces.form} initValue={salesProvince}
                            handleChange={(salesProvince) => {
                              getCities(salesProvince.value)
                              this.setState({salesProvince, salesCity: {}})
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Kabupaten</label>
                        <div className="custom-select-line">
                          <SelectComponentLoad options={cities.data} initValue={salesCity} isDisabled={auth.city_id !== null}
                            onFocus={() => { this.showCitiesByProvince(salesProvince)}}
                            handleChange={(salesCity) => {
                              getDistricts(salesCity.value)
                              this.setState({salesCity, salesDistrict: {}})
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Kecamatan</label>
                        <div className="custom-select-line">
                          <SelectComponentLoad options={districts.data} initValue={salesDistrict} isDisabled={auth.city_id !== null}
                            onFocus={() => { this.showDistrictsByCity(salesCity)}}
                            handleChange={(salesDistrict) => {
                              getVillages(salesDistrict.value)
                              this.setState({salesDistrict, salesVillage: {}})
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Kelurahan</label>
                        <div className="custom-select-line">
                          <SelectComponentLoad options={villages.data} initValue={salesVillage} isDisabled={auth.city_id !== null}
                            onFocus={() => { this.showVillagesByDistrict(salesDistrict)}}
                            handleChange={(salesVillage) => {
                              this.setState({salesVillage})
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Alamat</label>
                        <input onChange={e => this.setState({address: e.target.value})} value={address} type="text" name="address" className="form-control form-control-line" placeholder="Masukan Alamat" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-header">
                  <h4 className="text-uppercase mb-0">Data Regional</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Provinsi</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={provinces.form} initValue={selectedProvince}
                            handleChange={(selectedProvince) => {
                              getCities(selectedProvince.value)
                              this.setState({selectedProvince, selectedCity: {}})
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Kabupaten</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={cities.data} initValue={selectedCity} isDisabled={auth.city_id !== null}
                            handleChange={(selectedCity) => {
                              getDistricts(selectedCity.value)
                              this.setState({selectedCity, selectedDistrict: {}})
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Dynamic View */}
                    {
                      locations.map((location, idx) => {
                        let district = location.district;

                        return (
                          <div className="col-12" key={'district-' + idx}>
                            <div className="row">
                              <div className="col-12 col-lg-6">
                                <div className="form-group">
                                  <label className="text-uppercase">Kecamatan {idx + 1}</label>
                                  <div className="custom-select-line">
                                    <SelectComponentLoad options={districts.data} initValue={location.district} isDisabled={auth.district_id !== null}
                                      onFocus={() => { this.showDistrictsByCity(selectedCity.value)}}
                                      handleChange={(district) => {
                                        let newLocations = this.state.locations.map((loc, sidx) => {
                                          if (idx !== sidx) return loc;
                                          return { ...loc, district: district };
                                        });

                                        getVillages(district.value)
                                        this.setState({ locations: newLocations })
                                      }}
                                    />
                                  </div>
                                </div>
                                { (locations[locations.length-1] === location) &&
                                  <div className="form-group">
                                    <span className="btn btn-sm btn-rounded btn-outline-danger pl-3 d-inline-flex align-items-center" onClick={this.addDistrict}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                      </svg>
                                      Tambah Kecamatan
                                    </span>
                                  </div>
                                }
                              </div>
                              <div className="col-12 col-lg-6">
                                {
                                  location.village.map((village, idx_v) => {
                                    // let vill = location.village[idx_v];

                                    return (
                                      <div className="form-group" key={'village-' + idx_v}>
                                        <label className="text-uppercase">Kelurahan {idx_v + 1}</label>
                                        <div className="custom-select-line">
                                          <SelectComponentLoad options={villages.data} initValue={village}
                                            onFocus={() => { this.showVillagesByDistrict(location.district.value)}}
                                            handleChange={(village) => {
                                              let newLocations = this.state.locations.map((loc, sIdx) => {
                                                if (idx !== sIdx){
                                                  return loc;
                                                }else{
                                                  let newVillage = loc.village.map((vill, vIdx) => {
                                                    if(idx_v === vIdx){
                                                      return loc.village[idx_v] = village
                                                    }else{
                                                      return loc.village[idx_v] = vill
                                                    }
                                                  })

                                                  return { ...loc, district, village: newVillage };
                                                }
                                              });

                                              this.setState({ locations: newLocations })
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                                <div className="form-group">
                                  <span className="btn btn-sm btn-rounded btn-outline-danger d-inline-flex align-items-center pl-3" onClick={() => { this.addVillage(district, idx)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                      <line x1="12" y1="5" x2="12" y2="19"></line>
                                      <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Tambah Kelurahan
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                    {/* Dynamic View */}
                  </div>
                </div>
                <div className="card-footer">
                  <div className="d-flex row">
                    <div className="col-8 d-flex align-items-center">
                      <label className="mb-0">
                        <input type="checkbox" value={check} onChange={() => {
                          let newCheck = this.state.check ? false : true 
                          this.setState({check: newCheck})
                        }}/>
                        <small className="ml-2">Data sales sudah lengkap dan sesuai dengan data OttoPay</small>
                      </label>
                    </div>
                    <div className="col-4 d-flex align-items-center justify-content-end">
                      {sales.loading ?
                        <LoadingSpinner />
                        :
                        <button type="submit" disabled={!allFilled} className="btn btn-danger btn-rounded">Verifikasi</button>
                      }
                    </div>
                  </div>
                </div>
              </form>
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
  ({auth, genders, company_codes, provinces, cities, districts, villages, sales}) => ({ auth, genders, company_codes, provinces, cities, districts, villages, sales }),
  {verifySale, getSale, getCities, getDistricts, getVillages}
)(Edit)
