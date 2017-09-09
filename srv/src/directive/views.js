module.exports = function (app) {
  app.directive("topBar", function () {
    return {
      restrict: "E",
      templateUrl: "/static/views/topbar/index.html"
    };
  });
  app.directive("sideBar", function () {
    return {
      restrict: "E",
      templateUrl: "/static/views/sidebar/index.html"
    };
  });

  var controlSideBarLoaded = false;

  app.directive("controlSideBar", function () {
    return {
      restrict: "E",
      templateUrl: "/static/views/control-sidebar/index.html",
      link: function () {
        controlSideBarLoaded = true;
      }
    };
  });

  app.directive("appScript", function () {
    return {
      restrict: "E",
      templateUrl: "/static/views/scripts.html",
      link: function () {
        if (!controlSideBarLoaded) {
          var intervalID = setInterval(function () {
            if (controlSideBarLoaded) {
              clearInterval(intervalID);
              $.AdminLTE.controlSidebar.activate();
            }
          }, 250);

        }
      }
    };
  });

  app.directive('smoothieGrid', function () {
    return {
      template: '<canvas ng-transclude></canvas>',
      replace: true,
      transclude: true,
      restrict: 'E',

      scope: {
        background: '@',
        lineColor: '@',
        lineWidth: '@',
        labelColor: '@'
      },

      controller: function ($scope, $element) {
        this.canvas = $element[0];

        this.smoothie = new SmoothieChart({grid: {strokeStyle:'rgb(30, 30, 30)', fillStyle:'rgb(20, 20, 20)', lineWidth: 1, millisPerLine: 250, verticalSections: 6 }});
      }
    };
  })

  app.directive('timeSeries', function ($interval) {
    return {
      restrict: 'E',
      require: '^smoothieGrid',

      scope: {
        rate: '@',
        color: '@',
        width: '@',
        fill: '@',
        callback: '&'
      },

      controller: function ($scope, $element) {
        $scope.rate = $scope.rate || 1000;
        $scope.line = new TimeSeries();
        $scope.callback = $scope.callback ? $scope.callback : function () {
          return false;
        };
      },

      link: function (scope, element, attrs, controller) {
        controller.smoothie.streamTo(controller.canvas, scope.rate);

        controller.smoothie.addTimeSeries(scope.line, {
          strokeStyle: scope.color || 'green',
          fillStyle: scope.fill,
          lineWidth: scope.width || 2
        });

        var updateInterval = $interval(function () {
          var point = scope.callback();
          scope.line.append(point[0], point[1]);
        }, scope.rate);

        element.on('$destroy', function () {
          $interval.cancel(updateInterval);
        });
      }
    };
  });
}
