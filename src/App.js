import { useState, useEffect } from 'react';
import AppBody from '@/components/AppBody';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import Icons from '@/Icons';
import style from '@/app.scss';

export default () => {
  const [close, setClose] = useState(false);

  useEffect(() => {
    console.info(window.location, document.domain);
    console.info(`___xxx`);
  }, []);

  return (
    <div className={`app flex flex-column ${close && 'dn'}`}>
      <Icons></Icons>
      <div className="app-hd">
        <AppHeader onClose={() => setClose(true)}></AppHeader>
      </div>
      <div className="app-bd flex-auto">
        <div className="-inner">
          <AppBody></AppBody>
        </div>
      </div>
      {false && (
        <div className="app-ft">
          <AppFooter></AppFooter>
        </div>
      )}
      <style>{style[0][1]}</style>
    </div>
  );
};
