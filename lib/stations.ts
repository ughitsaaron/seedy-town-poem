/**
 * The following is an array of objects each including the url for a station's local news
 * website, alongside an array of selectors: the first being a selector for some kind of
 * list of articles, each selector must end with an anchor element with a valid href
 * attribute, the second selector is the selector for the first interesting text containing
 * element of the main body content from an article page.
 */
interface Station {
 feed: string;
 contentPath?: string;
}

const stations: Station[] = [{
  feed: 'http://rssfeeds.kare11.com/kare/local&x=1',
  contentPath: 'content.content'
}, {
  feed: 'http://www.news5cleveland.com/feeds/rssFeed?obfType=RSS_FEED&siteId=10003&categoryId=20000'
}, {
  feed: 'http://www.abc15.com/feeds/rssFeed?obfType=RSS_FEED&siteId=10008&categoryId=20412'
}, {
  feed: 'http://www.wjcl.com/topstories-rss'
}, {
  feed: 'http://krqe.com/feed/'
}, {
  feed: 'http://www.wtol.com/Global/category.asp?C=104085&clienttype=rss'
}, {
  feed: 'http://www.nbc12.com/Global/category.asp?C=134132&nav=0RZF&clienttype=rss'
}, {
  feed: 'http://www.wbaltv.com/topstories-rss'
}, {
  feed: 'http://longisland.news12.com/?clienttype=rss'
}, {
  feed: 'http://www.cbs46.com/category/208655/atlanta-news?clienttype=rss'
}, {
  feed: 'http://www.wmur.com/topstories-rss'
}, {
  feed: 'http://www.wcax.com/content/news/index.rss'
}, {
  feed: 'http://wtnh.com/feed/'
}];

export { stations, Station };
