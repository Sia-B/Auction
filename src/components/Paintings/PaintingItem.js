import { useEffect, useState } from 'react';
import React from 'react';
import './paintingitem.css'

  const PaintingItem = ({ painting }) => {
    const [imageSrc, setImageSrc] = useState(null);
  
    useEffect(() => {
      // Dynamically import the image based on the painting id
      import(`../../paintings/painting${painting.id}.jpeg`)
        .then((image) => {
          // Set the image source once it's loaded
          setImageSrc(image.default);
        })
        .catch((error) => {
          console.error('Error loading image:', error);
        });
    }, [painting.id]);
  return (
    <div className="painting-item">
      <img src={imageSrc} alt="" />
      {console.log()}
      {painting && painting.id && <p>ID: {painting.id}</p>}
      {painting && painting.value && <p>Value: ${painting.value}</p>}
    </div>
  );
}

export default PaintingItem;
