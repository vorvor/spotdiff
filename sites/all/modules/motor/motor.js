(function($) {  

Drupal.behaviors.admin = {
  attach: function (context, settings) {

    var coord1;

    $('.field-name-field-image .image-preview').append('<canvas id="img-1-cnvs" width="480" height="' + $('img', this).height() + '" style="border:1px solid #d3d3d3;"></div>');
    hint();

    function hint() {
      var c = document.getElementById("img-1-cnvs");
      var ctx = c.getContext("2d");
      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "white";

      $('#field-coordinates-values .form-text').each(function(i) {
        coords = $(this).val();
        if (coords.length !== 0) {
          parts = coords.split(':');
          coord1 = parts[0].split(',');
          coord2 = parts[1].split(',');

          ctx.rect(coord1[0], coord1[1], coord2[0] - coord1[0], coord2[1] - coord1[1]);
          ctx.fillText(i + 1, coord1[0] - 10, coord1[1] - 10);
          ctx.stroke();
        }

      })
    }

    $('canvas').mousedown(function(e) {
      e.preventDefault();
      var parentOffset = $(this).offset(); 
      var relX = e.pageX - parentOffset.left;
      var relY = e.pageY - parentOffset.top;
      $('.field-name-field-coordinates input[name="radio"]:checked').prev().val(relX + ',' + relY);
      coord1 = relX + ',' + relY;
    })

    $('canvas').mouseup(function(e) {
      var parentOffset = $(this).offset(); 
      var relX = e.pageX - parentOffset.left;
      var relY = e.pageY - parentOffset.top;
      var val = $('.field-name-field-coordinates input[name="radio"]:checked').prev().val();
      $('.field-name-field-coordinates input[name="radio"]:checked').prev().val(coord1 + ':' + relX + ',' + relY);
      hint();
    })

    if ($('.field-name-field-coordinates .form-item .form-item input[type="radio"]').length == 0) {
      $('.field-name-field-coordinates .form-item .form-item').append('<input type="radio" name="radio" class="spots">');
    }

  }
}})(jQuery);