import React from 'react';

const BASE_URL = "http://localhost/"; // "https://penncnp-dev.pmacs.upenn.edu/";

export class ImageSlideshow extends React.Component{
  constructor(props)
  {
    super(props);
    const image = this.findImage(props.trials[0].stimulus);
    this.state = {
      trial: 0,
      image: image,
      loading_error: false,
      trialTime: null
    };
    this.intervalid = -1;
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onImageLoadingError = this.onImageLoadingError.bind(this);
  }

  componentWillUnmount()
  {
    this.stop();
  }

  onImageLoaded()
  {
    this.setState((prevState, props) => {
      return {trialTime: new Date(), loading_error: false}
    }, this.start);
  }

  onImageLoadingError()
  {
    this.setState((prevState, props) => {
      return {loading_error: true}
    }, this.start);
  }

  start()
  {
    this.intervalid = setTimeout(() => {this.update();}, 32);
  }

  update()
  {
    const starttime = this.state.trialTime;
    const duration = (new Date()) - starttime;
    // Show next trial
    if(!starttime)
    {
      this.intervalid = setTimeout(() => {this.update();}, 32);
    }
    // By default all our slideshows are 5 seconds long.
    else if(duration >= 5000)
    {
      this.next();
    }
    else {
      this.intervalid = setTimeout(() => {this.update();}, 256);
    }
  }

  stop()
  {
    clearTimeout(this.intervalid);
    this.intervalid = null;
    this.trialTime = null;
  }

  next()
  {
    const nextSlide = this.state.trial + 1;
    const trial_count = this.props.trials.length;
    const rt = new Date() - this.trialTime;
    this.stop();
    if(nextSlide < trial_count)
    {
      const image = this.findImage(this.props.trials[nextSlide].stimulus);
      this.setState((prevState, props) => {
        return {trial: nextSlide, image: image, trialTime: null};
      }, this.start);
    }
    else
    {
      this.props.onSlideShowComplete();
    }
  }

  findImage(image_url)
  {
    const clean_url = JSON.parse(image_url);
    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return BASE_URL + "stimuli/svolt/" + clean_url;
  }

  findAssetFile(url)
  {
    let file = localStorage.getItem(url);
    if(!file)
    {
      file = this.findAssetFileInArray(url);
    }
    return file;
  }

  findAssetFileInArray(url)
  {
    let file = null;
    const assets = this.props.images || [];
    for(let i=0; i < assets.length; i++)
    {
      if((assets[i].url).includes(url))
      {
        file = assets[i].data;
        continue;
      }
    }
    return file || BASE_URL + "stimuli/svolt/" + url;
  }

  render()
  {
    const image = this.state.image;
    const loading_error = this.state.loading_error;
    return (
      loading_error ?
      <p>Failed to load required test image {JSON.parse(this.props.trials[this.state.index].stimulus)}. Please refresh the page and try again. If it continues to fail, please contact CNB team.</p>
      :
      <img className={"slideshow-image " + this.props.classList} src={image} alt="Loading image ..." onLoad={this.onImageLoaded} onError={this.onImageLoadingError}/>
    );
  }
}
