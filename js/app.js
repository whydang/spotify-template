var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=';
var defaultImage = 'img/spotify-logo.png';


var myApp = angular.module('myApp', []);

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.submission = false;
  $scope.displayImage = defaultImage;

  $scope.audioObject = {};
  $scope.getSongs = function() {

    $scope.submission = true;

    $http.get(baseUrl + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items;
      
    })
  }

  // plays the track that was clicked on
  $scope.play = function(track) {
    var song = track.preview_url;

    if($scope.currentSong == song) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause();
      $scope.audioObject = new Audio(song);
      $scope.audioObject.crossOrigin = "anonymous";

      $scope.audioObject.play();
      $scope.audioObject.loop=true;
      $scope.currentSong = song;

      // sets the image to be displayed each time another song is played
      $scope.displayImage = track.album.images[0] ? track.album.images[0].url : defaultImage;
      
      // set the visualiser
      initializeMP3();
    }
  }

  // determines whether or not the song should have play symbol next to it in row
  $scope.displayIcon = function(track) {
    return ($scope.currentSong == track.preview_url);
  }

  // changes the volume when icons are clicked
  $scope.volumeChange = function(diff) {
    var isMute = $scope.audioObject.muted;
    var currVolume = $scope.audioObject.volume;
    if (diff == 0) {
      $scope.audioObject.muted = isMute ? false : true;
    } else {
      currVolume = clamp(currVolume + diff, 0.0, 1.0);
      $scope.audioObject.volume = currVolume;
    }
  }

  // clamps value of volume to not exceed a min and max
  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  // analyser variables, the internet is a great learning experience :D
  var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
  
  function initializeMP3() {
    $('#audio-box').append($scope.audioObject);
    context = new AudioContext();
    analyser = context.createAnalyser();
    canvas = $("#analyser")[0];
    ctx = canvas.getContext('2d');

    source = context.createMediaElementSource($scope.audioObject);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
  }

  var SAMPLES = 150;
  var BAR_WIDTH = 3;
  function frameLooper() {
    window.requestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = '#0066FF'; // Color of the bars
    bars = SAMPLES;
    for (var i = 0; i < bars; i++) {
      bar_x = i * BAR_WIDTH;
      bar_width = BAR_WIDTH;
      bar_height = -(fbc_array[i] / 2);
      //  fillRect( x, y, width, height ) // Explanation of the parameters below
      ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
  }

});
