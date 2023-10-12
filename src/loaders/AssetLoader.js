import React from 'react';
import axios from 'axios';
var Buffer = require('safe-buffer').Buffer

//const this.props.base_url = "https://penncnp-dev.pmacs.upenn.edu/";
//const this.props.base_url = "http://localhost/";
export default class AssetLoader extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			loaded: 0,
			size: 0
		};
		this.assets = [];
		this.loadImageAssets = this.loadImageAssets.bind(this);
	}

	cancel(){}

	componentDidMount()
	{
		document.title = `Loading test, please wait ...`;
		const len = (this.props.practice_trials ? this.props.practice_trials.length : 0) + this.props.test_trials.length + (this.props.slideshow ? this.props.slideshow.length : 0);
		if(len === 0)
		{
			this.props.onAssetsLoadComplete([]);
		}
		else
		{
			let images = [];
			if(this.props.practice_trials)
			{
				if(this.props.task && (this.props.task === "adt" || this.props.task === "medf"))
				{
					this.props.practice_trials.forEach((item, i) => {
						const stimulus1 = JSON.parse(item.stimulus)[0];
						const stimulus2 = JSON.parse(item.stimulus)[1];
						!images.find(x => x.includes(stimulus1)) && images.push(this.props.base_url + "stimuli/" + this.props.stimulus_dir + "/" + stimulus1);
						!images.find(x => x.includes(stimulus1)) && images.push(this.props.base_url + "stimuli/" + this.props.stimulus_dir + "/" + stimulus2);
					});
				}
				else
				{
					this.props.practice_trials.forEach((item, i) => {
						const stimulus = JSON.parse(item.stimulus);
						if(!images.find(x => x.includes(stimulus)))
						{

							images.push(this.props.base_url + "stimuli/" + this.props.stimulus_dir + "/" + stimulus);
						}
					});
				}
			}
			if(this.props.test_trials)
			{
				if(this.props.task && (this.props.task === "adt" || this.props.task === "medf"))
				{
					this.props.test_trials.forEach((item, i) => {
						const stimulus1 = JSON.parse(item.stimulus)[0];
						const stimulus2 = JSON.parse(item.stimulus)[1];
						!images.find(x => x.includes(stimulus1)) && images.push(this.props.base_url + "stimuli/" + this.props.stimulus_dir + "/" + stimulus1);
						!images.find(x => x.includes(stimulus1)) && images.push(this.props.base_url + "stimuli/" + this.props.stimulus_dir + "/" + stimulus2);
					});
				}
				else
				{
					this.props.test_trials.forEach((item, i) => {
						let stimulus;
						try{
							stimulus = JSON.parse(item.stimulus);
						}
						catch(e)
						{
							stimulus = item.stimulus;
						}
						if(!images.find(x => x.includes(stimulus)))
						{
							images.push(this.props.base_url + "stimuli/" + this.props.stimulus_dir + "/" + stimulus);
						}
					});
				}
			}
			if(this.slideshow)
			{
				this.props.slideshow.forEach((item, i) => {
					const stimulus = JSON.parse(item.stimulus);
					if(!images.find(x => x.includes(stimulus)))
					{
						images.push(this.props.base_url + "stimuli/" + this.props.stimulus_dir + "/" + stimulus);
					}
				});
			}
			this.setState((prevState, props) => {
				return {size: images.length}
			}, () => {this.loadImageAssets(images);});

		}
	}

	loadImageAssets(image_urls)
	{
		image_urls.forEach( img_url => {
			this.loadImageAsset(img_url);
		});
	};

	async loadImageAsset(asset_url) {
		try
		{
			const response = await axios.get(asset_url, {responseType: 'arraybuffer'});
			const base64_encoded_img = this.getBase64EncodedImg(response);
			this.assets.push({'url': asset_url, 'data': base64_encoded_img});
		}
		catch (error)
		{
			console.error('error loading ', asset_url, ' details: ', error);
			this.assets.push({'url': asset_url});
		}
		const loaded = this.state.loaded + 1;
		this.setState((prevState, props) => {
			return {loaded: loaded};
		}, this.checkAssetsLoaded);
	}

	checkAssetsLoaded(){
		if(this.state.loaded >= this.state.size){
			this.props.onAssetsLoadComplete(this.assets);
		}
	}

	getBase64EncodedImg(response) {
		const prefix = "data:" + response.headers["content-type"] + ";base64,";
		const base64_encoded_img = prefix + Buffer.from(response.data, 'binary').toString('base64');
		return base64_encoded_img;
	}

	render()
	{
		let percent_loaded = "...";
		if(this.state.size > 0)
		{
			percent_loaded = Math.round((this.state.loaded / this.state.size)*100) + "";
		}
		return (
			<div className="container center">
			<h2 className="center--horizontal text--center">Loading {percent_loaded} % </h2>
			</div>
		);
	}
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
