import React from "react";
import { isEmpty } from "lodash";
import {
  Modal,
  ModalBody,
  ModalFooter,
  UncontrolledCollapse,
} from "reactstrap";
import check from "../checklist.png";
import cross from "../x.png";

const style = {
  minHeight: "150px",
};

const ModalReasonAttendance = ({
  rejectIsOpen,
  textReason,
  handleChange,
  handleSubmit,
  confirmClose,
  handleBack,
  headerTitle,
  desc,
  placeholder,
}) => {
  return (
    <Modal
      className="modal-confirmation d-flex align-items-center justify-content-center"
      size="sm"
      isOpen={rejectIsOpen}
      toggle={() => confirmClose()}
    >
      <form onSubmit={handleSubmit}>
        <ModalBody className="pb-2 text-left">
          <div className="col-sm">
            <div className="row">
              <h5>{headerTitle ? headerTitle : "Alasan Tolak Validasi"}</h5>
              <div className="form-group w-100 mb-0 mt-3">
                <label>{desc ? desc : "Masukan alasan tolak"}</label>
                <textarea
                  className="form-control"
                  value={textReason}
                  style={style}
                  placeholder={
                    placeholder
                      ? placeholder
                      : "Please type the rejection reason here..."
                  }
                  onChange={(e) => handleChange(e)}
                  required
                ></textarea>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="text-center">
          <div
            className="btn-group mr-2"
            role="group"
            aria-label="Second group"
          >
            <button
              className="btn btn-link btn-outline-primary text-primary "
              // disabled={disabledStatusExport}
              style={{ backgroundColor: "transparent" }}
              onClick={() => handleBack()}
            >
              Batal
            </button>
          </div>
          <div className="btn-group" role="group" aria-label="Second group">
            <button
              type="submit"
              className="btn btn-danger btn-rounded btn-block"
            >
              Lanjut
            </button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ModalReasonAttendance;
