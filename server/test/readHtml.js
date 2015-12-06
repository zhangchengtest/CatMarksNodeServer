var read = require('node-readability');

read('http://itwap.net/ArticleContent.aspx?id=40', function(err, article, meta) {
  console.log(article.title);
  console.log(article.content);
  article.close();
});
