import logo from './logo.svg';
import {TestVersionsEditor} from './tools/TestVersionsEditor.js';
//import TaskRunner from './tools/TaskRunner.js';


import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Switch, Route } from "react-router-dom";

function App(){
/***	return(
		<BrowserRouter>
	<Routes>
			<Route index element={<TaskRunner />} />
			<Route path="/assess" element={<TaskRunner />} />
			<Route path="/manage" element={<TestVersionsEditor />} />
	</Routes>
</BrowserRouter>
)*/
//const BASE_URL = "http://localhost/";
//const BASE_URL = "https://webcnp.med.upenn.edu/surveys/";
const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//const ASSESSMENT_URL = "https://webcnp.med.upenn.edu/surveys/survey.pl";
const ASSESSMENT_URL = "https://penncnp-dev.pmacs.upenn.edu/webcnp.pl";
//const ASSESSMENT_URL = "http://localhost/webcnp.pl";
//const BASE_URL = "http://localhost/";
return (
	<TestVersionsEditor base_url={BASE_URL} assessment_url={ASSESSMENT_URL}/>
)
}

export default App;
