import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { createStore } from 'redux';



export const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

console.log("STORE",store.getState())

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>, 
document.getElementById('root'));


serviceWorker.unregister();
