import React from 'react';
import keypic from '../assets/keyboard.png';
import arrow from '../assets/flnb/arrow.png';
import arrow_head from '../assets/flnb/arrow_head.png';
import green_arrow from '../assets/flnb/green_arrow.png';
import twoback_arrow from '../assets/flnb/twoback_arrow.png';
import threeback_arrow from '../assets/flnb/three_back_arrow.png';
import {Row} from '../layouts/Row.js';
import Vr from '../assets/flnb/Vr.png';
import Kr from '../assets/flnb/Kr.png';
//import CustomComponent from '../components/CustomComponent.js';
//import SpecialInstructions from '../components/SpecialInstructions.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';

const IMG_REGEX = /\.?(png|gif|jpe?g)/ig;


export default class LNBDemo extends React.Component
{
	constructor(props)
	{
		super(props);
		this.divRef = React.createRef();
		this.scaleRef = React.createRef();
		this.next = this.next.bind(this);
		this.showBlank  = this.showBlank.bind(this);
		this.getArrows = this.getArrows.bind(this);
		this.top = 400;

		this.slide = this.slide.bind(this);
		this.restart = this.restart.bind(this);
		this.renderFinish = this.renderFinish.bind(this);
		this.items = this.props.content.items;
		this.answers = this.props.content.answers;
		this.nextItemTimerId = -1;
		this.blankTimerId = -1;
		this.slideTimerId = -1;
		this.state = {
			index: 0,
			demoIndex: -1,
			item: ""
		}
	}

	componentWillUnmount()
	{
		clearInterval(this.nextItemTimerId);
		clearInterval(this.slideTimerId);
	}

	restart()
	{
		clearInterval(this.nextItemTimerId);
		clearInterval(this.slideTimerId);
		this.nextItemTimerId = -1;
		this.slideTimerId = -1;

		this.setState((prevState, props) => {return {
				index: 0,
				demoIndex: -1,
				item: ""
			}
		});
	}

	next()
	{
		let newindex = this.state.index + 1;
		if(newindex === 1)
		{
			this.nextItemTimerId = setInterval(this.next, 3000);
		}

		if(newindex >2)
		{
			clearInterval(this.nextItemTimerId);
			this.setState((prevState, props) => {
				return {index: newindex}
			});
			if(newindex === 3)
			{
				setTimeout(this.next, 3000);
			}
			if(newindex > 3)
			{
				// Initially show a blank item.
				this.nextItemTimerId = setInterval(this.slide, 17, new Date(), 1000);
			}
		}
		else
		{
			this.setState((prevState, props) => {
				return {index: newindex}
			});
		}
	}

	slide(start, duration)
	{
		let dt = new Date() - start;
		if(this.state.demoIndex < 0)
		{
			if(dt < duration)
			{
				this.showBlank();
			}
			else
			{
				clearInterval(this.nextItemTimerId);
				let item = this.items[0];
				this.setState((prevState, props) => {
					return {item: item, demoIndex: 0}
				});
				this.nextItemTimerId = setInterval(this.slide, 17, new Date(), 2500);
			}
		}
		else if(dt <= 1000)
		{
			let item = this.items[this.state.demoIndex];
			this.setState((prevState, props) => {
				return {item: item}
			});
		}
		else if(dt < duration)
		{
			this.showBlank();
		}
		else
		{
			let dindex = this.state.demoIndex + 1;
			clearInterval(this.nextItemTimerId);
			if(dindex < this.items.length)
			{
				let item = this.items[dindex];
				this.setState((prevState, props) => {
					return {item: item, demoIndex: dindex}
				});
				/***if(dindex - 1 !== 3)
				{
					this.nextItemTimerId = setInterval(this.slide, 17, new Date(), 2500);
				}*/
				this.nextItemTimerId = setInterval(this.slide, 17, new Date(), 2500);

			}
			else
			{
				let newindex = this.state.index + 1;
				this.setState((prevState, props) => {
					return {index: newindex}
				});
			}

		}
	}

	showBlank()
	{
		this.setState((prevState, props) => {return {item: "\u00A0"}});
	}

	welcome()
	{
		let tracker = Math.random()*1000;
		let letters = this.items.map((item, index) => {
			let highlight = "";
			if(this.answers[index]===1 )
			{
				this.items = this.props.content.items;
				this.answers = this.props.content.answers;
			}
			if(this.answers[index]===1)
			{
				if(this.props.content.title === '1-BACK')
				{
					if(item.match(IMG_REGEX))
					{
						return <td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || arrow_head} alt="1 Back Arrow" className="arrow_head right"/><img className={"image-demo " + highlight} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/></td>
					}
					else
					{
						return <td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || arrow_head} alt="1 Back Arrow" className="arrow_head right"/><p className={"text--center " + highlight}>{item}</p></td>
					}
				}
				else if(this.props.content.title === '2-BACK')
				{
					if(item.match(IMG_REGEX))
					{
						return <td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || twoback_arrow} alt="2 Back Arrow" className="twoback_arrow_head"/><img className={"image-demo " + highlight} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/></td>
					}
					else
					{
						return <td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || twoback_arrow} alt="2 Back Arrow" className="twoback_arrow_head"/><p className={"text--center " + highlight}>{item}</p></td>
					}
				}
				else
				{
					if(item.match(IMG_REGEX))
					{
						return <td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || threeback_arrow} alt="3 Back Arrow" className="threeback_arrow_head"/><img className={"image-demo " + highlight} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/></td>
					}
					else
					{
						return <td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || threeback_arrow} alt="3 Back Arrow" className="threeback_arrow_head"/><p className={"text--center " + highlight}>{item}</p></td>
					}
				}
			}
			else
			{
				if(item.match(IMG_REGEX))
				{
					return <td className="col" key={tracker + index + 1}><img className={"image-demo " + highlight} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/></td>
				}
				else
				{
				return <td className="col" key={tracker + index + 1}><p className={"text--center " + highlight}>{item}</p></td>
				}
			}
		});
		tracker += this.items.length + 1;
		/***let audioPlayer = null;

		if(this.props.content.welcome.audio)
		{
			audioPlayer = <AudioPlayer key={tracker + 1} audio={this.props.content.welcome.audio} />
		}*/
		tracker+=1;
		return (
			<>
			<div className="instructions lnb-demo text--left">
			 {this.props.content.welcome.map((item, index) => <div key={tracker + index + 1}><p>{item}</p><br/></div>)}


			<div className="container arrow--container">
			<table className="letters align-content-center">
			 <tbody>
			 {this.getArrows(1)}
			  <tr>
			    {letters}
				</tr>
			 </tbody>
			</table>
			</div>
			</div>

			<div className="lnb-demo-welcom-buttons-position">
			<table className="buttons-table">
			<tbody>
			<tr>
			<td>
			 <div className="boxed">
			  <p>{this.props.content.quitMessage || 'Skip training movie and return to practice'}</p>
				<GoBackButton classList="center--horizontal" onClick={this.props.skipPractice} text={this.props.back_button_text || "GO BACK"}/>
			 </div>
			</td>
			<td><ContinueButton text={this.props.continue_button_text} onClick={this.next}/></td>
			<td><div></div></td>
			</tr>
			</tbody>
			</table>
			</div>


			</>
		)
	}

	renderFinish()
	{
		clearInterval(this.nextItemTimerId);
		console.log('Finishing demo!');
		return (
			<>
			<div className="instructions lnb-demo text--left">
				{this.props.content.finish.map((instruction, index) => {
						return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
				})}
			</div>
			<div className="position-bottom--absolute">
			<table className="buttons-table">
			<tbody>
			<tr>
			<td><div><GoBackButton text={this.props.back_button_text} onClick={this.props.onContinue}/></div></td>
			<td><ContinueButton  text={this.props.continue_button_text} onClick={this.props.onContinue}/></td>
			<td><div></div></td>
			</tr>
			</tbody>
			</table>
			</div>
			</>
		);
	}

/***

<Row classList="letters align-content-center">{letters}</Row>
*/
	renderIntroduction()
	{
		let tracker = Math.random()*1000;
		const letters = this.items.map((item, index) => { return this.renderItemCol(item, tracker + index + 1)});

		return (
			<div className="instructions lnb-demo text--left">
			<table className="letters align-content-center thing ">
			 <tbody>
			 {this.getArrows()}
				<tr>
					{letters}
				</tr>
			 </tbody>
			</table>
			</div>
		);
	}

	getArrows(start)
	{
		let size = this.items.length - 1;
		let arr = this.items.map((item,index) => {
			let add = index === 0 || index === size ? "" : "invisible";
			if((start || index === this.state.demoIndex) && this.answers[index] === 1)
			{
				return <td className="col" key={index+100}><img src={this.props.content.pressArrow || green_arrow} alt="&#8595;" className="press_arrow "/></td>
			}
			else
			{
				return <td className="col" key={index+100}><img src={this.props.content.arrow || arrow} alt="&#8595;" className={"arrow " + add + " "} /></td>
			}
		});

		let hint = this.items.map((item, index) => {
			if(index === 0)
			{
				return <td className="col" key={index + 200}><div><p className="letter--hint first text--center">{this.props.content.firstArrow || '1st Letter'}</p></div></td>
			}
			else if(index === this.items.length-1)
			{
				return <td className="col" key={index + 200}><div><p className="letter--hint last text--center">{this.props.content.lastArrow || 'Last Letter'}</p></div></td>
			}
			else if((start || index === this.state.demoIndex) && this.answers[index] === 1)
			{
				return <td className="col" key={index + 200}><div><p className="letter--hint green">{this.props.content.press || 'PRESS'}</p></div></td>
			}
			else
			{
				return <td className="col" key={index + 200}><div><p className="letter--hint invisible">Letter</p></div></td>
			}
		});

		return(
			<>
			<tr>
			 {hint}
			</tr>
			<tr>
			 {arr}
			</tr>
			</>
		);
	}

	renderBoxes()
	{
		let tracker = Math.random()*1000;
		const inside_window_demo = this.renderInsideWindowDemo();
		let letters = this.items.map((item, index) => {
			if(index === this.state.demoIndex && this.answers[index] === 1)
			{
				if(item.match(IMG_REGEX))
				{
					return <td className="col" key={tracker + index + 1}><img className={"image-demo letter--hint"} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/></td>
				}
				else
				{
				return <td className="col"><p className="text--center letter--hint">{item}</p></td>
				}
			}
			else
			{
				return this.renderItemCol(item, tracker + index + 1);
			}
		});
		this.items = this.props.content.items;
		this.answers = this.props.content.answers;;

		return (

			<>
			<div className="instructions lnb-demo text--left">
			 <div className="container arrow--container ">
					<table className="letters align-content-center">
					 <tbody>
					 {this.getArrows()}
						<tr>
						 {letters}
						</tr>
					 </tbody>
					</table>
			  </div>
				<br/>
				<div ref={this.scaleRef} className="center--horizontal scaled">
				{inside_window_demo}
	     </div>
			 </div>
			</>
		);
	}

	renderBoxesPause()
	{
		clearInterval(this.nextItemTimerId);
		const inside_window_demo = this.renderInsideWindowDemo();
		let tracker = Math.random()*1000;
		const letters = this.items.map((item, index) => { return this.renderItemCol(item, tracker + index + 1)});

		this.items = this.props.content.items;
		this.answers = this.props.content.answers;;

		return (

			<>
			<div className="instructions lnb-demo text--left">
			<div className="container arrow--container">

			<table className="letters align-content-center">
			 <tbody>
			 {this.getArrows()}
			  <tr>
				 {letters}
				</tr>
			 </tbody>
			</table>
			</div>

      <div className="smallbox">
			{inside_window_demo}
			</div>

			<div className="during-the-demo">
			{this.props.content.duringTheDemo.map((item, index) => {return <div key={100 + index}><p>{item}</p></div>})}
			</div>

			</div>

			<div className="position-bottom--absolute">
	    <table className="buttons-table">
	    <tbody>
	    <tr>
	    <td><div></div></td>
	    <td><ContinueButton text={this.props.continue_button_text} onClick={this.next}/></td>
	    <td><div></div></td>
	    </tr>
	    </tbody>
	    </table>
			</div>
			</>
		);
	}

	///// 			{this.state.item.match(IMG_REGEX) ?  <img className="demo-image center--horizontal" src={this.props.base_url + "stimuli/flnb/" + this.state.item} alt="Demo" /> : <p className="stimulus-text--medium stimulus-text--demo">{this.state.item}</p>}

	renderInsideWindowDemo()
	{
		return (
			<div>
			<table className="box-pause-content">
			<tbody>
			<tr>
			<td className="demo-text--container">
			<p className="text--center--vertically during-the-demo--text">{this.props.content.window[0] || 'What you will see during the test is inside this window.'}</p>
			</td>
			<td className="box--container">
			<div className="box center--horizontal">
			 <table className="buttons-table">
				<tbody>
				 <tr>
					<td>
					 <p className="text--center during-the-demo--text">{this.props.content.verbose_title || 'Verbose N Back Title missing'}</p>
					</td>
				 </tr>
				 <tr>
					<td>
					 <div className="text--center during-the-demo--text"><p>{this.props.content.window[1]}</p></div>
					</td>
				 </tr>
				 <tr>
					<td>
					 <div className="flex inline center--horizontal stimulus-image-demo-container">
					 {
						 this.props.content.title.includes("1") &&
					   <>
						  <img src={Vr} className="stimulus-image-demo" alt="M"/>
							<img src={Vr} className="stimulus-image-demo" alt="M"/>
						</>
					 }
					 {
						 this.props.content.title.includes("2") &&
						 <>
						  <img src={Kr} className="stimulus-image-demo" alt="M"/>
							<img src={Vr} className="stimulus-image-demo" alt="M"/>
							<img src={Kr} className="stimulus-image-demo" alt="M"/>
						</>
					 }
					 </div>
					</td>
				 </tr>
				 <tr>
					<td>
					 <img src={keypic} alt="Keyboard" className="keyboard center--horizontal"/>
					</td>
				 </tr>
				</tbody>
			 </table>
			</div>
			</td>
			<td className="demo-text--container"><p></p></td>
			</tr>
			</tbody>
			</table>
			</div>
		)
	}
	renderItemCol(item, id)
	{
		if(item.match(IMG_REGEX))
		{
			return <td className="col" key={id}><img className={"image-demo "} src={this.props.content.base_url + "stimuli/flnb/" + item} alt={item}/></td>
		}
		else
		{
		return <td className="col" key={id}><p className={"text--center"}>{item}</p></td>
		}
	}

	renderBoxesPost()
	{
		clearInterval(this.nextItemTimerId);
		const inside_window_demo = this.renderInsideWindowDemo();
		this.items = this.props.content.items;
		this.answers = this.props.content.answers;;
		let tracker = Math.random()*1000;
		const letters = this.items.map((item, index) => { return this.renderItemCol(item, tracker + index + 1)});


		return (

			<>
			<div className="instructions lnb-demo text--left">
			<div className="container arrow--container ">
			<table className="letters align-content-center">
			 <tbody>
			 {this.getArrows()}
			  <tr>

				 {letters}
				</tr>
			 </tbody>
			</table>
			</div>
			<br/>
			{inside_window_demo}
			<Row>
			<div className="col"><p></p></div>
			</Row>
			</div>

			<div className="position-bottom--absolute">
	    <table className="buttons-table">
	    <tbody>
	    <tr>
	    <td><div></div></td>
	    <td><ContinueButton text={this.props.continue_button_text} onClick={this.next}/></td>
	    <td><div></div></td>
	    </tr>
	    </tbody>
	    </table>
			</div>
			</>
		);
	}

	renderDemo()
	{
		let tracker = Math.random()*1000;
		let letters = this.items.map((item, index) => {

			let highlight = index === this.state.demoIndex ? "hint-mem--p" : "";
			this.answers = this.props.content.answers;

			if(index === this.state.demoIndex && this.answers[index]===1)
			{
				if(this.props.content.title === '1-BACK')
				{
					let it = <p className={"text--center " + highlight}>{item}</p>;
					if(item.match(IMG_REGEX))
					{
						it = <img className={"image-demo " + highlight} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/>
					}
					return (<td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || arrow_head} alt="1 Back Arrow" className="arrow_head right"/>
					{it}
					</td>)
				}
				else if(this.props.content.title === '2-BACK')
				{
					let it = <p className={"text--center " + highlight}>{item}</p>
					if(item.match(IMG_REGEX))
					{
						it = <img className={"image-demo " + highlight} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/>
					}
					return <td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || twoback_arrow} alt="2 Back Arrow" className="twoback_arrow_head"/>{it}
					</td>
				}
				else
				{
					let it = <p className={"text--center " + highlight}>{item}</p>
					if(item.match(IMG_REGEX))
					{
						it = <img className={"image-demo " + highlight} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/>
					}
					return <td className="col" key={tracker + index + 1}><img src={this.props.content.nbackArrow || threeback_arrow} alt="3 Back Arrow" className="threeback_arrow_head"/>{it}
					</td>
				}
			}
			else
			{
				if(item.match(IMG_REGEX))
				{
					return <td className="col" key={tracker + index + 1}><img className={"image-demo " + highlight} src={this.props.base_url + "stimuli/flnb/" + item} alt={item}/></td>
				}
				else
				{
				return <td className="col" key={tracker + index + 1}><p className={"text--center " + highlight}>{item}</p></td>
				}
			}
		});

		return (
			<>
			<div className="instructions lnb-demo text--left">
			<div className="container arrow--container">
			<table className="letters align-content-center">
			 <tbody>
			 {this.getArrows()}
			  <tr>
				 {letters}
				</tr>
			 </tbody>
			</table>
			</div>
<br/>
			<div ref={this.scaleRef} className="center--horizontal">
			<table className="box-pause-content">
			<tbody>
			<tr>
			<td className="demo-text--container">
			<p className="text--center--vertically during-the-demo--text">{this.props.content.window[0] || 'What you will see during the test is inside this window.'}</p>
			</td>
			<td className="box--container">
			<div className="box center--horizontal">
			{this.state.item.match(IMG_REGEX) ?  <img className="demo-image center--horizontal" src={this.props.content.base_url + "stimuli/flnb/" + this.state.item} alt="Demo" /> : <p className="stimulus-text--medium stimulus-text--demo">{this.state.item}</p>}
			</div>
			</td>
			<td className="demo-text--container"><p></p></td>
			</tr>
			</tbody>
			</table>
</div>
</div>
			</>
		);
	}


	render()
	{
		let content;
		if(this.state.index === 0)
		{
			content= this.welcome();
		}
		else if(this.state.index === 1)
		{
			content = this.renderIntroduction();
		}
		else if(this.state.index === 2)
		{
			content = this.renderBoxesPause();
		}
		else if(this.state.index === 3)
		{
			content = this.renderBoxes();
		}
		else if(this.state.index === 4)
		{
			content = this.renderBoxesPost();
		}
		else if(this.state.index === 5)
		{
			content = this.renderDemo();
		}
		else
		{
			content = this.renderFinish();
		}

		return (<div className="container center--horizontal">{content}</div>);
	}
}
