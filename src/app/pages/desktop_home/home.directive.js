/**
 * Created by Administrator on 2016/10/10.
 */

(function () {
  'use strict';

  angular
    .module('shopApp')
    .factory('echarts', function () {
      return echarts;
    })
    .directive('chart', chart)
    .directive('searchToStart',searchToStart)
    .directive('dragableBox',dragableBox);


  function chart(echarts,$window) {
    return {
      restrict: "A",
      scope: {
        config:'='
      },
      link: function (scope, iElement) {
        var myCharts = echarts.init(iElement[0]);
        scope.$watch('config',function(newval){
          myCharts.setOption(newval);
        },true);
        $window.onresize=myCharts.resize;
      }
    }
  }


  function searchToStart() {
    return {
      restrict: "A",
      scope: {
        item:'=',
        itemHandler:'&'
      },
      link:function(scope,iElement){

      }
    }
  }

  function dragableBox(dragHandlerService) {
    return {
      restrict: "A",
      scope: {
        item:'=',
        itemHandler:'&'
      },
      replace: true,
      templateUrl: "app/pages/desktop_home/dragbox.html",
      link:function(scope,iElement){
        var box = iElement[0];
        dragHandlerService.startDrag(box);
      }
    }
  }
})();

