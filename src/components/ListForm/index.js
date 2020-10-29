import { useRef, useState, useEffect } from 'react';
import style from './style.scss';
import * as $api from '@/apis';
import cogoToast from 'cogo-toast';

const ListForm = ({
  onClose = null,
  coupons = [],
  onChange = null,
  onHide = null,
  className = '',
  supportCouponItemUrl = false,
  csDomain = '',
  csStatus = '',
  csId = 0,
}) => {
  const st = useRef(null);
  const [cpid, setCpid] = useState(0);
  const [changed, setChanged] = useState({ fieldName: '', idx: -1, value: '' });
  const [domain, setDomain] = useState(csDomain);
  const [loading, setLoading] = useState(false);

  const ces = [...coupons];
  if (changed.fieldName) {
    ces[changed.idx][changed.fieldName] = changed.value;
  }

  const handleSave = async () => {
    setLoading(true);
    await $api.saveData({ coupons: ces, domain, csId });
    setLoading(false);
    cogoToast.success('save successed!', {
      toastContainerID: '#ct-ctn',
      hideAfter: 0,
    });
  };

  const handleItemFieldChange = (fieldName, idx, value) => {
    setChanged({ fieldName, idx, value });

    if (st && st.current) clearTimeout(st.current);
    st.current = setTimeout(() => {
      onChange && onChange({ idx, value: ces[idx] });
      clearTimeout(st.current);
    }, 500);
  };

  useEffect(() => {
    setChanged({ fieldName: '', idx: -1, value: '' });
  }, [coupons]);

  return (
    <div id="com-list-form" className={`com-list-form ${className}`}>
      <div className="com-list-form-inner">
        <div className="tr space">
          <a onClick={onHide}>Hide</a>
          <a onClick={onClose}>Close</a>
        </div>
        <div className="red mb1">note: need login</div>
        <div className="mb1">
          Cs Domain:
          {csStatus === 'enable' && csDomain}
          {csStatus === 'pedding-complete' && (
            <input
              type="text"
              value={domain}
              onChange={e => {
                setDomain(e.target.value);
              }}
            />
          )}
        </div>
        <table className="mb2">
          <thead>
            <tr>
              <th>Id</th>
              <th width="280">Title</th>
              <th width="280">{supportCouponItemUrl ? 'Url' : 'Term'}</th>
              <th width="120">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ces.map((n, idx) => {
              return (
                <tr
                  key={`${n.id}__${idx}`}
                  className={n.__id === cpid && '_c'}
                  onClick={() => {
                    setCpid(n.__id);
                  }}
                >
                  <td className="tl">
                    <div className="flex mb1 items-center">
                      <div className="pr1 flex-shrink-0" style={{ width: '130px' }}>
                        <input
                          className="__id"
                          type="text"
                          value={n.__id}
                          onChange={e => handleItemFieldChange('__id', idx, e.target.value)}
                        />
                      </div>
                      <div className="flex-auto">
                        <select value={n.type} onChange={e => handleItemFieldChange('type', idx, e.target.value)}>
                          <option value="code">code</option>
                          <option value="deal">deal</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center mb1">
                      <div className=" pr1 flex-shrink-0" style={{ width: '130px' }}>
                        {n.type === 'code' ? (
                          <input
                            placeholder="code"
                            type="text"
                            className={`db ${!!!n.code.trim() && 'error'}`}
                            value={n.code}
                            onChange={e => handleItemFieldChange('code', idx, e.target.value)}
                          />
                        ) : (
                          '---'
                        )}
                      </div>

                      <div className="flex-auto">
                        <input
                          placeholder="expire at"
                          type="text"
                          value={n.expireAt}
                          onChange={e => handleItemFieldChange('expireAt', idx, e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="pr1 flex-shrink-0" style={{ width: '130px' }}>
                        <select
                          placeholder="is valid"
                          value={n.isValid}
                          onChange={e => handleItemFieldChange('isValid', idx, e.target.value)}
                        >
                          <option value="0">no</option>
                          <option value="1">yes</option>
                        </select>
                      </div>
                      <div className="flex-auto">
                        <input
                          type="text"
                          value={n.usedNum}
                          onChange={e => handleItemFieldChange('usedNum', idx, e.target.value)}
                        />
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="mb1">
                      <input
                        placeholder="title"
                        className="db"
                        type="text"
                        value={n.title}
                        onChange={e => handleItemFieldChange('title', idx, e.target.value)}
                      />
                    </div>

                    <div>
                      <textarea
                        placeholder="description"
                        value={n.description}
                        rows={3}
                        onChange={e => handleItemFieldChange('description', idx, e.target.value)}
                      />
                    </div>
                  </td>

                  <td>
                    {supportCouponItemUrl && (
                      <div className="mb1">
                        <input
                          placeholder="url"
                          className={`db ${!!!n.url.trim() && 'warnning'}`}
                          type="text"
                          value={n.url}
                          onChange={e => handleItemFieldChange('url', idx, e.target.value)}
                        />
                      </div>
                    )}

                    <div>
                      <textarea
                        placeholder="term"
                        value={n.term}
                        rows={supportCouponItemUrl ? 3 : 5}
                        onChange={e => handleItemFieldChange('term', idx, e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="tc">
                    {(n.type === 'code' || supportCouponItemUrl) && n.triggerUrl && (
                      <a href={`${n.triggerUrl}&__item_idx=${idx}`} target="_blank">
                        Fire
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="space">
          <button className="pure-button pure-button-primary" onClick={handleSave}>
            Save{loading && '...'}
          </button>
        </div>
      </div>

      <style>{style[0][1]}</style>
    </div>
  );
};

export default ListForm;
