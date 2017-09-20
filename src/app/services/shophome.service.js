/**
 * Created by Administrator on 2016/12/3.
 */
(function() {
  'use strict';
  angular
      .module('shopApp')
      .service('shophomeService', shophomeService);

  /** @ngInject */
  function shophomeService($q, shopHome, cbAlert) {
    var shopInfo = null;

    this.getInfo =function () {
      var deferred = $q.defer();
      if(shopInfo !== null){
        deferred.resolve(shopInfo);
      }else{
        shopHome.manager()
            .then(function (results) {
              if (results.data.status === 0) {
                shopInfo = results.data;
                _.remove(shopInfo.data.allonelevel, {'catename': '其他'});
                deferred.resolve(shopInfo);
              } else {
                deferred.reject(results.data.data);
                cbAlert.error("错误提示", results.data.data);
              }
            });
      }
      return deferred.promise;
    };

    this.setInfo = function(value) {
      console.log('55', value);
      shopInfo.data = value;
      shopInfo.countIsshow = value.$countIsshow;
    }

  }

})();
