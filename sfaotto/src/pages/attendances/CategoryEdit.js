import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ModalConfirm, LoadingDots, 
        NotAuthorize, TimeSelectComponent, SelectLineComponent} from '../../components'
import axios from '../../actions/config'
import { editAttendCategory, getCategoryDetail } from '../../actions/attendance_category'
import { ind, en } from '../../languages/attendance_category'

const types = [
  { value: '0', label: 'All'},
  { value: '1', label: 'In'}, 
  { value: '2', label: 'Out'}
]

class Edit extends React.Component {
  state = {
    id: '',
    category_name: '',
    time_in: '',
    time_out: '',
    type: { value: 'All', label: 'All'},
    confirmIsOpen: false,
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
    const { auth: {access_token}, getCategoryDetail, match} = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.edit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.edit})
    }

    getCategoryDetail(match.params.id)
      .then((data) => {
        const all = data.data
        const types = [
          { value: '0', label: 'All'},
          { value: '1', label: 'In'}, 
          { value: '2', label: 'Out'}
        ]
        const type1 = {value: all.type, label: types[parseInt(all.type, 10)].label }

        this.setState({
          id: all.category_id.toString(),
          category_name: all.category_name,
          type: type1,
          time_in: all.time_in,
          time_out: all.time_out,
        })
      })

  }

  componentDidMount(){
    document.title = "SFA OTTO - Add Category"
  }

  // validation1 = (time) => {

  //   console.log("======", time)

  //   if (this.state.type === '1' || this.state.type === '0' && time != '') {
  //     this.setState({timeStatus: 0})
  //   } 
  // }

  // validation2 = (time) => {

  //   if (this.state.type === '2' || this.state.type === '0' && time != '') {
  //     this.setState({timeStatus2: 0})
  //   } 
  // }

  changeCategory () {

    if (this.state.type.value === '1') {
      this.setState({time_out: null})
    } else if (this.state.type.value === '2') {
      this.setState({time_in: null})
    }

  }

  save(){
    this.setState({isLoading: true})
    const { id, category_name, time_in, time_out,type } = this.state

    this.props.editAttendCategory({
      id: id,
      category_name: category_name,
      type: type.value,
      time_in: time_in,
      time_out: time_out
    })
    .then(data => {
      if(data.meta.status === false){
        this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: data.meta.message, textReason: ''})
      }else{
        this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'success', textError: '', textSuccess: 'Update Attendance Category success!', textReason: ''})
      }
    })
    .catch(e => {
      this.setState({isLoading: false, confirmIsOpen: true,type_modal: 'error', textError: `Update Attendance Category fail! ${e.message}`, textReason: ''})
    })
  }

  render() {

    const { auth, history } = this.props
    const {
      id,
      category_name,
      time_in,
      time_out,
      confirmIsOpen,
      type,
      type_modal,
      textSuccess,
      textError,
      textReason,
      isLoading,
      languages,
      timeStatus,
      timeStatus2,
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
            <h2>{languages.header} ({id})</h2>
          </div>

          <form className="col-12" onSubmit={(e) => {
            e.preventDefault()

            if (type.value === '1') {
              if (time_in === '') {
                this.setState({timeStatus: 1})
                this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: 'Check your input time'})
              } else {
                this.setState({timeStatus: 0})
                this.save()
              }
            } else if (type.value === '2') {
              if (time_out === '') {
                this.setState({timeStatus2: 1})
                this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: 'Check your input time'})
              } else {
                this.setState({timeStatus2: 0})
                this.save()
              }
            } else if (type.value === '0') {
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
                        <SelectLineComponent options={types} 
                        handleChange={(type) => 
                          this.setState({type: type}, () => this.changeCategory())
                        } initValue={type}
                        required/>
                      </div>
                    </div>
                    <div className="form-group mt-3 w-50">
                      <label>{languages.in}</label>
                      <div className="custom-select-line " >
                        <TimeSelectComponent handleChange={time => this.setState({time_in: time})} value={time_in} disabled={type.value === '1' || type.value === '0' ? false : true} required/>
                      </div>
                      { timeStatus === 1 && <small className="text-danger">incorrect time format</small>}
                    </div>
                    <div className="form-group mt-3 w-50">
                      <label>{languages.out}</label>
                      <div className="custom-select-line">
                        {/* <TimeSelectComponent handleChange={time => this.setState({time_out: time}, () => this.validation2(time))} value={time_out} disabled={type.value === '2' || type.value === '0' ? false : true} required/> */}
                        <TimeSelectComponent handleChange={time => this.setState({time_out: time})} value={time_out} disabled={type.value === '2' || type.value === '0' ? false : true} required/>
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
                <div className="form-group d-flex justify-content-between">
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
  { getCategoryDetail, editAttendCategory }
)(Edit)
