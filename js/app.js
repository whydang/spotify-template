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
      $scope.audioObject.play();
      $scope.audioObject.loop=true;
      $scope.currentSong = song;

      // sets the image to be displayed each time another song is played
      $scope.displayImage = track.album.images[0] ? track.album.images[0].url : defaultImage;
    }
  }

  // determines whether or not the song should have play symbol next to it in row
  $scope.displayIcon = function(track) {
    return ($scope.currentSong == track.preview_url);
  }
});
