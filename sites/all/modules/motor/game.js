(function($) {  

Drupal.behaviors.game = {
  attach: function (context, settings) {
    $('#image-1 img').load(function() {
      setCanvas(); 
      var mobRate = $('#image-1 img').width() / 480;

      clock = $('#game-clock').FlipClock({
        clockFace: 'MinuteCounter'
      });

      $('.spot-image').unbind('click').click(function(e) {
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
          url: "/ajax/spot/" + gid + "/" + (relX / mobRate) + "/" + (relY  / mobRate),
          success: function(result){
            if (result[0] == 1) {
              coords = result[2];
              // show clickable area of spot
              //ctx.rect(coords[0], coords[1], coords[2]-coords[0], coords[3]-coords[1]);
              //ctx.stroke();
              markSpot(coords[0] * mobRate, coords[1] * mobRate, coords[2] * mobRate, coords[3] * mobRate);
              $('#spotted').html($('#spotted').html() * 1 + 1);
              $('#score').html(result[1]);
              $('#game-hint-word').hide();
              if (result[3] == 5) {
                $('#game-message').append("Szép munka! Következő kör >>").click(function() {
                  location.reload();
                }).addClass('nextgame');
                clock.stop();
                $('.spot-image').unbind('click');
                $('#game-hint').unbind('click');
              }
            } else {
              console.log(result);
              $('#score').html(result[1]);
              $('#score-wrapper').effect("shake", {times:2, direction: "right"}, 40);
              //$this.effect("shake", {times:2, direction: "up"}, 40);
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
      $(window).resize(function() {
        setCanvas();
        var mobRate = $('#image-1 img').width() / 480;
        $('#image-1 .diff-spotted').remove();
        $.ajax({
        url: "/ajax/setspots/" + gid + '/' + 0, 
        success: function(result){
          if (result) {
            for (i = 0; i < result['spotted'].length; i++) {
              coord = result['spotted'][i];
              markSpot(coord['x'] * mobRate, coord['y'] * mobRate, coord['x2'] * mobRate, coord['y2'] * mobRate);
            }
            //updateNums(result['spotted'].length, result['score']);
          }
        }});
      });
    
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
              markSpot(coord['x'] * mobRate, coord['y'] * mobRate, coord['x2'] * mobRate, coord['y2'] * mobRate);
            }
            updateNums(result['spotted'].length, result['score']);
          }
        }});
    
      $('#hint').unbind('click').click(function() {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        $.ajax({
          url: "/ajax/setspots/" + gid + '/' + 1, 
          success: function(result) {
            for (i = 0; i < result.length; i++) {
              coord = result[i];
              //ctx.rect(coord['x'], coord['y'], coord['x2'] - coord['x'], coord['y2'] - coord['y']);
              //ctx.fillText(i, coord['x'] - 10, coord['y'] - 10);
              //ctx.stroke();
              markSpot(coord['x'] * mobRate, coord['y'] * mobRate, coord['x2'] * mobRate, coord['y2'] * mobRate);
            }
          }});
      })

      $('#game-hint').unbind('click').click(function() {
        $('#game-hint-alert').show();
        $('#game-hint-alert-pop').show();
      })

      $('#game-hint-alert-pop-yes').unbind('click').click(function() {
        $('#game-hint-alert').hide();
        $('#game-hint-alert-pop').hide();
          $.ajax({
          url: "/ajax/gethint/", 
          success: function(result) {
            console.log(result);
            $('#game-hint-word').html(result['hint']).show();
            $('#score').html(result['score']);
          }});
      })

      $('#game-hint-alert-pop-no').unbind('click').click(function() {
        $('#game-hint-alert').hide();
        $('#game-hint-alert-pop').hide();
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

      function setCanvas() {
        
        imgW = $('#image-1 img').width();
        oW = $('#image-1').data('orig-width');
        oH = $('#image-1').data('orig-height');
        oP = oW / oH;
        imgH = imgW / oP;
        console.log(oW +':'+oH+':'+oP+':'+imgW+':'+imgH);

        $('#img-1-cnvs')
        .width(imgW)
        .attr('width', imgW)
        .height(imgH)
        .attr('height', imgH)
        .css('margin-top', imgH * -1 + 'px');

      }

    }).each(function(){
        if(this.complete) {
          $(this).trigger('load');
        }
  }); // load

  }
}})(jQuery);











