// import React from 'react';
// import { debounce } from 'lodash'
// import { Link } from 'react-router-dom'
// import moment from 'moment'
// import { connect } from 'react-redux'
// import { getOttopayOrders } from '../../actions/ottopay'
// import { NotAuthorize, ModalDelete, Pagination, LoadingDots } from '../../components'
// import { IconSearch, IconTrash, IconDots, IconEdit } from '../../components/Icons'

// const style = {
//   link: {
//     cursor: 'pointer'
//   }
// }

// const initState = {
//   selectedOttopay: [],
//   keyword: '',
//   id: '',
//   region_ids: [],
//   confirmIsOpen: false,
//   resultIsOpen: false,
//   confirmText: '',
//   resultText: '',
//   type: 'success',
//   filterBy: false
// }

// class Index extends React.Component {
//   state = initState

//   componentDidMount(){
//     document.title = "SFA OTTO - List Order"

//     this.fetchOttopay(window.location.search)
//   }

//   componentDidUpdate(prevProps) {
//     // Typical usage (don't forget to compare props):
//     if (this.props.location.search !== prevProps.location.search) {
//       this.fetchOttopay(this.props.location.search);
//     }
//   }

//   fetchOttopay = (pageNumber) => {
//     let page = "?page=1";

//     if(pageNumber){
//       page = pageNumber.includes("page") ? pageNumber : "?page=1"
//     }

//     this.props.getOttopayOrders({}, page)
//   }

//   toggleDropdown(toggle) {
//     let obj = {}
//     obj[toggle] = !this.state[toggle]
//     this.setState(obj)
//   }

//   hide(e, toggle) {
//     setTimeout(() => {
//       let obj = {}
//       obj[toggle] = !this.state[toggle]
//       this.setState(obj)
//     }, 175)
//   }

//   filterOttopayOrders = debounce(() => {
//     const { selectedRegion, keyword, selectedStatus } = this.state

//     this.props.getOttopayOrders({}, `?keyword=${keyword}`)
//   }, 350)

//   render() {
//     const { auth, ottopay, getOttopayOrders } = this.props
//     const { id,
//       confirmIsOpen,
//       resultIsOpen,
//       confirmText,
//       resultText,
//       region_ids,
//       type,
//       keyword,
//       selectedGender,
//       selectedCompCode,
//       selectedRegional,
//       selectedOttopay,
//       filterBy } = this.state

//     if(auth["authority"]["list_region"] === "" || auth["authority"]["list_region"] === "No Access") {
//       return <NotAuthorize />
//     }

//     return (
//       <div className="container">
//         <div className="row">
//           <ModalDelete
//             confirmIsOpen={confirmIsOpen}
//             resultIsOpen={resultIsOpen}
//             type={type}
//             confirmText={confirmText}
//             resultText={resultText}
//             confirmClose={() => this.setState({confirmIsOpen: false})}
//             resultClose={() => this.setState({resultIsOpen: false})}
//             confirmYes={() => {
//               this.setState({confirmIsOpen: false, confirmText: confirmText}, () => {
//                 // if(region_ids.length > 0){
//                 //     bulkDeleteRegion({region_ids: region_ids})
//                 //       .then((data) => {
//                 //         if(data.meta.status === false){
//                 //           this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
//                 //         }else{
//                 //           this.setState({resultIsOpen: true, type: 'success', region_ids: [], selectedOttopay: []}, () => getOttopayOrders())
//                 //         }
//                 //       })
//                 //       .catch(e => {
//                 //         this.setState({resultIsOpen: true, type: 'error'})
//                 //       })
//                 //   }else{
//                 //     deleteRegion(id)
//                 //       .then((data) => {
//                 //         if(data.meta.status === false){
//                 //           this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
//                 //         }else{
//                 //           this.setState({resultIsOpen: true, type: 'success'}, () => getOttopayOrders())
//                 //         }
//                 //       })
//                 //       .catch(e => {
//                 //         this.setState({resultIsOpen: true, type: 'error'})
//                 //       })
//                 //   }
//               })
//             }}
//           />

//           <div className="col-12 mb-3">
//             <h2>List Order</h2>
//           </div>
//           <div className="col-12 mb-4">
//             <div className="card noSelect">
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-12">
//                     <form className="form-inline d-flex justify-content-end">
//                       <div className="form-group">
                        
//                       </div>
//                       <div className="form-group input-action ml-3 w-30">
//                         <IconSearch/>
//                         <input placeholder='Search Order' className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterOttopayOrders() )} />
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//               <div className="table-fixed">
//                 <table className="table table-header mb-0">
//                   <thead>
//                     <tr>
//                       <th width="5%">
//                         <input type="checkbox" onChange={(e) => {
//                           let regionIds = ottopay.map(region => region.id)
//                           let newSelectedOrder = e.target.checked ? regionIds : []

//                           this.setState({selectedOttopay: newSelectedOrder})
//                         }}/>
//                       </th>
//                       <th width="10%">
//                       { selectedOttopay.length > 0 ?
//                         <span className="text-gray-danger d-flex align-items-center" style={{cursor: "pointer"}}
//                           onClick={() => this.setState({region_ids: selectedOttopay, confirmText: `Apakah Anda ingin menghapus ${selectedOttopay.length} regional?`, confirmIsOpen: true})}>
//                           <IconTrash/>
//                           <span className="ml-2">Hapus</span>
//                         </span>
//                         :
//                         <span>Merchant ID</span>
//                       }
//                       </th>
//                       <th width="20%">{ selectedOttopay.length > 0 || "Nama Toko" }</th>
//                       <th width="20%">{ selectedOttopay.length > 0 || "Nama Pemilik" }</th>
//                       <th width="20%">{ selectedOttopay.length > 0 || "No Handphone" }</th>
//                       <th width="20%">{ selectedOttopay.length > 0 || "Product Order" }</th>
//                       <th width="20%">{ selectedOttopay.length > 0 || "Status" }</th>
//                       <th width="5%"></th>
//                     </tr>
//                   </thead>
//                   {ottopay.loading ?
//                     <tbody>
//                       <tr>
//                         <td colSpan={4}><LoadingDots /></td>
//                       </tr>
//                     </tbody>
//                     :
//                     <tbody>
//                       {ottopay.data.map((order) => (
//                         <tr key={order.id}>
//                           <td>
//                             <input type="checkbox" checked={selectedOttopay.includes(order.id)} onChange={(e) => {
//                               let newSelectedOrder = selectedOttopay

//                               if(e.target.checked){
//                                 newSelectedOrder.push(ottopay.id)
//                               }else{
//                                 newSelectedOrder = selectedOttopay.filter(ottopayID => ottopayID !== order.id)
//                               }

//                               this.setState({selectedOttopay: newSelectedOrder})
//                             }}/>
//                           </td>
//                           <td>{order.id}</td>
//                           <td>{order.merchant_name}</td>
//                           <td>{order.owner_name}</td>
//                           <td>{order.phone}</td>
//                           <td>{order.product}</td>
//                           <td>-</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   }
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default connect(
//   ({ auth, ottopay }) => ({ auth, ottopay }),
//   { getOttopayOrders }
// )(Index)
