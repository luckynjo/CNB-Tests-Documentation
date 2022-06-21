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
      trialTime: new Date()
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
    this.intervalid = setTimeout(() => {this.update();}, 64);
  }

  update()
  {
    const starttime = this.state.trialTime;
    const duration = (new Date()) - starttime;
    // Show next trial
    // By default all our slideshows are 5 seconds long.
    if(duration >= 1000)
    {
      this.next();
    }
    else
    {
      this.intervalid = setTimeout(() => {this.update();}, 64);
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
    <td className="left"><p className={wordsLeft[index] === stimulus ? "word active" : "word"}>{wordsLeft[index]}</p></td>
    <td className="right"><p className={wordsRight[index] === stimulus ? "word active" : "word"}>{wordsRight[index]}</p></td>
    </tr>)

    return(
      <div className={"instructions center"}>
      <table className="words center--horizontal">
       <tbody>
       {rendered_words}
       </tbody>
      </table>
      </div>
    );
  }
}
