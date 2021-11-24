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

const ModalAddLink = ({
  open,
  textReason,
  handleChange,
  handleSubmit,
  confirmClose,
  handleBack,
  urlAddress,
  displayText,
}) => {
  return (
    <Modal
      className="modal-confirmation d-flex align-items-center justify-content-center"
      size="sm"
      isOpen={open}
      toggle={() => confirmClose()}
    >
      <ModalBody className="pb-2 text-left">
        <div className="col-sm-12">
          <div className="row">
            <div className="form-group w-100 mb-0">
              <b>
                <h5>Masukan tautan</h5>
              </b>
            </div>
            <div className="form-group w-100 mb-0 mt-4">
              <label>Text ditampilkan</label>
              <input
                type="text"
                className="form-control"
                value={displayText}
                placeholder=""
                name="displayText"
                id="displayText"
                placeholder="Masukan text untuk ditampilkan"
                onChange={handleChange}
              ></input>
            </div>
            <div className="col-sm-12 mb-0 mt-4 ">
              <div className="row">
                <label>Alamat URL</label>
                <div className="form-group w-100 form-inline">
                  <div className="col-sm-8">
                    <div className="row">
                      <input
                        type="text"
                        className="form-control w-100"
                        value={urlAddress}
                        placeholder=""
                        name="urlAddress"
                        id="urlAddress"
                        placeholder="Masukan alamat url yg dituju"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <a href={urlAddress} target="_blank">
                      <button
                        type="button"
                        className="form-control btn btn-primary w-100"
                      >
                        Test Link
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <small>
              Carilah halamn web yang ingin Anda tautkan. (Mesin telusur mungkin
              berguna) Kemudian, salin alamat web dari kotak dalam alamat
              browser, dan tempelkan ke kotak atas.
            </small>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="col-sm">
          <div className="float-right">
            <div
              className="btn-toolbar"
              role="toolbar"
              aria-label="Toolbar with button groups"
            >
              <div
                className="btn-group mr-2"
                role="group"
                aria-label="Second group"
              >
                <button
                  className="btn btn-link btn-outline-primary text-primary"
                  style={{ backgroundColor: "transparent" }}
                  onClick={handleBack}
                >
                  Kembali
                </button>
              </div>
              <div
                className="btn-group mr-2"
                role="group"
                aria-label="Second group"
              >
                <button
                  className="btn btn-primary d-flex align-items-center float-right"
                  onClick={handleSubmit}
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAddLink;
