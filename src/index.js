import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto'
import './index.css';
import App from './components/App';
// import registerServiceWorker from './registerServiceWorker';

const root = document.createElement('div');
root.style.background = '#f5f5f5;';
root.style.height = '100%';

ReactDOM.render(<App/>, document.body.appendChild(root));
// registerServiceWorker();