import React from 'react';
import { isEmpty } from 'lodash';
import {
  Modal,
  ModalBody,
  ModalFooter,
  UncontrolledCollapse
} from 'reactstrap';
import check from '../checklist.png';
import cross from '../x.png';

const ModalDownload = ({confirmIsOpen, textSuccess, textError, type, confirmClose, confirmSuccess, textReason, download}) => {
  return (
    <Modal className="modal-confirmation d-flex align-items-center justify-content-center" size="sm" isOpen={confirmIsOpen} toggle={() => confirmClose()} backdrop="static">
      <ModalBody className="pb-2">
        {(type === 'success') ?
          <div className="d-flex flex-column align-items-center align-items-center">
            <img src={check} alt='check' style={{width: '150px', marginTop: '20px'}} />
            <div style={{margin: '35px 0 15px'}} dangerouslySetInnerHTML={{__html: textSuccess}}></div>
          </div>
          :
          <div className="d-flex flex-column align-items-center align-items-center">
            <img src={cross} alt='cross' style={{width: '150px', marginTop: '20px'}} />
            <div style={{margin: '35px 0 15px'}} dangerouslySetInnerHTML={{__html: textError}}></div>
          </div>
        }
      </ModalBody>
      {isEmpty(textReason) ||
        <div>
          <span className="btn-small w-100 d-block text-center" id="toggler">
            See Detail
          </span>
          <UncontrolledCollapse toggler="#toggler">
            <p>{textReason}</p>
          </UncontrolledCollapse>
        </div>
      }
      <ModalFooter className='text-center'>
        {(type === 'success') ?
        <button className="btn btn-outline-primary btn-rounded btn-block" onClick={() => (confirmSuccess) ? confirmSuccess() :
           confirmClose()}>OK</button>
          :
          <div className="col-12 form-inline">
            <div className="col-lg-4">
                <button className="btn btn-outline-danger btn-rounded" onClick={() => confirmClose()}>Tutup</button>
            </div>
            <div className="col-lg-8">
                <button className="btn btn-danger btn-rounded" onClick={() => download()}>Download error file</button>
            </div>
        </div>
        }
      </ModalFooter>
    </Modal>
  );
}

export default ModalDownload
