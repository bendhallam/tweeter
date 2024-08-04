$(document).ready(function() {
  console.log("Script loaded and DOM is ready.");
  // Select the textarea in the .new-tweet section
  $('.new-tweet textarea').on('input', function() {
      // Access the textarea element
      const textarea = $(this);
      // Get the value and its length
      const textLength = textarea.val().length;
      // Calculate remaining characters
      const remainingChars = 140 - textLength;
      // Select the counter element related to this textarea
      const counter = textarea.closest('form').find('.counter');
      // Update the counter text
      counter.text(remainingChars);
      // Change counter color based on length
      if (remainingChars < 0) {
          counter.css('color', 'red');
      } else {
          counter.css('color', '#333'); // Default color
      }
  });
});