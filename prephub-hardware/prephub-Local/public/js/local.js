$(document).ready(function () {
  let $container = $(".container");

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
});
