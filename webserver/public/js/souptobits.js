'use strict'; // some browser don't recognize as a pragma. When they see it here
              // they interpret it as a String literal, so we are safe

// Using jquery's DOM's ready:
$(function(){
  // we are including that socket library in the HTML, it exposes a global
  // variable called io. If you call io.connect without arguments, is connects
  // to the same host that browser loaded the page from
  var socket = io.connect();

  // loads an image and prepends it on the body of the page:
  socket.on('badge', function(badge){
    var $img = $('<img src="'+badge.badge_id+'" alt="Badge here">');
    $('body').prepend($img);
  });
});