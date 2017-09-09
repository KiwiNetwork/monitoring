var io = require('socket.io-client')
var angular = require('angular')
require('angular-route')
require('angular-sanitize')
require('angular-socket-io')
require('angular-animate')

var app = angular.module("dbapp", ['ngRoute', 'btford.socket-io', 'ngSanitize', 'ngAnimate'])

app.config(function($routeProvider){
  app.routeProvider = $routeProvider

  $routeProvider.when('/', {
    templateUrl: "/static/views/home/index.html",
    controller:"HomeController"
  })

  $routeProvider.when('/:server', {
    templateUrl: "/static/views/home/index.html",
    controller:"HomeController"
  })

  $routeProvider.otherwise({
    redirectTo: '/'
  })

})

app.factory('socket', function(socketFactory, $rootScope){
  var myIoSocket = io.connect({transports: ['websocket']})
  return socketFactory({ioSocket:myIoSocket})
})

app.run(function($rootScope) {
    if ($rootScope.servers == undefined) {
        $rootScope.servers = {}
    }
})

app.run(function($location, $rootScope){
  $rootScope.currentPath = $location.path()
  
  $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
      $rootScope.currentPath = $location.path()
  })
})

app.service('sharedData', require('./service/sharedData.js'))

app.controller('HomeController', require('./controller/home'))

require('./directive/views.js')(app)
