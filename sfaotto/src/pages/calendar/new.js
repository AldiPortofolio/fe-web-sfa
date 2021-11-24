import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import { isNaN } from 'lodash'
import { createCalendar } from '../../actions/calendar'
import { NotAuthorize, ModalConfirm, DatePickerSelect, CalendarBulk, SelectRequired } from '../../components'
import axios from '../../actions/config'
import { ind, en } from '../../languages/calendar';


const type_list = [
  {value: 'National Holiday', label: 'National Holiday'},
  {value: 'Office Leave', label: 'Office Leave'},
]

const repeat_list = [
  {value: '0', label: `Doesn't Repeat`},
  {value: '1', label: 'Weekly'},
  {value: '2', label: 'Monthly'},
  {value: '3', label: 'Annually'}
]

class Register extends React.Component {
  state = {
    dateValidate: 0,
    event_date: '',
    event_type: '',
    repeat: '',
    repeat_until: '',
    description: '',
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    languages: {}
  }

  componentWillMount() {
    const { auth: {access_token} } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
  }

  componentDidMount(){
    document.title = "SFA OTTO - Add Calendar"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.new})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.new})
    }
  }

  dateValidation = (inputDate, event_date) => {

    if (inputDate < event_date) {
      this.setState({dateValidate: 1})
    } else {
      this.setState({dateValidate: 0})
    }
  }
  

  // uploadSalesBulk = () => {
  //   if (this.refs.file.files) {
  //     this.setState({uploadStatus: 'Uploading File...'})

  //     const data = new FormData();
  //     data.append('file', this.state.upload[0]);
  //     axios.post('/sales/bulk', data)
  //     .then(data => {
  //       let result = data.data;
  //       if(result.meta.status === false){
  //         this.setState({confirmIsOpen: true, type: 'error', textError: result.meta.message, uploadStatus: 'Upload File'})
  //       }else{
  //         this.setState({confirmIsOpen: true, type: 'success', textSuccess: 'Bulk upload sales sukses', uploadStatus: 'Upload File'})
  //       }
  //     })
  //     .catch(e => {
  //       this.setState({confirmIsOpen: true, type: 'error', textSuccess: 'Bulk upload sales gagal', uploadStatus: 'Upload File'})
  //     })
  //   }
  // }

  render() {
    const { auth, createCalendar, history } = this.props
    const {
      dateValidate,
      event_date,
      event_type,
      repeat,
      repeat_until,
      description,

      confirmIsOpen,
      type,
      textSuccess,
      textError,
      languages } = this.state

    if (auth.isAuthenticated && (auth.authority["calendar_setup"] === "" || auth.authority["calendar_setup"] === "No Access")) {
      return <NotAuthorize />
    }

    const style = {
      minHeight: "100px"
    }

    return (
      <div className="container mb-5">
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => history.push('/system-configuration/calendar')}
          textSuccess={textSuccess}
          textError={textError}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault()

            if(dateValidate !== 1) {
              createCalendar({
                event_date: event_date,
                event_type: event_type.value,
                repeat: repeat.value,
                repeat_until: repeat_until,
                description: description
              })
              .then(data => {
                if(data.meta.status === false){
                  this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
                }else{
                  this.setState({confirmIsOpen: true, type: 'success', textSuccess: data.meta.message})
                }
              })
              .catch(e => {
                this.setState({confirmIsOpen: true, type: 'error', textError: 'Add Calendar fail!'})
              })
            }else{
              this.setState({confirmIsOpen: true, type: 'error', textError: 'Please check all fields.'})
            }
            
          }}>
          <div className="row">

            <div className="col-12 mb-4">
              <h2>{languages.header}</h2>
            </div>

            <div className="col-12 col-lg-8 mb-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="form-group w-50">
                        <label>{languages.date}</label>
                        <div className="custom-select-line">
                          <DatePickerSelect handleChange={event_date => this.setState({event_date})} value={event_date} yearDropdownItemNumber={5} required/>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group w-50">
                        <label>{languages.type}</label>
                        <div className="custom-select-line">
                          <SelectRequired options={type_list} value={event_type}
                            onChange={(event_type) => {
                              this.setState({event_type})
                            }} required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group w-50">
                        <label>{languages.repeat}</label>
                        <div className="custom-select-line">
                          <SelectRequired options={repeat_list} value={repeat}
                            handleChange={(repeat) => this.setState({repeat})} 
                            onChange={(repeat) => {
                              this.setState({repeat})
                            }} required
                          />
                        </div>
                      </div>
                    </div>
                    {repeat.value !== '0' &&
                     <div className="col-12">
                      <div className="form-group w-50">
                        <label>{languages.until}</label>
                        <div className="custom-select-line">
                          <DatePickerSelect handleChange={repeat_until => this.setState({repeat_until}, () => this.dateValidation(repeat_until, event_date))} value={repeat_until} yearDropdownItemNumber={5} required/>
                        </div>
                        { dateValidate === 1 && <small className="text-danger">{languages.err1}</small>}
                      </div>
                    </div>
                    }
                    <div className="col-12">
                      <div className="form-group w-50">
                        <label>{languages.desc}</label>
                        <textarea className="form-control form-control-line" style={style} value={description} placeholder='Enter Description' onChange={e => {
                            this.setState({description: e.target.value})
                          }} required></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 mb-3">
              <CalendarBulk history={history} />
            </div>

            <div className="col-12 mb-3">
              <hr className="content-hr"/>
              <div className="form-group d-flex justify-content-between">
                <Link to="/system-configuration/calendar" className="btn btn-outline-danger">{languages.cancel}</Link>
                {(auth.authority["calendar_setup"] === "Full Access") &&
                  <button type="submit" className="btn btn-danger">{languages.save}</button>
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  ({auth, genders, company_codes, sales}) => ({ auth, genders, company_codes, sales }),
  {createCalendar}
)(Register)
