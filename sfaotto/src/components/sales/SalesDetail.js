import React from 'react';

const SalesDetail = ({sales}) => {
  return (
    <React.Fragment>
      <div className="card-footer border-top">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-lg-2 text-center d-flex justify-content-center align-items-center">
              <div className="avatar  d-flex justify-content-center align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <p className="mt-1">{sales.first_name} {sales.last_name}</p>
            </div>
            <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
              <strong className="mb-0"><small>Status</small></strong>
              <span className="badge badge-status">{sales.status}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer border-top pt-3">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-lg-4">
              <p className="text-dark-gray my-2"><strong className="mb-0">Role Sebelumnya</strong></p>
            </div>
            <div className="col-12 col-lg-8">
              <p className="my-2">{sales.positions.length ? sales.positions[sales.positions.length -1].role : "-"}</p>
            </div>
          </div>
          { (sales.position && sales.position.region) &&
            <div className="row">
              <div className="col-12 col-lg-4">
                <p className="text-dark-gray">Region</p>
              </div>
              <div className="col-12 col-lg-8">
                {sales.position.region ? sales.position.region : "-"}
              </div>
            </div>
          }
          { /*(sales.position && sales.position.branch) &&
            <div className="row">
              <div className="col-12 col-lg-4">
                <p className="text-dark-gray">Branch</p>
              </div>
              <div className="col-12 col-lg-8">
                {sales.position.branch ? sales.position.branch : "-"}
              </div>
            </div>
          */}
          { /*(sales.position && sales.position.area) &&
            <div className="row">
              <div className="col-12 col-lg-4">
                <p className="text-dark-gray">Area</p>
              </div>
              <div className="col-12 col-lg-8">
                {sales.position.area ? sales.position.area : "-"}
              </div>
            </div>
          */}
          { /*(sales.position && sales.position.sub_area) &&
            <div className="row">
              <div className="col-12 col-lg-4">
                <p className="text-dark-gray">SubArea</p>
              </div>
              <div className="col-12 col-lg-8">
                {sales.position.sub_area ? sales.position.sub_area : "-"}
              </div>
            </div>
          */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default SalesDetail