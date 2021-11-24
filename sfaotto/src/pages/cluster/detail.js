import React from 'react';
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCluster } from '../../actions/cluster'
import axios from '../../actions/config'
import { ind, en } from '../../languages/cluster'
import { NotAuthorize } from '../../components';

// const svgStyle = {
//   height: '18px',
//   width: '18px'
// }

class Detail extends React.Component {
  state = {
    id: null,
    upload: null,
    check: false,
    confirmIsOpen: false,
    expandCard: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    status: '',
    regionalProvince: '',
    regionalCity: '',
    created_at: '',
    updated_at: '',
    languages: {},
    clusters: {},
    coverages: []
  }

  componentWillMount() {
    const { auth: {access_token}, getCluster } = this.props

    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    getCluster(this.props.match.params.id)
      .then((data) => {
        let clusters = data.data
        let coverages = clusters.coverages

        this.setState({
          clusters,
          coverages,
        })
      })
  }

  // getData = async () => {
  //   try {
  //     await this.props.getCountries()
  //     await this.props.getCities()
  //     await this.props.getProvinces()
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }

  componentDidMount(){
    document.title = "SFA OTTO - Detail Sales"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.detail})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.detail})
    }
  }

  render() {
    const { auth } = this.props
    const {
      languages,
      clusters,
      coverages 
    } = this.state

    if (auth.isAuthenticated && (auth.authority["list_cluster"] === "" || auth.authority["list_cluster"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          {/* <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/sales/verifications')}
            textSuccess={textSuccess}
            textError={textError}
          /> */}

          <div className="col-12 mb-4">
            <h2>{languages.header} (ID-{clusters.id})</h2>
          </div>

          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-9 p-0 text-center d-flex flex-row align-items-center mt-1">
                          <div className="d-flex flex-column align-items-start ">
                            <p className="mb-0">{clusters.name}</p>
                          </div>
                        </div>
                        <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                          <strong className="text-primary"><small>{languages.tingkat}</small></strong>
                          <span className="badge badge-gray">Cluster</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body border-top">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-6 p-0 text-center d-flex">
                          <div className="d-flex flex-column align-items-start">
                            <p className="mb-0">{languages.subarea}</p>
                            <strong className="d-flex flex-column mt-1"><small>{clusters.sub_area}</small></strong>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 p-0 text-center d-flex">
                          <div className="d-flex flex-column align-items-start">
                            <p className="mb-0">{languages.kelurahan}</p>
                            <strong className="d-flex flex-column mt-1"><small>{clusters.village}</small></strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <p className="mb-2">{languages.coverage}</p>
                  </div>
                  <div className="table-fixed">
                    <table className="table table-header">
                      <thead>
                        <tr>
                          <th width="24%">{languages.merchant}</th>
                          <th width="19%">{languages.noHp}</th>
                          <th width="34%">{languages.alamat}</th>
                          <th width="23%">{languages.koordinat}</th>
                        </tr>
                      </thead>
                      <tbody className="table table-body">
                        {coverages.map((a, idx) => (
                          <tr key={idx}>
                            <td>{a.name}</td>
                            <td>{a.phone_number}</td>
                            <td>{a.address}</td>
                            <td className="wordwrap">
                            {/* {a.latitude}, {a.longitude} */}
                              <a href={'https://www.google.com/maps/search/?api=1&query='+ a.latitude + ',' + a.longitude}  rel="noopener noreferrer"target="_blank" className="btn btn-link btn-sm btn-left wordwrap" >{a.latitude}, {a.longitude}</a>
                            </td>
                          </tr>
                        ))}
                        {isEmpty(coverages) &&
                          <tr>
                            <td colSpan={8} className="text-center">{languages.noData}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
              <div className="col-12 mb-0">
                <hr className="content-hr"/>
                <div className="form-group d-flex mb-0">
                  <Link to={`/cluster`} className="btn btn-default w-20">{languages.back}</Link>
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
  {getCluster}
)(Detail)
