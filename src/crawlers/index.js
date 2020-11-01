import base from './base';
import * as $api from '@/apis';
import { getStore, setStore } from '@/lib/storage';

export default async ({ cid, cache = true }, { st = 's2' } = {}) => {
  let crawler = null;

  if (cache) {
    let crawlerSezStr = await getStore(`crawler_${cid}`, null);
    if (crawlerSezStr) {
      crawler = parseCrawler({ crawlerSezStr, cid });
      return crawler;
    }
  }

  const competitor = await $api.getCompetitorById(cid, { st });
  if (!competitor) return null;

  await setStore(`crawler_${cid}`, competitor.crawler);

  crawler = parseCrawler({ crawlerSezStr: competitor.crawler, cid });

  return crawler;
};

const parseCrawler = ({ crawlerSezStr, cid }) => {
  let crawler = eval('(' + crawlerSezStr + ')');

  crawler = Object.assign({}, base, crawler);
  crawler.setCid(cid);

  return crawler;
};
