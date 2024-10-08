/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// initialize tweet array
const data = []

// Escape function for Cross Site Scripting
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Function to format the created tweet to be fed into the tweet feed
const createTweetElement = function(tweet) {
  const { user, content, created_at } = tweet;
  const timeagoString = timeago.format(new Date(created_at)); // Make timeago information easier to access
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

renderTweets(data); // Render the tweets upon load

$(document).ready(function() {
  // Define the function to load tweets from the server
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
  
  // Call loadTweets when the document is ready
  loadTweets();

  // Select the form using its ID or a class if you prefer
  $('#submit-tweet-button').on('click', function(event) {
    // Prevent the default form submission
    event.preventDefault();
    // Access the textarea element
    const textarea = $('.new-tweet textarea');
    const tweetContent = textarea.val().trim();
    const textLength = tweetContent.length;
    const errorMessage = $('.new-tweet .error-message');

    errorMessage.slideUp();

    // Ensure tweet isn't empty
    if (textLength === 0) {
      errorMessage.text("Tweet cannot be empty.").slideDown();
      return;
    }

    // Ensure tweet isn't too long
    if (textLength > 140) {
      errorMessage.text("Tweet exceeds the 140-character limit.").slideDown();
      return;
    }


    // Serialize the form data
    const formData = $('form').serialize();
    // Log the serialized data for debugging
    console.log("Serialized form data:", formData);
    // Send the data using AJAX
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formData, // Send serialized data from textarea
      success: function(response) {
        // Handle success
        textarea.val(''); // Reset text area to blank
        // Reset counter
        const counter = textarea.closest('form').find('.counter')
        counter.text(140)
        console.log("Tweet posted successfully:", response);
        loadTweets(); // Refresh tweet feed without reloading page
      },
      error: function(xhr, status, error) {
        // Handle errors
        console.error("Error posting tweet:", status, error);
      }
    });
  });
  // Scroll to top of page when either the tweeter logo or the write a new tweet buttons are clicked
  $('#to-new-tweet').click(function() {
    $('html, body').animate({scrollTop: 0}, 100); // Scroll to top within 100 milliseconds
    $('#tweet-text').focus(); // Activate textarea if the Write a New Tweet button specifically is clicked
  })
  $('#tweeter-logo').click(function() {
    $('html, body').animate({scrollTop: 0}, 100) // Scroll to top within 100 milliseconds
})
});