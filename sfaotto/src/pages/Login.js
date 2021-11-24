import React from 'react';
import { connect } from 'react-redux'
import { signIn, confirmEmail, signInV2 , confirmEmailV2} from '../actions/auth'
import LoadingSpinner from '../components/LoadingSpinner';
import { IconSearch, IconTrash, IconDots, IconEdit } from '../components/Icons'
import { ind, en } from '../languages/login'

const style = {
  link: {
    cursor: 'pointer'
  }
}

class Login extends React.Component {
  state = {
    email: '',
    pin: '',
    next: false,
    isLoading: false,
    error: '',
    errorText: '',
    language: 'in',
    languagePack: ind,
    hide: false,
  }

  componentWillMount() {
    const { isAuthenticated, history } = this.props
    if (isAuthenticated) {
      return history.replace('/')
    }
  }

  componentDidMount(){
    document.title = "SFA OTTO - Login"
  }

  setPin = (val, pos, idx) => {
    if (val) {
      let pin = this.state.pin.split('')
      pin[idx] = val
      this.setState({pin: pin.join('')}, () => (pos) && this.refs[pos].focus())
    }
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  hideMap(id_map) {
    let obj = {}
    obj[id_map] = false
    this.setState(obj);
  }

  languagePack(language) {
    if (language === 'in') {
      this.setState({languagePack: ind})
    } else if (language === 'en') {      
      this.setState({languagePack: en})
    }
  }

  render() {
    const { email, pin, next, error, isLoading, errorText, language, hide, languagePack } = this.state
    return (
      <div className="container-fluid h-100 no-auth">
        <div className="row no-auth-row h-100">

          <div className="container-fluid">
            <div className="d-flex justify-content-end dropdown mr-3">
              <div onClick={() => this.setState({hide: true})}
                className="btn btn-lang dropdown-toggle mt-2" role="button" data-toggle="dropdown">
                {language === 'in' ? <img src="/img/indonesia.png" className="img-circle mr-1"/> 
                : <img src="/img/country.png" className="img-circle mr-1"/>}
                {language === 'in' ? "Indonesia" : "English"}
              </div>
              <div className={`dropdown-menu dropdown-menu-right dropdown-menu-icon btn ${this.state.hide ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                <button className="dropdown-item" style={style.link}
                  onClick={() => { this.setState({language: 'in', hide: false }, () => this.languagePack('in')) }}>
                  Indonesia
                </button>
                <span className="dropdown-item" style={style.link}
                  onClick={() => { this.setState({language: 'en', hide: false}, () => this.languagePack('en')) }}>
                  English
                </span>
              </div>
            </div>
          </div>

          <div className="container h-100">
            <div className="logo-brand">
              <img src="/img/logo-big.png" alt="logo" />
            </div>
            <div className="row h-100">
              <div className="col-12 col-md-10 col-lg-7 h-100 d-flex align-items-center mx-auto">
                <div className="card card-transparent mx-auto w-100">
                  {next ?
                    <div className="card-body">
                      <h2 className="mb-1">{ languagePack.headerPin}</h2>
                      <p className="text-blue">{email}</p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (pin.length === 6) {
                            this.setState({isLoading: true})
                            this.props.signInV2({email, pin}, language)
                              .then(() => this.props.history.push('/'))
                              .catch(err => {
                                let errorNotice = err.response ? err.response.statusText : languagePack.validationPin
                                this.setState({error: true, errorText: errorNotice, isLoading: false}, () => {
                                  this.refs.pin1.value = ''
                                  this.refs.pin2.value = ''
                                  this.refs.pin3.value = ''
                                  this.refs.pin4.value = ''
                                  this.refs.pin5.value = ''
                                  this.refs.pin6.value = ''
                                  this.refs.pin1.focus()
                                })
                              })
                          }
                        }}
                        className="mt-5">
                        <div className="form-group">
                          <label className="text-uppercase">Pin</label>
                          <div className="row form-row">
                            <div className="col-2">
                              <input onChange={e => this.setPin(e.target.value, 'pin2', 0)} ref='pin1' type="password" name="email" className="form-control text-center" placeholder="-" maxLength="1" autoFocus={true} />
                            </div>
                            <div className="col-2">
                              <input onChange={e => this.setPin(e.target.value, 'pin3', 1)} ref='pin2' type="password" name="email" className="form-control text-center" placeholder="-" maxLength="1" />
                            </div>
                            <div className="col-2">
                              <input onChange={e => this.setPin(e.target.value, 'pin4', 2)} ref='pin3' type="password" name="email" className="form-control text-center" placeholder="-" maxLength="1" />
                            </div>
                            <div className="col-2">
                              <input onChange={e => this.setPin(e.target.value, 'pin5', 3)} ref='pin4' type="password" name="email" className="form-control text-center" placeholder="-" maxLength="1" />
                            </div>
                            <div className="col-2">
                              <input onChange={e => this.setPin(e.target.value, 'pin6', 4)} ref='pin5' type="password" name="email" className="form-control text-center" placeholder="-" maxLength="1" />
                            </div>
                            <div className="col-2">
                              <input onChange={e => this.setPin(e.target.value, false, 5)} ref='pin6' type="password" name="email" className="form-control text-center" placeholder="-" maxLength="1" />
                            </div>
                          </div>
                          {error && <p className="text-danger text-right"><i>{errorText.length === 0 ? languagePack.validationPin : errorText}</i></p>}
                        </div>
                        <div className="form-group text-right mt-5 mb-0 d-flex justify-content-end">
                          <button type="submit" className={`btn btn-danger btn-circle btn-circle-submit ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                            { isLoading ?
                              <LoadingSpinner />
                              :
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            }
                          </button>
                        </div>
                      </form>
                    </div>
                    :
                    <div className="card-body">
                      <h2 className="mb-1">{languagePack.headerEmail}</h2>
                      <p className="text-gray">{languagePack.headerEmail2}</p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (email) {
                            this.setState({isLoading: true})

                            this.props.confirmEmailV2({email})
                              .then(() => this.setState({next: true, error: null, isLoading: false}))
                              .catch(error => this.setState({error: true, isLoading: false}))
                          }
                        }}
                        className="mt-5">
                        <div className="form-group">
                          <label className="text-uppercase">Email</label>
                          <input onChange={e => this.setState({email: e.target.value})} type="email" name="email" className="form-control" placeholder={languagePack.placeholder} required="required" />
                          {error && <p className="text-warning text-right"><i>{languagePack.validationEmail}</i></p>}
                        </div>
                        <div className="form-group text-right mt-5 mb-0 d-flex justify-content-end">
                          <button type="submit" className={`btn btn-danger btn-circle btn-circle-submit ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                            { isLoading ?
                              <LoadingSpinner />
                              :
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            }
                          </button>
                        </div>
                      </form>
                    </div>
                  }
                </div>
              </div>
            </div>
            <footer>
              Member of Salim Group
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth}) => {
    const { loading, isAuthenticated } = auth
    return {
      loading,
      isAuthenticated
    }
  }, {signIn, confirmEmail, signInV2, confirmEmailV2}
)(Login)
