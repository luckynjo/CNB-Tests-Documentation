import React from 'react';

const MP3_REGEX = /\.?(mp3)/ig;
const OGG_REGEX = /\.?(ogg)/ig;
/***
* CNB audio player. Can easily extend to video player.
* TO DO: Convert CNB audio files to ogg format which has a smaller file size.
*/
export default class AudioPlayer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      playlistIndex: 0,
      audio: Array.isArray(this.props.audio) ? this.props.audio : [this.props.audio],
      audioPlayed: false,
      autoPlayAllowed: true,
      audioPlayBlockedByBrowser: false,
      playButtonVisibility: "invisible",
      otherPlayerButtonVisibility: this.props.isTitle || this.props.isFeedback ? "invisible" : "",
    };

    if(this.props.autoPlay === false)
    {
      this.autoPlay = this.props.autoPlay;
    }
    else
    {
      this.autoPlay = true;
    }
    this.audioPlayerRef = React.createRef();
    this.audioControlsRef = React.createRef();
    this.startAudioPlayback = this.startAudioPlayback.bind(this);
    this.restartAudioPlayback = this.restartAudioPlayback.bind(this);
    this.audioPlaybackFinish = this.audioPlaybackFinish.bind(this);
    this.audioPlaybackError = this.audioPlaybackError.bind(this);
  }

  componentDidMount()
  {
    // Attempt audio playback once component rendered.
    let media = this.audioPlayerRef.current;
    media.addEventListener('ended', this.audioPlaybackFinish);
    media.addEventListener('error', this.audioPlaybackError);

    let playButton = this.audioControlsRef.current.querySelector("#play");
    let repeatButton = this.audioControlsRef.current.querySelector("#repeat");
    playButton.addEventListener('click', this.startAudioPlayback);
    repeatButton.addEventListener('click', this.restartAudioPlayback);
    if(this.autoPlay == true)
    {
      this.startAudioPlayback();
    }
  }

  componentWillUnmount()
  {
    // Remove event listeners.
    let media = this.audioPlayerRef.current;
    media.removeEventListener('ended', this.audioPlaybackFinish);
    media.removeEventListener('error', this.audioPlaybackError);

    let playButton = this.audioControlsRef.current.querySelector("#play");
    let repeatButton = this.audioControlsRef.current.querySelector("#repeat");
    playButton.removeEventListener('click', this.startAudioPlayback);
    repeatButton.removeEventListener('click', this.restartAudioPlayback);
  }

  render()
  {
    let audioElement = <audio id="audio" ref={this.audioPlayerRef}/>
    if(this.state.audio.length > 0)
    {
      audioElement = (<audio id="audio" src={this.state.audio[this.state.playlistIndex]} type={this.getAudioMimeType()} ref={this.audioPlayerRef} autoPlay></audio>);
      if(!this.autoPlay)
      {
        audioElement = <audio id="audio" src={this.state.audio[this.state.playlistIndex]} type={this.getAudioMimeType()} ref={this.audioPlayerRef}></audio>
      }
    }

    // Override standard audio player controls by creating custom controls.
    return(
      <div className="audio_player">

      {audioElement}

      <div className="controls" id="controls" ref={this.audioControlsRef}>
      <button id="play" className={"play " + this.state.playButtonVisibility} aria-label="play  toggle"></button>
      <button id="status" className={"play_state__off " + this.state.otherPlayerButtonVisibility}  aria-label="play state"></button>
      <button id="repeat" className={"repeat " + this.state.otherPlayerButtonVisibility} aria-label="play repeat"></button>
      </div>
      </div>
    )
  }

  getAudioMimeType()
  {
    if(!this.state.audio[this.state.playlistIndex])
    {
      throw "No audio file provided. Please provide audio file.";
    }
    else if(this.state.audio[this.state.playlistIndex].match(OGG_REGEX))
    {
      return "audio/ogg";
    }
    else if(this.state.audio[this.state.playlistIndex].match(MP3_REGEX))
    {
      return "audio/mp3";
    }
    else
    {
      throw "Unknown audio mimetype. Please add mimetype. Currently supporting mp3 and ogg formats only.";
    }
  }

  /***
  * Audio played successfully, play next clip or use property callback to signal audio played.
  */
  audioPlaybackFinish()
  {
    let playlistIndex = this.state.playlistIndex + 1;
    if(playlistIndex >= this.state.audio.length)
    {
      let statusElement = this.audioControlsRef.current.querySelector("#status");
      statusElement.classList.remove("play_state__on");
      statusElement.classList.add("play_state__off");
      this.audioPlayerRef.current.pause();
      if(this.props.callback)
      {
        this.props.callback();
      }
    }
    else
    {
      this.setState((props, prevState) => { return {playlistIndex: playlistIndex, audioPlayed: true, playButtonVisibility: "invisible", otherPlayerButtonVisibility: this.props.isTitle || this.props.isFeedback ? "invisible" : ""}});
      this.startAudioPlayback();
    }
  }

  /***
  * Update audio file to play from calling component and restart audio playback.
  */
  updateAudio(audio)
  {
    this.setState((props, prevState) => {return {audio: [audio], playlistIndex: 0, playButtonVisibility: "invisible"}});
  }

  /***
  * Start audio playback.
  */
  startAudioPlayback()
  {
    if(this.props.audio)
    {
      this.playAudio();
    }
  }

  /***
  * Restart audio play. Triggered by calling component, specifically the audio slider.
  */
  restartAudioPlayback()
  {
    if(this.props.restartAudioPlayback)
    {
      this.props.restartAudioPlayback();
    }
    else
    {
      this.startAudioPlayback();
    }
  }

  /***
  * Play audio.
  */
  async playAudio()
  {
    let media = this.audioPlayerRef.current;
    let statusElement = this.audioControlsRef.current.querySelector("#status");
    media.removeAttribute('controls');

    try
    {
      await media.play();
      statusElement.classList.remove("play_state__off");
      statusElement.classList.add("play_state__on");
      this.setState((prevState, props) => {return {playButtonVisibility: "invisible", otherPlayerButtonVisibility: this.props.isTitle || this.props.isFeedback ? "invisible" : ""}});
    }
    catch(err)
    {
      // Visual cue will provide feedback for user to press play button.
      // Additionally enable buttons to prevent forcing user to press play before continuing, in case there really is a technical problem.
      // Auto play blocked by browser for unmutted audio.
      // DOMException: play() failed because the user didn't interact with the document first.
      if(err.name === "NotAllowedError")
      {
        this.setState((prevState, props) => {return {audioPlayed: false, autoPlayAllowed: false, playButtonVisibility: this.props.isFeedback ? "invisible" : "", otherPlayerButtonVisibility: "invisible"}});
        statusElement.classList.remove("play_state__on");
        statusElement.classList.add("play_state__off");
      }
      // DOMException: The element has no supported sources.
      else
      {
        this.setState((prevState, props) => {return {audioPlayed: false, audioPlayBlockedByBrowser: true, playButtonVisibility: this.props.isFeedback ? "invisible" : "", otherPlayerButtonVisibility: "invisible"}});
      }
      this.enableButtons();
    }
  }

  /***
  * Handle audio playback error. Occurs when browser has disabled auroplay for video and audio.
  */
  audioPlaybackError()
  {
    // Playing problems DOMException: play() failed because the user didn't interact with the document first
    this.setState((props, prevState) => {return {audioPlayed: false, playButtonVisibility: this.props.isFeedback ? "invisible" : "", otherPlayerButtonVisibility: "invisible"}});
    // Enable button control and give user option to continue with(out) playing audio.
    this.enableButtons();
    if(this.props.callback)
    {
      this.props.callback();
    }
  }

  enableButtons()
  {
    let buttons = document.getElementsByClassName('button');
    if(buttons)
    {
      for(let i=0; i < buttons.length; i++)
      {
        buttons[i].classList.remove('invisible');
      }
    }
  }
}
