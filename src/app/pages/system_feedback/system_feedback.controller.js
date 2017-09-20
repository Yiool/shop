/**
 * Created by Administrator on 2017/05/16.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('FeedBackController', FeedBackController);

    /** @ngInject */
    function FeedBackController(systemFeedback, cbAlert, utils) {
        var vm = this;
        /**
         * 表单对象  提交api用
         * @type {{}}
         */
        vm.dataBase = {};
        vm.dataBase.type = '1';

        var type_status = {
          "1": '建议提交成功',
          "2": '建议提交成功'
        };

        vm.submitFeedback = function() {
            systemFeedback.save(_.merge(vm.dataBase, {createtime: new Date()}))
                .then(utils.requestHandler)
                .then(function() {
                    cbAlert.tips(type_status[vm.dataBase.type]);
                    vm.dataBase.context = "";
                    vm.dataBase.title = "";
                });
        };
    }

})();
