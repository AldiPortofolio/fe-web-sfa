// import React from 'react';
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { createTargetCountry, createTargetProvince, createTargetCity, createTargetDistrict, createTargetVillage } from '../../actions/target'
// import { getCountries } from '../../actions/country'
// import { getProvinces } from '../../actions/province'
// import { getCities } from '../../actions/city'
// import { getDistricts } from '../../actions/district'
// import { getVillages } from '../../actions/village'
// import { NotAuthorize, SelectLineComponent, ModalConfirm } from '../../components'
// import { formatNumber, unformatNumber } from '../../formatter'

// const initValue = {
//   selectedCountry: {},
//   selectedProvince: {},
//   selectedCity: {},
//   selectedDistrict: {},
//   selectedPeriod: {},
//   selectedLevel: {value: "headquarter", label: "Headquarter"},
//   pic: '',
//   target_negara: '',
//   target_provinsi: '',
//   target_kabupaten: '',
//   target_kecamatan: '',
//   target_kelurahan: '',
//   target_1: '',
//   target_2: '',
//   year: {value: 2018, label: 2018},
//   confirmIsOpen: false,
//   type: 'success',
//   textSuccess: '',
//   textError: '',
// }

// const TargetLevels = [
//   {value: "headquarter", label: "Headquarter"},
//   {value: "regional", label: "Regional"},
// ]

// const TargetPeriods = [
//   {value: "tahunan", label: "Tahunan"},
//   {value: "bulanan", label: "Bulanan"},
// ]

// class Set extends React.Component {
//   state = initValue

//   componentWillMount() {
//     // this.getData()

//     this.settedValue(this.props);
//   }

//   componentDidMount(){
//     document.title = "SFA OTTO - Set Target"
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

//   setCollapse = (collapse) => {
//     if (this.state.collapse === collapse) {
//       collapse = ''
//     }
//     this.setState({collapse})
//   }

//   settedValue = (props) => {
//     const { getCities, getDistricts, getVillages } = props
//     const { selectedProvince, selectedCity, selectedDistrict } = this.state
//     const auth = props.auth

//     if(auth.province_id !== null){
//       this.state.selectedProvince = {value: auth.province_id, label: auth.province_name}

//       getCities(auth.province_id)
//     }

//     if(auth.city_id !== null){
//       this.state.selectedCity = {value: auth.city_id, label: auth.city_name}

//       getDistricts(auth.city_id)
//     }

//     if(auth.district_id !== null){
//       this.state.selectedDistrict = {value: auth.district_id, label: auth.district_name}

//       getVillages(auth.district_id)
//     }
//   }

//   render() {
//     const { auth, createTargetCountry, createTargetProvince, createTargetCity, createTargetDistrict, createTargetVillage, getCities, getDistricts, getVillages, countries, cities, provinces, districts, villages } = this.props
//     const {
//       collapse,
//       selectedCountry,
//       selectedProvince,
//       selectedCity,
//       selectedDistrict,
//       selectedPeriod,
//       selectedLevel,
//       pic,
//       target_negara,
//       target_provinsi,
//       target_kecamatan,
//       target_kabupaten,
//       target_kelurahan,
//       target_1,
//       target_2,
//       confirmIsOpen,
//       type,
//       textSuccess,
//       textError,
//       year } = this.state

//     if (auth.role === 'Operator' || (auth.authority["list_all_sales"] === "" || auth.authority["list_all_sales"] === "No Access")) {
//       return <NotAuthorize />
//     }

//     let years = []
//     for (var i = 0; i < 20; i++) {
//       years = years.concat({value: 2018+i, label: 2018+i})
//     }

//     return (
//       <div className="container mb-5">
//         <div className="row">
//           <ModalConfirm
//             confirmIsOpen={confirmIsOpen}
//             type={type}
//             confirmClose={() => this.setState({confirmIsOpen: false})}
//             confirmSuccess={() => this.setState({confirmIsOpen: false})}
//             textSuccess={textSuccess}
//             textError={textError}
//           />

//           <div className="col-12 mb-4">
//             <h2>Set Target</h2>
//           </div>

//           <div className="col-12 col-lg-8 mb-4">
//             <div className="card card-blue mb-4">
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-12 col-lg-7 d-flex align-items-center">
//                     <p className="mb-0">Pilih tingkat yang ingin anda set target</p>
//                   </div>
//                   <div className="col-12 col-lg-5 d-flex justify-content-end">
//                     <SelectLineComponent initValue={selectedLevel} options={TargetLevels} handleChange={(selectedLevel) => {
//                       this.setState({selectedLevel: selectedLevel})
//                     }}></SelectLineComponent>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           { selectedLevel.value === 'regional' &&
//             <div className="col-12 col-lg-8 mb-4">
//               <div className="card mb-4">
//                 <div className="card-body">
//                   <h6>Pilih Regional</h6>
//                   <div className="row mt-4">
//                     <div className="col-12 col-lg-6">
//                       <div className="form-group mb-0">
//                         <label>Regional</label>
//                         <SelectLineComponent></SelectLineComponent>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           }

//           <div className="col-12 col-lg-8 mb-4">
//             <div className="card mb-4">
//               <div className="card-body">
//                 <h6>Pilih Periode</h6>
//                 <div className="row mt-4">
//                   <div className="col-12 col-lg-6">
//                     <div className="form-group mb-0">
//                       <label>Periode</label>
//                       <SelectLineComponent initValue={selectedPeriod} options={TargetPeriods} handleChange={(selectedPeriod) => {
//                         this.setState({selectedPeriod: selectedPeriod})
//                       }}></SelectLineComponent>
//                     </div>
//                   </div>
//                   <div className="col-12 col-lg-6">
//                     <div className="form-group mb-0">
//                       <label>Tahun</label>
//                       <SelectLineComponent></SelectLineComponent>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-12 col-lg-8 mb-4">
//             <div className="card mb-4">
//               <div className="card-body">
//                 <h6>Set Target</h6>
//                 <div className="row mt-4">
//                   <div className="col-12 col-lg-6">
//                     <div className="form-group mb-0">
//                       <label className="d-flex justify-content-between">
//                         Jenis Target 1 (Parameter)
//                         <small className="text-danger">*numerik</small>
//                       </label>
//                       <input onChange={e => this.setState({target_1: e.target.value})} value={target_1} type="text" name="target" className="form-control form-control-line" placeholder="Type nilai target" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="row mt-4">
//                   <div className="col-12 col-lg-6">
//                     <div className="form-group mb-0">
//                       <label className="d-flex justify-content-between">
//                         Jenis Target 2 (Parameter)
//                         <small className="text-danger">*numerik</small>
//                       </label>
//                       <input onChange={e => this.setState({target_2: e.target.value})} value={target_2} type="text" name="target" className="form-control form-control-line" placeholder="Type nilai target" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           { 
//           <div className="col-12 col-lg-8 mb-4">
//             <div className="accordion mb-4" id="target-accordion">
//               {(['IT Admin', 'Manager', 'ASM'].includes(auth.role)) &&
//                 <div className="card mb-4">
//                   <div onClick={() => this.setCollapse('provinsi')} className={`card-header ${(collapse === 'provinsi') ? '' : 'collapsed'}`} data-toggle="collapse">
//                     <h4 className="text-uppercase mb-0">Buat target provinsi</h4>
//                   </div>
//                   <div id="target-provinsi" className={`collapse ${(collapse === 'provinsi') ? 'show' : ''}`} aria-labelledby="target-provinsi" data-parent="#target-accordion">
//                     <div className="card-body">
//                       <form
//                         onSubmit={e => {
//                           e.preventDefault()
//                           if (selectedProvince && target_provinsi && year && pic) {
//                             createTargetProvince({province_id: selectedProvince.value, target: target_provinsi, year: year.value, pic})
//                               .then(data => this.setState({...initValue, confirmIsOpen: true, type: 'success', textSuccess: 'Set Target sukses'}))
//                               .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
//                           }
//                         }}
//                         >
//                         <div className="row">
//                           <div className="col-12 col-lg-6">
//                             <div className="form-group">
//                               <label className="text-uppercase">Provinsi</label>
//                               <div className="custom-select-line">
//                                 <SelectLineComponent options={provinces.form} initValue={selectedProvince} isDisabled={auth.province_id !== null} handleChange={(selectedProvince) => this.setState({selectedProvince, selectedCity: {}})} />
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-12 col-lg-6">
//                             <div className="form-group">
//                               <label className="text-uppercase">Target Provinsi</label>
//                               <input
//                                 onChange={e => {
//                                   let target_provinsi = unformatNumber(e.target.value)
//                                   this.setState({target_provinsi})
//                                 }}
//                                 value={formatNumber(target_provinsi)}
//                                 type="text" className="form-control form-control-line" placeholder="Masukan Target"
//                               />
//                             </div>
//                           </div>
//                           <div className="col-12 col-lg-6">
//                             <div className="form-group">
//                               <label className="text-uppercase">PIC Provinsi</label>
//                               <input value={pic} onChange={e => this.setState({pic: e.target.value})} type="text" className="form-control form-control-line" placeholder="Masukan Nama PIC" />
//                             </div>
//                           </div>
//                           <div className="col-12 col-lg-6">
//                             <div className="form-group">
//                               <label className="text-uppercase">Tahun</label>
//                               <div className="custom-select-line">
//                                 <SelectLineComponent options={years} initValue={year} handleChange={(year) => this.setState({year})} />
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-12 mt-4 text-right">
//                             <button type="submit" className="btn btn-danger btn-rounded">Simpan</button>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               }

//               {(['IT Admin', 'Manager', 'ASM'].includes(auth.role)) &&
//                 <div className="card mb-4">
//                   <div onClick={() => this.setCollapse('kabupaten')} className={`card-header ${(collapse === 'kabupaten') ? '' : 'collapsed'}`} data-toggle="collapse" data-target="#target-kabupaten" aria-expanded="true" aria-controls="target-kabupaten">
//                     <h4 className="text-uppercase mb-0">Buat target kabupaten</h4>
//                   </div>
//                   <div id="target-kabupaten" className={`collapse ${(collapse === 'kabupaten') ? 'show' : ''}`} aria-labelledby="target-kabupaten" data-parent="#target-accordion">
//                     <div className="card-body">
//                       <form
//                         onSubmit={e => {
//                           e.preventDefault()
//                             if (selectedProvince && target_kabupaten && year && selectedCity) {
//                               createTargetCity({province_id: selectedProvince.value, target: target_kabupaten, year: year.value, city_id: selectedCity.value})
//                                 .then(data => this.setState({...initValue, confirmIsOpen: true, type: 'success', textSuccess: 'Set Target sukses'}))
//                                 .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
//                             }
//                         }}
//                         >
//                         <div className="row">
//                           <div className="col-12 col-lg-6">
//                             <div className="form-group">
//                               <label className="text-uppercase">Provinsi</label>
//                               <div className="custom-select-line">
//                                 <SelectLineComponent options={provinces.form} initValue={selectedProvince} isDisabled={auth.province_id !== null}
//                                   handleChange={(selectedProvince) => {
//                                     getCities(selectedProvince.value)
//                                     this.setState({selectedProvince, selectedCity: {}})
//                                   }}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-12 col-lg-6">
//                             <div className="form-group">
//                               <label className="text-uppercase">Kabupaten</label>
//                               <div className="custom-select-line">
//                                 <SelectLineComponent options={cities.data} initValue={selectedCity} isDisabled={auth.city_id !== null}
//                                   handleChange={(selectedCity) => {
//                                     this.setState({selectedCity, selectedDistrict: {}})
//                                   }}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-12 col-lg-6">
//                             <div className="form-group">
//                               <label className="text-uppercase">Tahun</label>
//                               <div className="custom-select-line">
//                                 <SelectLineComponent options={years} initValue={year} handleChange={(year) => this.setState({year})} />
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-12 col-lg-6">
//                             <div className="form-group">
//                               <label className="text-uppercase">Target Kabupaten</label>
//                               <input
//                                 onChange={e => {
//                                   let target_kabupaten = unformatNumber(e.target.value)
//                                   this.setState({target_kabupaten})
//                                 }}
//                                 value={formatNumber(target_kabupaten)}
//                                 className="form-control form-control-line" placeholder="Masukan Target"
//                               />
//                             </div>
//                           </div>
//                           <div className="col-12 mt-4 text-right">
//                             <button type="submit" className="btn btn-danger btn-rounded">Simpan</button>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               }

//               <div className="card mb-4">
//                 <div onClick={() => this.setCollapse('kecamatan')} className={`card-header ${(collapse === 'kecamatan') ? '' : 'collapsed'}`} data-toggle="collapse" data-target="#target-kecamatan" aria-expanded="true" aria-controls="target-kecamatan">
//                   <h4 className="text-uppercase mb-0">Buat target kecamatan</h4>
//                 </div>
//                 <div id="target-kecamatan" className={`collapse ${(collapse === 'kecamatan') ? 'show' : ''}`} aria-labelledby="target-kecamatan" data-parent="#target-accordion">
//                   <div className="card-body">
//                     <form
//                       onSubmit={e => {
//                         e.preventDefault()
//                           if (selectedProvince && target_kecamatan && year && selectedCity && selectedDistrict) {
//                             debugger;
//                             createTargetDistrict({province_id: selectedProvince.value, target: target_kecamatan, year: year.value, city_id: selectedCity.value, district_id: selectedDistrict.value})
//                               .then(data => this.setState({...initValue, confirmIsOpen: true, type: 'success', textSuccess: 'Set Target sukses'}))
//                               .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
//                           }
//                       }}
//                       >
//                       <div className="row">
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Provinsi</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={provinces.form} initValue={selectedProvince} isDisabled={auth.province_id !== null}
//                                 handleChange={(selectedProvince) => {
//                                   getCities(selectedProvince.value)
//                                   this.setState({selectedProvince, selectedCity: {}})
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Kabupaten</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={cities.data} initValue={selectedCity} isDisabled={auth.city_id !== null}
//                                 handleChange={(selectedCity) => {
//                                   getDistricts(selectedCity.value)
//                                   this.setState({selectedCity, selectedDistrict: {}})
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Kecamatan</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={districts.data} initValue={selectedDistrict} isDisabled={auth.district_id !== null}
//                                 handleChange={(selectedDistrict) => {
//                                   this.setState({selectedDistrict, selectedVillage: {}})
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Tahun</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={years} initValue={year} handleChange={(year) => this.setState({year})} />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Target Kecamatan</label>
//                             <input
//                               onChange={e => {
//                                 let target_kecamatan = unformatNumber(e.target.value)
//                                 this.setState({target_kecamatan})
//                               }}
//                               value={formatNumber(target_kecamatan)}
//                               className="form-control form-control-line" placeholder="Masukan Target"
//                             />
//                           </div>
//                         </div>
//                         <div className="col-12 mt-4 text-right">
//                           <button type="submit" className="btn btn-danger btn-rounded">Simpan</button>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>

//               <div className="card mb-4">
//                 <div onClick={() => this.setCollapse('kelurahan')} className={`card-header ${(collapse === 'kelurahan') ? '' : 'collapsed'}`} data-toggle="collapse" data-target="#target-kelurahan" aria-expanded="true" aria-controls="target-kelurahan">
//                   <h4 className="text-uppercase mb-0">Buat target kelurahan</h4>
//                 </div>
//                 <div id="target-kelurahan" className={`collapse ${(collapse === 'kelurahan') ? 'show' : ''}`} aria-labelledby="target-kelurahan" data-parent="#target-accordion">
//                   <div className="card-body">
//                     <form
//                       onSubmit={e => {
//                         e.preventDefault()
//                           if (selectedProvince && target_kelurahan && year && selectedCity && selectedDistrict && selectedVillage) {
//                             createTargetVillage({province_id: selectedProvince.value, target: target_kelurahan, year: year.value, city_id: selectedCity.value, district_id: selectedDistrict.value, village_id: selectedVillage.value})
//                               .then(data => this.setState({...initValue, confirmIsOpen: true, type: 'success', textSuccess: 'Set Target sukses'}))
//                               .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
//                           }
//                       }}
//                       >
//                       <div className="row">
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Provinsi</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={provinces.form} initValue={selectedProvince} isDisabled={auth.province_id !== null}
//                                 handleChange={(selectedProvince) => {
//                                   getCities(selectedProvince.value)
//                                   this.setState({selectedProvince, selectedCity: {}})
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Kabupaten</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={cities.data} initValue={selectedCity} isDisabled={auth.city_id !== null}
//                                 handleChange={(selectedCity) => {
//                                   getDistricts(selectedCity.value)
//                                   this.setState({selectedCity, selectedDistrict: {}})
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Kecamatan</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={districts.data} initValue={selectedDistrict} isDisabled={auth.district_id !== null}
//                                 handleChange={(selectedDistrict) => {
//                                   getVillages(selectedDistrict.value)
//                                   this.setState({selectedDistrict, selectedVillage: {}})
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Kelurahan</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={villages.data} initValue={selectedVillage}
//                                 handleChange={(selectedVillage) => {
//                                   this.setState({selectedVillage})
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Tahun</label>
//                             <div className="custom-select-line">
//                               <SelectLineComponent options={years} initValue={year} handleChange={(year) => this.setState({year})} />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
//                           <div className="form-group">
//                             <label className="text-uppercase">Target Kelurahan</label>
//                             <input
//                               onChange={e => {
//                                 let target_kelurahan = unformatNumber(e.target.value)
//                                 this.setState({target_kelurahan})
//                               }}
//                               value={formatNumber(target_kelurahan)}
//                               className="form-control form-control-line" placeholder="Masukan Target"
//                             />
//                           </div>
//                         </div>
//                         <div className="col-12 mt-4 text-right">
//                           <button type="submit" className="btn btn-danger btn-rounded">Simpan</button>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card">
//               <div className="card-body text-center text-md-left">
//                 <div className="row">
//                   <div className="col-12 col-lg-8 text-gray">
//                     <h5 className="mb-0">Lihat Target yang Telah Dibuat </h5>
//                     <small className="mb-0">Lihat daftar target dan lakukan perubahan data sesuai yang dibutuhkan</small>
//                   </div>
//                   <div className="col-12 col-lg-4 d-flex align-items-center mt-4 mt-lg-0 justify-content-center justify-content-lg-end">
//                     <Link to={`/targets/detail/${selectedCountry.value ? selectedCountry.value : 1}`} className="btn btn-rounded btn-danger">Detail Target</Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//             {(['IT Admin', 'Manager'].includes(auth.role)) &&
//               <div className="col-12 col-lg-4 mb-5">
//                 <div className="card mb-4">
//                   <div className="card-body">
//                     <h4 className="text-uppercase text-center">Buat Target Negara</h4>
//                     <form
//                       className="mt-4"
//                       onSubmit={e => {
//                         e.preventDefault()
//                         if (selectedCountry && target_negara && year) {
//                           createTargetCountry({country_id: selectedCountry.value, target: target_negara, year: year.value})
//                             .then(data => this.setState({...initValue, confirmIsOpen: true, type: 'success', textSuccess: 'Set Target sukses'}))
//                             .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
//                         }
//                       }}
//                       >
//                       <div className="form-group">
//                         <label className="text-uppercase">Negara</label>
//                         <div className="custom-select-line">
//                           <SelectLineComponent options={countries.data} initValue={selectedCountry}
//                             handleChange={(selectedCountry) => {
//                               getProvinces(selectedCountry.value)
//                               this.setState({selectedCountry})
//                             }}
//                           />
//                         </div>
//                       </div>

//                       <div className="form-group">
//                         <label className="text-uppercase">Target Negara</label>
//                         <input
//                           onChange={e => {
//                             let target_negara = unformatNumber(e.target.value)
//                             this.setState({target_negara})
//                           }}
//                           value={formatNumber(target_negara)}
//                           className="form-control form-control-line" placeholder="Masukan Target"
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label className="text-uppercase">Tahun</label>
//                         <div className="custom-select-line">
//                           <SelectLineComponent options={years} initValue={year} handleChange={(year) => this.setState({year})} />
//                         </div>
//                       </div>

//                       <div className="col-12 mt-4 text-center">
//                         <button type="submit" className="btn btn-outline-danger btn-rounded">Simpan</button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             }
//             }
//           </div>
//       </div>
//     );
//   }
// }

// export default connect(
//   ({countries, auth, cities, provinces, districts, villages}) => ({ countries, auth, cities, provinces, districts, villages }),
//   {createTargetCountry, createTargetProvince, createTargetCity, createTargetDistrict, createTargetVillage, getCountries, getCities, getProvinces, getDistricts, getVillages}
// )(Set)
