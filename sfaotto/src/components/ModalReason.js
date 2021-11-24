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

const style = {
  minHeight: "150px"
}

const ModalReason = ({rejectIsOpen, textReason, handleChange, handleSubmit, confirmClose}) => {
  return (
    <Modal className="modal-confirmation d-flex align-items-center justify-content-center" size='sm' isOpen={rejectIsOpen} toggle={() => confirmClose()}>
      <ModalBody className="pb-2 text-left flex-column justify-content-start">
        <h5>Reject Request</h5>
        <div className="form-group w-100 mb-0">
          <label>Reason</label>
          <textarea className="form-control" value={textReason} style={style} placeholder="Please type the rejection reason here..." onChange={(e) => handleChange(e)}></textarea>
        </div>
      </ModalBody>
      <ModalFooter className='text-center'>
        <button className="btn btn-danger btn-rounded btn-block" disabled={textReason.length <= 10} onClick={() => handleSubmit()}>Send</button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalReason
