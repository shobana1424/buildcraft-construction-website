// Frontend-only dynamic progress calculation.
// Rules:
//  - Every enabled category contributes equally.
//  - Disabled optional categories are excluded.
//  - Task completion determines category completion (average of its tasks).
//  - Enabled category completion determines overall completion (average of enabled categories).
//  - Result is always clamped to 0..100.
import { CATEGORIES, CATEGORY_ORDER } from '../data/constants';

export const clamp = (n) => Math.min(100, Math.max(0, Math.round(Number(n) || 0)));
const clampRaw = (n) => Math.min(100, Math.max(0, Number(n) || 0));

export const enabledKeys = (site) =>
  CATEGORY_ORDER.filter((k) => CATEGORIES[k].mandatory || site.optional?.[k]);

const categoryRaw = (site, key) => {
  const tasks = CATEGORIES[key].tasks;
  return tasks.reduce((sum, t) => sum + clampRaw(site.tasks?.[t.id]), 0) / tasks.length;
};

export const categoryProgress = (site, key) => clamp(categoryRaw(site, key));

export const overallProgress = (site) => {
  const keys = enabledKeys(site);
  if (!keys.length) return 0;
  return clamp(keys.reduce((s, k) => s + categoryRaw(site, k), 0) / keys.length);
};

export const categoryBreakdown = (site) =>
  enabledKeys(site).map((k) => {
    const done = categoryProgress(site, k);
    return { key: k, name: CATEGORIES[k].short, fullName: CATEGORIES[k].name, color: CATEGORIES[k].color, completed: done, remaining: 100 - done };
  });

export const taskLists = (site) => {
  const completed = [];
  const pending = [];
  enabledKeys(site).forEach((k) => {
    CATEGORIES[k].tasks.forEach((t) => {
      const value = clamp(site.tasks?.[t.id]);
      const item = { ...t, cat: k, catName: CATEGORIES[k].name, color: CATEGORIES[k].color, value };
      (value >= 100 ? completed : pending).push(item);
    });
  });
  return { completed, pending };
};

export const siteStatus = (site) => {
  const p = overallProgress(site);
  if (p >= 100) return 'Completed';
  const start = new Date(site.startDate).getTime();
  const end = new Date(site.expectedDate).getTime();
  const now = Date.now();
  if (now > end) return 'Delayed';
  const elapsed = end > start ? clamp(((now - start) / (end - start)) * 100) : 0;
  if (p >= elapsed - 10) return 'On Track';
  if (p >= elapsed - 25) return 'In Progress';
  return 'Delayed';
};
