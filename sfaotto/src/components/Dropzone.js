import React, { useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px",
  borderWidth: 2,
  borderRadius: 3,
  borderColor: "#989ca3",
  borderStyle: "dashed",
  backgroundColor: "#ffffff",
  color: "#989ca3",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "0px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const formatMbtoBytes = (mb, decimals = 2) => {
  const bytes = mb * 1048576;
  return bytes;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Dropzone = ({
  isShowPreview = false,
  maxSize = 5,
  handleChange,
  name,
  initialValue,
}) => {
  const logo = initialValue && true;
  const maxSizeDropZone = formatMbtoBytes(maxSize);
  const [files, setFiles] = useState([]);
  const [showInitialValue, setInitialValue] = useState(true);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
    open,
  } = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    noClick: true,
    noKeyboard: true,
    maxSize: maxSizeDropZone,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      acceptedFiles.map(async (file) => {
        const base64 = await getBase64(file);
        handleChange(base64, name);
      });
      // setInitialValue(false);
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  const thumbsInitialValue = () => {
    return (
      <div style={thumb}>
        <div style={thumbInner}>
          <img src={initialValue} style={img} />
        </div>
      </div>
    );
  };

  const fileName = files.map((file) => (
    <div key={file.name}>
      <p>{file.name}</p>
    </div>
  ));

  const fileReject = fileRejections.map((err, index) => (
    <div key={index}>
      <p className="text-danger">{err.errors[0].message}</p>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      setInitialValue(false);
    },
    [files]
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <h4>Drag and drop files here</h4>
        <p>File supported: .PNG, .JPG & .JPEG</p>
        <button type="button" className="btn btn-danger" onClick={open}>
          Choose File
        </button>
        {showInitialValue && initialValue && (
          <aside style={thumbsContainer}>
            <div style={thumb}>
              <div style={thumbInner}>
                <img src={initialValue} style={img} />
              </div>
            </div>
          </aside>
        )}
        <p></p>
        <aside>{!fileRejections.length > 0 ? fileName : fileReject}</aside>
        <p>Maximum Size: {maxSize}MB</p>
      </div>
      {isShowPreview && <aside style={thumbsContainer}>{thumbs}</aside>}
    </div>
  );
};

export default Dropzone;
