import React from 'react'
import ReactDOM from "react-dom/client";
import App from './Components/App'
import Styles from './Components/Styles/Main.css'
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<div class = "container">
		<App />
    </div>
)