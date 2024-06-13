(function() {
  const HIGHLIGHT_CLASS = 'highlight-new-article';
  chrome.storage.local.get('seenArticles', data => {
    const seenArticles = data.seenArticles || [];
    const currentArticles = Array.from(document.querySelectorAll('.athing'));
    currentArticles.forEach(article => {
      const articleId = article.id;
      if (!seenArticles.includes(articleId)) {
        article.classList.add(HIGHLIGHT_CLASS);
      }
      const nextRow = article.nextElementSibling;
      if (nextRow) {
        const subtextElement = nextRow.querySelector('td.subtext');
        if (subtextElement) {
          if (subtextElement && subtextElement.innerText.includes('comment')) {
             const commentElement = Array.from(subtextElement.querySelectorAll('a'))
            .find(a => a.innerText.includes('comment'));
            const commentText = commentElement.innerText;
            const match = commentText.match(/(\d+)\s*comments?/);
            if (match) {
              const commentCount = parseInt(match[1], 10);
              let commentColor = '';
              if (commentCount > 50) {
                let transparency = 0.0 + commentCount * 0.3 / 200.0;
                commentColor = 'rgba(255,0,0, ' + transparency + ')';
                if (commentColor) {
                  commentElement.style.backgroundColor = commentColor;
                  if (commentCount > 200) {
                    commentElement.style.color = 'white';
                  }
                }
              }
            }
          }
        }
      }
    });
    const currentArticleIds = currentArticles.map(article => article.id);
    chrome.storage.local.set({ seenArticles: currentArticleIds });
  });

   // Make all links open in a new tab
  const allLinks = document.querySelectorAll('a');
  allLinks.forEach(link => {
    link.setAttribute('target', '_blank');
  });

})();
