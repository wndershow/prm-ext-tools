import { useRef, useState } from 'react';
import style from './style.scss';

const ListForm = ({ onClose = null, coupons = [], onChange = null, onHide = null, className = '' }) => {
  const st = useRef(null);
  const [cpid, setCpid] = useState(0);

  const handleOnSave = async () => {
    console.info(coupons);
  };

  const handleBatch = async () => {
    coupons.forEach((n) => {
      window.open(n.triggerUrl, '_blank');
    });
  };

  const handleAuto = async () => {
    window.open(c.triggerUrl, '_blank');
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
    <div className={`com-list-form ${className}`}>
      <div className="com-list-form-inner">
        <div className="tr space">
          <a onClick={onHide}>hide</a>
          <a onClick={onHide}>close</a>
        </div>
        <div className="red mb2">note: need login</div>
        <table className="mb2">
          <thead>
            <tr>
              <th>id</th>
              <th width="280">title</th>
              <th width="280">url</th>
              <th width="120">actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((n, idx) => {
              return (
                <tr
                  key={n.id}
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
                        {n.type === 'code' ? (
                          <input
                            placeholder="code"
                            type="text"
                            className={`db ${!!!n.code.trim() && 'error'}`}
                            defaultValue={n.code}
                            onChange={(e) => handleItemFieldChange('code', idx, e.target.value)}
                          />
                        ) : (
                          '---'
                        )}
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
                        className={`db ${!!!n.url.trim() && 'warnning'}`}
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
                    <a href={n.triggerUrl} target="_blank">
                      Fire
                    </a>
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
