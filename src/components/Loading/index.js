import React from 'react';
import style from './style.scss';

export default () => {
  return (
    <div className="com-loading">
      <div className="spinner">
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
      <style>{style[0][1]}</style>
    </div>
  );
};
