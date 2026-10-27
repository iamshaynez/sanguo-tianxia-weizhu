// runtime.js —— 浏览器端章节数据仓库;首屏只注册加载器,打开章回时再取对应剧本。
export const STORY_DATA = {};
export const BRIEFINGS = {};

const scrollLoaders = {
  1: async () => (await import('./scroll-1.js')).SCROLL_1_STORIES,
  2: async () => (await import('./scroll-2.js')).SCROLL_2_STORIES,
  3: async () => (await import('./scroll-3.js')).SCROLL_3_STORIES,
  4: async () => (await import('./scroll-4.js')).SCROLL_4_STORIES,
};
const pending = new Map();

function loadOnce(key, loader, apply) {
  if (!pending.has(key)) {
    const promise = loader().then(apply).catch(error => {
      pending.delete(key);
      throw error;
    });
    pending.set(key, promise);
  }
  return pending.get(key);
}

const loadBriefings = () => loadOnce(
  'briefings',
  () => import('./briefings.js'),
  ({ BRIEFINGS: data }) => Object.assign(BRIEFINGS, data),
);

export async function loadChapterData(chapter) {
  if (!chapter || chapter.apocrypha) return;
  const scroll = chapter.scroll === 5 ? 4 : chapter.scroll;
  const jobs = [loadBriefings()];
  if (scrollLoaders[scroll]) {
    jobs.push(loadOnce(`scroll-${scroll}`, scrollLoaders[scroll], data => Object.assign(STORY_DATA, data)));
  }
  await Promise.all(jobs);
}

export const briefingFor = chapter => BRIEFINGS[chapter?.id] || null;
