$(document).ready(function () {

  var socket = io.connect('http://' + document.domain + ':' + location.port);

  socket.on("connection", console.log("connected to server"));

  let $container = $('.container');
  console.log("ready");
  /**
   * This handles expanding/contracting the collapsibles
   */
  $container.on('click', '.collapsible', function () {
    let $this = $(this);
    let content = $this.next();
    if (content.css("max-height") != "0px") {
      $this.removeClass("active");
      content.css("max-height", 0);
    } else {
      $this.addClass("active");
      content.css("max-height", content.prop("scrollHeight"));
    }
  });

  $('.twitter').slick({
  dots: true,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
  ]
  });

  
});


