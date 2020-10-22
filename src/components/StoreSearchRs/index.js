import React from 'react';
import style from './style.scss';
const IMG_URL = process.env.IMG_URL;

export default ({ stores }) => {
  console.info(stores);
  return (
    <div className="com-search-store-rs">
      {!stores.length && <div className="tc pa3 fs-l">no rs!</div>}
      <ul>
        {stores.map(n => (
          <li key={n.id}>
            <a href={n.affUrl} className="flex items-center" target="_blank">
              <div className="-img flex-s-0">
                <img src={`${IMG_URL}/${n.logoPic}`} />
              </div>
              <div className="flex-auto">{n.name}</div>
            </a>
          </li>
        ))}
      </ul>
      <style>{style[0][1]}</style>
    </div>
  );
};
