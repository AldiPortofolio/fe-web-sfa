import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ModalConfirm, LoadingDots, 
        NotAuthorize, SelectRequired, TimeSelectComponent} from '../../components'
import {  createAttendCategory } from '../../actions/attendance_category'
import { ind, en } from '../../languages/attendance_category'

const types = [
  { value: '0', label: 'All'},
  { value: '1', label: 'In'}, 
  { value: '2', label: 'Out'}
]

class New extends React.Component {
  state = {
    category_name: '',
    time_in: '',
    time_out: '',
    category_type: 'all',
    confirmIsOpen: false,
    type: '',
    type_modal: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    isLoading: false,
    languages: {},
    timeStatus: 0,
    timeStatus2: 0,
  }

  componentWillMount() {
    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.create})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.create})
    }
  }

  componentDidMount(){
    document.title = "SFA OTTO - Add Category"
  }

  save(){
    this.setState({isLoading: true})

    this.props.createAttendCategory(this.state)
    .then(data => {
      if(data.meta.status === false){
        this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: this.state.data.meta.message, textReason: ''})
      }else{
        this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'success', textSuccess: 'Create Attendance Category success!', textReason: ''})
      }
    })
    .catch(e => {
      this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: `Create Attendance Category fail! merchant ${e.message}`, textReason: ''})
    })
  }

  validation1 = (time) => {

    if ((this.state.type === '1' || this.state.type === '0') && time !== '') {
      this.setState({timeStatus: 0})
    } 
  }

  validation2 = (time) => {

    if ((this.state.type === '2' || this.state.type === '0') && time !== '') {
      this.setState({timeStatus2: 0})
    } 
  }

  render() {

    const { auth, history } = this.props
    const { 
      category_name,
      time_in,
      time_out,
      confirmIsOpen,
      type,
      timeStatus,
      timeStatus2,
      type_modal,
      textSuccess,
      textError,
      textReason,
      isLoading,
      languages,
      } = this.state

    if (auth.isAuthenticated && (auth.authority["add_todo_list"] === "" || auth.authority["add_todo_list"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container mb-5 noSelect">
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type_modal}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => history.push('/attendance/category')}
          textSuccess={textSuccess}
          textError={textError}
          textReason={textReason}
        />
        <div className="row">
          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
          </div>

          <form className="col-12" onSubmit={(e) => {
            e.preventDefault()

            if (type === '1') {
              if (time_in === '') {
                this.setState({timeStatus: 1})
                this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: 'Check your input time'})
              } else {
                this.setState({timeStatus: 0})
                this.save()
              }
            } else if (type === '2') {
              if (time_out === '') {
                this.setState({timeStatus2: 1})
                this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: 'Check your input time'})
              } else {
                this.setState({timeStatus2: 0})
                this.save()
              }
            } else if (type === '0') {
              if (time_in === '') {
                this.setState({timeStatus: 1})
                this.setState({timeStatus2: 1})
                this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: 'Check your input time'})
              } else {
                this.setState({timeStatus: 0})
                this.setState({timeStatus2: 0})
                this.save()
              }
            }
            

          }}>
            <div className="row">
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="form-group mb-2 w-50">
                      <label>{languages.categoryName}</label>
                      <input onChange={e => this.setState({category_name: e.target.value})} value={category_name} type="text" className="form-control form-control-line" placeholder={languages.pCategoryName} required />
                    </div>
                    <div className="form-group mt-3 w-50">
                      <label>{languages.type}</label>
                      <div className="form-group custom-select-line">
                        <SelectRequired options={types} onChange={(selectType) => {
                        this.setState({type: selectType.value})
                        }} placeholder="Select" value={type.value} required />
                      </div>
                    </div>
                    <div className="form-group mt-3 w-50">
                      <label>{languages.in}</label>
                      <div className="custom-select-line " >
                        <TimeSelectComponent handleChange={time => this.setState({time_in: time}, () => this.validation1(time))} value={time_in} disabled={type === '1' || type === '0' ? false : true} required/>
                      </div>
                      { timeStatus === 1 && <small className="text-danger">incorrect time format</small>}
                    </div>
                    <div className="form-group mt-3 w-50">
                      <label>{languages.out}</label>
                      <div className="custom-select-line">
                        <TimeSelectComponent handleChange={time => this.setState({time_out: time}, () => this.validation2(time))} value={time_out} disabled={type === '2' || type=== '0' ? false : true} required/>
                      </div>
                      { timeStatus2 === 1 && <small className="text-danger">incorrect time format</small>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            { auth.authority["add_todo_list"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between mr-4">
                  <Link to="/attendance/category" className="btn btn-default">{languages.cancel}</Link>
                  <button type="submit" className={`btn btn-danger ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                    { isLoading ? <LoadingDots/> : languages.save}
                  </button>
                </div>
              </div>
            }
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth }) => ({ auth }),
  { createAttendCategory }
)(New)
