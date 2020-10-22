import React from 'react';
import { render } from 'react-dom';
import App from './App';
import root from 'react-shadow';
import style from '@/index.scss';

const containerDiv = document.createElement('div');
containerDiv.id = '____beanbag';
document.body.appendChild(containerDiv);

render(
  <root.div mode="closed">
    <div className="____beanbag">
      <App />
      <style>{style[0][1]}</style>
    </div>
  </root.div>,
  containerDiv
);
