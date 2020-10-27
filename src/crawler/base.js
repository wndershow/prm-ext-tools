import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/de';
import 'dayjs/locale/fr';
// import 'dayjs/locale/en-in';
// import 'dayjs/locale/en-au';
// import 'dayjs/locale/en-ca';

dayjs.extend(customParseFormat);

export default {
  document: null,
  dayjs,

  setDocument(document) {
    this.document = document;
  },

  getShowAllTrigger() {
    return null;
  },

  getItemTitle() {
    return 'xxx';
  },

  selectorCouponItems: 'div.js-threadList article[id*=thread_]',
  getCouponItems() {
    const $couponItems = this.document.querySelectorAll(this.selectorCouponItems);
    return $couponItems;
  },

  selectorCouponItemId: 'a.js-gutscheinsammler-item@data-voucher-button|@id',
  getCouponItemId($item) {
    let t = this._getValueBySelector($item, this.selectorCouponItemId);
    if (!t) return '';
    t = t.match(/[\d]{1,}/);
    if (!t) return '';
    return t[0];
  },

  selectorCouponItemTitle: 'div.cept-voucher-widget-item-title|span.thread-title--list--merchant',
  getCouponItemTitle($item) {
    return this._getValueBySelector($item, this.selectorCouponItemTitle);
  },

  coupontItemTypeCodeKwds: 'code',
  selectorCouponItemType: 'div.voucher-btn|input[data-copy-to-clipboard]@title',
  getCouponItemType($item) {
    let t = this._getValueBySelector($item, this.selectorCouponItemType);
    if (!t) return 'deal';
    if (t.toLowerCase().indexOf(this.coupontItemTypeCodeKwds.toLowerCase()) >= 0) return 'code';
    return 'deal';
  },

  selectorCouponItemCode: 'input[data-copy-to-clipboard]@value',
  getCouponItemCode($item) {
    return this._getValueBySelector($item, this.selectorCouponItemCode);
  },

  selectorCouponItemExpireAt: 'span.lbox--v-4.size--all-m.text--color-greyShade',
  getCouponItemExpireAtTrack($item) {
    let t = this._getValueBySelector($item, this.selectorCouponItemExpireAt);
    if (!t) return '';
    t = t.match(/[\d]{1,2}[.][\d]{1,2}[.][\d]{4}/);
    if (!t) return '';
    return t[0];
  },
  couponItemExpireAtFormat: 'DD.MM.YYYY',
  getCouponItemExpireAt($item) {
    let t = this.getCouponItemExpireAtTrack($item);
    if (!t) return '';
    return this.dayjs(t, this.couponItemExpireAtFormat, 'de').format('YYYY-MM-DD');
  },

  couponItemValidKwds: 'valid',
  selectorCouponItemValid: '',
  getCouponItemValid($item) {
    let t = this._getValueBySelector($item, this.selectorCouponItemValid);
    if (!t) return 0;
    t = t.toLowerCase();
    if (t.indexOf(this.couponItemValidKwds.toLowerCase()) >= 0) return 1;
    return 0;
  },

  selectorCouponItemUsedNum: '',
  getCouponItemUsedNum($item) {
    let t = this._getValueBySelector($item, this.selectorCouponItemUsedNum);
    if (!t) return 0;
    t = t.match(/[\d]{1,}/);
    if (!t) return 0;
    return parseInt(t[0]);
  },

  selectorCouponItemDescription: '',
  getCouponItemDescription($item) {
    return this._getValueBySelector($item, this.selectorCouponItemDescription);
  },

  selectorCouponItemTerm: '',
  getCouponItemTerm($item) {
    return this._getValueBySelector($item, this.selectorCouponItemTerm);
  },

  getCouponItemTriggerType($item) {
    return 'click';
  },

  /**
   * @param {*} $item
   * 1: trigger page jump out to store or product page, coupon detail page open
   * 2: trigger page staty, jump out to store or product page
   * 3: trigger page jump to coupon detail page, jump out to store or product page
   */
  getCouponItemForwardType($item, { type, code }) {
    if (type === 'deal') return 2;
    if (type === 'code' && !code) return 1;
    if (type === 'code' && code) return 2;
    return 3;
  },

  getCouponItemTriggerUrl($item, { csUrl, itemIdx, csId, storeKwds, type, code } = {}) {
    let triggerType = this.getCouponItemTriggerType($item);
    if (triggerType === 'na') return '';
    let forwardType = this.getCouponItemForwardType($item, { type, code });
    return `${csUrl}?__ext_tools=y&__page_type=trigger&__trigger_type=${triggerType}&__forward_type=${forwardType}&__item_idx=${itemIdx}&__cs_id=${csId}&__store_kwds=${storeKwds}`;
  },

  selectorDetailTrigger: 'div.voucher-btn,a.cept-dealBtn,button.voucher-codeCopyButton>a',
  getDetailTrigger(idx) {
    let $couponItems = this.getCouponItems();
    let $item = $couponItems[idx] || null;
    if (!$item) return null;
    return $item.querySelector(this.selectorDetailTrigger);
  },

  selectorCouponDetailCode: 'div.popover-content input[data-copy-to-clipboard]@value',
  getCouponDetailCode() {
    let code = this._getValueBySelector(this.document, this.selectorCouponDetailCode);
    return code;
  },

  getCoupons({ csId, storeKwds, csUrl } = {}) {
    const $couponItems = this.getCouponItems();

    let ces = [];
    $couponItems.forEach(($item, i) => {
      let id = this.getCouponItemId($item);
      if (!id) return;

      let title = this.getCouponItemTitle($item);
      if (!title) return;

      let type = this.getCouponItemType($item);

      let code = this.getCouponItemCode($item);

      let expireAt = this.getCouponItemExpireAt($item);

      let valid = this.getCouponItemValid($item);

      let usedNum = this.getCouponItemUsedNum($item);

      let description = this.getCouponItemDescription($item);

      let term = this.getCouponItemTerm($item);

      let triggerUrl = this.getCouponItemTriggerUrl($item, { itemIdx: i, csId, storeKwds, type, code, csUrl });

      ces.push({
        __id: id,
        title,
        type,
        code,
        expireAt,
        valid,
        usedNum,
        url: '',
        term,
        description,
        triggerUrl,
      });
    });

    return ces;
  },

  _getValueBySelector($el, seletor, defaultValue = '') {
    if (seletor.indexOf('|') < 0 && seletor.indexOf('&') < 0)
      return this._getValueBySelectorItem($el, seletor, defaultValue);

    if (seletor.indexOf('|') >= 0) {
      let t = seletor.split('|');
      for (var i = 0; i < t.length; i++) {
        let n = t[i];
        if (!n) continue;
        let v = this._getValueBySelectorItem($el, n, defaultValue);
        if (v) return v;
      }
      return defaultValue;
    }

    if (seletor.indexOf('&') >= 0) {
      let t = seletor.split('&');
      let vs = [];
      for (var i = 0; i < t.length; i++) {
        let n = t[i];
        if (!n) continue;
        let v = this._getValueBySelectorItem($el, n, defaultValue);
        vs.push(v);
      }
      let _vs = _trim(vs.join(' '));
      if (_vs) return _vs;
      return defaultValue;
    }
  },

  _getValueBySelectorItem($el, seletor, defaultValue = '') {
    let value = '';
    if (!seletor) return defaultValue;
    let tmp = seletor.split('@');

    if (tmp.length == 1) {
      // no attr query char @
      const $t = $el.querySelector(tmp[0]);
      value = ($t && $t.textContent) || '';
    } else if (tmp.length === 2) {
      // with attr query char @
      if (tmp[1] == 'text') {
        if (tmp[0] == '') {
          value = $el.textContent || '';
        } else {
          const $t = $el.querySelector(tmp[0]);
          value = ($t && $t.textContent) || '';
        }
        value = value.replace(/(\<.*?\>.*?\<\/.*?\>)/g, '');
        value = value.replace(/\<br\>/g, '');
      } else if (tmp[1] === 'html') {
        if (tmp[0] == '') {
          value = $el.innerHTML || '';
        } else {
          const $t = $el.querySelector(tmp[0]);
          value = ($t && $t.innerHTML) || '';
        }
        return value;
      } else {
        if (tmp[0] == '') {
          value = $el.getAttribute(tmp[1]) || '';
        } else {
          const $t = $el.querySelector(tmp[0]);
          value = ($t && $t.getAttribute(tmp[1])) || '';
        }
      }
    }
    if (!value) return defaultValue;
    return value.trim();
  },
};
