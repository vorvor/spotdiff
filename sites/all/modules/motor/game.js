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
      $this = $(this);
      $('#dev').append(relX + ':' + relY + '<br/>');
      $.ajax({
        url: "/ajax/spot/" + gid + "/" + relX + "/" + relY, 
        success: function(result){
          if (result[0] == 1) {
            coords = result[2];
            // show clickable area of spot
            //ctx.rect(coords[0], coords[1], coords[2]-coords[0], coords[3]-coords[1]);
            //ctx.stroke();
            console.log(coords[0]+':'+ coords[1]+':'+coords[2]+':'+coords[3]);
            markSpot(coords[0], coords[1], coords[2], coords[3]);
            $('#spotted').html($('#spotted').html() * 1 + 1);
            $('#score').html(result[1]);
            if (result[3] == 5) {
              $('#game-message').append("CONGRATULATION! NEXT >>").click(function() {
                location.reload();
              }).addClass('nextgame');
              clock.stop();
              $('.spot-image').unbind('click');
            }
          } else {
            $('#score').html(result[1]);
            $this.effect("shake", {times:2, direction: "right"}, 40);
            $this.effect("shake", {times:2, direction: "up"}, 40);
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

    // init
    $('#image-1 canvas').attr('height', $('#image-1 img').height());
    var c = document.getElementById("img-1-cnvs");
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "yellow";
    $('#dev').html(gid);
    $.ajax({
      url: "/ajax/setspots/" + gid + '/' + 0, 
      success: function(result){
        if (result) {
          for (i = 0; i < result['spotted'].length; i++) {
            coord = result['spotted'][i];
            markSpot(coord['x'], coord['y'], coord['x2'], coord['y2']);
          }
          updateNums(result['spotted'].length, result['score']);
        }
      }});
    
    $('#hint').click(function() {
      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      $.ajax({
        url: "/ajax/setspots/" + gid + '/' + 1, 
        success: function(result) {
          for (i = 0; i < result.length; i++) {
            coord = result[i];
            ctx.rect(coord['x'], coord['y'], coord['x2'] - coord['x'], coord['y2'] - coord['y']);
            ctx.fillText(i, coord['x'] - 10, coord['y'] - 10);
            ctx.stroke();
          }
        }});
    })  

    function updateNums(spotnum, score) {
      $('#spotted').html(spotnum);
      $('#score').html(score);
    }

    function markSpot(x,y,x2,y2) {
      x = parseInt(x);
      y = parseInt(y);
      w = parseInt(x2) - parseInt(x);
      h = parseInt(y2) - parseInt(y);
      $('#image-1').append('<div class="diff-spotted" style="top:' + (y+h/2-18) + 'px;left: ' + (x+w/2-20) + 'px;"></div>');
    }

  }
}})(jQuery);











