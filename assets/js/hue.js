(function() {

  $( document ).ready(function() {

    var key = '3407f3f35a8fb76c284dba425abcb9e9';
    var host = 'http://192.168.1.114';
    var lights = {};
    var groups = {};

    var devices = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 }
    ];

    $('.color').colorpicker({
      format: 'rgb'
    });


    /** 
     * Show response data 
     */
    var results = function(data) {
      $('.response').html(JSON.stringify(data, null, '\t'));
    };


    /** 
     * Get list of lights
     */
    $('.get-lights').click(function(e){

        var url = '/api/' + key + '/lights';

        $.ajax({
          url: host + url,
          type: 'GET',
          success: function(data) {
            results(data);
            lights = data;
          },
        });

    });


    /** 
     * Get list of groups
     */
    $('.get-groups').click(function(e){

        var url = '/api/' + key + '/groups';

        $.ajax({
          url: host + url,
          type: 'GET',
          success: function(data) {
            results(data);
            groups = data;
          },
        });

    });


    /** 
     * Send color update command to all lights
     */
    $('.send').click(function(e){

      e.preventDefault();

      var data = {
        'on': true,
        'xy': [
          parseFloat($('input[name=gamut-x]').val()), 
          parseFloat($('input[name=gamut-y]').val())
        ],
        'sat': 255,
      };

      for (var i = 0; i < devices.length; i++) {

        var dev = devices[i].id;
        var url = '/api/' + key + '/lights/' + dev + '/state/';

        for (var j = 1; j < 256; j++) {

          data.bri = j;
          console.log('Sending update with brightness '+data.bri);
  
          $.ajax({
            url: host + url,
            type: 'PUT',
            data: JSON.stringify(data),
            beforeSend: function(data) {
              
            },
            success: function(data) {
              results(data);
            },
          });

          sleep(50);

        }
      
      }

    });

  }); // end .ready()

})();



/**
 * Source: https://github.com/mjijackson/mjijackson.github.com/blob/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.txt
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}


/** 
 * Source: http://stackoverflow.com/a/26233318/1775124
 */
function getHue(red, green, blue) {

    var min = Math.min(Math.min(red, green), blue);
    var max = Math.max(Math.max(red, green), blue);

    var hue = 0;
    if (max == red) {
        hue = (green - blue) / (max - min);

    } else if (max == green) {
        hue = 2 + (blue - red) / (max - min);

    } else {
        hue = 4 + (red - green) / (max - min);
    }

    hue = hue * 60;
    if (hue < 0) hue = hue + 360;

    return Math.round(hue);
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}