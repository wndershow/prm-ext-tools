import React, { useRef } from 'react';
import style from './style.scss';
export default ({ onSearch = null }) => {
  const input = useRef(null);
  return (
    <div className="com-search-box flex items-center">
      <div className="flex-auto -input">
        <input
          ref={input}
          type="text"
          placeholder="Search the brand you like"
          onKeyUp={e => {
            if (e.keyCode !== 13) return;
            onSearch && onSearch(e.target.value);
          }}
        />
      </div>
      <div className="-btn" onClick={() => onSearch && onSearch(input.current.value)}>
        <svg className="icon" aria-hidden="true">
          <use href="#icon-search"></use>
        </svg>
      </div>
      <style>{style[0][1]}</style>
    </div>
  );
};
