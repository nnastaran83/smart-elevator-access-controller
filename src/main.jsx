import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import store from './store/store.js';
import {Provider} from "react-redux";

//TODO: Setup Redux
ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
);
