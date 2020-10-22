import React from 'react';
import Logo from '@/components/Logo';
import style from './style.scss';

export default ({ onClose = null }) => {
  return (
    <div className="com-app-header flex items-center">
      <div className="-logo">
        <Logo></Logo>
      </div>
      <div className="flex-auto tc -main">
        <a href="http://www.baidu.com" target="_blank">
          WhatsDis
        </a>
      </div>
      <div className="pointer -close" onClick={onClose}>
        <svg className="icon" aria-hidden="true">
          <use href="#icon-close"></use>
        </svg>
      </div>
      <style>{style[0][1]}</style>
    </div>
  );
};
