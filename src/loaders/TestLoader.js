import React, {useEffect, useState} from 'react';
import axios from 'axios';



//const BASE_URL = "http://localhost/";
//const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//const BASE_URL = "http://localhost/";
/***
 Loads test data from the server.
*/

export const TestLoader = props =>
{
  const {base_url, assessment_url, onLoad, onError, ...rest} = props;
  let [loaded, setLoaded] = useState(0);
	let [message, setMessage] = useState("Loading test ...");

	/*** We have several assessment URLs and webcnp and surveys will eventually be retired. However, we always want to request the tests from the current page. */
	const location = window.location.href;
	console.log('url ', location);
	let zurl = 'webcnp.pl';
	if (location.includes('survey')) {
		zurl = 'survey.pl';
	} else if (location.includes('administer')) {
		zurl = 'administer.pl';
	}
  useEffect(() => {
    axios.get('?op=get_next_test_json')
         .then((response) => {
          //  setLoaded(100); onLoad(response.data);
          if(response.data.timeline.length > 0)
          {
            if(response.data.test.test.includes('volt'))
            {
              document.body.classList.remove('dark');
              document.body.classList.add('light');
            }
            setLoaded(100); onLoad(response.data);
          }
          else
          {
            setMessage("Failed to load test because no test data exists. Please contact the CNB team.");
          }

          })
         .catch((e) => {
            console.log(e);
            setMessage("There was an error loading the test. Please contact the CNB team.");
          });

  }, [loaded, message]);

  return (
    <div className="frame dark">
    <div className="container center">
    <h2 className="center--horizontal text--center">{message}</h2>
    </div>
    </div>
  );
};




//import axios from 'axios';
//var Buffer = require('safe-buffer').Buffer

/***async function load_asset(asset_url, images) {
	try
	{
		const response = await axios.get(asset_url, {responseType: 'arraybuffer'});
		console.log('loaded image ', response);
		const base64_encoded_img = get_base64_encoded_img(response);
		let image = new Image();
		image.src = base64_encoded_img;
		images.push({'url': asset_url, 'data': base64_encoded_img});
		//return response;
	}
	catch (error)
	{
		console.error('error loading ', asset_url, ' details: ', error);
		images.push({'url': asset_url});
		//return asset_url;
	}
}*/
/****
function load_asset(asset_url, images) {
	axios.get(asset_url, {responseType: 'arraybuffer'})
	.then(response => {

		const prefix = "data:" + response.headers["content-type"] + ";base64,";
		const base64_encoded_img = prefix + Buffer.from(response.data, 'binary').toString('base64');
		let image = new Image();
		image.src = base64_encoded_img;
		images.push({'url': asset_url, 'data': base64_encoded_img});
	})
	.catch(err => {
		images.push({'url': asset_url});
		console.log('load error ', err);
	})
	.then( () => {
		console.log('something');
	})
}

const get_base64_encoded_img = response => {
	console.log('encoding response ', response);
	const prefix = "data:" + response.headers["content-type"] + ";base64,";
	const base64_encoded_img = prefix + Buffer.from(response.data, 'binary').toString('base64');
	console.log('encoded img is ', base64_encoded_img);
	return base64_encoded_img;
}

const load_image_assets = image_urls =>
{
	let base64_encoded_images = [];
	image_urls.forEach( img_url => {
		console.log('Loafing image ', img_url);
		load_asset(img_url, base64_encoded_images);
		//base64_encoded_images.push(result);
	});
	return base64_encoded_images;
};

export default load_image_assets;
*/
