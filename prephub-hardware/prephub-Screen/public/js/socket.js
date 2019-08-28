/**
 * This file handles receiving RSS feeds from the hosted web server
 * When rss feed data is sent over, 
 * it will populate the banner at the top of the carousel page
 */
$(document).ready(function() {
  /* Change this line to reflect actual URL/namespace of the desired host */
  let socket = io("http://35.197.44.95:9000/web");
  let $banner = $(".banner");

  socket.on("rss feed", data => {
    if (data["description"]) {
      let desc = data["description"];
      let date = data["date"];
      // code to append the values to the banner here
      $banner.text(date + ": " + desc);
    } else if (data === "rss feed clear") {
      console.log("No update:" + data);
      $banner.text('');
    }
  });
});
