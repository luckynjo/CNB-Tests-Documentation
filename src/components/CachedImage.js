import React, {useEffect, useState} from 'react';
import axios from 'axios';
var Buffer = require('safe-buffer').Buffer


const CachedImage = props =>
{
  const {img_url, ...rest} = props;
  let [image, setImage] = useState("");

  useEffect(() => {

    const load_image = url => {

    // https://www.npmjs.com/package/safe-buffer
      axios.get(url, {responseType: 'arraybuffer'})
      .then(response => {
        const prefix = "data:" + response.headers["content-type"] + ";base64,";
        const base64_encoded_img = prefix + Buffer.from(response.data, 'binary').toString('base64');
        setImage(base64_encoded_img);
      })
      .catch(err => {
        setImage(img_url);
        console.log('load error ', err);
      })
      .then( () => {
        console.log('All done!');
      })
    }

    load_image(img_url);
  }, [image]);

  console.log('given url ', img_url);
  return (
    <img src={image}/>
  );
}

export default CachedImage;
