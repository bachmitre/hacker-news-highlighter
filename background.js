globalThis.browser ??= chrome;
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ seenArticles: [] });
});
function updateSeenArticles(tab) {
  if (tab && tab.url && tab.url.endsWith("news.ycombinator.com/news")) {
    browser.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: storeCurrentArticles
      }
    );
  }
}
browser.tabs.onActivated.addListener(activeInfo => {
  browser.tabs.get(activeInfo.tabId, tab => {
    updateSeenArticles(tab);
  });
});
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateSeenArticles(tab);
  }
});
function storeCurrentArticles() {
  const articleIds = Array.from(document.querySelectorAll('.athing')).map(article => article.id);
  browser.storage.local.set({ seenArticles: articleIds });
}
