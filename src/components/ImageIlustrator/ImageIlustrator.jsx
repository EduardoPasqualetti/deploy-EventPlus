import React from 'react';
import defaultImage from "../../assets/images/default-image.jpeg"

const ImageIlustrator = ({alteText, additionalClass, imageRender = defaultImage}) => {

    return (
        <figure className='ilustrator-box'>
            <img 
            src={imageRender} 
            alt={alteText} 
            className={`illustrator-box__image ${additionalClass}`} />
        </figure>
    );
};

export default ImageIlustrator;