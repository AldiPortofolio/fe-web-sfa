import React from 'react'
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const LightboxComponent = ({images, isOpen, confirmClose}) => {

  return (

    <React.Fragment>
        {isOpen &&
            <Lightbox 
                mainSrc={images}
                onCloseRequest={() => confirmClose()}
                reactModalStyle={{overlay:{zIndex:10000}}}
            />
        }
    </React.Fragment>
  )
}

export default LightboxComponent
