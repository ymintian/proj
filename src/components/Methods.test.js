import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {parseColor} from './TeamMainInfo.js';

Enzyme.configure({ adapter: new Adapter() });



test('Methods test', () => {
  let colorsArr = parseColor("red/green/yell");
  console.log(colorsArr.constructor.name);
  expect(colorsArr.constructor.name).toBe('Array');
  expect(colorsArr.length).toBe(3);

  let noArgsCall = parseColor();
  expect(noArgsCall).toBe(null);

  let nonStringCall = parseColor(43);
  expect(nonStringCall).toBe(null);

});
