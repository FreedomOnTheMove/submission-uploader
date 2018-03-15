import React from 'react';
import ReactDOM from 'react-dom';
import Uploader from './Uploader';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Uploader />, document.getElementById('root'));
registerServiceWorker();
