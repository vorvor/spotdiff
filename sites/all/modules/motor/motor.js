(function($) {  

Drupal.behaviors.admin = {
  attach: function (context, settings) {

    var coord1;

    $('img').mousedown(function(e) {
      e.preventDefault();
      var parentOffset = $(this).offset(); 
      var relX = e.pageX - parentOffset.left;
      var relY = e.pageY - parentOffset.top;
      $('.field-name-field-coordinates input[name="radio"]:checked').prev().val(relX + ',' + relY);
      coord1 = relX + ',' + relY;
    })

    $('img').mouseup(function(e) {
      var parentOffset = $(this).offset(); 
      var relX = e.pageX - parentOffset.left;
      var relY = e.pageY - parentOffset.top;
      var val = $('.field-name-field-coordinates input[name="radio"]:checked').prev().val();
      $('.field-name-field-coordinates input[name="radio"]:checked').prev().val(coord1 + ':' + relX + ',' + relY);
    })

    if ($('.field-name-field-coordinates .form-item .form-item input[type="radio"]').length == 0) {
      $('.field-name-field-coordinates .form-item .form-item').append('<input type="radio" name="radio">');
    }


  }
}})(jQuery);











