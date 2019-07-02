$(document).ready(function() {
  /**
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}
 */
  let $collapsible = $('.collapsible');
  
  $collapsible.on('click',function() {
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
});

/**
 * this is the same as saying $selector = jQuery('selector');
 * $ before a variable name indicates the variable holds an object
 *  we cache jquery results for performance

    document.on('ready', function() {
    let $collapsible = $('collapsible');
    });

 */

/*
function rClick(button) {
  buttons = document
    .getElementsByClassName("btn-group")[0]
    .getElementsByClassName("button");
  var i;
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i] == button) {
      buttons[i].disabled = true;
      buttons[i].style.background = "#013220";
      buttons[i].style.color = "white";
    } else if (buttons[i].disabled == true) {
      buttons[i].disabled = false;
      buttons[i].style.background = "#669900";
      buttons[i].style.color = "black";
    }
  }
}

function lClick(button) {
  buttons = document
    .getElementsByClassName("btn-group")[1]
    .getElementsByClassName("button");
  var i;
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i] == button) {
      buttons[i].disabled = true;
      buttons[i].style.background = "#013220";
      buttons[i].style.color = "white";
    } else if (buttons[i].disabled == true) {
      buttons[i].disabled = false;
      buttons[i].style.background = "#669900";
      buttons[i].style.color = "black";
    }
  }
}
*/
