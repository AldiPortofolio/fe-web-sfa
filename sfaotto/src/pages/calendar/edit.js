import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ModalConfirm, LoadingDots, 
        NotAuthorize, SelectLineComponent, DatePickerSelect} from '../../components'
import axios from '../../actions/config'
import { getCalendar, editCalendar } from '../../actions/calendar'
import { ind, en } from '../../languages/calendar'

const type_list = [
  {value: 'National Holiday', label: 'National Holiday'},
  {value: 'Office Leave', label: 'Office Leave'},
]

class Edit extends React.Component {
  state = {
    id: '',
    event_date: '',
    event_type: '',
    description: '',
    
    confirmIsOpen: false,
    type_modal: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    isLoading: false,
    languages: {},
  }

  componentWillMount() {
    const { auth: {access_token}, getCalendar, match} = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.edit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.edit})
    }

    getCalendar(match.params.id)
      .then((data) => {
        const all = data.data
        const type = {value: all.event_type, label: all.event_type }

        this.setState({
          ...all,
          event_type: type,
        })
      })

  }

  componentDidMount(){
    document.title = "SFA OTTO - Update Calendar"
  }

  render() {

    const { auth, history, editCalendar } = this.props
    const {
      id,
      event_date,
      event_type,
      description,

      confirmIsOpen,
      type_modal,
      textSuccess,
      textError,
      textReason,
      isLoading,
      languages,
      } = this.state

    if (auth.isAuthenticated && (auth.authority["calendar_setup"] === "" || auth.authority["calendar_setup"] === "No Access")) {
      return <NotAuthorize />
    }

    const style = {
      minHeight: "100px"
    }

    return (
      <div className="container mb-5 noSelect">
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type_modal}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => history.push('/system-configuration/calendar')}
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
            this.setState({isLoading: true})

            editCalendar({
              id: id.toString(),
              event_date: event_date,
              event_type: event_type.value,
              description: description
            })
            .then(data => {
              if(data.meta.status === false){
                this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'error', textError: data.meta.message, textReason: ''})
              }else{
                this.setState({isLoading: false, confirmIsOpen: true, type_modal: 'success', textSuccess: this.state.languages.sukses, textReason: ''})
              }
            })
            .catch(e => {
              this.setState({isLoading: false, confirmIsOpen: true,type_modal: 'error', textError: `${this.state.languages.gagal} ${e.message}`, textReason: ''})
            })
              

          }}>
            <div className="row">
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="form-group mb-2 w-50">
                      <label>{languages.id}</label>
                      <input onChange={e => this.setState({id: e.target.value})} value={id} type="text" className="form-control form-control-line" disabled />
                    </div>
                    
                    <div className="form-group mt-3 w-50">
                      <label>{languages.date}</label>
                      <div className="custom-select-line">
                        <DatePickerSelect handleChange={event_date => this.setState({event_date})} value={event_date} yearDropdownItemNumber={5} required/>
                      </div>
                    </div>

                    <div className="form-group mb-2 w-50">
                      <label>{languages.type}</label>
                      {/* <input onChange={e => this.setState({event_type: e.target.value})} value={event_type} type="text" className="form-control form-control-line" /> */}
                      <SelectLineComponent options={type_list} 
                        handleChange={(event_type) => 
                          this.setState({event_type})
                        } initValue={event_type}
                        required/>
                    </div>

                    <div className="form-group mt-3 w-50">
                      <label>{languages.desc}</label>
                      <textarea className="form-control form-control-line" style={style} value={description} placeholder={languages.pDesc} onChange={e => {
                          this.setState({description: e.target.value})
                        }} required></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            { auth.authority["calendar_setup"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/system-configuration/calendar" className="btn btn-default">{languages.cancel}</Link>
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
  { getCalendar, editCalendar }
)(Edit)
