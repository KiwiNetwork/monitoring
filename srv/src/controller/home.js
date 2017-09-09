module.exports = function($scope, socket, $rootScope, $routeParams, $interval){
    var server = $routeParams.server;

    $scope.refresh = function () {
        if (server == null) {
            $scope.server = $rootScope.servers[Object.keys($rootScope.servers)[0]]
        } else {
            $scope.server = $rootScope.servers[server]
        }
    }
    
    socket.on('refresh', function(data){
        $rootScope.servers[data.id] = data
        $scope.refresh()
    })

    $scope.getTX = function() {
        return [new Date().getTime(), ($scope.server.net.tx / 1024)];
    }

    $scope.getRX = function() {
        return [new Date().getTime(), ($scope.server.net.rx / 1024)];
    }

    $scope.refresh()
    $interval(function() {
        $scope.refresh()
    }, 1000)

    $scope.secondsToReadableTime = function (seconds) {
        var uptime = ""
        var y = Math.floor(seconds/60/60/24/365);
        var d = Math.floor(seconds/60/60/24) % 365;
        var h = Math.floor((seconds / 3600) % 24);
        var m = Math.floor((seconds / 60) % 60);

        if(y > 0) { 
            yw = y > 1 ? ' années ' : ' année '; 
            uptime += $y + yw; 
        }
        if(d > 0) { 
            dw = d > 1 ? ' jours ' : ' jour '; 
            uptime += d + dw; 
        }
        if(h > 0) { 
            hw = h > 1 ? ' heures ' : ' heure '; 
            uptime += h + hw; 
        }
        if(m > 0) {
            mw = m > 1 ? ' minutes ' : ' minute '; 
            uptime += m + mw; 
        }

        return uptime
    }
}