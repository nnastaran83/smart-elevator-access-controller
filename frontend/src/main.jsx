import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './components/App.jsx';
import './styles/index.css';
import 'semantic-ui-css/semantic.min.css';


/**
 * Render the App component into the root of the DOM.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <App/>
    </Router>
);
