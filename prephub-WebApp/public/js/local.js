$(document).ready(function () {
  let $container = $(".container");

  // Socket connection to web namespace '/user'
  var socket = io("http://localhost:8080/user");
  
  /**
   * This handles expanding/contracting the collapsibles
   */
  $container.on("click", ".collapsible", function () {
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
   * Carousel stuff, subject to change to a different
   * tech
   */
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


  /**** SOCKET.io related ****/

  /**
   * When a radio/light button is clicked, \
   * we grab the value and call send_data
   */
  jQuery(".change-radio").on("click", function () {
    let val = $(this).text();
    send_data("Change Radio", val);
  });

  jQuery(".change-light").on("click", function () {
    let val = $(this).text();
    send_data("Change Light", val);
  });

  // This function is called when a button with a light/radio value is clicked
  function send_data(cmd, val) {
    socket.emit("send command", { command: cmd, value: val });
  }

  socket.on("send command confirm", function (msg) {
    console.log(msg);
  });

  socket.on('connect', () => {
    console.log('This client successfully connected to the server');
  });
  
  function openLang(evt, lang) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(lang).style.display = "block";
    evt.currentTarget.className += " active";
  }
});
