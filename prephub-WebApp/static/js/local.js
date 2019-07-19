$(document).ready(function() {
  let $container = $(".container");

  // Socket connection to web namespace
  var socket = io("/web");
  console.log("Ready");

  /**
   * This handles expanding/contracting the collapsibles
   */
  $container.on("click", ".collapsible", function() {
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

  /**
   * This handles
   */
  $container.on("click", ".content .btn-group .button", function() {
    let $this = $(this);
    $this.css("background", "#013220");
    $this.css("color", "white");
    $this.prop("disabled", true);
    if ($this.siblings().is(":disabled")) {
      $this.siblings().css("background", "#9ACD32");
      $this.siblings().css("color", "black");
      $this.siblings().prop("disabled", false);
    }
  });

  $(".twitter").slick({
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
      }
    ]
  });

  /**** SOCKET STUFF ****/

  jQuery(".change-radio").on("click", function() {
    let command = "Change Radio";
    let val = $(this).text();
    console.log(val);
    send_data(command, val);
  });

  jQuery(".change-light").on("click", function() {
    let command = "Change Light";
    let val = $(this).text();
    console.log(val);
    send_data(command, val);
  });

  function send_data(cmd, val) {
    socket.emit("send command", {
      command: cmd,
      value: val
    });
  }

  socket.on("send command confirm", function(msg) {
    console.log(msg);
  });
});
