import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/de';
import 'dayjs/locale/fr';
// import 'dayjs/locale/en-in';
// import 'dayjs/locale/en-au';
// import 'dayjs/locale/en-ca';

dayjs.extend(customParseFormat);

export default {
  cid: 0,
  document: null,
  dayjs,
  supportCouponItemUrl: false,

  setCid(cid) {
    this.cid = cid;
  },
  setDocument(document) {
    this.document = document;
  },

  selectorRelateStoreArea: '',
  getRelateStoreUrls(csUrl = '') {
    if (!this.selectorRelateStoreArea) return [];
    if (typeof this.selectorRelateStoreArea != 'string' && !this.selectorRelateStoreArea.length) return [];
    let exp = new RegExp(` href="(.*?)"`, 'g');

    csUrl = csUrl.repeat(/\/$/, '');

    return this.getRelateStoreUrlsByExp(exp, csUrl);
  },

  getRelateStoreUrlsByExp(exp, csUrl = '') {
    if (!exp) return [];

    let conts = [];

    let $areas = this.document.querySelectorAll(this.selectorRelateStoreArea);

    $areas.forEach($n => {
      if (!$n) return;
      conts.push($n.innerHTML);
    });

    let t = null;
    let urls = [];
    conts.forEach(n => {
      while ((t = exp.exec(n))) {
        let u = t[1].trim();
        if (!this.filterRelateStoreUrl(u)) continue;
        u = this.modifyRelateStoreUrl(u);
        u && urls.push(u);
      }
    });

    return urls;
  },
  filterRelateStoreUrl(url) {
    return true;
  },
  modifyRelateStoreUrl(url) {
    if (!url) return '';
    url = url.replace(/\/$/, '');
    if (url.indexOf('/') != 0) {
      url = '/' + url;
    }
    return url;
  },

  getShowAllTrigger() {
    return null;
  },

  selectorCouponItems: '',
  getCouponItems() {
    const $couponItems = this.document.querySelectorAll(this.selectorCouponItems);
    return $couponItems;
  },

  selectorCouponItemId: '',
  getCouponItemId($item) {
    let t = this._getValueBySelector($item, this.selectorCouponItemId);
    if (!t) return '';
    t = t.match(/[\d]{1,}/);
    if (!t) return '';
    return t[0];
  },

  selectorCouponItemTitle: '',
  getCouponItemTitle($item) {
    return this._getValueBySelector($item, this.selectorCouponItemTitle);
  },

  coupontItemTypeCodeKwds: 'code',
  selectorCouponItemType: '',
  getCouponItemType($item) {
    let t = this._getValueBySelector($item, this.selectorCouponItemType);
    if (!t) return 'deal';
    if (t.toLowerCase().indexOf(this.coupontItemTypeCodeKwds.toLowerCase()) >= 0) return 'code';
    return 'deal';
  },

  selectorCouponItemCode: '',
  getCouponItemCode($item) {
    return this._getValueBySelector($item, this.selectorCouponItemCode);
  },

  selectorCouponItemExpireAt: '',
  getCouponItemExpireAtTrack($item) {
    let t = this._getValueBySelector($item, this.selectorCouponItemExpireAt);
    if (!t) return '';
    t = t.match(/[\d]{1,2}[.][\d]{1,2}[.][\d]{4}/);
    if (!t) return '';
    return t[0];
  },
  couponItemExpireAtFormat: 'DD.MM.YYYY',
  getCouponItemExpireAt($item, { locale = 'de' } = {}) {
    let t = this.getCouponItemExpireAtTrack($item);
    if (!t) return '';
    return this.dayjs(t, this.couponItemExpireAtFormat, locale).format('YYYY-MM-DD');
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

  getCouponItemJumpUrl($item, { csUrl, csId, storeKwds, type, code, id } = {}) {
    return '';
  },

  getCouponItemTriggerUrl($item, { csUrl, csId, storeKwds, type, code, id } = {}) {
    let triggerType = this.getCouponItemTriggerType($item);

    let jumpUrl = this.getCouponItemJumpUrl($item, { csUrl, csId, storeKwds, type, code, id });
    if (jumpUrl) return jumpUrl;

    let forwardType = this.getCouponItemForwardType($item, { type, code });
    return `${csUrl}?__ext_tools=y&__page_type=trigger&__trigger_type=${triggerType}&__forward_type=${forwardType}&__cid=${this.cid}&__cs_id=${csId}`;
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

  getCoupons({ csId, storeKwds, csUrl, sourceCoupons = [] } = {}) {
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

      let isValid = this.getCouponItemValid($item);

      let usedNum = this.getCouponItemUsedNum($item);

      let description = this.getCouponItemDescription($item);

      let term = this.getCouponItemTerm($item);

      let triggerUrl = this.getCouponItemTriggerUrl($item, { csId, storeKwds, type, code, csUrl, id });

      ces.push({
        __id: id,
        title,
        type,
        code,
        expireAt,
        isValid,
        usedNum,
        url: '',
        term,
        description,
        triggerUrl,
        status: 'pendding',
      });
    });

    if (sourceCoupons.length) {
      ces = this._mixinCoupons({ coupons: ces, sourceCoupons });
    }

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
      let _vs = vs.join(' ').trim();
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

  _mixinCoupons({ coupons, sourceCoupons }) {
    if (!coupons || !coupons.length) return [];
    if (!sourceCoupons || !sourceCoupons.length) return coupons;

    let kv_id_sourceCoupon = {};
    sourceCoupons.forEach(n => {
      kv_id_sourceCoupon[n.tid] = n;
    });

    coupons = coupons.map((n, i) => {
      n.isNew = false;
      let sc = kv_id_sourceCoupon[n.__id] || null;
      if (!sc) {
        n.isNew = true;
        return n;
      }
      n.code = sc.code || '';
      n.url = sc.url || '';
      return n;
    });

    // coupons.sort((a, b) => {
    //   let v1 = 0;
    //   let v2 = 0;

    //   if (a.type === 'code') {
    //     v1 += 1000;
    //   }

    //   if (!a.code) {
    //     v1 += 1000;
    //   }

    //   if (!a.url) {
    //     v1 += 1000;
    //   }

    //   if (b.type === 'code') {
    //     v2 += 1000;
    //   }

    //   if (!b.code) {
    //     v2 += 1000;
    //   }

    //   if (!b.url) {
    //     v2 += 1000;
    //   }

    //   return v2 - v1;
    // });

    return coupons;
  },
};
