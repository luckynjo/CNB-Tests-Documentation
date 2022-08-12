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

  useEffect(() => {
    //axios.get('http://localhost/webcnp.pl?op=get_next_test_json')
    // sctap-2.00-ff
    // spcptn90-4.00-ff
    // svolt-3.00-ff
    //cpf-2.05-ff
    // digsym-a-2.00-ff
    // sfnb2-3.00-ff
    //spllt-a-1.00-ff
    // k-er40-d-3.60-ff
    // svolt-3.00-ff
    axios.post(base_url + 'tests.pl', {'op': 'administer', 'test': 'stroop-1.10-ff', 'language': 'en_US'})
    //axios.get(assessment_url ? assessment_url + '?op=get_next_test_json' : base_url + 'webcnp.pl?op=get_next_test_json')
         .then((response) => {
          //  setLoaded(100); onLoad(response.data);
          if(response.data.timeline.length > 0)
          {
            if(response.data.test.test.includes('volt') || response.data.test.test.includes('er40') || response.data.test.test.includes('stroop'))
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
