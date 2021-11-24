import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter
} from 'reactstrap';

const ModalOffline = ({isOpen, handleClose}) => {
  return (
    <Modal className="modal-confirmation d-flex align-items-center justify-content-center" size='sm' isOpen={isOpen}>
      <ModalBody className="text-left flex-column justify-content-start">
        <h5>You're offline from the Internet</h5>
        <p className="pt-4 text-center">To access the site you need to be connected to the Internet.</p>
        <ul>
          <li>Checking the network cables, modem, and router</li>
          <li>Reconnecting to Wi-Fi</li>
        </ul>
      </ModalBody>
      <ModalFooter className='text-center'>
        <button className="btn btn-danger btn-rounded btn-block" onClick={() => handleClose()}>Close</button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalOffline
