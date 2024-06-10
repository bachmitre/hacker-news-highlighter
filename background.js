chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ seenArticles: [] });
});
function updateSeenArticles(tab) {
  if (tab && tab.url && tab.url.endsWith("news.ycombinator.com/news")) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: storeCurrentArticles
      }
    );
  }
}
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    updateSeenArticles(tab);
  });
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateSeenArticles(tab);
  }
});
function storeCurrentArticles() {
  const articleIds = Array.from(document.querySelectorAll('.athing')).map(article => article.id);
  chrome.storage.local.set({ seenArticles: articleIds });
}
