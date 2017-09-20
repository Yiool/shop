/**
 * Created by Administrator on 2017/8/29.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .directive('createOrderTemplateDialog', createOrderTemplateDialog);


  function createOrderTemplateDialog($q, cbDialog, $filter, $document, cbAlert, tadeOrder, utils, computeService, orderTemplate) {
    return {
      restrict: "A",
      scope: {
        item: '=',
        itemHandler: '&'
      },
      link: function (scope, iElement) {
        /**
         * 获取模糊查询结果
         * @param type
         * @param data
         */
        function getResults(type, data) {
          var deferred = $q.defer();
          tadeOrder[type](data).then(function (results) {
            if (results.data.status === 0) {
              deferred.resolve(results.data.data);
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });
          return deferred.promise;
        }

        /**
         * 后端接口API地址的一部分
         * 可根据 'code' 'manualskuvalues' 'servername' 'skuvalues' 'cnname' 等进行搜索
         * @type {{0: string, 1: string}}
         */
        var getOrder = {
          "0": 'getOrderServer',
          "1": 'getOrderProduct'
        };

        function handler(childScope) {

          /*$document.on('click', function () {
            scope.$apply(function () {
              childScope.showDropSelect = false;
            });
          });*/

          /**
           * 先判断是否存在数据，如果不存在的话则表示 新增套餐卡
           * 如果存在则表示 修改套餐卡 信息
           */

          childScope.showDropSelect = false;
          childScope.isEdit = false;
          if (angular.isUndefined(scope.item)) {
            childScope.dataBase = {
              'fastordername': '',
              'bak': '',
              'fastOrderItems': [{
                type: '-1',
                item:'',
                price:'0.00',
                originprice:'0.00',
                num:0
              }]
            };
          } else {
            childScope.isEdit = true;
            childScope.dataBase = _.cloneDeep(scope.item);
            console.log(scope.item);
            angular.forEach(childScope.dataBase.fastOrderItems, function (packageItem) {
              packageItem.originprice = computeService.pullMoney(packageItem.originprice);
              packageItem.price = computeService.pullMoney(packageItem.price);
              packageItem.price = (packageItem.price * 1).toFixed(2);
              packageItem.originprice = (packageItem.originprice * 1).toFixed(2);
            });
          }

          /*
          * cb-amount  组件回调 修改sku数量
          * */
          childScope.updataNum = function(data,item){
            item.num = data;
            // console.log(data);
          };


          /**
           * 用于给childScope添加其它的属性
           * @type {{}}
           */
          childScope.config = {
            isSelectItem: false // 是否点击搜索下拉框， 避免不选择就可以提交
          };


          childScope.getFocus = function (event,item) {
            event.stopPropagation();
            event.preventDefault();
            _.forEach(childScope.dataBase.fastOrderItems, function (packageItem) {
              packageItem.$showSelect = false;
            });
            item.$showSelect = true;
            childScope.showDropSelect = true;
            if(item.type < 0){
              return false;
            }
            _.forEach(childScope.dataBase.fastOrderItems, function (packageItem) {
              packageItem.$isSelected = true;
            });
            childScope.searchHandler(item);
            item.$isSelected = false;
            childScope.config.isSelectItem = false; // focus则表明还没有选择搜索框中的item
          };

          /**
           * 添加一个新的package item
           */
          childScope.addPackageItem = function () {
            var flag = true;
            if(!childScope.dataBase.fastOrderItems){
              childScope.dataBase.fastOrderItems = [{
                type: '-1',
                originprice:'0.00',
              }];
              return;
            }
            _.forEach(childScope.dataBase.fastOrderItems,function (v) {
              if(v.type<0 || !v.name){
                flag = false;
                v.$noName = true;
              }
            })

            flag && (childScope.dataBase.fastOrderItems.push({
              type: '-1',
              originprice:'0.00'
            }))

          };

          /**
           * 根据索引删除某个package item
           * @param item 当前项
           * @param index 当前索引
           */
          childScope.removePackageItem = function (item, index) {
            // _.remove(childScope.dataBase.fastOrderItems, {'guid': item.guid});
            childScope.config.isSelectItem = true; // 清除的时候将已选中设置为true,防止不能提交
            childScope.config.searchList = undefined; // 清除下拉框
            childScope.dataBase.fastOrderItems.splice(index, 1);
            if (angular.isDefined(childScope.dataBase.fastOrderItems)) {
              computeSinglePrice(item);
              computeTotalPrice();
            }
            if (childScope.dataBase.fastOrderItems.length === 0) {
              childScope.dataBase.$emptyPackage = true; // fastOrderItems为空时，禁止提交
            }
          };


          /**
           * 计算单个原价或者套餐价
           */
          function computeSinglePrice(item) {
            item.$originprice = computeService.multiply(item.originprice, item.num);
            item.$price = computeService.multiply(item.price, item.num);
          }

          /**
           * 计算合计，统计商品项和合计，统计服务项和合计
           */
          function computeTotalPrice() {
            childScope.dataBase.originprice = _.reduce(childScope.dataBase.fastOrderItems, function (result, value) {
              return computeService.add(result, value.$originprice);
            }, 0);
            childScope.dataBase.price = _.reduce(childScope.dataBase.fastOrderItems, function (result, value) {
              return computeService.add(result, value.$price);
            }, 0);
          }

          /**
           * 单个packageItem price，输入金额时计算价格
           */
          childScope.inputPrice = function (item) {
            computeSinglePrice(item);
            computeTotalPrice();
          };

          /**
           * 将输入的金额保留2位小数
           * @param item
           */
          childScope.formatMoney = function (item) {
            if (!_.isUndefined(item.price)) {
              item.price = (item.price * 1).toFixed(2);
            }
            if (!_.isUndefined(item.originprice)) {
              item.originprice = (item.originprice * 1).toFixed(2);
            }
          };

          /**
           * 重新选择类型时，将其它输入框清空
           * @param item
           */
          childScope.reselectType = function (item) {
            if (!_.isUndefined(item.type)) {
              item.name = '';
              item.originprice = '';
              item.price = '';
              item.num = '';
              childScope.config.searchList = undefined; // 清除下拉框
              item.$isSelected = false;
              item.$isValueEmpty = false;
              computeSinglePrice(item);
              computeTotalPrice();
            }
          };

          /**
           * 查询搜索
           * @param value
           */
          childScope.searchHandler = _.throttle(function (item) {
            getResults(getOrder[item.type], {pageSize: 10000})
              .then(function (results) {
                /**
                 * 移除已经存在的packageItem
                 */
                _.remove(results, function (result) {
                  return _.find(childScope.dataBase.fastOrderItems, function (packageItem) {
                    return result.guid === packageItem.guid || result.guid === packageItem.objectid;
                  })
                });
                // console.log('list1',childScope.config.searchList);
                console.log(results);
                childScope.config.searchList = _.map(results, function (item) {
                  if (angular.isDefined(item.serverid)) { // 如果是服务
                    item.name = item.servername + ' ' + item.manualskuvalues;
                    item.originprice = $filter('moneySubtotalFilter')([computeService.pullMoney(item.serverprice), item.servertime]);
                    item.originprice = item.originprice.toFixed(2);
                  } else { // 如果是商品
                    item.name = item.productname + ' ' + item.cnname + ' ' + item.manualskuvalues;
                    item.originprice = computeService.pullMoney(item.salepriceText);
                    item.originprice = item.originprice.toFixed(2);
                  }
                  return item;

                });
                console.log('list2',childScope.config.searchList.length);
              });
          }, 200);
          childScope.searchHandler1 = _.throttle(function (item) {
            getResults(getOrder[item.type], {pageSize: 10000,keyword:item.name})
              .then(function (results) {
                /**
                 * 移除已经存在的packageItem
                 */
                _.remove(results, function (result) {
                  return _.find(childScope.dataBase.fastOrderItems, function (packageItem) {
                    return result.guid === packageItem.guid || result.guid === packageItem.objectid;
                  })
                });
                // console.log('list1',childScope.config.searchList);
                console.log(results);
                childScope.config.searchList = _.map(results, function (item) {
                  if (angular.isDefined(item.serverid)) { // 如果是服务
                    item.name = item.servername + ' ' + item.manualskuvalues;
                    item.originprice = $filter('moneySubtotalFilter')([computeService.pullMoney(item.serverprice), item.servertime]);
                    item.originprice = item.originprice.toFixed(2);
                  } else { // 如果是商品
                    item.name = item.productname + ' ' + item.cnname + ' ' + item.manualskuvalues;
                    item.originprice = computeService.pullMoney(item.salepriceText);
                    item.originprice = item.originprice.toFixed(2);
                  }
                  return item;

                });
                console.log('list2',childScope.config.searchList.length);
              });
          }, 200);

          /**
           * 提交金额时 乘以100变为'分'返回给后台
           * @param money
           */
          function formatPushMoney(money) {
            return computeService.pushMoney(money);
          }


          /*
          * 表单提交拦截器
          * */
          function interception(data){
            console.log(data);
            var flag = true;
            if(!data.fastordername){
              data.$isNameEmpty = true;
              flag = false;
            }
            if(!data.fastOrderItems){
              flag = false;
            }
            _.forEach(data.fastOrderItems,function(v){
              if(!v.name){
                v.$noName = true;
                flag = false;
              }
            });
            return flag;
          }

          /**
           * 提交给后台
           */
          childScope.saveTemplate = function () {
            /*if (childScope.dataBase.num === '') {
             childScope.dataBase.num = null;
             }*/

            /*
             * 将空的项目删除
             * */
            if(!childScope.dataBase.fastOrderItems){
              return false;
            }
            var len = childScope.dataBase.fastOrderItems.length;
            var lastItem = childScope.dataBase.fastOrderItems[len-1];
            if(lastItem.type < 0 && !lastItem.name){
              childScope.dataBase.fastOrderItems.splice(len-1,1);
            }

            /*
            * 表单验证
            * */
            if(!interception(childScope.dataBase)){
              return false;
            }
            childScope.dataBase.originprice = formatPushMoney(childScope.dataBase.originprice);
            childScope.dataBase.price = formatPushMoney(childScope.dataBase.price);
            _.map(childScope.dataBase.fastOrderItems, function (item) {
              item.originprice = formatPushMoney(item.originprice);
              item.price = formatPushMoney(item.price);
              if(!item.num){
                item.num = 1;
              }
            });

            // scope.itemHandler({data: {"status": "-1", "data": childScope.dataBase}});

            // 去除packageItem 中item json中不必要的字段
            /*_.forEach(childScope.dataBase.fastOrderItems, function(packageItem) {
             var itemJson = angular.fromJson(packageItem.item);
             itemJson = _.omit(itemJson, ['name', 'originprice']);
             packageItem.item = angular.toJson(itemJson)
             });*/


            orderTemplate.add(childScope.dataBase)
              .then(utils.requestHandler)
              .then(function () {
                cbAlert.tips('保存套餐成功');
                childScope.close();
                scope.itemHandler(
                  {
                    data: {
                      status: '0'
                    }
                  }
                )
                // $state.reload();
              });
          };

          function setPackageItems(item, result) {
            item.item = angular.toJson(result);
            item.objectid = result.guid;
            _.merge(item, result);
            computeSinglePrice(item);
            computeTotalPrice();
          }


          /**
           * 选择下拉选项
           * @param event
           * @param subitem 选择的商品或服务的信息
           * @param item
           */
          childScope.chooseItem = function (event, subitem, item) {
            _.forEach(childScope.dataBase.fastOrderItems, function (packageItem) {
              packageItem.$isSelected = true;
            });

            setPackageItems(item, subitem);
            // childScope.config.searchList = undefined; // 清除下拉框
            childScope.showDropSelect = false;
            childScope.config.isSelectItem = true;
            item.$isValueEmpty = true; // 是否已经选择name
            computeSinglePrice(item);
            computeTotalPrice();
          };

        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/trade_template/create_order_template_dialog.html", handler, {
            windowClass: "viewFramework-create-order-template-dialog"
          });
        });
      }
    }
  }

  /** @ngInject */
  /* function createOrderTemplateDialog($q, cbDialog, $filter, marktingPackage, cbAlert, tadeOrder, utils, computeService, $state,orderTemplate) {
   return {
   restrict: "A",
   scope: {
   item: '=',
   itemHandler: '&'
   },
   link: function (scope, iElement) {
   /!**
   * 获取模糊查询结果
   * @param type
   * @param data
   *!/
   function getResults(type, data){
   var deferred = $q.defer();
   tadeOrder[type](data).then(function(results) {
   if (results.data.status === 0) {
   deferred.resolve(results.data.data);
   } else {
   cbAlert.error("错误提示", results.data.data);
   }
   });
   return deferred.promise;
   }

   /!**
   * 后端接口API地址的一部分
   * 可根据 'code' 'manualskuvalues' 'servername' 'skuvalues' 'cnname' 等进行搜索
   * @type {{0: string, 1: string}}
   *!/
   var getOrder = {
   "0": 'getOrderServer',
   "1": 'getOrderProduct'
   };

   function handler(childScope) {

   /!**
   * 先判断是否存在数据，如果不存在的话则表示 新增套餐卡
   * 如果存在则表示 修改套餐卡 信息
   *!/
   childScope.isEdit = false;
   if (angular.isUndefined(scope.item)) {
   childScope.dataBase = {
   'name': '',
   'bak': '',
   'price': 0,
   'originprice': 0,
   'status': '1',
   'fastOrderItems': [{
   type:'-1'
   }]
   };
   } else {
   childScope.isEdit = true;
   childScope.dataBase = _.cloneDeep(scope.item);
   childScope.minNum = scope.item.num; // 用于部分修改时，只能改大不能改小
   angular.forEach(childScope.dataBase.fastOrderItems, function(packageItem) {
   packageItem.originprice = computeService.pullMoney(packageItem.originprice);
   packageItem.price = computeService.pullMoney(packageItem.price);
   packageItem.price = (packageItem.price * 1).toFixed(2);
   packageItem.originprice = (packageItem.originprice * 1).toFixed(2);
   computeSinglePrice(packageItem);
   packageItem.$isValueEmpty = packageItem.name === '';
   });
   computeTotalPrice();
   childScope.isEditable = function() {
   childScope.config.isSelectItem = true;
   return childScope.dataBase.soldnum > 0 // true: 卖出就表示只能部分修改; false: 则表示全部可以修改
   };
   }

   /!**
   * 用于给childScope添加其它的属性
   * @type {{}}
   *!/
   childScope.config = {
   isSelectItem: false // 是否点击搜索下拉框， 避免不选择就可以提交
   };

   /!**
   * 清空选择框，一次只允许清空一行
   *!/
   childScope.clearContent = function (item, index) {
   if (!_.isUndefined(item.name)) {
   _.remove(childScope.dataBase.fastOrderItems, function(packageItem) {
   return packageItem.objectid === item.objectid;
   });
   childScope.dataBase.fastOrderItems.splice(index, 0, {
   type: item.type
   });
   /!*item.name = '';
   item.originprice = '';
   item.price = '';
   item.num = '';*!/
   item.$isValueEmpty = false; // 清空时，item.name已选择 设置为false
   childScope.config.isSelectItem = false;
   computeSinglePrice(item);
   computeTotalPrice();
   }
   };

   childScope.getFocus = function(item) {
   _.forEach(childScope.dataBase.fastOrderItems, function(packageItem) {
   packageItem.$isSelected = true;
   });
   childScope.searchHandler(item);
   item.$isSelected = false;
   childScope.config.isSelectItem = false; // focus则表明还没有选择搜索框中的item
   };

   /!**
   * 添加一个新的package item
   *!/
   childScope.addPackageItem = function() {

   // 如果最后一个服务或商品没有填完整则不允许添加新的服务或商品
   // var fullProp = ['type', 'name', 'originprice', 'price', 'num'];
   /!*var length = childScope.dataBase.fastOrderItems.length;
   if (childScope.dataBase.fastOrderItems[length - 1]) {
   for (var i = 0; i < fullProp.length; i ++) {
   var prop = childScope.dataBase.fastOrderItems[length - 1][fullProp[i]];
   if (prop === '' || _.isUndefined(prop)) {
   return false;
   }
   }
   }*!/

   // 用于防止出现多个下拉框的情况
   /!*_.forEach(childScope.dataBase.fastOrderItems, function(packageItem) {
   packageItem.$isSelected = true;
   });*!/

   // childScope.dataBase.$emptyPackage = false; // 添加商品时，则说明有packageItem, 和removePackageItem相对应
   childScope.dataBase.fastOrderItems.push({
   'name': '',
   'bak': '',
   'price': 0,
   'originprice': 0,
   'status': '1',
   'fastOrderItems': [{
   type:'-1'
   }]
   })
   };

   /!**
   * 根据索引删除某个package item
   * @param item 当前项
   * @param index 当前索引
   *!/
   childScope.removePackageItem = function(item, index) {
   // _.remove(childScope.dataBase.fastOrderItems, {'guid': item.guid});
   childScope.config.isSelectItem = true; // 清除的时候将已选中设置为true,防止不能提交
   childScope.config.searchList = undefined; // 清除下拉框
   childScope.dataBase.fastOrderItems.splice(index, 1);
   if (angular.isDefined(childScope.dataBase.fastOrderItems)) {
   computeSinglePrice(item);
   computeTotalPrice();
   }
   if (childScope.dataBase.fastOrderItems.length === 0) {
   childScope.dataBase.$emptyPackage = true; // fastOrderItems为空时，禁止提交
   }
   };


   /!**
   * 计算单个原价或者套餐价
   *!/
   function computeSinglePrice(item) {
   item.$originprice = computeService.multiply(item.originprice, item.num);
   item.$price = computeService.multiply(item.price, item.num);
   }

   /!**
   * 计算合计，统计商品项和合计，统计服务项和合计
   *!/
   function computeTotalPrice() {
   childScope.dataBase.originprice = _.reduce(childScope.dataBase.fastOrderItems, function (result, value) {
   return computeService.add(result, value.$originprice);
   }, 0);
   childScope.dataBase.price = _.reduce(childScope.dataBase.fastOrderItems, function (result, value) {
   return computeService.add(result, value.$price);
   }, 0);
   }

   /!**
   * 单个packageItem price，输入金额时计算价格
   *!/
   childScope.inputPrice = function(item) {
   computeSinglePrice(item);
   computeTotalPrice();
   };

   /!**
   * 将输入的金额保留2位小数
   * @param item
   *!/
   childScope.formatMoney = function(item) {
   if (!_.isUndefined(item.price)) {
   item.price = (item.price * 1).toFixed(2);
   }
   if (!_.isUndefined(item.originprice)) {
   item.originprice = (item.originprice * 1).toFixed(2);
   }
   };

   /!**
   * 重新选择类型时，将其它输入框清空
   * @param item
   *!/
   childScope.reselectType = function(item) {
   if (!_.isUndefined(item.type)) {
   item.name = '';
   item.originprice = '';
   item.price = '';
   item.num = '';
   childScope.config.searchList = undefined; // 清除下拉框
   item.$isSelected = false;
   item.$isValueEmpty = false;
   computeSinglePrice(item);
   computeTotalPrice();
   }
   };

   /!**
   * 查询搜索
   * @param value
   *!/
   childScope.searchHandler = _.throttle(function(item) {
   getResults(getOrder[item.type], {pageSize: 10000, keyword: item.name})
   .then(function(results) {
   /!**
   * 移除已经存在的packageItem
   *!/
   _.remove(results, function(result) {
   return _.find(childScope.dataBase.fastOrderItems, function(packageItem) {
   return result.guid === packageItem.guid || result.guid === packageItem.objectid;
   })
   });

   childScope.config.searchList = _.map(results, function (item) {
   if (angular.isDefined(item.serverid)) { // 如果是服务
   item.name = item.servername + ' ' + item.manualskuvalues;
   item.originprice = $filter('moneySubtotalFilter')([computeService.pullMoney(item.serverprice), item.servertime]);
   item.originprice = item.originprice.toFixed(2);
   } else { // 如果是商品
   item.name = item.productname + ' ' + item.cnname + ' ' + item.manualskuvalues;
   item.originprice = computeService.pullMoney(item.salepriceText);
   item.originprice = item.originprice.toFixed(2);
   }
   return item;
   });
   // console.log('list',childScope.config.searchList);
   });
   }, 200);


   /!**
   * 提交金额时 乘以100变为'分'返回给后台
   * @param money
   *!/
   function formatPushMoney(money) {
   return computeService.pushMoney(money);
   }
   /!**
   * 提交给后台
   *!/
   childScope.saveTemplate = function() {
   /!*if (childScope.dataBase.num === '') {
   childScope.dataBase.num = null;
   }*!/
   childScope.dataBase.originprice = formatPushMoney(childScope.dataBase.originprice);
   childScope.dataBase.price = formatPushMoney(childScope.dataBase.price);
   _.map(childScope.dataBase.fastOrderItems, function(item) {
   item.originprice = formatPushMoney(item.originprice);
   item.price = formatPushMoney(item.price);
   });

   // scope.itemHandler({data: {"status": "-1", "data": childScope.dataBase}});

   // 去除packageItem 中item json中不必要的字段
   /!*_.forEach(childScope.dataBase.fastOrderItems, function(packageItem) {
   var itemJson = angular.fromJson(packageItem.item);
   itemJson = _.omit(itemJson, ['name', 'originprice']);
   packageItem.item = angular.toJson(itemJson)
   });*!/
   orderTemplate.add(childScope.dataBase)
   .then(utils.requestHandler)
   .then(function() {
   cbAlert.tips('保存套餐成功');
   childScope.close();
   scope.itemHandler(
   {
   data:{
   status:'0'
   }
   }
   )
   // $state.reload();
   });
   };

   function setPackageItems(item, result) {
   item.item = angular.toJson(result);
   item.objectid = result.guid;
   _.merge(item, result);
   computeSinglePrice(item);
   computeTotalPrice();
   }


   /!**
   * 选择下拉选项
   * @param event
   * @param subitem 选择的商品或服务的信息
   * @param item
   *!/
   childScope.chooseItem = function(event, subitem, item) {
   _.forEach(childScope.dataBase.fastOrderItems, function(packageItem) {
   packageItem.$isSelected = true;
   });

   setPackageItems(item, subitem);
   childScope.config.searchList = undefined; // 清除下拉框
   childScope.config.isSelectItem = true;
   item.$isValueEmpty = true; // 是否已经选择name
   computeSinglePrice(item);
   computeTotalPrice();
   };

   }

   /!**
   * 点击按钮
   *!/
   iElement.click(function (t) {
   t.preventDefault();
   t.stopPropagation();
   cbDialog.showDialogByUrl("app/pages/trade_template/create_order_template_dialog.html", handler, {
   windowClass: "viewFramework-create-order-template-dialog"
   });
   });
   }
   }
   }*/

})();