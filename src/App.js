import logo from './logo.svg';
//import {TestVersionsEditor} from './tools/TestVersionsEditor.js';
import TaskRunner from './tools/TaskRunner.js';


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
const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//const BASE_URL = "http://localhost/";
return (
	<TestVersionsEditor />
)
}

export default App;
