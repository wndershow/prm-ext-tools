import React from 'react';
import { render } from 'react-dom';
import App from './App';
import root from 'react-shadow';
import style from '@/index.scss';

const containerDiv = document.createElement('div');
containerDiv.id = '____beanbag';
document.body.appendChild(containerDiv);

render(
  <div>
    <root.div mode="closed">
      <div className="____beanbag">
        <App />
        <div id="ct-ctn"></div>
        <style>{style[0][1]}</style>
      </div>
    </root.div>
    <style>
      {`#ct-container {
       z-index: 30000;
      }`}
    </style>
  </div>,
  containerDiv
);
