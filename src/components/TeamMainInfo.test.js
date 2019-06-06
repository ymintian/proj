import React from 'react';
import ReactDOM from 'react-dom';
import {parseColor} from './TeamMainInfo';

it('parseColor test', () => {
    const colors = parseColor(" Red/ Blue/ Green ");
    expect(colors).toEqual(["red","blue","green"])
    
  });

  it('parseColor complex color test', () => {

    const colors = parseColor(" Royal Red/ Light Orange/ Sky Blue ");
    expect(colors).toEqual(["red","orange","blue"])
    
  });