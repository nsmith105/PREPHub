/**
 * This js script automatically loads all images un public/images/
 * The script sends an AJAX request to window.location.host
 * it will fetch all images under public/images/ and automatically populate
 * the carousel with the selected images.
 * 
 */
var dir = "/images";
var fileextension = ".jpg";
$.ajax({
  //This will retrieve the contents of the folder if the folder is configured as 'browsable'
  url: dir,
  success: function(data) {
    //List all .png file names in the page
    var count = 1;
    $(data)
      .find("a:contains(" + fileextension + ")")
      .each(function() {
        let $carousel_inner = $(".carousel-inner");
        var filename = this.href
          .replace(window.location.host, "")
          .replace("http://", "");
        if (count == 1) {
          $($carousel_inner).append(
            '<div class="carousel-item active"><img class="d-block w-100 slideCard" src="' +
              filename +
              '"></div>'
          );
        } else {
          $($carousel_inner).append(
            '<div class="carousel-item"><img class="d-block w-100 slideCard" src="' +
              filename +
              '"></div>'
          );
        }
        ++count;
      });
  }
});


$(document).ready(function() {
  console.log('ready')
  $('.carousel').carousel({
    interval: 4000,
    ride: "carousel",
  })
});