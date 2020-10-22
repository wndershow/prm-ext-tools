import { useEffect } from 'react';
import style from '@/app.scss';

export default () => {
  useEffect(() => {}, []);

  return (
    <div className="app">
      <button
        onClick={() => {
          window.open('https://www.sina.com.cn/', 'XX', 'fullscreen,scrollbars,resizable=yes,toolbar=no');
        }}
      >
        start
      </button>
      <style>{style[0][1]}</style>
    </div>
  );
};
