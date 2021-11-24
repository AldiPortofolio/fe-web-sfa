// import React from 'react';
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { isNaN } from 'lodash'
// import { createSale } from '../../actions/sale'
// import { getCities } from '../../actions/city'
// import { getDistricts } from '../../actions/district'
// import { getVillages } from '../../actions/village'
// import { NotAuthorize, ModalConfirm, SelectLineComponent, LoadingSpinner, DatePicker } from '../../components'
// import axios from '../../actions/config'

// class Register extends React.Component {
//   state = {
//     first_name: '',
//     last_name: '',
//     email: '',
//     id_number: '',
//     dob: '',
//     phone_number: '',
//     phone_area: '+62',
//     province: '',
//     city: '',
//     sales_id: '',
//     selectedGender: {},
//     selectedCompCode: {},
//     selectedProvince: {},
//     selectedCity: {},
//     locations: [
//       {
//         "district": {},
//         "village": [
//           {}
//         ]
//       }
//     ],
//     upload: null,
//     pin1: '',
//     pin2: '',
//     pin3: '',
//     pin4: '',
//     pin5: '',
//     pin6: '',
//     pinConf1: '',
//     pinConf2: '',
//     pinConf3: '',
//     pinConf4: '',
//     pinConf5: '',
//     pinConf6: '',
//     confirmIsOpen: false,
//     type: 'success',
//     textSuccess: '',
//     textError: '',
//   }

//   componentWillMount() {
//     const { auth: {access_token} } = this.props
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
//   }

//   componentDidMount(){
//     document.title = "SFA OTTO - Register Sales"
//   }

//   getData = async () => {
//     try {
//       await this.props.getCountries()
//       await this.props.getCities()
//       await this.props.getProvinces()
//     } catch(e) {
//       console.log(e)
//     }
//   }

//   setPin = (val, pos) => {
//     let obj = {}
//     if (isNaN(Number(val)) || !val) {
//       obj[`pin${pos}`] = ''
//       this.setState(obj)
//       return
//     }
//     obj[`pin${pos}`] = val
//     this.setState(obj, () => (pos < 6) && this.refs[`pin${pos+1}`].focus())
//   }

//   setPinConfirm = (val, pos) => {
//     let obj = {}
//     if (isNaN(Number(val)) || !val) {
//       obj[`pinConf${pos}`] = ''
//       this.setState(obj)
//       return
//     }
//     obj[`pinConf${pos}`] = val
//     this.setState(obj, () => (pos < 6) && this.refs[`pinConf${pos+1}`].focus())
//   }

//   addDistrict = (e) => {
//     if(this.state.locations.length < 5){
//       this.setState((prevState) => ({
//         locations: [...prevState.locations, {district:"", village:[""]}],
//       }));
//     }else{
//       alert("Anda sudah mencapai batas maximum menambah kecamatan")
//     }
//   }

//   addVillage = (district, idx) => {
//     let newLocations = this.state.locations.map((loc, sIdx) => {
//       if (idx !== sIdx){
//         return loc;
//       }else{
//         if(loc.village.length < 20){
//           let newVillage = loc.village.push({})

//           return { ...loc, district, village: newVillage };
//         }else{
//           alert("Anda sudah mencapai batas maximum menambah kelurahan")
//         }
//       }
//     });
//   }

//   removeDistrict = (idx) => {
//     let location = this.state.locations;
//     let district = location.indexOf(idx);

//     if (district > -1) {
//       location.splice(district, 1);
//     }
//   }

//   removeVillage = (vill, idx) => {
//     let location = this.state.locations;
//     let district = location[idx];

//     if (vill > -1) {
//       district.village.splice(vill, 1);
//     }
//   }

//   render() {
//     let allFilled = false
//     const { auth, sales, genders, company_codes, createSale, history, getCities, getDistricts, getVillages, provinces, cities, districts, villages } = this.props
//     const { pin1,
//       pin2,
//       pin3,
//       pin4,
//       pin5,
//       pin6,
//       pinConf1,
//       pinConf2,
//       pinConf3,
//       pinConf4,
//       pinConf5,
//       pinConf6,
//       upload,
//       first_name,
//       last_name,
//       email,
//       id_number,
//       dob,
//       phone_number,
//       phone_area,
//       sales_id,
//       selectedGender,
//       selectedCompCode,
//       city,
//       province,
//       confirmIsOpen,
//       type,
//       textSuccess,
//       textError,
//       selectedProvince,
//       selectedCity,
//       selectedDistrict,
//       selectedVillage,
//       locations } = this.state

//     let pin = pin1 + pin2 + pin3 + pin4 + pin5 + pin6
//     let pin_confirmation = pinConf1 + pinConf2 + pinConf3 + pinConf4 + pinConf5 + pinConf6

//     if (first_name && last_name && email && phone_number && pin && (pin === pin_confirmation) && id_number && dob && selectedGender.label && selectedCompCode.label && sales_id) {
//       allFilled = true
//     }else if (first_name && last_name && email && phone_number && pin && (pin === pin_confirmation) && id_number && dob && selectedGender.label && selectedCompCode.label && selectedProvince.label && selectedCity.label) {
//       allFilled = true
//     }

//     let notMatch = false
//     if ((pin.split('')).length === 6 && (pin_confirmation.split('')).length === 6 && pin !== pin_confirmation) {
//       notMatch = true
//     }

//     if (auth.role === 'Manager' || auth.role === 'ASM' || auth.role === 'TL') {
//       return <NotAuthorize />
//     }

//     return (
//       <div className="container mb-5">
//         <div className="row">
//           <ModalConfirm
//             confirmIsOpen={confirmIsOpen}
//             type={type}
//             confirmClose={() => this.setState({confirmIsOpen: false})}
//             confirmSuccess={() => history.push('/sales/')}
//             textSuccess={textSuccess}
//             textError={textError}
//           />

//           <div className="col-12">
//             <nav className="d-flex justify-content-between" aria-label="breadcrumb">
//               <ol className="breadcrumb">
//                 <li className="breadcrumb-item">
//                   <Link to="/sales" className="d-flex">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left">
//                       <polyline points="15 18 9 12 15 6"></polyline>
//                     </svg>
//                     Kembali ke list
//                   </Link>
//                 </li>
//               </ol>
//               <ol className="breadcrumb">
//                 <li className="breadcrumb-item"><Link to="/">Home</Link></li>
//                 <li className="breadcrumb-item"><Link to="/sales">Manage sales</Link></li>
//                 <li className="breadcrumb-item active" aria-current="page">Daftar Sales Perorang</li>
//               </ol>
//             </nav>
//           </div>

//           <div className="col-12 col-lg-8 mb-4">
//             <div className="card mb-4">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault()

//                   if (allFilled && selectedProvince.value) {
//                     createSale({first_name, email, last_name, pin, id_number, dob, phone_area, sales_id,
//                       phone_number: (phone_number.charAt(0) === '0' ? phone_number.substr(1) : phone_number),
//                       gender: selectedGender.label,
//                       company_code: selectedCompCode.value,
//                       area_attributes: {
//                         province_id: selectedProvince.value,
//                         city_id: selectedCity.value,
//                         locations: locations
//                       }
//                     })
//                     .then(data => {
//                       if(data.meta.status === false){
//                         this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
//                       }else{
//                         this.setState({confirmIsOpen: true, type: 'success', textSuccess: 'Tambah data sales sukses'})
//                       }
//                     })
//                     .catch(e => {
//                       this.setState({confirmIsOpen: true, type: 'error', textError: 'Tambah data sales gagal'})
//                     })
//                   }else{
//                     createSale({first_name, email, last_name, pin, id_number, dob, phone_area, sales_id,
//                       phone_number: (phone_number.charAt(0) === '0' ? phone_number.substr(1) : phone_number),
//                       gender: selectedGender.label,
//                       company_code: selectedCompCode.value
//                     })
//                     .then(data => {
//                       if(data.meta.status === false){
//                         this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
//                       }else{
//                         this.setState({confirmIsOpen: true, type: 'success', textSuccess: 'Tambah data sales sukses'})
//                       }
//                     })
//                     .catch(e => {
//                       this.setState({confirmIsOpen: true, type: 'error', textError: 'Tambah data sales gagal'})
//                     })
//                   }
//                 }}>
//                 <div className="card-header">
//                   <h4 className="text-uppercase mb-0">Data Akun</h4>
//                 </div>
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Nama Depan</label>
//                         <input onChange={e => this.setState({first_name: e.target.value})} value={first_name} type="text" name="first-name" className="form-control form-control-line" placeholder="Masukan nama" />
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Nama Belakang</label>
//                         <input onChange={e => this.setState({last_name: e.target.value})} value={last_name} type="text" name="last-name" className="form-control form-control-line" placeholder="Masukan nama" />
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Email</label>
//                         <input onChange={e => this.setState({email: e.target.value})} value={email} type="text" name="email" className="form-control form-control-line" placeholder="Masukan email" />
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">No Handphone</label>
//                         <div className="form-row">
//                           <div className="col-3 col-lg-3">
//                             <select className="custom-select-line text-center" onChange={e => this.setState({phone_area: e.target.value})} value={phone_area}>
//                               <option value='+62'>+62</option>
//                             </select>
//                           </div>
//                           <div className="col-9">
//                             <input
//                               onChange={e => {
//                                 if (isNaN(Number(e.target.value)) || e.target.value.split('').length > 16) {
//                                   return
//                                 }
//                                 this.setState({phone_number: e.target.value})
//                               }}
//                               value={phone_number} type="number" name="first-name" className="form-control form-control-line" placeholder="812 3456 7890" maxLength="12" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">PIN</label>
//                         <div className="form-row form-control-pin">
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPin(e.target.value, 1)}
//                               value={pin1}
//                               ref='pin1'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" required/>
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPin(e.target.value, 2)}
//                               value={pin2}
//                               ref='pin2'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPin(e.target.value, 3)}
//                               value={pin3}
//                               ref='pin3'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPin(e.target.value, 4)}
//                               value={pin4}
//                               ref='pin4'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPin(e.target.value, 5)}
//                               value={pin5}
//                               ref='pin5'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPin(e.target.value, 6)}
//                               value={pin6}
//                               ref='pin6'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           {notMatch && <small className="text-danger"><i>ups! PIN tidak sesuai</i></small>}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Konfirmasi PIN</label>
//                         <div className="form-row form-control-pin">
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPinConfirm(e.target.value, 1)}
//                               value={pinConf1}
//                               ref='pinConf1'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPinConfirm(e.target.value, 2)}
//                               value={pinConf2}
//                               ref='pinConf2'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPinConfirm(e.target.value, 3)}
//                               value={pinConf3}
//                               ref='pinConf3'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPinConfirm(e.target.value, 4)}
//                               value={pinConf4}
//                               ref='pinConf4'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPinConfirm(e.target.value, 5)}
//                               value={pinConf5}
//                               ref='pinConf5'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                           <div className="col-2">
//                             <input
//                               onChange={e => this.setPinConfirm(e.target.value, 6)}
//                               value={pinConf6}
//                               ref='pinConf6'
//                               type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="card-header">
//                   <h4 className="text-uppercase mb-0">Data Sales</h4>
//                 </div>
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">No KTP</label>
//                         <input
//                           onChange={e => {
//                             if (isNaN(Number(e.target.value)) || e.target.value.split('').length > 16) {
//                               return
//                             }
//                             this.setState({id_number: e.target.value})
//                           }}
//                           value={id_number} type="number" name="first-name" className="form-control form-control-line" placeholder="Masukan no ktp" maxLength="16" required/>
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Kode Perusahaan</label>
//                         <div className="custom-select-line">
//                           <SelectLineComponent options={company_codes.form} initValue={selectedCompCode}
//                             handleChange={(selectedCompCode) => this.setState({selectedCompCode}) }
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Sales ID</label>
//                         <div className="custom-select-line">
//                           <input onChange={e => this.setState({sales_id: e.target.value})} value={sales_id} type="text" name="sales-id" className="form-control form-control-line" placeholder="Masukan Sales ID" />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Tanggal Lahir</label>
//                         <DatePicker handleChange={dob => this.setState({dob})} value={dob} required/>
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Jenis Kelamin</label>
//                         <div className="custom-select-line">
//                           <SelectLineComponent options={genders.form} initValue={selectedGender}
//                             handleChange={(selectedGender) => this.setState({selectedGender}) }
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="card-header">
//                   <h4 className="text-uppercase mb-0">Data Regional</h4>
//                 </div>
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Provinsi</label>
//                         <div className="custom-select-line">
//                           <SelectLineComponent options={provinces.form} initValue={selectedProvince}
//                             handleChange={(selectedProvince) => {
//                               getCities(selectedProvince.value)
//                               this.setState({selectedProvince, selectedCity: {}})
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group">
//                         <label className="text-uppercase">Kabupaten</label>
//                         <div className="custom-select-line">
//                           <SelectLineComponent options={cities.data} initValue={selectedCity} isDisabled={auth.city_id !== null}
//                             handleChange={(selectedCity) => {
//                               getDistricts(selectedCity.value)
//                               this.setState({selectedCity, selectedDistrict: {}})
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     {/* Dynamic View */}
//                     {
//                       locations.map((location, idx) => {
//                         let district = location.district;

//                         return (
//                           <div className="col-12" key={'district-' + idx}>
//                             <div className="row">
//                               <div className="col-12 col-lg-6">
//                                 <div className="form-group">
//                                   <label className="text-uppercase">Kecamatan {idx + 1}</label>
//                                   <div className="custom-select-line d-flex">
//                                     <SelectLineComponent options={districts.data} initValue={location.district} isDisabled={auth.district_id !== null}
//                                       handleChange={(district) => {
//                                         let newLocations = this.state.locations.map((loc, sidx) => {
//                                           if (idx !== sidx) return loc;
//                                           return { ...loc, district: district };
//                                         });

//                                         getVillages(district.value)
//                                         this.setState({ locations: newLocations })
//                                       }}
//                                     />
//                                     {idx >= 1 &&
//                                       <a href="javascript:void(0)" className="btn btn-link text-danger pr-0" onClick={() => { this.removeDistrict(location)}}>
//                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
//                                         <line x1="18" y1="6" x2="6" y2="18"></line>
//                                         <line x1="6" y1="6" x2="18" y2="18"></line>
//                                       </svg>
//                                       </a>
//                                     }
//                                   </div>
//                                 </div>
//                                 { (locations[locations.length-1] === location) &&
//                                   <div className="form-group">
//                                     <a href="javascript:void(0)" className="btn btn-sm btn-rounded btn-outline-danger d-inline-flex align-items-center pl-3" onClick={this.addDistrict}>
//                                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
//                                         <line x1="12" y1="5" x2="12" y2="19"></line>
//                                         <line x1="5" y1="12" x2="19" y2="12"></line>
//                                       </svg>
//                                       Tambah Kecamatan
//                                     </a>
//                                   </div>
//                                 }
//                               </div>
//                               <div className="col-12 col-lg-6">
//                                 {
//                                   location.village.map((village, idx_v) => {
//                                     let vill = location.village[idx_v];

//                                     return (
//                                       <div className="form-group" key={'village-' + idx_v}>
//                                         <label className="text-uppercase">Kelurahan {idx_v + 1}</label>
//                                         <div className="custom-select-line d-flex">
//                                           <SelectLineComponent options={villages.data} initValue={village}
//                                             handleChange={(village) => {
//                                               let newLocations = this.state.locations.map((loc, sIdx) => {
//                                                 if (idx !== sIdx){
//                                                   return loc;
//                                                 }else{
//                                                   let newVillage = loc.village.map((vill, vIdx) => {
//                                                     if(idx_v === vIdx){
//                                                       return loc.village[idx_v] = village
//                                                     }else{
//                                                       return loc.village[idx_v] = vill
//                                                     }
//                                                   })

//                                                   return { ...loc, district, village: newVillage };
//                                                 }
//                                               });

//                                               this.setState({ locations: newLocations })
//                                             }}
//                                           />
//                                           {idx_v >= 1 &&
//                                             <a href="javascript:void(0)" className="btn btn-link text-danger pr-0" onClick={() => { this.removeVillage(idx_v, idx)}}>
//                                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
//                                               <line x1="18" y1="6" x2="6" y2="18"></line>
//                                               <line x1="6" y1="6" x2="18" y2="18"></line>
//                                             </svg>
//                                             </a>
//                                           }
//                                         </div>
//                                       </div>
//                                     )
//                                   })
//                                 }
//                                 <div className="form-group">
//                                   <a href="javascript:void(0)" className="btn btn-sm btn-rounded btn-outline-danger d-inline-flex align-items-center" onClick={() => { this.addVillage(district, idx)}}>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
//                                       <line x1="12" y1="5" x2="12" y2="19"></line>
//                                       <line x1="5" y1="12" x2="19" y2="12"></line>
//                                     </svg>
//                                     Tambah Kelurahan</a>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })
//                     }
//                     {/* Dynamic View */}
//                     <div className="col-12 mt-4 text-right">
//                       {sales.loading ?
//                         <LoadingSpinner />
//                         :
//                         <button type="submit" disabled={!allFilled} className="btn btn-danger btn-rounded">Simpan</button>
//                       }
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>

//             <div className="card">
//               <div className="card-body text-center text-md-left">
//                 <div className="row">
//                   <div className="col-12 col-lg-8 text-gray">
//                     <h5 className="mb-0">Atur Sales OttoPay</h5>
//                     <small className="mb-0">Lihat daftar sales dan lakukan perubahan data sesuai yang dibutuhkan</small>
//                   </div>
//                   <div className="col-12 col-lg-4 d-flex align-items-center mt-4 mt-lg-0 justify-content-center justify-content-lg-end">
//                     <Link to="/sales/" className="btn btn-rounded btn-danger">Manage Sales</Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-12 col-lg-4 mb-4">
//             <div className="card mb-4">
//               <div className="card-body text-center">
//                 <h4 className="text-uppercase">Daftar sales bulk</h4>
//                 <p className="my-4">Lakukan pendaftaran sales sekaligus banyak, menggunakan file .xls</p>
//                 <form
//                   onSubmit={e => {
//                     e.preventDefault()
//                     if (this.refs.file.files) {
//                       const data = new FormData();
//                       data.append('file', upload[0]);
//                       axios.post('/sales/bulk', data)
//                       .then(data => {
//                         let result = data.data;
//                         if(result.meta.status === false){
//                           this.setState({confirmIsOpen: true, type: 'error', textError: result.meta.message})
//                         }else{
//                           this.setState({confirmIsOpen: true, type: 'success', textSuccess: 'Bulk upload sales sukses'})
//                         }
//                       })
//                       .catch(e => this.setState({confirmIsOpen: true, type: 'error', textSuccess: 'Bulk upload sales gagal'}))
//                     }
//                   }}
//                   >
//                   <div className="upload-area d-flex-column align-items-center">
//                     <input type='file' ref='file' onChange={e => this.setState({upload: e.target.files})} />
//                     <a href="javascript:void(0)" className="d-block pt-4">
//                     {
//                       upload ? (upload[0] ? upload[0].name : "Upload") : "Upload"
//                     }
//                     </a>
//                     <span className="text-gray">or Drag file here</span>
//                   </div>
//                   <button type='submit' className="btn btn-outline-danger btn-rounded">Upload File</button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default connect(
//   ({auth, genders, company_codes, provinces, cities, districts, villages, sales}) => ({ auth, genders, company_codes, provinces, cities, districts, villages, sales }),
//   {createSale, getCities, getDistricts, getVillages}
// )(Register)
