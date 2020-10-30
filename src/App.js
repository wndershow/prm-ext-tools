import { useEffect, useState } from 'react';
import style from '@/app.scss';
import PageList from '@/container/PageList';
import PageTrigger from '@/container/PageTrigger';
import PageDetail from '@/container/PageDetail';
import * as _storage from '@/lib/storage';
import { getQuery } from '@/lib/url';

export default () => {
  const [pageType, setPageType] = useState('');
  const [open, setOpen] = useState('');

  useEffect(async () => {
    const __ext_tools = getQuery('__ext_tools');
    const __page_type = getQuery('__page_type');

    setPageType(__page_type);
    setOpen(__ext_tools);
  }, []);

  if (open !== 'y') return null;

  return (
    <div className="app">
      {pageType === 'list' && <PageList></PageList>}
      {pageType === 'trigger' && <PageTrigger></PageTrigger>}
      {pageType === 'detail' && <PageDetail></PageDetail>}
      <style>{style[0][1]}</style>
    </div>
  );
};
