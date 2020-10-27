import { useRef } from 'react';
import style from './style.scss';
import { getQuery } from '@/lib/url';
import { sendMsg } from '@/lib/runtime';

const ListForm = ({ onClose = null, coupons = [], onChange = null }) => {
  const st = useRef(null);
  const csId = getQuery('__cs_id');

  const handleOnSave = async () => {
    console.info(coupons);
  };

  const handleItemFieldChange = (fieldName, idx, value) => {
    if (st && st.current) clearTimeout(st.current);
    st.current = setTimeout(() => {
      let c = coupons[idx];
      c[fieldName] = value;
      onChange && onChange({ idx, value: c });
      clearTimeout(st.current);
    }, 500);
  };

  return (
    <div className="com-list-form">
      <div className="com-list-form-inner">
        <a className="-close" onClick={onClose}>
          关闭
        </a>
        <div className="red mb2">note: need login</div>
        <table className="mb2">
          <thead>
            <tr>
              <th>id</th>
              <th width="280">title</th>
              <th width="280">url</th>
              <th width="100">actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((n, idx) => {
              return (
                <tr key={n.id}>
                  <td className="tl">
                    <div className="flex mb1 items-center">
                      <div className="pr1 flex-shrink-0" style={{ width: '130px' }}>
                        <input
                          type="text"
                          defaultValue={n.__id}
                          onChange={(e) => handleItemFieldChange('__id', idx, e.target.value)}
                        />
                      </div>
                      <div className="flex-auto">
                        <select
                          defaultValue={n.type}
                          onChange={(e) => handleItemFieldChange('type', idx, e.target.value)}
                        >
                          <option value="code">code</option>
                          <option value="deal">deal</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center mb1">
                      <div className=" pr1 flex-shrink-0" style={{ width: '130px' }}>
                        <input
                          placeholder="code"
                          type="text"
                          defaultValue={n.code}
                          onChange={(e) => handleItemFieldChange('code', idx, e.target.value)}
                        />
                      </div>
                      <div className="flex-auto">
                        <input
                          placeholder="expire at"
                          type="text"
                          defaultValue={n.expireAt}
                          onChange={(e) => handleItemFieldChange('expireAt', idx, e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="pr1 flex-shrink-0" style={{ width: '130px' }}>
                        <select
                          placeholder="valid"
                          defaultValue={n.valid}
                          onChange={(e) => handleItemFieldChange('valid', idx, e.target.value)}
                        >
                          <option value="0">no</option>
                          <option value="1">yes</option>
                        </select>
                      </div>
                      <div className="flex-auto">
                        <input
                          type="text"
                          defaultValue={n.usedNum}
                          onChange={(e) => handleItemFieldChange('usedNum', idx, e.target.value)}
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
                        defaultValue={n.title}
                        onChange={(e) => handleItemFieldChange('title', idx, e.target.value)}
                      />
                    </div>

                    <div>
                      <textarea
                        placeholder="description"
                        defaultValue={n.description}
                        rows={3}
                        onChange={(e) => handleItemFieldChange('description', idx, e.target.value)}
                      />
                    </div>
                  </td>

                  <td>
                    <div className="mb1">
                      <input
                        placeholder="url"
                        className="db"
                        type="text"
                        defaultValue={n.url}
                        onChange={(e) => handleItemFieldChange('url', idx, e.target.value)}
                      />
                    </div>

                    <div>
                      <textarea
                        placeholder="term"
                        defaultValue={n.term}
                        rows={3}
                        onChange={(e) => handleItemFieldChange('term', idx, e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="tc">
                    <span>
                      [
                      <a
                        target="_blank"
                        onClick={() => {
                          sendMsg('create_tab', { url: n.triggerUrl, csId });
                        }}
                      >
                        Fetch
                      </a>
                      ]
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div>
          <button onClick={handleOnSave}>save</button>
        </div>
      </div>

      <style>{style[0][1]}</style>
    </div>
  );
};

export default ListForm;
