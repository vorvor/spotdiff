(function($) {  

Drupal.behaviors.game = {
  attach: function (context, settings) {

    clock = $('#game-clock').FlipClock({
      clockFace: 'MinuteCounter'
    });

    $('.spot-image').click(function(e) {
      clock.start();

      var parentOffset = $(this).offset(); 
      var relX = e.pageX - parentOffset.left;
      var relY = e.pageY - parentOffset.top;

      gid = $("#game").data("gid");
      var c = document.getElementById("img-1-cnvs");
      var ctx = c.getContext("2d");
      ctx.strokeStyle = "yellow";
      $.ajax({
        url: "/ajax/spot/" + gid + "/" + relX + "/" + relY, 
        success: function(result){
          console.log(result);
          if (result[0] == 1) {
            coords = result[2];
            ctx.rect(coords[0], coords[1], coords[2]-coords[0], coords[3]-coords[1]);
            ctx.stroke();
            $('#spotted').html($('#spotted').html() * 1 + 1);
            $('#score').html(result[1]);
            if (result[3] == 5) {
              $('#game-message').append("CONGRATULATION!");
              clock.stop();
            }
          }
        }});
    })

    $(window).bind('beforeunload', function(e){
      gid = $("#game").data("gid");
      $.ajax({
        url: "/ajax/savetime/" + gid + "/"  + clock.getTime(), 
        success: function(result){
          
        }});
    });

    gid = $("#game").data("gid");
    $.ajax({
      url: "/ajax/gettime/" + gid, 
      success: function(result) {
        clock.setTime(result * 1);
      }});

    var c = document.getElementById("img-1-cnvs");
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "yellow";
    $.ajax({
        url: "/ajax/setspots/" + gid + '/' + 0, 
        success: function(result){
          pairs = result.split(',');
          for (i = 0; i < pairs.length - 1; i+=2) {
            coords1 = pairs[i].split(':');
            coords2 = pairs[i + 1].split(':');
            console.log(coords1[0] + ':' + coords1[1]);
            console.log(coords2[0] + ':' + coords2[1]);
            ctx.rect(coords1[0], coords1[1], coords2[0] - coords1[0], coords2[1] - coords1[1]);
            ctx.stroke();
          }
          $('#spotted').html((pairs.length - 1) / 2);
          if (pairs[pairs.length - 1] != pairs.length - 1) {
            clock.start();
          }
          
        }});
    
    $('#hint').click(function() {
      $.ajax({
        url: "/ajax/setspots/" + gid + '/' + 1, 
        success: function(result) {
          console.log(result);
          pairs = result.split(',');
          for (i = 0; i < pairs.length - 2; i+=2) {
            coords1 = pairs[i].split(':');
            coords2 = pairs[i + 1].split(':');
            console.log(coords1[0] + ':' + coords1[1]);
            console.log(coords2[0] + ':' + coords2[1]);
            console.log('---');
            ctx.rect(coords1[0], coords1[1], coords2[0] - coords1[0], coords2[1] - coords1[1]);
            ctx.stroke();
          }
          if (pairs[pairs.length - 1] != pairs.length - 1) {
            clock.start();
          }
          
        }});
    })  
  


  }
}})(jQuery);











