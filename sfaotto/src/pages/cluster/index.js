import React from 'react';
import { debounce, isEmpty } from 'lodash';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getClusters} from '../../actions/cluster'
import { IconDownload } from '../../components/Icons'
import { NotAuthorize, LoadingDots, Pagination } from '../../components'
import { ind, en } from '../../languages/cluster'
import axios from '../../actions/config'
import { NEWAPI } from '../../actions/constants'
import moment from 'moment'

var dateNow = new Date()
var dateNow2 = moment(dateNow, 'DDMMYYYY')
dateNow2 = dateNow2.format('DDMMYYYY')

class Manage extends React.Component {
  state = {
    confirmIsOpen: false,
    confirmText: '',
    resultIsOpen: false,
    type: 'success',
    keyword: '',
    languages: {},
    disabledStatusExport: false,

    cluster_id: '',
    sub_area: '',
    village: '',
    cluster_name: '',
    coverage: ''
  }

  componentDidMount(){
    document.title = "SFA OTTO - Cluster List"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.index})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.index})
    }

    this.fetchData(window.location.search)
    this.props.getClusters()
  }

  componentDidUpdate(prevProps) {

    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchData(this.props.location.search);
    }
  }

  // getData = async () => {
  //   try {
  //     await this.props.getClusters()
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }

  fetchData = (pageNumber) => {
    const { cluster_id, sub_area, village, cluster_name, coverage } = this.state
    let page = "?page=1";

    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber : "?page=1"
    }

    this.props.getClusters({cluster_id, sub_area, village, cluster_name, coverage}, page)
  }

  export = (state) => {
    let req = {
      cluster_id: state.cluster_id,
      sub_area: state.sub_area,
      village: state.village,
      cluster_name: state.cluster_name,
      coverage: state.coverage,
      limit: 100000
    }
    axios.post(NEWAPI + `/clusters/export`, req)
			.then(response => {
        this.setState({disabledStatusExport: false})
        const bstr = atob(response.data.data)
        const byteNumbers = new Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
            byteNumbers[i] = bstr.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        const blob = new Blob([byteArray], {type: 'file/csv'});

        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a');
        a.href = url;
        a.download = 'export_list_clusters_' + dateNow2 + '.csv'
        a.click();
    });
  }

  search = debounce(() => {
    const { cluster_id, cluster_name, village, sub_area, coverage} = this.state
    let page = "?page=1";

    this.props.getClusters({cluster_id, cluster_name, village, sub_area, coverage}, page)
  }, 350)

  render() {
    let { auth, getClusters, clusters } = this.props
    const { 
      cluster_id,
      sub_area,
      village,
      cluster_name,
      coverage,
      languages, 
      disabledStatusExport} = this.state

    if (auth.isAuthenticated && (auth.authority["list_cluster"] === "" || auth.authority["list_cluster"] === "No Access")) {
      return <NotAuthorize />
    }

    let newParams = ""
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
            <div className="actions d-flex justify-content-end">
              <button className="btn btn-link text-danger mr-3" disabled={disabledStatusExport} onClick={() => this.setState({disabledStatusExport: true}, () => this.export(this.state))}><IconDownload/>{languages.export}</button>
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="row">

                    <div className="col-12">
                    <div className="row mt-2">
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.id}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="ID" className="form-control form-control-line w-30" placeholder="Masukan ID"
                            onChange={e => {
                              this.setState({cluster_id: e.target.value.toString()})
                            }}
                            value={cluster_id}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.subarea}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="sub_area" className="form-control form-control-line w-30" placeholder="Masukan Nama atau ID SubArea" 
                            onChange={e => {
                              this.setState({sub_area: e.target.value})
                            }}
                            value={sub_area}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.name}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="cluster_name" className="form-control form-control-line w-20" placeholder="Masukan Nama" 
                            onChange={e => {
                              this.setState({cluster_name: e.target.value})
                            }}
                            value={cluster_name}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.coverage}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="coverage" className="form-control form-control-line w-30" placeholder="Masukan Nama atau No Telp Merchant" 
                            onChange={e => {
                              this.setState({coverage: e.target.value.toString()})
                            }}
                            value={coverage}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.kelurahan}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="village" className="form-control form-control-line w-30" placeholder="Masukan Nama atau ID Kelurahan" 
                            onChange={e => {
                              this.setState({village: e.target.value})
                            }}
                            value={village}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline  my-2">
                          <div className="col-3"></div>
                          <div className="col-lg-5">
                            <button type="submit" className="btn btn-danger w-100" onClick={() => {this.search()}}>{languages.search}</button>
                          </div>
                          <div className="col-lg-4 input-action my-2">
                            <Link to={`?page=1`} aria-label="Previous">
                              <button className="btn btn-link text-danger" onClick={() => {this.setState({
                                selectedFilter: true, 
                                cluster_id: '',
                                cluster_name: '',
                                village: '',
                                sub_area: '',
                                coverage: ''}, 
                                () => getClusters(this.state, "?page=1"))}}>{languages.reset}</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header mb-0">
                  <thead>
                    <tr>
                        <th width="2%"></th>
                      <th width="14%">{languages.id}</th>
                      <th width="17%">{languages.subarea}</th>
                      <th width="17%">{languages.kelurahan}</th>
                      <th width="22%">{languages.name}</th>
                      <th width="28%">{languages.coverage}</th>
                    </tr>
                  </thead>
                  {clusters.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={6}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {clusters.data.map((a, idx) => (
                        <tr key={idx}>
                          <td></td>
                          <td>
                            <Link to={`/cluster/${a.cluster_id}`}style={{cursor: "pointer"}}>
                                {a.cluster_id}
                            </Link>
                          </td>
                          <td>{a.sub_area_name}</td>
                          <td>{a.village_name}</td>
                          <td>{a.cluster_name}</td>
                          <td>{a.coverages}</td>
                          {/* <td>{a.position === "Maker" ? a.role : a.position}</td> */}
                          {/* <td>-</td> */}
                          {/* { auth.authority["add_admin"] === "Full Access" ?
                            <td className="d-flex align-items-center justify-content-center">
                              <Link to={`/admin/edit/${a.id}`} className="px-2 btn-circle">
                                <IconEdit/>
                              </Link>
                              <button className="px-2 btn-circle text-danger"
                                style={{cursor: 'pointer', color: '#007bff', background: 'transparent'}}
                                onClick={() => this.setState({id: a.id, confirmIsOpen: true})}
                                >
                                <IconTrash/>
                              </button>
                            </td>
                            :
                            <td></td>
                          } */}
                        </tr>
                      ))}
                      {isEmpty(clusters.data) &&
                        <tr>
                          <td colSpan={8} className="text-center">{languages.noData}</td>
                        </tr>
                      }
                    </tbody>
                  }
                </table>
              </div>

              <div className="card-body border-top">
                <Pagination pages={clusters.meta} routeName="cluster" parameter={newParams} handleClick={(pageNumber) => this.fetchData(pageNumber)} />
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({clusters, auth}) => ({ clusters, auth }),
  {getClusters}
)(Manage)
