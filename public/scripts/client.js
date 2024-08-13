/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]

const renderTweets = function(tweets) {
// loops through tweets
// calls createTweetElement for each tweet
// takes return value and appends it to the tweets container
}

const createTweetElement = function(tweet) {
  const { user, content, created_at } = tweet;
  // format the date
  let $tweet = $(`
    <article class="tweet">
      <header>
        <img class="avatar" src="${user.avatars}" alt="${user.name}'s avatar">
        <div class="user-info">
          <strong>${user.name}</strong>
          <span class="handle">${user.handle}</span>
        </div>
      </header>
      <p class="tweet-content">${content.text}</p>
      <footer>
        <div class="actions">
          <i class="fa fa-flag"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
      </footer>
    </article>
  `);
  return $tweet;
}

const renderTweets = function(tweets) {
  // Select the container where tweets will be appended
  const $tweetsContainer = $('#tweets-container');

  // Clear existing tweets
  $tweetsContainer.empty();

  // Loop through each tweet and create its element
  tweets.forEach(tweet => {
    const $tweetElement = createTweetElement(tweet);
    $tweetsContainer.prepend($tweetElement);
  });
};

renderTweets(data);
