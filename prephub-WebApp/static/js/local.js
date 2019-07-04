$(document).ready(function () {

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

  /**
   * This handles 
   */
  $container.on('click', '.content .btn-group .button', function () {
    let $this = $(this);
    $this.css('background', '#013220');
    $this.css('color', 'white');
    $this.prop('disabled', true);
    if ($this.siblings().is(":disabled")) {
      console.log("siblings are disabled");
      $this.siblings().css('background', '#9ACD32');
      $this.siblings().css('color', 'black');
      $this.siblings().prop('disabled', false);
    }
  });
});
