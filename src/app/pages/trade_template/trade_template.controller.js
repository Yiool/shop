/**
 * Created by Administrator on 2017/8/29.
 */
(function(angular){
  'use strict';

  angular
    .module('shopApp')
    .controller('tradeTemplateListController',tradeTemplateListController);

  /** @ngInject */
  function tradeTemplateListController($state,cbAlert,orderTemplate){
    var vm = this;
    vm.test = $state.current;

    vm.propsParams = {
      addOrderTemplateCb:function(data){
        if(data.status == '0'){
          getList();
        }
      }
    };
    vm.loadingState = true;

    vm.deleteItem = function(data){
      console.log(data.id);
      var tips = "是否确认该操作？"
      cbAlert.ajax(tips, function (isConform) {
        if (isConform) {
          orderTemplate.delete({id:data.id}).then(function (results) {
            if (results.data.status === 0) {
              cbAlert.tips('操作成功');
              getList();
            } else {
              cbAlert.error(results.data.data);
            }
          });
        } else {
          cbAlert.close();
        }
      }, '', 'confirm');

    };



    vm.dragItem = function (data) {
      var item = vm.dataBase[data.currentIndex];
      moveItme(item, data.targetIndex, data.currentIndex);
      console.log(vm.dataBase);
      var orderId = [];
      _.forEach(vm.dataBase,function(v){
        orderId.push(v.id);
      });

      console.log(orderId);
      orderTemplate.sort(orderId).then(function(res){
        console.log(res.data);
      })
    };

    function moveItme(item, targetIndex, currentIndex) {
      var replaceItem = vm.dataBase.splice(targetIndex, 1, item);
      vm.dataBase.splice(currentIndex, 1, replaceItem[0]);
      _.forEach(vm.dataBase, function (item, index) {
        item.sortsku = index;
      });
    }

    getList();

    function getList(){
      orderTemplate.list().then(function(res){
        vm.dataBase = res.data.data;
        vm.loadingState = false;
        console.log(vm.dataBase);

      })
    }

  }
})(angular);