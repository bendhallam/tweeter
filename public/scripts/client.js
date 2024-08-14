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

const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function(tweet) {
  const { user, content, created_at } = tweet;
  const timeagoString = timeago.format(new Date(created_at));
  const escapedText = escape(content.text);

  // Use jQuery's .text() for user input
  let $tweet = $(`
    <article class="tweet">
      <header>
        <img class="avatar" src="${escape(user.avatars)}" alt="${escape(user.name)}'s avatar">
        <div class="user-info">
          <strong>${escape(user.name)}</strong>
          <span class="handle">${escape(user.handle)}</span>
        </div>
      </header>
      <p class="tweet-content">${escapedText}</p>
      <footer>
        <span class="timeago">${timeagoString}</span>
        <div class="actions">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `);

  return $tweet;
};

const renderTweets = function(tweets) {
  // Select the container where tweets will be appended
  const $tweetsContainer = $('.tweet-feed');

  // Clear existing tweets
  $tweetsContainer.empty();

  // Loop through each tweet and create its element
  tweets.forEach(tweet => {
    const $tweetElement = createTweetElement(tweet);
    $tweetsContainer.prepend($tweetElement);
  });
};

renderTweets(data);

$(document).ready(function() {
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json',
      success: function(tweets) {
        renderTweets(tweets);
      },
      error: function(xhr, status, error) {
        console.error("Error loading tweets:", status, error);
      }
    });
  };

  loadTweets();

  $('#submit-tweet-button').on('click', function(event) {
    event.preventDefault();
    
    // Hide the error message initially
    const errorMessage = $('.error-message');
    errorMessage.hide().removeClass('show').addClass('hide');
    
    const textarea = $('.new-tweet textarea');
    const tweetContent = textarea.val().trim();
    const textLength = tweetContent.length;

    if (textLength === 0) {
      errorMessage.text("Tweet cannot be empty.").show().removeClass('hide').addClass('show');
      return;
    }

    if (textLength > 140) {
      errorMessage.text("Tweet exceeds the 140-character limit.").show().removeClass('hide').addClass('show');
      return;
    }

    const formData = $('form').serialize();
    $.ajax({
      url: '/tweets/',
      method: 'POST',
      data: formData,
      success: function(response) {

        textarea.val('');
        const counter = textarea.closest('form').find('.counter');
        counter.text(140);
        console.log("Tweet posted successfully:", response);
        loadTweets();
        errorMessage.hide().removeClass('show').addClass('hide');
      },
      error: function(xhr, status, error) {
        console.error("Error posting tweet:", status, error);
      }
    });
  });
});