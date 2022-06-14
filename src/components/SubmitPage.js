import React from 'react';

export default class SubmitPage extends React.Component
{

	constructor(props)
	{
		super(props);
	}

	componentDidMount()
	{
		if(this.props.logs && this.props.logs.length > 0)
		{
			this.sendLog();
		}
		else
		{
			setTimeout(function(){document.getElementById("form").submit();}, 10);
		}
	}

	sendLog()
	{
		const data = this.props.logs.join(';');
		//console.log('event log', data);
		console.log('sending log');
		setTimeout(function(){document.getElementById("form").submit();}, 200);
		console.log('timeout set');
		try {
			console.log('attempt send');
			fetch('/event_log2.pl', {
				method: 'POST', // or 'PUT'
				headers: {
					'Content-Type': 'text/plain',
				},
				body: data,
			})
			.then(response => console.log(response))
			.then(data => console.log(data))
			.catch((error) => console.log(error));
		} catch (e) {

		} finally {

		}

	}

	render()
	{
		return (
			<form id="form" className="invisible" method="post" action="">
			<input type="hidden" name="op" value="AddResponses" />
			<input type="hidden" name="test" value={this.props.test} />
			<input type="hidden" id="skipped" name="skipped" value={this.props.skipped || 0} />
			<input type="hidden" id="responses" name="responses" value={this.props.responses}/>
			<input type="hidden" id="starttime" name="starttime" value={this.props.starttime}/>
			<input type="hidden" id="endtime" name="endtime" value={(new Date()).toUTCString()} />
			<input type='submit' value="Submit"/>
			</form>
		);
	}
}
