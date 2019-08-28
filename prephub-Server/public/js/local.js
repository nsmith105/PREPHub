function openPage(pageName,elmnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

$(document).ready(function () {
  let $container = $(".container");

  // Socket connection to web namespace '/user'
  let socket = io("/web");

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
   
  /**** SOCKET.io related ****/
  /**
   * When a radio/light button is clicked, \
   * we grab the value and call send_data
   */
  jQuery(".change-radio").on("click", function () {
    let val = $(this).val();
    send_data("Change Radio", val);
  });

  jQuery(".change-light").on("click", function () {
    let val = $(this).val();
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

  /**
   * When rss data is parsed
   * and sent to user from server
   */

  socket.on('rss feed', (data) => {
    if(data['description']){
      let desc = data['description'];
      let date = data['date'];
      // code to append the values to the banner here
      jQuery('.banner').text(date+": "+desc);
    }
    else if(data === "rss feed clear"){
      console.log("No update:"+data);
      jQuery('.banner').text('');
    }
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
