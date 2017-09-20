/**
 * Created by Administrator on 2017/8/29.
 */

(function(angular){
  "use strict"

  angular
    .module('shopApp')
    .factory('orderTemplate',orderTemplate)

    function orderTemplate(requestService) {
      return requestService.request('trade', 'template');
    }
})(angular);