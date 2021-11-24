import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import check from '../checklist.png';
import cross from '../x.png';
import MerchantBulk from '../components/MerchantBulk'

const ModalBulkUpload = ({confirmIsOpen, resultIsOpen, type, confirmClose, resultClose, confirmYes, confirmText, resultText, upload, history}) => {
  return (
    <React.Fragment>
      <Modal className="modal-confirmation d-flex align-items-center justify-content-center" size='sm' isOpen={confirmIsOpen} toggle={() => confirmClose()}>
        {/* <ModalBody> */}

          <MerchantBulk browserHistory={history}/>
          {/* <div className="d-flex flex-column">
            <h6>Add To-do List Bulk</h6>
            <div className="d-flex form-group mt-3 mb-0">
              <input type='file' onChange={e => upload = e.target.files}/>
            </div>
          </div> */}
        {/* </ModalBody> */}
        {/* <ModalFooter className='text-center mt-0'>
          <button className="btn btn-outline-danger btn-rounded btn-block mr-2" onClick={() => confirmClose()}>Cancel</button>
          <button className="btn btn-danger btn-rounded btn-block ml-2" onClick={() => confirmYes(upload)}>Upload</button>
        </ModalFooter> */}
      </Modal>

      <Modal className="modal-confirmation d-flex align-items-center justify-content-center" size='sm' isOpen={resultIsOpen} toggle={() => resultClose()}>
        <ModalBody>
          {(type === 'success') ?
            <div className="d-flex flex-column align-items-center align-items-center">
              <img src={check} alt='check' style={{width: '100px', marginTop: '20px'}} />
              <div style={{margin: '35px 0 15px'}}>{ (resultText && resultText.length > 0) ? resultText : "Berhasil di Non-aktifkan"}</div>
            </div>
            :
            <div className="d-flex flex-column align-items-center align-items-center">
              <img src={cross} alt='cross' style={{width: '100px', marginTop: '20px'}} />
              <div style={{margin: '35px 0 15px'}}>{ (resultText && resultText.length > 0) ? resultText : "Ups! Gagal di Non-aktifkan"}</div>
            </div>
          }
        </ModalBody>
        <ModalFooter className='text-center'>
          {(type === 'success') ?
          <button className="btn btn-primary btn-rounded btn-block mr-1" onClick={() => resultClose()}>OK</button>
          :
          <button className="btn btn-danger btn-rounded btn-block ml-1" onClick={() => resultClose()}>OK</button>
          }
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default ModalBulkUpload
