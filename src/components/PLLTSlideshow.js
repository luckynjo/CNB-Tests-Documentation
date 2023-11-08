import React from 'react';


export class PLLTSlideshow extends React.Component{
  constructor(props)
  {
    super(props);
    const words = this.props.words || JSON.parse(this.props.content).slice(1);
    const stimulus = words[0];
    this.state = {
      trial: 0,
      stimulus: stimulus,
      trialTime: new Date(),
      active: false
    };
    this.words = words;
    this.intervalid = -1;
  }

  componentDidMount()
  {
    this.start();
  }

  componentWillUnmount()
  {
    this.stop();
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
    // By default all our slideshows are 5 seconds long.
    if(duration >= 1000 && !this.state.active)
    {
      this.setState((prevState, props) => {
        return {active: true, trialTime: new Date()};
      }, this.start);
    }
    else if(duration >= 1000)
    {
      this.next();
    }
    else
    {
      this.intervalid = setTimeout(() => {this.update();}, 32);
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
    const next_trial = this.state.trial + 1;
    const trial_count = this.words.length;
    this.stop();
    if(next_trial < trial_count)
    {
      const stimulus = this.words[next_trial];
      this.setState((prevState, props) => {
        return {trial: next_trial, stimulus: stimulus, trialTime: new Date()};
      }, this.start);
    }
    else
    {
      this.props.onSlideShowComplete();
    }
  }

  render()
  {
    // Render all words
    let stimulus = this.state.stimulus;
    const words = this.words;
    let count = words.length;
    let wordsLeft = words.slice(0, count/2);
    let wordsRight = words.slice(count/2);

    const rendered_words = wordsLeft.map((word, index) =>
    <tr key={index}>
    <td className="left"><p style={this.props.form && this.props.form === "c" && this.props.language === "de_DE" ? {fontSize: "18px"} : {}} className={wordsLeft[index] === stimulus && this.state.active ? "word active" : "word"}>{wordsLeft[index]}</p></td>
    <td className="right"><p style={this.props.form && this.props.form === "c" && this.props.language === "de_DE" ? {fontSize: "18px"} : {}} className={wordsRight[index] === stimulus && this.state.active  ? "word active" : "word"}>{wordsRight[index]}</p></td>
    </tr>)

    return(
      <div className={"pllt--instructions center"}>
      <table className="words center--horizontal">
       <tbody>
       {rendered_words}
       </tbody>
      </table>
      </div>
    );
  }
}
