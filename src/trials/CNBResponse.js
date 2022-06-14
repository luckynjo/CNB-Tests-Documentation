export default class CNBResponse{

	constructor(qid, response, reaction_time){
		this.qid = qid;
		this.response = response;
		this.reaction_time = reaction_time;
	}

	equalTo(other)
	{
		return this.qid === other.qid;
	}

	toString(){
		return this.qid + ":" + this.response + ":" + this.reaction_time;
	}
}
