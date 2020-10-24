import style from './style.scss';
import { setStore, clear, getStore } from '@/lib/storage';
import { getQuery } from '@/lib/url';

const ListForm = ({ onClose = null, coupons = [], onChange = null }) => {
  const csId = getQuery('__cs_id');

  const handleOnSave = async () => {
    chrome.runtime.sendMessage('new_tab');
  };

  return (
    <div className="com-list-form">
      <a className="-close" onClick={onClose}>
        关闭
      </a>
      <table className="mb2">
        <thead>
          <tr>
            <th width="120">id</th>
            <th width="320">title</th>
            <th width="110">type</th>
            <th>code</th>
            <th width="100">actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((n, i) => {
            return (
              <tr key={n.id}>
                <td className="tc">
                  <input
                    type="text"
                    value={n.__id}
                    onChange={e => onChange && onChange({ idx: i, value: { ...n, __id: e.target.value } })}
                  />
                </td>
                <td>
                  <input
                    className="db"
                    type="text"
                    value={n.title}
                    onChange={e => onChange && onChange({ idx: i, value: { ...n, title: e.target.value } })}
                  />
                </td>
                <td className="tc">
                  <select
                    value={n.type}
                    onChange={e => onChange && onChange({ idx: i, value: { ...n, type: e.target.value } })}
                  >
                    <option value="code">code</option>
                    <option value="deal">deal</option>
                  </select>
                </td>
                <td className="tc">
                  <input
                    type="text"
                    value={n.code}
                    onChange={e => onChange && onChange({ idx: i, value: { ...n, code: e.target.value } })}
                  />
                </td>
                <td className="tc">
                  <a
                    onClick={() => {
                      clear(`cs_${csId}`);
                      window.open(
                        `https://www.mydealz.de/gutscheine/lidl-de/?__ext_tools=y&__page_type=detail&__trigger_type=click&__item_idx=${i}&__cs_id=${csId}`,
                        '_blank'
                      );
                    }}
                  >
                    fc
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

      <style>{style[0][1]}</style>
    </div>
  );
};

export default ListForm;
