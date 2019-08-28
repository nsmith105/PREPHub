$(document).ready(function() {
  let $info = $(".info");
  let $nav_item = $(".nav-item");

  $(".dropdown-item").on("click", function() {
    let val = $(this).attr("value");
    $info.hide();
    let div = $("#" + val).show();
  });

 $nav_item.on("click", function() {
    $(".collapse").collapse("hide");
 });

});
