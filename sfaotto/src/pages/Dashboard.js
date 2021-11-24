import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Line } from 'react-chartjs-2';
import { getTargetStatistic } from '../actions/target'
import { getCountries } from '../actions/country'
import { NotAuthorize, SelectComponent } from '../components'
import { ind, en } from '../languages/dashboard'

class Dashboard extends React.Component {
  state = {
    selectedCountry: {value: 1, label: 'Indonesia'},
    languages: {},
  }
  
  componentDidMount(){
    const { auth, history } = this.props

    document.title = "SFA OTTO - SFA Dashboard"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.dashboard})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.dashboard})
    }

    if(auth.position === "Checker"){
      history.push("/requests")
    }
  }

  componentWillMount() {
    this.getData()
  }

  getData = async () => {
    try {
      await this.props.getTargetStatistic()
      await this.props.getCountries()
    } catch(e) {
      console.log(e)
    }
  }

  render() {
    const { auth, countries, targets } = this.props
    const { selectedCountry, languages } = this.state
    const labels = targets.statistic.map(({year}) => year)
    const dataSet = targets.statistic.map(({actual}) => Number(actual))
    const dataTargetSet = targets.statistic.map(({target}) => Number(target))
    const options = {
      scales: {
        yAxes: [{
          ticks: {
            callback(value) {
              return Number(value).toLocaleString('en')
            }
          }
        }]
      }
    }
    const data = {
      labels,
      datasets: [
        {
          label: languages.actual,
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(5, 110, 181, 0.6)',
          borderColor: '#056eb5',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          borderWidth: 1,
          pointBorderColor: 'rgba(5, 110, 181, 0.6)',
          pointBackgroundColor: '#056eb5',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(5, 110, 181, 0.6)',
          pointHoverBorderColor: '#056eb5',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataSet
        },
        {
          label: 'Target',
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(224, 60, 79, 0.6)',
          borderColor: '#e03c4f',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          borderWidth: 1,
          pointBorderColor: 'rgba(224, 60, 79, 0.6)',
          pointBackgroundColor: '#e03c4f',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(224, 60, 79, 0.6)',
          pointHoverBorderColor: '#e03c4f',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataTargetSet
        }
      ]
    }

    return (
      <div className="container mb-5">
        <div className="form-row">
          <div className="col-12 mb-5">
            <h2>{languages.header}</h2>
          </div>
          <div className="col-12 mb-4">
            {(['Maker'].includes(auth.position)) ?
              <div className="row">
                <div className="col-12 col-lg-8">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="float-left">{languages.target}</h5>
                      <Line data={data} options={options} />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4 text-center pb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="form-group">
                        <SelectComponent options={countries.data} initValue={selectedCountry} handleChange={(selectedCountry) => this.setState({selectedCountry})} />
                      </div>
                      <div className="table-fixed">
                        <div className="table-body table-sm">
                          <table className="table table-header table-sm text-center mb-5">
                            <thead>
                              <tr>
                                <th>{languages.tahun}</th>
                                <th>{languages.tercapai}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {targets.statistic.map((t, idx) => (
                                <tr key={idx}>
                                  <td><strong>{t.year}</strong></td>
                                  <td className="text-gray">{t.percentage}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-gray"><small>{languages.ket}</small></p>
                        <Link to={`/targets/detail/${selectedCountry.value}`} className="btn btn-danger">{languages.detail}</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            :
              <div className="">
                <NotAuthorize />
                <div className="text-center">
                  <Link to={`/targets/detail/${selectedCountry.value}`} className="btn btn-danger btn-rounded">{languages.detail}</Link>
                </div>
              </div>
            }
          </div>
        </div>
        { /* (auth.role === 'Verificator') ?
          <div className="form-row">
            <div className="col col-menu-dash">
              <Link to="/sales/verifications" className="card card-rounded card-bg h-124 mb-3" style={{backgroundImage: 'url(/img/verify-sales.png)'}}>
                <div className="card-body text-center d-flex justify-content-center align-items-end">
                  <h6>Verifikasi Sales</h6>
                </div>
              </Link>
            </div>
          </div>
          :
          <div className="form-row">
            <div className="col col-menu-dash">
              <Link to="/sales/recruit" className="card card-rounded card-bg h-124 mb-3" style={{backgroundImage: 'url(/img/register-bg.png)'}}>
                <div className="card-body text-center d-flex justify-content-center align-items-end">
                  <h6>Pendaftaran Sales</h6>
                </div>
              </Link>
            </div>
            <div className="col col-menu-dash">
              <Link to="/sales/" className="card card-rounded card-bg h-124 mb-3" style={{backgroundImage: 'url(/img/manage-target-bg.png)'}}>
                <div className="card-body text-center d-flex justify-content-center align-items-end">
                  <h6>Manage Sales</h6>
                </div>
              </Link>
            </div>
            {((auth.role === 'Verificator') || (auth.role === 'IT Admin')) &&
              <div className="col col-menu-dash">
                <Link to="/sales/verifications" className="card card-rounded card-bg h-124 mb-3" style={{backgroundImage: 'url(/img/verify-sales.png)'}}>
                  <div className="card-body text-center d-flex justify-content-center align-items-end">
                    <h6>Verifikasi Sales</h6>
                  </div>
                </Link>
              </div>
            }
            {(auth.role !== 'Operator') &&
              <div className="col col-menu-dash">
                <Link to="/targets/set-target" className="card card-rounded card-bg h-124 mb-3" style={{backgroundImage: 'url(/img/set-target-bg.png)'}}>
                  <div className="card-body text-center d-flex justify-content-center align-items-end">
                    <h6>Set Target</h6>
                  </div>
                </Link>
              </div>
            }
            <div className="col col-menu-dash">
              <Link to="/todos/new" className="card card-rounded card-bg h-124 mb-3" style={{backgroundImage: 'url(/img/new-todo.png)'}}>
                <div className="card-body text-center d-flex justify-content-center align-items-end">
                  <h6>Set To-do List</h6>
                </div>
              </Link>
            </div>
            <div className="col col-menu-dash">
              <Link to="/todos/" className="card card-rounded card-bg h-124 mb-3" style={{backgroundImage: 'url(/img/manage-todo.png)'}}>
                <div className="card-body text-center d-flex justify-content-center align-items-end">
                  <h6>Manage To-do List</h6>
                </div>
              </Link>
            </div>
          </div>
        */}
      </div>
    );
  }
}

export default connect(
  ({countries, auth, targets}) => ({ countries, auth, targets }),
  {getTargetStatistic, getCountries}
)(Dashboard)
