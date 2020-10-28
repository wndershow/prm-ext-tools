import { setStore } from '@/lib/storage';
import * as _tab from '@/lib/tab';

export const handleCloseTab = async ({ payload, sendResponse, sender }) => {
  const { tab } = sender;
  _tab.remove([tab.id]);
};
