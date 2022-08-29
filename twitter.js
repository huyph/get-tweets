const { TwitterApi } = require('twitter-api-v2');
const XLSX = require('XLSX');

const ACCESS_TOKEN = process.argv[2];
const SEARCH_QUERY = process.argv[3];
const LIMIT = process.argv[4] || 1000;

// Instantiate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi(ACCESS_TOKEN);

const jsonToXLSX = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tweets");

  XLSX.writeFile(workbook, "Report.xlsx");
}

const exportTweets = async () => {
  const jsTweets = await twitterClient.v2.search(SEARCH_QUERY, {'media.fields': 'url'});

  const tweets = [];
  // Consume every possible tweet of jsTweets (until rate limit is hit)
  for await (const tweet of jsTweets) {
    tweets.push(tweet);
    if (tweets.length > LIMIT) break;
  }

  jsonToXLSX(tweets);

  return tweets;
}

exportTweets();


