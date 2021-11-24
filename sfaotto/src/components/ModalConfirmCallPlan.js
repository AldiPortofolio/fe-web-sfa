import React from "react";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import check from "../checklist.png";
import question from "../question.png";
import cross from "../x.png";

const ModalConfirmCallPlan = ({
  confirmIsOpen,
  resultIsOpen,
  type,
  confirmClose,
  resultClose,
  confirmYes,
  confirmText,
  resultText,
  isAll,
  data,
  confirmSuccess,
  afterEdit = false,
}) => {
  return (
    <div>
      <Modal
        className="modal-confirmation d-flex align-items-center justify-content-center"
        size="sm"
        isOpen={confirmIsOpen}
        toggle={() => confirmClose()}
      >
        <ModalBody>
          <div className="d-flex flex-column align-items-center align-items-center">
            <img
              src={afterEdit ? check : question}
              alt="check"
              style={{ width: "150px", marginTop: "20px" }}
            />
            <div style={{ margin: "35px 0 15px" }}>
              {afterEdit ? (
                <h4>
                  Assigment untuk <span className="text-primary">{data}</span>{" "}
                  Berhasil diperbarui
                </h4>
              ) : (
                <h4>Regenerate Call Plan{isAll && " Keseluruhan"}</h4>
              )}
            </div>
            {afterEdit && (
              <>
                <div>
                  Klik <b>Lanjut</b> jika ingin otomatis Regenerate Call Plan
                  salesman. Klik <b>Selesai</b> jika tidak ingin lanjut proses
                  Regenerate Call Plan.
                </div>
              </>
            )}
            {!afterEdit && (
              <>
                {isAll ? (
                  <div>
                    Apakah anda yakin ingin meregenerate call plan secara
                    keseluruhan?
                  </div>
                ) : (
                  <>
                    <div>
                      Apakah anda yakin ingin meregenerate call plan salesman
                    </div>
                    <div>
                      <span className="text-primary">{data}?</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="text-center">
          <button
            className="btn btn-outline-primary btn-lg btn-block"
            onClick={() => confirmClose()}
          >
            {afterEdit ? "Selesai" : "Batal"}
          </button>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={() => confirmYes()}
          >
            {afterEdit ? "Lanjutkan" : " Iya, Yakin"}
          </button>
        </ModalFooter>
      </Modal>

      <Modal
        className="modal-confirmation d-flex align-items-center justify-content-center"
        size="sm"
        isOpen={resultIsOpen}
        toggle={() => resultClose()}
      >
        <ModalBody>
          {type === "success" ? (
            <div className="d-flex flex-column align-items-center align-items-center">
              <img
                src={check}
                alt="check"
                style={{ width: "100px", marginTop: "20px" }}
              />
              <div style={{ margin: "35px 0 15px" }}>
                <h4>Regenerate Call Plan Berhasil</h4>
              </div>
              <div>
                {isAll && (
                  <span>
                    Anda telah berhasil meregenerate call plan secara
                    keseluruhan Mohon cek email secara berkala untuk mendapatkan
                    update lebih lanjut
                  </span>
                )}
                {!isAll && (
                  <span>
                    Anda telah berhasil meregenerate call plan salesman{" "}
                    <span className="text-primary">{data}</span>. Mohon cek
                    email secara berkala untuk mendapatkan update
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center align-items-center">
              <img
                src={cross}
                alt="cross"
                style={{ width: "100px", marginTop: "20px" }}
              />
              <div style={{ margin: "35px 0 15px" }}>
                {resultText && resultText.length > 0
                  ? resultText
                  : "Ups! Gagal mengenerate call plan"}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="text-center">
          {type === "success" ? (
            <button
              className="btn btn-primary btn-rounded btn-block mr-1"
              onClick={() =>
                confirmSuccess() ? confirmSuccess() : confirmClose()
              }
            >
              OK
            </button>
          ) : (
            <button
              className="btn btn-danger btn-rounded btn-block ml-1"
              onClick={() => resultClose()}
            >
              OK
            </button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalConfirmCallPlan;
