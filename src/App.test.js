import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App.js';

Enzyme.configure({ adapter: new Adapter() });

const sum = (a,b) => a+b;

test('first test', () => {
  
  const App1 = shallow(<App/>);
  
  App1.setState({isLoading: false});

  expect(App1.find('.container')).toHaveLength(1);
  
  //expect(App1.find('#root')).html().toBe(1);
});
