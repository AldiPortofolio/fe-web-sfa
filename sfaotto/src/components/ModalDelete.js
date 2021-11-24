import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import check from '../checklist.png';
import question from '../question.png';
import cross from '../x.png';

const ModalDelete = ({confirmIsOpen, resultIsOpen, type, confirmClose, resultClose, confirmYes, confirmText, resultText}) => {
  return (
    <div>
      <Modal className="modal-confirmation d-flex align-items-center justify-content-center" size='sm' isOpen={confirmIsOpen} toggle={() => confirmClose()}>
        <ModalBody>
          <div className="d-flex flex-column align-items-center align-items-center">
            <img src={question} alt='check' style={{width: '150px', marginTop: '20px'}} />
            <div style={{margin: '35px 0 15px'}}>
              { (confirmText && confirmText.length > 0) ? confirmText : "Apakah Anda yakin untuk non-aktifkan data ini?" }
            </div>
          </div>
        </ModalBody>
        <ModalFooter className='text-center'>
          <button className="btn btn-outline-danger btn-rounded btn-block mr-2" onClick={() => confirmClose()}>Cancel</button>
          <button className="btn btn-danger btn-rounded btn-block ml-2" onClick={() => confirmYes()}>Ya</button>
        </ModalFooter>
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
    </div>
  );
}

export default ModalDelete
