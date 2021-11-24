import React from 'react';
import { connect } from 'react-redux'
import { NotAuthorize, Lightbox } from '../../components'
import axios from '../../actions/config'
import moment from 'moment'
import { IconDownload, IconSearchMaps } from '../../components/Icons'
import { getHistoryDetail } from '../../actions/attendance_history'
import { ind, en } from '../../languages/attendance_history'

class Detail extends React.Component {
  state = {
    all: {},
    date: '',
    dateSales: '',
    sales_id: '',
    languages: {},
    category_type: '',
    isOpen: false,
    isOpen2: false,
  }

  componentWillMount() {
    const { auth: {access_token}, getHistoryDetail, match} = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.detail })
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.detail})
    }

    getHistoryDetail(match.params.id)
      .then((data) => {
        if(data.meta.status === false){
          this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.messages, textReason: data.meta.message})
        }else{
          // var date = moment(data.data.date, "YYYY-MM-DD").format("DD-MM-YYYY")
          var date = moment(data.data.date, 'YYYY-MM-DD, HH:mm').format('DD-MM-YYYY, HH:mm')
          var dateSales = moment(data.data.clocktime_local, 'YYYY-MM-DD, HH:mm').format('DD-MM-YYYY, HH:mm')
          var dataAll = data.data

          if (dataAll.attend_category_type === '0'){
            this.setState({category_type: this.state.languages.all})
          } else if (dataAll.attend_category_type === '1'){
            this.setState({category_type: this.state.languages.in})
          } else if (dataAll.attend_category_type === '2'){
            this.setState({category_type: this.state.languages.out})
          }

          this.setState({
            all: dataAll, 
            date: date,
            dateSales: dateSales
          })
        }
      })
  }

  componentDidMount(){
    document.title = "SFA OTTO - Attendance History Detail"
  }

  downloadImage = (url) => {
    var date = moment(this.state.all.date, "YYYY-MM-DD").format("DDMMYYYY")
    var category =  this.state.all.attend_category.replace(/\s+/g, '')
    var type =  this.state.all.attend_category_type.replace(/\s+/g, '')

    fetch(url)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        let url2 = window.URL.createObjectURL(blob)
        let a = document.createElement('a');
        a.href = url2;
        a.download = "absensisales_" + this.state.all.id + category + type + this.state.all.sales_phone + date + ".jpg"
        a.click();
    });
  }

  render() {
    const { auth } = this.props
    const { 
      all,
      date,
      dateSales,
      languages,
      category_type,
      isOpen,
      isOpen2
    } = this.state

    if (auth.isAuthenticated && (auth.authority["add_todo_list"] === "" || auth.authority["add_todo_list"] === "No Access")) {
      return <NotAuthorize />
    }

    const style = {
      minHeight: "100px"
    }

    const handleChange = (e) => {
      this.setState(e.target.value.toUpperCase());
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4">
            <h2>{languages.header} (ID - {all.id})</h2>
          </div>
          
          <div className="col-12 mt-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row"> 
                  <div className="col-12 col-lg-7">
                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.salesId}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input value={all.sales_id} className="form-control form-control-line w-30" 
                        onChange={handleChange} placeholder="Sales ID" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.salesPhone}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={all.sales_phone} className="form-control form-control-line w-30" placeholder="Sales Phone" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.salesName}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={all.sales_name} className="form-control form-control-line w-30" placeholder="Sales Name" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-2">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.category}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={all.attend_category} className="form-control form-control-line w-30" placeholder="Category" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.type}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={category_type} className="form-control form-control-line w-30" placeholder="Category Type" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.date}</label></div>
                      <div className="col-sm-4 input-filter">
                          {/* <DateTime value={date} disabled/> */}
                          <input type="text" value={date} className="form-control form-control-line w-30" placeholder="date, time" disabled/>
                        </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.dateSales}</label></div>
                      <div className="col-sm-4 input-filter">
                          {/* <DateTime value={date} disabled/> */}
                          <input type="text" value={dateSales} className="form-control form-control-line w-30" placeholder="date, time" disabled/>
                        </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.typeAttend}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={all.type_attendance} className="form-control form-control-line w-30" placeholder="Attendance Type" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.notes}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={all.notes || '-'} className="form-control form-control-line w-30" placeholder="Notes" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3 align-items-start">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.foto}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <img onClick={() => this.setState({isOpen: true})} src={all.photo_profile} className="image-selfie pointerYes" alt=""/>
                        <Lightbox isOpen={isOpen} images={all.photo_profile} confirmClose={() => this.setState({isOpen: false})}/>
                        <button className="btn btn-link text-primary" onClick={() => this.downloadImage(all.photo_profile)} ><IconDownload/></button>
                      </div>
                    </div>

                    <div className="form-inline my-3 align-items-start">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.selfie}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <img onClick={() => this.setState({isOpen2: true})} src={all.selfie} className="image-selfie pointerYes" alt=""/>
                        <Lightbox isOpen={isOpen2} images={all.selfie} confirmClose={() => this.setState({isOpen2: false})}/>
                        <button className="btn btn-link text-primary" onClick={() => this.downloadImage(all.selfie)} ><IconDownload/></button>
                        <small className={all.photo_accuration >= all.min_accuration_percentage ? 'text-success' : 'text-danger'}>Kemiripan: {all.photo_accuration}%</small>
                      </div>
                    </div>

                    <div className="form-inline my-3 align-items-start">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.location}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <textarea type="text" value={all.location || '-'} style={style} className="form-control form-control-line w-30" placeholder="Location" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.longlat}</label></div>
                      <div className="col-lg-9 input-filter input-action text-primary">
                        <input placeholder='Search Sales...' className='form-control form-control-line' value={ all.longitude !== "" && all.latitude !== "" ? all.latitude + ", " + all.longitude : "-" } disabled/>
                        <a href={'https://www.google.com/maps/search/?api=1&query='+ all.latitude + ',' + all.longitude}  rel="noopener noreferrer"target="_blank" className="btn btn-link btn-sm btn-left" ><IconSearchMaps/></a>
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

export default connect(
  ({auth}) => ({ auth }),
  { getHistoryDetail }
)(Detail)
