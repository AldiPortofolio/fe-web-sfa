import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { find, result } from 'lodash'
// import {AsyncTypeahead} from 'react-bootstrap-typeahead'
import {
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { NotAuthorize, SelectComponent, SelectLineComponent, LoadingSpinner, ModalDelete, ModalConfirm } from '../../components'
import { filterCountry, filterProvince, filterCity, filterDistrict, detailTargetVillage, deleteCountry, deleteProvince, deleteCity, deleteDistrict, deleteVillage, editTargetCountry, editTargetProvince, editTargetCity, editTargetDistrict, editTargetVillage } from '../../actions/target'
import { getCities } from '../../actions/city'
import { getDistricts } from '../../actions/district'
import { getVillages } from '../../actions/village'
import { formatNumber, unformatNumber } from '../../formatter'

// class EditCity extends React.Component {
//   state = {
//     selectedProvince: this.props.selectedProvince,
//     selectedCity: this.props.selectedCity,
//     pic: this.props.pic,
//     target_kabupaten: this.props.target_kabupaten,
//     year: this.props.year
//   }

//   componentWillMount() {
//     this.props.getCities(this.state.selectedProvince.value)
//   }

//   render() {
//     const { editTarget, handleClose, provinces, cities, getCities } = this.props
//     const { selectedProvince, selectedCity, pic, target_kabupaten, year } = this.state
//     let years = []
//     for (var i = 0; i < 20; i++) {
//       years = years.concat({value: 2018+i, label: 2018+i})
//     }
//     return (
//       <div className="card">
//         <div>
//           <div className="card-body p-0">
//             <form
//               onSubmit={e => {
//                 e.preventDefault()
//                   if (selectedProvince && target_kabupaten && year && selectedCity) {
//                     alert('api not ready')
//                     // editTarget({province_id: selectedProvince.value, target: target_kabupaten, year: year.value, city_id: selectedCity.value})
//                     //   .then(() => {
//                     //       alert('success')
//                     //       handleClose()
//                     //     })
//                     //   .catch(e => alert('error'))
//                   }
//               }}
//               >
//               <div className="row">
//                 <div className="col-12 col-lg-6">
//                   <div className="form-group">
//                     <label className="text-uppercase">Provinsi</label>
//                     <div className="custom-select-line">
//                       <SelectLineComponent options={provinces.form} initValue={selectedProvince}
//                         handleChange={(selectedProvince) => {
//                           getCities(selectedProvince.value)
//                           this.setState({selectedProvince, selectedCity: {}})
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-12 col-lg-6">
//                   <div className="form-group">
//                     <label className="text-uppercase">Kabupaten</label>
//                     <div className="custom-select-line">
//                       <SelectLineComponent options={cities.data} initValue={selectedCity}
//                         handleChange={(selectedCity) => {
//                           this.setState({selectedCity, selectedDistrict: {}})
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-12 col-lg-6">
//                   <div className="form-group">
//                     <label className="text-uppercase">Tahun</label>
//                     <div className="custom-select-line">
//                       <SelectLineComponent options={years} initValue={year} handleChange={(year) => this.setState({year})} />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-12 col-lg-6">
//                   <div className="form-group">
//                     <label className="text-uppercase">Target Kabupaten</label>
//                     <input
//                       onChange={e => {
//                         let target_kabupaten = unformatNumber(e.target.value)
//                         this.setState({target_kabupaten})
//                       }}
//                       value={formatNumber(target_kabupaten)}
//                       className="form-control form-control-line" placeholder="Masukan Target"
//                     />
//                   </div>
//                 </div>
//                 <div className="col-12 mt-4 text-right">
//                   <button type="submit" className="btn btn-danger btn-rounded">Simpan</button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

class EditTarget extends React.Component {
  state = {
    target: this.props.target,
    year: this.props.year,
    confirmIsOpen: false,
    modalConfirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
  }

  render() {
    const { editTarget, handleClose, id } = this.props
    const { target,
      confirmIsOpen,
      modalConfirmIsOpen,
      type,
      textSuccess,
      textError,
      year } = this.state
    let years = []
    for (var i = 0; i < 20; i++) {
      years = years.concat({value: 2018+i, label: 2018+i})
    }
    return (
      <div className="card">
        <div>
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => handleClose()}
            textSuccess={textSuccess}
            textError={textError}
          />
          <div className="card-body p-0">
            <form
              onSubmit={e => {
                e.preventDefault()
                  if ( target && year) {
                    editTarget(id, {target, year: year.value})
                      .then(data => this.setState({confirmIsOpen: true, type: 'success', textSuccess: 'Edit target sukses'}))
                      .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
                  }
              }}
              >
              <div className="row">
                <div className="col-12 col-lg-6">
                  <div className="form-group">
                    <label className="text-uppercase">Tahun</label>
                    <div className="custom-select-line">
                      <SelectLineComponent options={years} initValue={year} handleChange={(year) => this.setState({year})} />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="form-group">
                    <label className="text-uppercase">Target</label>
                    <input
                      onChange={e => {
                        let target = unformatNumber(e.target.value)
                        this.setState({target})
                      }}
                      value={formatNumber(target)}
                      className="form-control form-control-line" placeholder="Masukan Target"
                    />
                  </div>
                </div>
                <div className="col-12 mt-4 text-right">
                  <button type="submit" className="btn btn-danger btn-rounded">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const initSelect = {
  selectedProvince: {value: '', label: ''},
  selectedCity: {value: '', label: ''},
  selectedDistrict: {value: '', label: ''},
  selectedVillage: {value: '', label: ''},
  openCity: false,
  openDistrict: false,
  openVillage: false,
  searchCity: '',
  searchDistrict: '',
  searchVillage: '',
  citiesMatch: null,
  districtsMatch: null,
  villagesMatch: null,
}

const initState = {
  ...initSelect,
  selectedCountry: {value: '', label: ''},
  year: {value: 2018, label: 2018},
  options: [],
  selectedOptions: [],
  map_country: '',
  map_province: '',
  map_city: '',
  map_district: '',
  map_village: '',
  confirmIsOpen: false,
  modalConfirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
  deleteFunc: null,
  openCity: false,
  openDistrict: false,
  openVillage: false,
  isOpen: false,
  textSuccess: '',
  textError: '',
}

const firstLetter = (word) => {
  let arrayWord = word.split(" ");
  let newWord = arrayWord.join("");

  return newWord.toLowerCase().replace(/^.{1}/g, newWord[0].toUpperCase());
}

class Detail extends React.Component {
  state = initState

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  hide(e, toggle) {
    // if(e && e.relatedTarget){
    //   e.relatedTarget.click();
    // }

    setTimeout(() => {
      let obj = {}
      obj[toggle] = !this.state[toggle]
      this.setState(obj)
    }, 175)
  }

  componentDidMount(){
    document.title = "SFA OTTO - Detail Target"
  }

  componentWillMount() {
    const { filterCountry, match: {params: {id}} } = this.props
    this.initData(this.props)
    this.settedValue(this.props)
    filterCountry(id, {year: this.state.year.value})
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps)
  }

  showMap(query, id_map, toggle, markers) {
    let obj = {}
    var zoomBy = null
    var locations = []
    obj[id_map] = true
    // obj[toggle] = !this.state[toggle]

    if(id_map === 'map_country'){
      zoomBy = 5
    } else if(id_map === 'map_province'){
      zoomBy = 10
    } else if(id_map === 'map_city'){
      zoomBy = 13
    } else {
      zoomBy = 15
    }

    if(markers !== null){
      let x;
      for (x in markers) {
        locations.push(markers[x])
      }
    }

    this.setState(obj, () => {
      let infowindow, map, service, place
      let request = {
        query,
        fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
      }

      map = new window.google.maps.Map(document.getElementById(id_map), {
        center: {lat: -6.226996, lng: 106.819894},
        zoom: zoomBy,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER
        },
        scrollwheel: false,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: 'roadmap',
      });

      infowindow = new window.google.maps.InfoWindow();
      service = new window.google.maps.places.PlacesService(map);

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            place = {
              name: results[i].name,
              photo: typeof results[i].photos !== 'undefined'
                ? results[i].photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
                : '',
              loc: results[i].geometry.location,
              rating: results[i].rating,
            }

            if(locations === []){
              let contentString = `
                <div>
                  <p><strong>${place.name}</strong></p>
                  <img src=${place.photo} />
                </div>
              `

              let marker = new window.google.maps.Marker({
                map: map,
                position: place.loc
              });

              marker.addListener('click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
              });
            }else{
              let marker, i;

              for (i = 0; i < locations.length; i++) {
                let contentString = `
                  <div>
                    <p><strong>${locations[i].MerchantName}</strong></p>
                  </div>
                `

                marker = new window.google.maps.Marker({
                  position: new window.google.maps.LatLng(locations[i].Latitude, locations[i].Longitude),
                  map: map
                });

                window.google.maps.event.addListener(marker, 'click', (function(marker, i) {
                  return function() {
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                  }
                })(marker, i));

                marker.setMap(map);
              }
            }
          }
          map.setCenter(place.loc)
        }
      })
    })
  }

  hideMap(id_map) {
    let obj = {}
    obj[id_map] = false
    this.setState(obj);
  }

  hideChildren(category){
    if(category === 'province'){
      this.setState({
        openCity: false,
        openDistrict: false,
        map_province: false,
        map_city: false,
        map_district: false,
      });
    }else if(category === 'city'){
      this.setState({
        openDistrict: false,
        map_city: false,
        map_district: false,
      });
    }else if(category === 'district'){
      this.setState({
        openDistrict: false,
        map_district: false,
      });
    }
  }

  initData(props) {
    const { filterProvince, filterCity, countries, provinces, cities, targets, handleClose, match: {params: {id}} } = props
    const { filter_country, filter_province, filter_city, filter_district } = targets
    const { selectedProvince, selectedCity } = this.state
    let obj = {}

    if (!countries.loading) {
      let value = Number(id)
      obj.selectedCountry = find(countries.data, {value})
    }
    if (!provinces.loading) {
      if (!selectedProvince.value && selectedProvince.value !== 0) {
        let finder = (props.auth.province_id !== null ? {value: props.auth.province_id} : {label: "Dki Jakarta"} )

        obj.selectedProvince = find(provinces.data, finder)
        filterProvince({province_id: obj.selectedProvince.value, year: this.state.year.value})
      }
    }

    // debugger;
    this.setState(obj)
  }

  settedValue = (props) => {
    const { filterProvince, filterCity, filterDistrict, countries, provinces, cities, targets, match: {params: {id}} } = props
    const { filter_country, filter_province, filter_city, filter_district } = targets
    const auth = props.auth
    let obj = {}

    if(auth.province_id){
      obj.selectedProvince = find(provinces.data, auth.province_id)

      this.setState({openCity: true})
    }

    if(auth.city_id){
      this.state.selectedCity = {value: auth.city_id, label: auth.city_name}
      
      filterCity(auth.city_id, filter_province.year)

      this.setState({openCity: true})
    }

    // if(auth.district_id){
    //   this.state.selectedDistrict = {value: auth.district_id, label: auth.district_name}
      
    //   filterDistrict(auth.district_id, filter_province.year)
    // }
  }

  render() {
    const { auth,
      countries,
      provinces,
      targets,
      filterCountry,
      filterProvince,
      filterCity,
      filterDistrict,
      detailTargetVillage,
      deleteCountry,
      deleteProvince,
      deleteCity,
      deleteDistrict,
      deleteVillage,
      editTargetCountry,
      editTargetProvince,
      editTargetCity,
      editTargetDistrict,
      editTargetVillage } = this.props

    if (auth.role === 'Operator') {
      return <NotAuthorize />
    }

    if (targets.invalid_token) {
      return <h1>Invalid token</h1>
    }

    const { filter_country, filter_province, filter_city, filter_district } = targets
    let cities = result(filter_province, 'cities', [])
    let districts = result(filter_city, 'districts', [])
    let villages = result(filter_district, 'villages', [])
    const { editing,
      isOpen,
      openCity,
      openDistrict,
      id,
      confirmIsOpen,
      modalConfirmIsOpen,
      resultIsOpen,
      type,
      deleteFunc,
      year,
      selectedCountry,
      selectedProvince,
      selectedCity,
      map_country,
      map_province,
      map_city,
      map_district,
      map_village,
      searchCity,
      searchDistrict,
      searchVillage,
      citiesMatch,
      districtsMatch,
      villagesMatch,
      textSuccess,
      textError } = this.state
    let years = []
    for (var i = 0; i < 20; i++) {
      years = years.concat({value: 2018+i, label: 2018+i})
    }

    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({confirmIsOpen: false}, () => {
                deleteFunc(id)
                  .then((data) => this.setState({ ...initState, resultIsOpen: true}, () => filterProvince(selectedProvince.value)))
                  .catch(e => this.setState({ ...initState, resultIsOpen: true, type: 'error'}))
              })
            }}
          />
          <ModalConfirm
            confirmIsOpen={modalConfirmIsOpen}
            type={type}
            confirmClose={() => this.setState({modalConfirmIsOpen: false})}
            confirmSuccess={() => this.setState({modalConfirmIsOpen: false})}
            textSuccess={textSuccess}
            textError={textError}
          />

          <Modal className="modal-card" isOpen={isOpen} toggle={() => this.setState({isOpen: !isOpen})}>
            <ModalHeader toggle={() => this.setState({isOpen: !isOpen})}>Edit {editing}</ModalHeader>
            <ModalBody>
              <EditTarget
                {...this.state}
                handleClose={() => this.setState({...initSelect, selectedProvince, isOpen: !isOpen}, () => {
                  filterCountry(selectedCountry.value, {year: this.state.year.value})
                  filterProvince(selectedProvince.value, {year: this.state.year.value})
                })}
              />
            </ModalBody>
          </Modal>

          <div className="col-12">
            <div className="row d-flex justify-content-end">
              <div className="col-lg-8 d-flex justify-content-between">
              <div className="d-flex">
                <div className="form-group d-flex align-items-center mr-3">
                  <small className="text-gray mr-2">Provinsi</small>
                  <div style={{zIndex: '100'}}>
                    <SelectComponent options={provinces.form} initValue={selectedProvince} isDisabled={auth.province_id !== null}
                      handleChange={(selectedProvince) => this.setState({...initSelect, selectedProvince}, () => {
                        filterProvince({province_id: selectedProvince.value, year: this.state.year.value}).catch(e => this.setState({modalConfirmIsOpen: true, type: 'error', textError: e.message}))
                        this.hideChildren('province')
                      }) }
                    />
                  </div>
                </div>
                <div className="form-group d-flex align-items-center">
                  <small className="text-gray mr-2">Tahun</small>
                  <div style={{zIndex: '100'}}>
                    <SelectComponent options={years} initValue={year}
                      handleChange={(year) => this.setState({...initSelect, selectedProvince, year}, () => {
                        filterCountry(selectedCountry.value, {year: year.value}).catch(e => this.setState({modalConfirmIsOpen: true, type: 'error', textError: e.message}))
                        filterProvince({province_id: selectedProvince.value, year: year.value}).catch(e => this.setState({modalConfirmIsOpen: true, type: 'error', textError: e.message}))
                      })}
                    />
                  </div>
                </div>
              </div>
              <nav className="d-flex justify-content-end" aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Detail Target</li>
                </ol>
              </nav>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 mb-4">
          {(['IT Admin'].includes(auth.role)) &&
            <div>
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="text-uppercase text-center">Target Negara</h4>
                <div className="form-row">
                  <div className="col-6 my-3">
                    <SelectComponent options={countries.data} initValue={selectedCountry}
                      handleChange={(selectedCountry) => this.setState({selectedCountry}, () =>{ 
                        filterCountry(selectedCountry.value, {year: year.value})
                        filterProvince({province_id: selectedProvince.value, year: year.value})
                      })}
                    />
                  </div>
                  <div className="col-6 my-3">
                    <SelectComponent options={years} initValue={year}
                      handleChange={(year) => this.setState({year}, () => {
                        filterCountry(selectedCountry.value, {year: year.value}).catch(e => this.setState({modalConfirmIsOpen: true, type: 'error', textError: e.message}))
                        filterProvince({province_id: selectedProvince.value, year: year.value}).catch(e => this.setState({modalConfirmIsOpen: true, type: 'error', textError: e.message}))
                      })}
                    />
                  </div>
                  {targets.loading_country ?
                    <LoadingSpinner />
                    :
                    <div className="row">
                      <div className="col-6 d-flex flex-row justify-content-between">
                        <div>
                          <label className="mb-0"><small>Target</small></label>
                          <h5 className="text-warning">{formatNumber(filter_country.target)}</h5>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="dropdown ml-2">
                            <button
                              onClick={() => this.toggleDropdown(`show${filter_country.country_id}`)}
                              onBlur={(event) => this.hide(event,`show${filter_country.country_id}`)}
                              className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                            </button>
                            <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${filter_country.country_id}`] ? 'show' : ''}`}
                              aria-labelledby="dropdownMenuButton">
                              <span style={{cursor: 'pointer'}} onClick={() => this.showMap(filter_country.country_name, 'map_country', `show${filter_country.country_id}`, null)} className="dropdown-item">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                Map
                              </span>
                              <span style={{cursor: 'pointer'}}
                                onClick={() => {
                                  let obj = {isOpen: true, editTarget: editTargetCountry, editing: filter_country.country_name, id: filter_country.id, target: filter_country.target}
                                  this.setState(obj)
                                }}
                                className="dropdown-item">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                Ubah
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <label className="mb-0"><small>Aktual</small></label>
                        <h5 className="text-warning">{formatNumber(filter_country.total_acquisition)}</h5>
                      </div>
                      <div className="col-6">
                        <label className="mb-0"><small>Pencapaian</small></label>
                        <h5 className="text-warning">{parseFloat((filter_country.total_acquisition / filter_country.target) * 100).toFixed(2)} %</h5>
                      </div>
                      <div className="col-6">
                        <label className="mb-0"><small>Approved</small></label>
                        <h5 className="text-warning">{formatNumber(filter_country.verified)}</h5>
                      </div>
                      <div className="col-6">
                        <label className="mb-0"><small>Approve dengan catatan</small></label>
                        <h5 className="text-warning">-</h5>
                      </div>
                      <div className="col-6">
                        <label className="mb-0"><small>Rejected</small></label>
                        <h5 className="text-warning">{formatNumber(filter_country.standard)}</h5>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <h4 className="text-uppercase">Set Target</h4>
                <p className="text-gray mt-3 mb-4">Buat target baru untuk tahun depan.</p>
                <Link to="/targets/set-target" className="btn btn-rounded btn-outline-danger">Set Target</Link>
              </div>
            </div>
            </div>
          }
          </div>
          <div className="col-12 col-lg-8 mb-4">
            {map_country &&
              <div className="card-border">
                <div style={{width: '100%', height: '500px'}} id="map_country" className="maps-border"></div>
                <span className="close-map" onClick={() => this.hideMap('map_country')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
              </div>
            }
            {!targets.loading_province ?
              (
                ((['IT Admin', 'ASM', 'Manager'].includes(auth.role)) && filter_province) ?
                  <div className="province-box">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h4 className="text-uppercase mb-0">Target {filter_province.province_name} {filter_province.year}</h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="px-3 small-info bg-soft-warning d-flex justify-content-between">
                            <div className="mr-2">
                              <label className="mb-0">PIC</label>
                              <p className="mb-0 text-warning">{filter_province.pic || 'N/A'}</p>
                            </div>
                            <div className="mr-2">
                              <label className="mb-0">Target</label>
                              <p className="mb-0 text-warning">{formatNumber(filter_province.target || 0)}</p>
                            </div>
                            <div className="mr-2">
                              <label className="mb-0">Aktual</label>
                              <p className="mb-0 text-warning">{formatNumber(filter_province.total_acquisition || 0)}</p>
                            </div>
                            <div className="mr-2">
                              <label className="mb-0">Pencapaian</label>
                              <p className="mb-0 text-warning">{parseFloat(filter_province.total_acquisition / filter_province.target * 100).toFixed(2)} %</p>
                            </div>
                            <div className="mr-2">
                              <label className="mb-0">Approved</label>
                              <p className="mb-0 text-warning">{formatNumber(filter_province.verified)}</p>
                            </div>
                            <div className="mr-2">
                              <label className="mb-0">Approve dengan catatan</label>
                              <p className="mb-0 text-warning">-</p>
                            </div>
                            <div className="mr-2">
                              <label className="mb-0">Rejected</label>
                                <p className="mb-0 text-warning">{formatNumber(filter_province.standard)}</p>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="dropdown ml-2">
                                <button
                                  onClick={() => this.toggleDropdown(`show${filter_province.province_id}`)}
                                  onBlur={(event) => this.hide(event,`show${filter_province.province_id}`)}
                                  className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                </button>
                                <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${filter_province.province_id}`] ? 'show' : ''}`}
                                  aria-labelledby="dropdownMenuButton">
                                  <span style={{cursor: 'pointer'}} onClick={() => this.showMap(filter_province.province_name, 'map_province', `show${filter_province.province_id}`, null)} className="dropdown-item">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    Map
                                  </span>
                                  <span style={{cursor: 'pointer'}}
                                    onClick={() => this.setState({isOpen: true, editTarget: editTargetProvince, editing: filter_province.province_name, id: filter_province.id, target: filter_province.target})}
                                    className="dropdown-item">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                    Ubah
                                  </span>
                                  <span style={{cursor: 'pointer'}}
                                    onClick={() => this.setState({id: filter_province.id, confirmIsOpen: true, deleteFunc: deleteProvince})}
                                    className="dropdown-item">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    Hapus
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-12">
                          <form className="form-row form-inline my-3 d-flex justify-content-end">
                            <div className="form-group col-6 col-md-5 col-lg-4">
                              <input type="text" className="form-control form-control-line w-100" placeholder="Search"
                                onChange={({target: {value}}) => {
                                  if (cities.length > 0) {
                                    let citiesMatch = cities.filter(v => v.city_name.toLowerCase().includes(value.toLowerCase()));
                                    this.setState({searchCity: value, citiesMatch})
                                  }
                                }}
                                value={searchCity}
                                />
                            </div>
                          </form>
                        </div>
                        <div className="col-12 col-lg-12 text-center pb-3">
                          <div className="table-fixed">
                            <table className="table table-header">
                              <thead>
                                <tr>
                                  <th width="20%">Kota</th>
                                  <th width="10%">Target</th>
                                  <th width="10%">Aktual</th>
                                  <th width="10%">Pencapaian (%)</th>
                                  <th width="10%">Approved</th>
                                  <th width="20%">Approve with notes</th>
                                  <th width="10%">Rejected</th>
                                </tr>
                              </thead>
                            </table>
                            <div className="table-body">
                              <table className="table mb-5">
                                <thead>
                                  <tr>
                                    <th width="20%">Kota</th>
                                    <th width="10%">Target</th>
                                    <th width="10%">Aktual</th>
                                    <th width="10%">Pencapaian (%)</th>
                                    <th width="10%">Approved</th>
                                    <th width="20%">Approve with notes</th>
                                    <th width="10%">Rejected</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {citiesMatch ?
                                    (
                                      citiesMatch.length > 0 ?
                                        citiesMatch.map(c => (
                                          <tr key={c.city_id}>
                                            <td style={{cursor: 'pointer'}}
                                              onClick={() => {
                                                filterCity(c.city_id, filter_province.year)
                                                  .then((data) => this.setState({openCity: true}))
                                                this.hideChildren('city')
                                              }}
                                              >
                                              {c.city_name}
                                            </td>
                                            <td>{formatNumber(c.target)}</td>
                                            <td>{formatNumber(c.total_acquisition)}</td>
                                            <td>{parseFloat(c.total_acquisition / c.target * 100).toFixed(2)} %</td>
                                            <td>{formatNumber(c.verified)}</td>
                                            <td>-</td>
                                            <td className="d-flex align-items-center">
                                              <span>{c.standard}</span>
                                              <div className="dropdown ml-2">
                                                <button
                                                  onClick={() => this.toggleDropdown(`show${c.city_id}`)}
                                                  onBlur={(event) => this.hide(event,`show${c.city_id}`)}
                                                  className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                                </button>
                                                <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${c.city_id}`] ? 'show' : ''}`}
                                                  aria-labelledby="dropdownMenuButton">
                                                  <span style={{cursor: 'pointer'}} onClick={() => this.showMap(c.city_name, 'map_city', `show${c.city_id}`, null)} className="dropdown-item">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                    Map
                                                  </span>
                                                  <span style={{cursor: 'pointer'}}
                                                    onClick={() => this.setState({isOpen: true, editTarget: editTargetCity, editing: c.city_name, id: c.id, target: c.target})}
                                                    className="dropdown-item">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                                    Ubah
                                                  </span>
                                                  <span style={{cursor: 'pointer'}}
                                                    onClick={() => this.setState({id: c.id, confirmIsOpen: true, deleteFunc: deleteCity})}
                                                    className="dropdown-item">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    Hapus
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        ))
                                        :
                                        <tr width='100%'><td colSpan={7} className="text-center">No data</td></tr>
                                    )
                                    :
                                    (
                                      cities.length > 0 ?
                                        cities.map(c => (
                                          <tr key={c.city_id}>
                                            <td style={{cursor: 'pointer'}}
                                              onClick={() => {
                                                filterCity(c.city_id, filter_province.year)
                                                  .then((data) => this.setState({openCity: true}))
                                                this.hideChildren('city')
                                              }}
                                              >
                                              {c.city_name}
                                            </td>
                                            <td>{formatNumber(c.target)}</td>
                                            <td>{formatNumber(c.total_acquisition)}</td>
                                            <td>{parseFloat(c.total_acquisition / c.target * 100).toFixed(2)} %</td>
                                            <td>{formatNumber(c.verified)}</td>
                                            <td>-</td>
                                            <td className="d-flex align-items-center">
                                              <span>{c.standard}</span>
                                              <div className="dropdown ml-2">
                                                <button
                                                  onClick={() => this.toggleDropdown(`show${c.city_id}`)}
                                                  onBlur={(event) => this.hide(event,`show${c.city_id}`)}
                                                  className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                                </button>
                                                <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${c.city_id}`] ? 'show' : ''}`}
                                                  aria-labelledby="dropdownMenuButton">
                                                  <span style={{cursor: 'pointer'}} onClick={() => this.showMap((c.city_name + " " + filter_province.province_name), 'map_city', `show${c.city_id}`, null)} className="dropdown-item">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                    Map
                                                  </span>
                                                  <span style={{cursor: 'pointer'}}
                                                    onClick={() => this.setState({isOpen: true, editTarget: editTargetCity, editing: c.city_name, id: c.id, target: c.target})}
                                                    className="dropdown-item">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                                    Ubah
                                                  </span>
                                                  <span style={{cursor: 'pointer'}}
                                                    onClick={() => this.setState({id: c.id, confirmIsOpen: true, deleteFunc: deleteCity})}
                                                    className="dropdown-item">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    Hapus
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        ))
                                        :
                                        <tr width='100%'><td colSpan={7}>No data</td></tr>
                                    )
                                  }
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  :
                  <div className={"card mb-4 " + (auth.role === "TL" ? "d-none" : " ")}>
                    <div className="card-header">
                      <h4 className="text-uppercase mb-0">No Target</h4>
                    </div>
                  </div>
              )
              :
              <LoadingSpinner />
            }
            {map_province &&
              <div className="card-border">
                <div style={{width: '100%', height: '500px'}} id="map_province" className="maps-border"></div>
                <span className="close-map" onClick={() => this.hideMap('map_province')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
              </div>
            }
            {map_city &&
              <div className="card-border">
                <div style={{width: '100%', height: '500px'}} id="map_city" className="maps-border"></div>
                <span className="close-map" onClick={() => this.hideMap('map_city')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
              </div>
            }
            {(openCity && (['IT Admin', 'ASM', 'Manager', 'TL'].includes(auth.role))) &&
              <div className="card-city">
              <div className="card mb-4">
                <div className="card-header">
                  <h4 className="text-uppercase mb-0">Target {filter_city.city_name} {filter_city.year}</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 pl-5">
                      <div className="px-3 ml-5 small-info bg-soft-warning d-flex justify-content-between">
                        <div className="mr-2">
                          <label className="mb-0">Target</label>
                          <p className="mb-0 text-warning">{formatNumber(filter_city.target || 0)}</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Aktual</label>
                          <p className="mb-0 text-warning">{formatNumber(filter_city.total_acquisition || 0)}</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Pencapaian</label>
                          <p className="mb-0 text-warning">{parseFloat(filter_city.total_acquisition / filter_city.target * 100).toFixed(2)} %</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Approved</label>
                          <p className="mb-0 text-warning">{formatNumber(filter_city.verified)}</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Approve dengan catatan</label>
                          <p className="mb-0 text-warning">-</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Rejected</label>
                            <p className="mb-0 text-warning">{formatNumber(filter_city.standard)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-12">
                      <form className="form-row form-inline my-3 d-flex justify-content-end">
                        <div className="form-group col-6 col-md-5 col-lg-4">
                          <input type="text" className="form-control form-control-line w-100" placeholder="Search"
                            onChange={({target: {value}}) => {
                              if (districts.length > 0) {
                                let districtsMatch = districts.filter(v => v.district_name.toLowerCase().includes(value.toLowerCase()));
                                this.setState({searchDistrict: value, districtsMatch})
                              }
                            }}
                            value={searchDistrict}
                          />
                        </div>
                      </form>
                    </div>
                    <div className="col-12 col-lg-12 text-center pb-3">
                      <div className="table-fixed">
                        <table className="table table-header">
                          <thead>
                            <tr>
                              <th width="20%">Kecamatan</th>
                              <th width="10%">Target</th>
                              <th width="10%">Aktual</th>
                              <th width="10%">Pencapaian (%)</th>
                              <th width="10%">Approved</th>
                              <th width="20%">Approve with notes</th>
                              <th width="10%">Rejected</th>
                            </tr>
                          </thead>
                        </table>
                        <div className="table-body">
                          <table className="table mb-5">
                            <thead>
                              <tr>
                                <th width="20%">Kecamatan</th>
                                <th width="10%">Target</th>
                                <th width="10%">Aktual</th>
                                <th width="10%">Pencapaian (%)</th>
                                <th width="10%">Approved</th>
                                <th width="20%">Approve with notes</th>
                                <th width="10%">Rejected</th>
                              </tr>
                            </thead>
                            <tbody>
                              {districtsMatch ?
                                (
                                  districtsMatch.length > 0 ?
                                    districtsMatch.map(c => (
                                      <tr key={c.district_id} className={(auth.district_id !== null && auth.district_id === c.district_id) ? true : false}>
                                        <td style={{cursor: 'pointer'}}
                                          onClick={() => {
                                            filterDistrict(c.district_id, filter_province.year)
                                              .then((data) => this.setState({openDistrict: true}))
                                            this.hideChildren('district')
                                          }}
                                          >
                                          {c.district_name}
                                        </td>
                                        <td>{formatNumber(c.target)}</td>
                                        <td>{formatNumber(c.total_acquisition)}</td>
                                        <td>{parseFloat(c.total_acquisition / c.target * 100).toFixed(2)} %</td>
                                        <td>{formatNumber(c.verified)}</td>
                                        <td>-</td>
                                        <td className="d-flex align-items-center">
                                          <span>{c.standard}</span>
                                          <div className="dropdown ml-2">
                                            <button
                                              onClick={() => this.toggleDropdown(`district${c.district_id}`)}
                                              onBlur={(event) => this.hide(event,`district${c.district_id}`)}
                                              className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                            </button>
                                            <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`district${c.district_id}`] ? 'show' : ''}`}
                                              aria-labelledby="dropdownMenuButton">
                                              <span style={{cursor: 'pointer'}} onClick={() => this.showMap((c.district_name + " " + filter_city.city_name), 'map_district', `district${c.district_id}`, null)} className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                Map
                                              </span>
                                              <span style={{cursor: 'pointer'}}
                                                onClick={() => this.setState({isOpen: true, editTarget: editTargetDistrict, editing: c.district_name, id: c.id, target: c.target})}
                                                className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                                Ubah
                                              </span>
                                              <span style={{cursor: 'pointer'}}
                                                onClick={() => this.setState({id: c.id, confirmIsOpen: true, deleteFunc: deleteDistrict})}
                                                className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                Hapus
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                    :
                                    <tr width='100%'><td colSpan={7}>No data</td></tr>
                                )
                                :
                                (
                                  districts.length > 0 ?
                                    districts.map(c => (
                                      <tr key={c.district_id} className={auth.district_id !== null ? (auth.district_id === c.district_id ? " " : "d-none") : ""}>
                                        <td style={{cursor: 'pointer'}}
                                          onClick={() => {
                                            filterDistrict(c.district_id, filter_province.year)
                                              .then((data) => this.setState({openDistrict: true}))
                                            this.hideChildren('district')
                                          }}
                                          >
                                          {c.district_name}
                                        </td>
                                        <td>{formatNumber(c.target)}</td>
                                        <td>{formatNumber(c.total_acquisition)}</td>
                                        <td>{parseFloat(c.total_acquisition / c.target * 100).toFixed(2)}%</td>
                                        <td>{formatNumber(c.verified)}</td>
                                        <td>-</td>
                                        <td className="d-flex align-items-center">
                                          <span>{c.standard}</span>
                                          <div className="dropdown ml-2">
                                            <button
                                              onClick={() => this.toggleDropdown(`district${c.district_id}`)}
                                              onBlur={(event) => this.hide(event,`district${c.district_id}`)}
                                              className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                            </button>
                                            <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`district${c.district_id}`] ? 'show' : ''}`}
                                              aria-labelledby="dropdownMenuButton">
                                              <span style={{cursor: 'pointer'}} onClick={() => this.showMap((c.district_name + " " + filter_city.city_name), 'map_district', `district${c.district_id}`, null)} className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                Map
                                              </span>
                                              <span style={{cursor: 'pointer'}}
                                                onClick={() => this.setState({isOpen: true, editTarget: editTargetDistrict, editing: c.district_name, id: c.id, target: c.target})}
                                                className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                                Ubah
                                              </span>
                                              <span style={{cursor: 'pointer'}}
                                                onClick={() => this.setState({id: c.id, confirmIsOpen: true, deleteFunc: deleteDistrict})}
                                                className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                Hapus
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                    :
                                    <tr width='100%'><td colSpan={7}>No data</td></tr>
                                )
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {map_district &&
                <div className="card-border">
                  <div style={{width: '100%', height: '500px'}} id="map_district" className="maps-border"></div>
                  <span className="close-map" onClick={() => this.hideMap('map_district')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
                </div>
              }
              </div>
            }
            {openDistrict &&
              <div className="card-distrinct">
              <div className="card mb-4">
                <div className="card-header">
                  <h4 className="text-uppercase mb-0">Target {filter_district.district_name} {filter_district.year}</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 pl-5">
                      <div className="px-3 ml-5 small-info bg-soft-warning d-flex justify-content-between">
                        <div className="mr-2">
                          <label className="mb-0">Target</label>
                          <p className="mb-0 text-warning">{formatNumber(filter_district.target || 0)}</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Aktual</label>
                          <p className="mb-0 text-warning">{formatNumber(filter_district.total_acquisition || 0)}</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Pencapaian</label>
                          <p className="mb-0 text-warning">{parseFloat(filter_district.total_acquisition / filter_district.target * 100).toFixed(2)} %</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Approved</label>
                          <p className="mb-0 text-warning">{formatNumber(filter_district.verified)}</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Approve dengan catatan</label>
                          <p className="mb-0 text-warning">-</p>
                        </div>
                        <div className="mr-2">
                          <label className="mb-0">Rejected</label>
                            <p className="mb-0 text-warning">{formatNumber(filter_district.standard)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-12">
                      <form className="form-row form-inline my-3 d-flex justify-content-end">
                        <div className="form-group col-6 col-md-5 col-lg-4">
                          <input type="text" className="form-control form-control-line w-100" placeholder="Search"
                            onChange={({target: {value}}) => {
                              if (villages.length > 0) {
                                let villagesMatch = villages.filter(v => v.village_name.toLowerCase().includes(value.toLowerCase()));
                                this.setState({searchVillage: value, villagesMatch})
                              }
                            }}
                            value={searchVillage}
                          />
                        </div>
                      </form>
                    </div>
                    <div className="col-12 col-lg-12 text-center pb-3">
                      <div className="table-fixed">
                        <table className="table table-header">
                          <thead>
                            <tr>
                              <th width="20%">Kelurahan</th>
                              <th width="10%">Target</th>
                              <th width="10%">Aktual</th>
                              <th width="10%">Pencapaian (%)</th>
                              <th width="10%">Approved</th>
                              <th width="20%">Approve with notes</th>
                              <th width="10%">Rejected</th>
                            </tr>
                          </thead>
                        </table>
                        <div className="table-body">
                          <table className="table mb-5">
                            <thead>
                              <tr>
                                <th width="20%">Kelurahan</th>
                                <th width="10%">Target</th>
                                <th width="10%">Aktual</th>
                                <th width="10%">Pencapaian (%)</th>
                                <th width="10%">Approved</th>
                                <th width="20%">Approve with notes</th>
                                <th width="10%">Rejected</th>
                              </tr>
                            </thead>
                            <tbody>
                              {villagesMatch ?
                                (
                                  villagesMatch.length > 0 ?
                                    villagesMatch.map(c => (
                                      <tr key={c.village_id}>
                                        <td>
                                          {c.village_name}
                                        </td>
                                        <td>{formatNumber(c.target)}</td>
                                        <td>{formatNumber(c.total_acquisition)}</td>
                                        <td>{parseFloat(c.total_acquisition / c.target * 100).toFixed(2)}%</td>
                                        <td>{formatNumber(c.verified)}</td>
                                        <td>-</td>
                                        <td className="d-flex align-items-center">
                                          <span>{c.standard}</span>
                                          <div className="dropdown ml-2">
                                            <button
                                              onClick={() => this.toggleDropdown(`village${c.village_id}`)}
                                              onBlur={(event) => this.hide(event,`village${c.village_id}`)}
                                              className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                            </button>
                                            <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`village${c.village_id}`] ? 'show' : ''}`}
                                              aria-labelledby="dropdownMenuButton">
                                              <span style={{cursor: 'pointer'}} className="dropdown-item" onClick={() => {
                                                detailTargetVillage(c.village_id, {village: firstLetter(c.village_name), year: this.state.year.value})
                                                .then((data) => this.showMap(c.village_name, 'map_village', `village${c.village_id}`, data.data))
                                                }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                Map
                                              </span>
                                              <span style={{cursor: 'pointer'}}
                                                onClick={() => this.setState({isOpen: true, editTarget: editTargetVillage, editing: c.village_name, id: c.id, target: c.target})}
                                                className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                                Ubah
                                              </span>
                                              <span style={{cursor: 'pointer'}}
                                                onClick={() => this.setState({id: c.id, confirmIsOpen: true, deleteFunc: deleteVillage})}
                                                className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                Hapus
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                    :
                                    <tr width='100%'><td colSpan={7}>No data</td></tr>
                                )
                                :
                                (
                                  villages.length > 0 ?
                                    villages.map(c => (
                                      <tr key={c.village_id}>
                                        <td>
                                          {c.village_name}
                                        </td>
                                        <td>{formatNumber(c.target)}</td>
                                        <td>{formatNumber(c.total_acquisition)}</td>
                                        <td>{parseFloat(c.total_acquisition / c.target * 100).toFixed(2)}%</td>
                                        <td>{formatNumber(c.verified)}</td>
                                        <td>-</td>
                                        <td className="d-flex align-items-center">
                                          <span>{c.standard}</span>
                                          <div className="dropdown ml-2">
                                            <button
                                              onClick={() => this.toggleDropdown(`village${c.village_id}`)}
                                              onBlur={(event) => this.hide(event,`village${c.village_id}`)}
                                              className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                            </button>
                                            <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`village${c.village_id}`] ? 'show' : ''}`}
                                              aria-labelledby="dropdownMenuButton">
                                              <span style={{cursor: 'pointer'}} className="dropdown-item" onClick={() => {
                                                detailTargetVillage(c.village_id, {village: firstLetter(c.village_name), year: this.state.year.value})
                                                .then((data) => this.showMap((c.village_name + " " + filter_district.district_name), 'map_village', `village${c.village_id}`, data.data))
                                                }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                Map
                                              </span>
                                              <span style={{cursor: 'pointer'}}
                                                onClick={() => this.setState({isOpen: true, editTarget: editTargetVillage, editing: c.village_name, id: c.id, target: c.target})}
                                                className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                                Ubah
                                              </span>
                                              <span style={{cursor: 'pointer'}}
                                                onClick={() => this.setState({id: c.id, confirmIsOpen: true, deleteFunc: deleteVillage})}
                                                className="dropdown-item">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                Hapus
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                    :
                                    <tr width='100%'><td colSpan={7}>No data</td></tr>
                                )
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {map_village &&
                <div className="card-border">
                  <div style={{width: '100%', height: '500px'}} id="map_village" className="maps-border"></div>
                  <span className="close-map" onClick={() => this.hideMap('map_village')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </span>
                </div>
              }
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({countries, auth, provinces, cities, districts, villages, targets}) => ({ countries, auth, provinces, cities, districts, villages, targets }),
  {filterCountry, filterProvince, filterCity, filterDistrict, detailTargetVillage, deleteCountry, deleteProvince, deleteCity, deleteDistrict, deleteVillage, editTargetCountry, editTargetProvince, editTargetCity, editTargetDistrict, editTargetVillage, getCities, getDistricts, getVillages}
)(Detail)
