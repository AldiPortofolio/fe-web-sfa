import React from 'react';
import { range } from 'lodash';
import { Link } from 'react-router-dom';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from './Icons';
import { ind, en } from '../languages/paginations'
import { connect } from 'react-redux'

class Pagination extends React.Component {
  state = {
    languages: {}
  }
  
  componentDidMount(){
    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.manage})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.manage})
    }
  }

  render() {
    const { routeName, pages, parameter, maxRaw } = this.props;
    let column_from, column_to, prev_page, next_page, total_pages, newParameter;
    const { languages } = this.state

    if(pages !== undefined){
      if (maxRaw !== undefined) {
        column_from = (pages.current_page * maxRaw - (maxRaw - 1)) < 0 ? 0 : (pages.current_page * maxRaw - (maxRaw - 1));
        column_to = (pages.current_page * maxRaw) > pages.total_count ? pages.total_count : (pages.current_page * maxRaw);
      } else {
        column_from = (pages.current_page * 25 - 24) < 0 ? 0 : (pages.current_page * 25 - 24);
        column_to = (pages.current_page * 25) > pages.total_count ? pages.total_count : (pages.current_page * 25);
      }
      prev_page = (pages.current_page - 4 < 0) ? 0 : (pages.current_page - 4) ;
      next_page = (pages.current_page + 3 > pages.total_pages) ? pages.total_pages : (pages.current_page + 3);
      total_pages = range(prev_page, next_page)
    }
  
    newParameter = parameter !== undefined ? parameter : ''
  
    return (
      <nav className="d-flex align-items-center justify-content-between" aria-label="Pagination">
        {((pages !== undefined)) &&
          <React.Fragment>
            <ul className="pagination mb-0">
              <li className={`page-item ${(pages.prev_page >= pages.current_page) || (pages.prev_page === null) || (pages.prev_page === 0)  ? 'disabled' : ''}`}>
                <Link className="page-link" to={`/${routeName}?page=1${newParameter}`} aria-label="Previous">
                  <span aria-hidden="true"><IconChevronsLeft /></span>
                </Link>
              </li>
              <li className={`page-item ${(pages.prev_page >= pages.current_page) || (pages.prev_page === null) || (pages.prev_page === 0)? 'disabled' : ''}`}>
                <Link className="page-link" to={`/${routeName}?page=${pages.prev_page}${newParameter}`} aria-label="Previous">
                  <span aria-hidden="true"><IconChevronLeft /></span>
                </Link>
              </li>
              {total_pages.map(page => (
                <li key={page} className={`page-item ${pages.current_page === (page + 1) ? 'active' : ''}`}>
                  <Link className="page-link" to={`/${routeName}?page=${page + 1}${newParameter}`}>{page + 1}</Link>
                </li>
              ))}
              <li className={`page-item ${pages.prev_page >= pages.next_page || pages.total_pages < 2 || pages.next_page === null || pages.next_page > pages.total_pages ? 'disabled' : ''}`}>
                <Link className="page-link" to={`/${routeName}?page=${pages.next_page}${newParameter}`} aria-label="Next">
                  <span aria-hidden="true"><IconChevronRight /></span>
                </Link>
              </li>
              <li className={`page-item ${pages.prev_page >= pages.next_page || pages.total_pages < 2 || pages.next_page === null ||  pages.next_page > pages.total_pages ? 'disabled' : ''}`}>
                <Link className="page-link" to={`/${routeName}?page=${pages.total_pages}${newParameter}`} aria-label="Next">
                  <span aria-hidden="true"><IconChevronsRight /></span>
                </Link>
              </li>
            </ul>
  
            <p className="m-0 d-flex align-items-center text-gray">
              {languages.display} {column_from} - {column_to} {languages.of} {pages.total_count} {languages.data}
            </p>
          </React.Fragment>
        }
      </nav>
    );
  }
}

export default connect(
  ({ auth }) => ({ auth }),
)(Pagination)


// const Pagination = ({routeName, pages, parameter }) => {
//   let column_from, column_to, prev_page, next_page, total_pages, newParameter;

//   if(pages !== undefined){
//     column_from = (pages.current_page * 25 - 24) < 0 ? 0 : (pages.current_page * 25 - 24);
//     column_to = (pages.current_page * 25) > pages.total_count ? pages.total_count : (pages.current_page * 25);
//     prev_page = (pages.current_page - 4 < 0) ? 0 : (pages.current_page - 4) ;
//     next_page = (pages.current_page + 3 > pages.total_pages) ? pages.total_pages : (pages.current_page + 3);
//     total_pages = range(prev_page, next_page)
//   }

//   newParameter = parameter !== undefined ? parameter : ''

//   return (
//     <nav className="d-flex align-items-center justify-content-between" aria-label="Pagination">
//       {((pages !== undefined)) &&
//         <React.Fragment>
//           <ul className="pagination mb-0">
//             <li className={`page-item ${(pages.prev_page >= pages.current_page) || (pages.prev_page === null) || (pages.prev_page === 0)  ? 'disabled' : ''}`}>
//               <Link className="page-link" to={`/${routeName}?page=1${newParameter}`} aria-label="Previous">
//                 <span aria-hidden="true"><IconChevronsLeft /></span>
//               </Link>
//             </li>
//             <li className={`page-item ${(pages.prev_page >= pages.current_page) || (pages.prev_page === null) || (pages.prev_page === 0)? 'disabled' : ''}`}>
//               <Link className="page-link" to={`/${routeName}?page=${pages.prev_page}${newParameter}`} aria-label="Previous">
//                 <span aria-hidden="true"><IconChevronLeft /></span>
//               </Link>
//             </li>
//             {total_pages.map(page => (
//               <li key={page} className={`page-item ${pages.current_page === (page + 1) ? 'active' : ''}`}>
//                 <Link className="page-link" to={`/${routeName}?page=${page + 1}${newParameter}`}>{page + 1}</Link>
//               </li>
//             ))}
//             <li className={`page-item ${pages.prev_page >= pages.next_page || pages.total_pages < 2 ? 'disabled' : ''}`}>
//               <Link className="page-link" to={`/${routeName}?page=${pages.next_page}${newParameter}`} aria-label="Next">
//                 <span aria-hidden="true"><IconChevronRight /></span>
//               </Link>
//             </li>
//             <li className={`page-item ${pages.prev_page >= pages.next_page || pages.total_pages < 2 || pages.next_page === null ? 'disabled' : ''}`}>
//               <Link className="page-link" to={`/${routeName}?page=${pages.total_pages}${newParameter}`} aria-label="Next">
//                 <span aria-hidden="true"><IconChevronsRight /></span>
//               </Link>
//             </li>
//           </ul>

//           <p className="m-0 d-flex align-items-center text-gray">
//             Displaying {column_from} - {column_to} of {pages.total_count} records
//           </p>
//         </React.Fragment>
//       }
//     </nav>
//   );
// }

// export default Pagination
