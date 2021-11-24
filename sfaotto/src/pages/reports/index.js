import React from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Charts from 'react-apexcharts'
import { getReports, getSalesReports } from '../../actions/report'
import { NotAuthorize, SelectLineComponent, DatePicker } from '../../components'
import { ind, en } from '../../languages/report'

const targetLevels = [
  {value: "headquarter", label: "headquarter"}
]

class Dashboard extends React.Component {
  state = {
    selectedCountry: {value: 1, label: 'Indonesia'},
    selectedLevel: {value: "headquarter", label: "headquarter"},
    selectedDate: moment(),
    start_date: moment().subtract(6,'d').format('DD-MM-YYYY'),
    end_date: moment().format('DD-MM-YYYY'),
    date_on_list: moment().format('DD-MM-YYYY'),
    languages: {},
  }
  
  componentDidMount(){
    document.title = "SFA OTTO - Reports"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.index})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.index})
    }
  }

  componentWillMount() {
    const {start_date, end_date} = this.state

    this.props.getReports({start_date, end_date})
      .then((data) => {
        this.setState({selectedDate: data.data.date_on_list})
      })
  }

  render() {
    const { auth, reports, getReports, getSalesReports } = this.props
    const { selectedCountry, selectedLevel, start_date, end_date, selectedDate, languages } = this.state

    if(auth.isAuthenticated && (isEmpty(auth.authority["acquisition"]) || auth.authority["acquisition"] === "No Access")) {
      return <NotAuthorize />
    }

    const labels = reports.charts.map(({date}) => moment(date).format("ddd, DD MMM YY"))
    const dataSet = reports.charts.map(({sales}) => Number(sales))
    const dataAkuisisiSet = reports.charts.map(({akuisisi}) => Number(akuisisi))

    const getSalesList = (graphDate) => {
      getSalesReports({date: graphDate})
        .then((data) => {
          this.setState({selectedDate: graphDate})
        })
    }

    const options = {
      chart: {
        id: "basic-bar",
        zoom: {
          enabled: false
        },
        selection: {
          enabled: true,
        },
        events: {
          markerClick: function(a, b, c, ) {
            let newSelectedDate = moment(labels[c.dataPointIndex]).format("DD-MM-YYYY")
            // return this.state.selectedDate
            getSalesList(newSelectedDate)

            // this.setState({selectedDate: newSelectedDate})
          }
        },
      },
      fill: {
        colors: ['#4C8ABF', '#A1D2E5'],
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.1,
          type: "vertical",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        show: false
      },
      series: [{
        name: "Sales",
        data: dataSet
      }],
      labels: labels,
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        opposite: false,
        floating: false,
        decimalsInFloat: false,
        forceNiceScale: true
      },
      legend: {
        show: false,
        horizontalAlign: 'right'
      },
      tooltip: {
        x: {
          format: 'ddd, dd MMM'
        },
      }
    }

    const series = [{
      name: "Akuisisi",
      type: "area",
      data: dataAkuisisiSet
    },
    {
      name: "Sales",
      type: "line",
      data: dataSet
    }]

    return (
      <div className="container mb-5">
        <div className="form-row">
          <div className="col-12 mb-5">
            <h2>{languages.header}</h2>
          </div>
          <div className="col-12 mb-4">
            {(['IT Admin', 'HQ', 'Manager'].includes(auth.role)) ?
              <div className="row">
                <div className="col-12 col-lg-8 mb-5">
                  <div className="card">
                    <div className="card-body d-flex justify-content-between align-item-center">
                      <h6 className="float-left">{languages.target}</h6>
                      <small className="text-gray text-bold d-flex align-item-center">{moment(start_date, "DD-MM-YYYY").format("DD")} - {moment(end_date, "DD-MM-YYYY").format("DD MMM YYYY")}</small>
                    </div>
                    <div className="card-body">
                      <Charts
                        options={options}
                        series={series}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4 pb-3">
                  <div className="card">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        getReports({selectedLevel, start_date, end_date})
                          .then(data => {
                            if(data.meta.status === false){
                              this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
                            }

                            this.setState({selectedDate: data.data.date_on_list})
                          })
                          .catch(e => {
                            this.setState({confirmIsOpen: true, type: 'error', textError: 'Tambah data sales gagal'})
                          })
                      }}>
                      <div className="card-body">
                        <div className="form-group">
                          <h5 className="">{languages.filter}</h5>
                        </div>
                        <div className="form-group mb-0">
                          <label>{languages.regional}</label>
                          <SelectLineComponent initValue={selectedLevel} options={targetLevels} handleChange={(selectedLevel) => {
                            this.setState({selectedLevel: selectedLevel})
                          }}></SelectLineComponent>
                        </div>
                      </div>
                      <div className="card-body border-top">
                        <div className="form-group">
                          <label>{languages.start}</label>
                          <DatePicker handleChange={start_date => this.setState({start_date, end_date: start_date})} value={start_date} required/>
                        </div>
                        <div className="form-group">
                          <label>{languages.end}</label>
                          <DatePicker handleChange={end_date => this.setState({end_date})} value={end_date} maxDate={start_date} required/>
                        </div>
                        <div className="form-group mb-0 d-flex justify-content-end">
                          <button className="btn btn-danger">{languages.terapkan}</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-12 col-lg-8">
                  <div className="card">
                    <div className="card-body d-flex justify-content-between align-item-center">
                      <h6 className="mb-0">{languages.header2}</h6>
                      <small className="text-gray text-bold d-flex align-item-center">{moment(selectedDate, "DD-MM-YYYY").format("dddd, DD MMM YYYY")}</small>
                    </div>
                    <div className="table-fixed">
                      <table className="table table-header table-striped table-fixed mb-5">
                        <thead>
                          <tr>
                            <th width="30%">{languages.id}</th>
                            <th width="35%">{languages.sales}</th>
                            <th width="35%">{languages.akuisisi}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.sales.map((sales, idx) => {
                            return(
                              <tr key={idx}>
                                <td width="30%">{sales.sfa_id}</td>
                                <td width="35%">{sales.name}</td>
                                <td width="35%">{sales.acquisition}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            :
              <div className="">
                <NotAuthorize />
                <div className="text-center">
                  <Link to={`/targets/detail/${selectedCountry.value}`} className="btn btn-danger btn-rounded">{languages.detailTarget}</Link>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({reports, auth}) => ({ reports, auth }),
  { getReports, getSalesReports }
)(Dashboard)
