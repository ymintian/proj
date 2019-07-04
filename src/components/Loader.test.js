import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Loader from './Loader.js';

Enzyme.configure({ adapter: new Adapter() });

const sum = (a,b) => a+b;

console.log(Loader);

test('Loader test', () => {
  
  const loader = shallow(<Loader/>);
  
  expect(loader.find('img')).toHaveLength(1);

});
