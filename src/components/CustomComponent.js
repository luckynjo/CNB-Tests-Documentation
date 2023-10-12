import React from 'react';
import {ContinueButton} from './ContinueButton.js';
import {BackButton} from './GoBackButton.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function parse(data, props)
{
	let tracker = Math.random()*1000 + 1;
	if(props && props.placeholder)
	{
		return parse({type:data.type, classList:data.classList, content: props.placeholder});
	}
	else if(data.type === 'element')
	{
		return data.content;
	}
	else if(data.type === 'p' && data.content === '')
	{
		return (<br key={tracker}></br>)
	}
	else if(data.type === 'p')
	{
		return (<Col lg={data.columns}><p  key={tracker} className={data.classList}>{data.content}</p></Col>)
	}
	else if(data.type == 'img')
	{
		return (<Col><img  key={tracker} className={data.classList} src={data.content} alt={data.content} /></Col>)
	}
	else if(data.type === 'buttons')
	{

		var content = data.content.map((c, index) => <Col key={tracker + index}><div onClick={(e) => c.onClick(c.response)} className={'button ' + data.classList}>{c.text}</div></Col>);
		return (<Row>{content}</Row>)
	}
	else if(data.type === 'button')
	{
		return (<Col><button  key={tracker} onClick={ (e) => props.onClick(data.response, e)} className={'button ' + data.classList}>{data.content || ''}</button></Col>)
	}
	else if(data.type === 'list')
	{
		var content = data.content.map((c, index) => parse(c, props));
		return content;
	}
	else if(data.type === 'span')
	{
		return <Col lg={data.columns}><span  key={tracker} className={data.classList}>{data.content}</span></Col>
	}
	else if(data.type === 'rows')
	{
		var content =data.content.map((c, index) => <Row>parse(c, props)</Row>);
		return content;
	}
	// Specifically for tap
	else if(data.type === 'spanlist')
	{
		var content =data.content.map((c, index) => <Row>parse(c, props)</Row>);
		return content;
	}
	 else
	{
		return (<Row className="fullWidth"><Col><span  key={tracker} className={data.classList}>{data.content}</span></Col></Row>)
	}
}

export default function CustomComponent(props)
{
	let content;
	if(props.content.type === 'list' || props.content.type === 'rows' || props.content === 'buttons')
	{
		content = props.content.content.map((c, index) => <Row key={index} className={props.classList}>{parse(c, props)}</Row> );
	}
	else
	{
		content = (<Container key={Math.random()*2000 + 1}>{parse(props.content, props)}</Container>)
	}
           return (
              <Container className={props.container_style || props.content.classList}>

                {content}

              </Container>
          );

}
