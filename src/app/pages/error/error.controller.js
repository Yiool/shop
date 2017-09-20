/**
 * Created by Administrator on 2016/10/20.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('ErrorForbiddenController', ErrorForbiddenController)
        .controller('ErorNotfoundController', ErorNotfoundController);

    /** @ngInject */
    function ErrorForbiddenController($interval, $state) {
      var vm = this;
      var timer = null;
      vm.countdown = 10;
      timer = $interval(function(){
        vm.countdown--;
        if(vm.countdown < 1){
          $interval.cancel(timer);
          $state.go('desktop.home');
        }
      },1000);
    }

    /** @ngInject */
    function ErorNotfoundController($interval, $state) {
      var vm = this;
      var timer = null;
      vm.countdown = 10;
      timer = $interval(function(){
        vm.countdown--;
        if(vm.countdown < 1){
          $interval.cancel(timer);
          $state.go('desktop.home');
        }
      },1000);
    }
})();
