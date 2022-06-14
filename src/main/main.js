import React, {Suspense} from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Switch, Route } from "react-router-dom";
//https://reactjs.org/docs/code-splitting.html
//import {TaskTranslator} from '../tools/TaskTranslator.js';
const TaskEditor = React.lazy(() => import('../tools/TaskEditor.js'));
//const TaskTimelineEditor = React.lazy(() => import('../tools/TaskTimelineEditor.js'));
const TaskTranslator = React.lazy(() => import('../tools/TaskTranslator.js'));

// Options: new or editing upload. 

function home

export const Main = props => {
  return (

    <BrowserRouter>
    <Routes>
      <Route path="/" element={<TaskTranslator />}>
        <Route
          path="about"
          element={
            <React.Suspense fallback={<div>Loading... </div>}>
              <TaskEditor />
            </React.Suspense>
          }
        />
        <Route path="*" element={<TaskTranslator />} />
      </Route>
    </Routes>

    </BrowserRouter>
  )
}
