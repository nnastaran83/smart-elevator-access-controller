import 'core-js/stable';
import 'regenerator-runtime/runtime'; //This import is required for the speech recognition
import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
import App from './App.jsx';
import 'semantic-ui-css/semantic.min.css';
import {store} from "./store/index.js";


/**
 * Render the App component into the root of the DOM.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App/>
    </Provider>
);
