/**
 * Created by Administrator on 2016/10/10.
 */
(function () {
  'use strict';


  angular
      .module('shopApp')
      .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    /**
     * 路由跳转配置
     * @param otherwise             默认跳转页面
     * @param when(name, router)    指定路由(当前状态,指定路由)
     */
    $urlRouterProvider
        .otherwise('/notfound')         // 页面找不到
        // .when('', '/desktop/home')       // 工作台
        .when('', '/desktop/home')   // 订单管理
        .when('/', '/desktop/home')       // 工作台
        .when('/desktop', '/desktop/home')       // 工作台
        .when('/desktop/', '/desktop/home')       // 工作台
        .when('/feedback', '/system/feedback/feedback') // 建议反馈
        .when('/store', '/store/shop/')      // 店铺管理
        .when('/store/', '/store/shop/')
        .when('/store/shop', '/store/shop/home')
        .when('/store/shop/', '/store/shop/home')
        .when('/store/shop/home', '/store/shop/home/info')
        .when('/store/shop/home/', '/store/shop/home/info')
        .when('/product', '/notfound')                  // 抛出异常
        .when('/product/', '/notfound')                 // 抛出异常
        .when('/product/goods', '/product/goods/list')     // 商品管理
        .when('/product/goods/', '/product/goods/list')
        .when('/product/goods/list', '/product/goods/list/1')
        .when('/product/goods/list/', '/product/goods/list/1')
        .when('/product/server', '/product/server/list/')     // 产品管理
        .when('/product/server/', '/product/server/list/')
        .when('/product/server/list', '/product/server/list/1')
        .when('/product/server/list/', '/product/server/list/1')
        .when('/trade/porder', '/trade/porder/list/')              // 商品订单管理
        .when('/trade/porder/', '/trade/porder/list/')
        .when('/trade/porder/list', '/trade/porder/list/1')
        .when('/trade/porder/list/', '/trade/porder/list/1')
        .when('/trade/fast_orders', '/trade/fast_orders/list')        //开单模板管理
        .when('/trade/fast_orders/', '/trade/fast_orders/list')
        .when('/user/grades', '/user/grades/list')                 // 会员等级
        .when('/user/grades/', '/user/grades/list')
        .when('/user/am', '/user/am/list')                 // 智能提醒
        .when('/user/am/', '/user/am/list')
        .when('/member', '/member/employee/list/')                  // 服务管理
        .when('/member/', '/member/employee/list/')
        .when('/member/employee', '/member/employee/list/')
        .when('/member/employee/', '/member/employee/list/')
        .when('/member/employee/list', '/member/employee/list/1')
        .when('/member/employee/list/', '/member/employee/list/1')
        .when('/system', '/notfound')                  // 抛出异常
        .when('/system/', '/notfound')                 // 抛出异常
        .when('/system/role', '/system/role/list/')    // 角色管理
        .when('/system/role/', '/system/role/list/')
        .when('/system/role/list', '/system/role/list/1')
        .when('/system/role/list/', '/system/role/list/1')
        .when('/system/role/list/', '/system/role/list/1')
        .when('/markting', '/notfound')
        .when('/markting/', '/notfound')
        .when('/markting/debitcard', '/markting/debitcard/list')   // 店铺活动
        .when('/markting/debitcard/', '/markting/debitcard/list')
        .when('/markting/jk', '/markting/jk/list')   // 积客券
        .when('/markting/jk/', '/markting/jk/list')
        .when('/finance', '/notfound')
        .when('/finance/', '/notfound')
        .when('/finance/journal', '/finance/journal/list/')            // 收支明细
        .when('/finance/journal/', '/finance/journal/list/')
        .when('/finance/journal/list', '/finance/journal/list/1')
        .when('/finance/journal/list/', '/finance/journal/list/1')
        .when('/finance/debitcard', '/finance/debitcard/list/')   // 储值卡账单
        .when('/finance/debitcard/', '/finance/debitcard/list/')
        .when('/finance/debitcard/list', '/finance/debitcard/list/1')
        .when('/finance/debitcard/list/', '/finance/debitcard/list/1');

    /**
     * 路由配置
     * @param name        路由状态
     * @param {}          路由配置
     *    url             显示url
     *    templateUrl     模板url
     *    controller      控制器
     *    controllerAs    设置别名显示在view层
     *    title           当前页面标题
     *    permission      权限设置
     */
    $stateProvider
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'app/pages/error/forbidden.html',
        controller: 'ErrorForbiddenController',
        controllerAs: 'vm',
        title: '没有访问权限',
        permission: "forbidden"
      })
      .state('notfound', {
        url: '/notfound',
        templateUrl: 'app/pages/error/notfound.html',
        controller: 'ErorNotfoundController',
        controllerAs: 'vm',
        title: '页面没找到',
        permission: "notfound"
      })
      .state('desktop', {
        url: '/desktop',
        title: '工作台首页',
        template: '<div ui-view class="desktop"></div>',
        permission: "desktop"
      })
      .state('desktop.home', {
        url: '/home',
        templateUrl: 'app/pages/desktop_home/home.html',
        controller: 'DesktopHomeController',
        controllerAs: 'vm',
        title: '工作台管理',
        permission: "desktop"
      })
      .state('store', {   // 店铺管理
        url: '/store',
        title: '店铺管理',
        abstract: true,
        template: '<div ui-view></div>',
        permission: "chebian:store:store:shop:view"
      })
      .state('store.shop', {   // 店铺管理
        url: '/shop',
        template: '<div ui-view></div>',
        title: '店铺管理',
        permission: "chebian:store:store:shop:view"
      })
      .state('store.shop.home', {   // 店铺信息管理
        url: '/home',
        templateUrl: 'app/pages/store_shop/home.html',
        controller: 'StoreShopHomeController',
        controllerAs: 'vm',
        title: '店铺管理',
        permission: "chebian:store:store:shop:index"
      })
      .state('store.shop.home.info', {   // 店铺信息管理信息
        url: '/info',
        templateUrl: 'app/pages/store_shop/info.html',
        controller: 'StoreShopHomeController',
        controllerAs: 'vm',
        title: '店铺管理',
        permission: "chebian:store:store:shop:index"
      })
      .state('store.shop.home.aptitude', {   // 店铺信息管理  店铺资质
        url: '/aptitude',
        templateUrl: 'app/pages/store_shop/aptitude.html',
        controller: 'StoreShopHomeAptitudeController',
        controllerAs: 'vm',
        title: '店铺管理',
        permission: "chebian:store:store:shop:index"
      })
      .state('store.shop.home.contact', {   // 店铺信息管理 联系方式
        url: '/contact',
        templateUrl: 'app/pages/store_shop/contact.html',
        controller: 'StoreShopHomeContactController',
        controllerAs: 'vm',
        title: '店铺管理',
        permission: "chebian:store:store:shop:index"
      })
      .state('store.shop.home.bank', {   // 店铺信息管理  银行
        url: '/bank',
        templateUrl: 'app/pages/store_shop/bank.html',
        controller: 'StoreShopHomeBankController',
        controllerAs: 'vm',
        title: '店铺管理',
        permission: "chebian:store:store:shop:index"
      })
      .state('product', {     // 产品管理
        url: '/product',
        template: '<div ui-view></div>',
        title: '产品管理',
        permission: "chebian:store:product:goods:view"
      })
      .state('product.goods', {     // 商品管理
        url: '/goods',
        abstract: true,
        template: '<div ui-view></div>',
        title: '商品管理',
        permission: "chebian:store:product:goods:view"
      })
      .state('product.goods.list', {     // 商品管理 列表
        url: '/list/:page?remove&keyword&pcateid1&salenums0&salenums1&stock0&stock1&saleprice0&saleprice1&shelflife0&shelflife1',
        templateUrl: 'app/pages/product_goods/list.html',
        controller: 'ProductGoodsListController',
        controllerAs: 'vm',
        title: '商品管理',
        permission: "chebian:store:product:goods:view"
      })
      .state('product.goods.view', {     // 商品管理 视图
        url: '/view/:page?remove?productid&keyword&pcateid1&salenums0&salenums1&stock0&stock1&saleprice0&saleprice1&shelflife0&shelflife1',
        templateUrl: 'app/pages/product_goods/view.html',
        controller: 'ProductGoodsViewController',
        controllerAs: 'vm',
        title: '商品管理',
        permission: "chebian:store:product:goods:view"
      })
      .state('product.goods.add', {     // 商品管理 新增商品
        url: '/add',
        templateUrl: 'app/pages/product_goods/change.html',
        controller: 'ProductGoodsChangeController',
        controllerAs: 'vm',
        title: '添加商品',
        permission: "chebian:store:product:goods:add"
      })
      .state('product.goods.edit', {     // 编辑商品 编辑商品
        url: '/edit/:pskuid',
        templateUrl: 'app/pages/product_goods/change.html',
        controller: 'ProductGoodsChangeController',
        controllerAs: 'vm',
        title: '编辑商品',
        permission: "chebian:store:product:goods:edit"
      })
      .state('product.server', {     // 服务项目管理
        url: '/server',
        template: '<div ui-view></div>',
        title: '服务管理',
        permission: "chebian:store:product:server:view"
      })
      .state('product.server.list', {     // 服务项目列表视图
        url: '/list/:page?status&keyword&scateid1&sumserverorder0&sumserverorder1&serverprice0&serverprice1&shelflife0&shelflife1',
        templateUrl: 'app/pages/product_server/list.html',
        controller: 'ProductServerListController',
        controllerAs: 'vm',
        title: '服务管理',
        permission: "chebian:store:product:server:view"
      })
      .state('product.server.detail', {     // 服务项目详情视图
        url: '/detail/:page?status&keyword&scateid1&sumserverorder0&sumserverorder1&serverprice0&serverprice1&shelflife0&shelflife1&serverid',
        templateUrl: 'app/pages/product_server/detail.html',
        controller: 'ProductServerViewController',
        controllerAs: 'vm',
        title: '服务管理',
        permission: "chebian:store:product:server:view"
      })
      .state('product.server.add', {     // 新增项目
        url: '/add',
        templateUrl: 'app/pages/product_server/change.html',
        controller: 'ProductServerChangeController',
        controllerAs: 'vm',
        title: '新增服务',
        permission: "chebian:store:product:server:edit"
      })
      .state('product.server.edit', {     // 编辑项目
        url: '/edit/:serverid',
        templateUrl: 'app/pages/product_server/change.html',
        controller: 'ProductServerChangeController',
        controllerAs: 'vm',
        title: '编辑服务',
        permission: "chebian:store:product:server:edit"
      })
      .state('product.package', {     // 套餐管理
        url: '/package',
        template: '<div ui-view></div>',
        title: '套餐管理',
        permission: "chebian:store:product:package:view"
      })
      .state('product.package.list', {     // 套餐管理
        url: '/list/:page',
        templateUrl: 'app/pages/product_package/list.html',
        controller: 'ProductPackageListController',
        controllerAs: 'vm',
        title: '套餐管理',
        permission: "chebian:store:product:package:view"
      })
      .state('product.package.add', {     // 新增套餐
        url: '/add',
        templateUrl: 'app/pages/product_package/change.html',
        controller: 'ProductPackageChangeController',
        controllerAs: 'vm',
        title: '新增套餐',
        permission: "chebian:store:product:package:add"
      })
      .state('product.package.edit', {     // 编辑套餐
        url: '/edit/:id',
        templateUrl: 'app/pages/product_package/change.html',
        controller: 'ProductPackageChangeController',
        controllerAs: 'vm',
        title: '编辑套餐',
        permission: "chebian:store:product:package:edit"
      })
      .state('trade', {      // 交易管理
        url: '/trade',
        template: '<div ui-view></div>',
        title: '交易管理',
        permission: "chebian:store:trade:porder:view"
      })
      .state('trade.order', {      // 订单管理（服务和商品一起）
        url: '/porder',
        template: '<div ui-view></div>',
        title: '订单管理',
        permission: "chebian:store:trade:porder:view"
      })
      .state('trade.order.list', {      // 订单管理列表
        url: '/list/:page?keyword&status&paystatus&createtime0&createtime1&motorid&orderstype&paytype',
        templateUrl: 'app/pages/trade_order/list.html',
        controller: 'TradeOrderListController',
        controllerAs: 'vm',
        title: '订单管理',
        permission: "chebian:store:trade:porder:view"
      })
      .state('trade.order.view', {      // 订单管理列表
          url: '/view/:page?orderid&keyword&status&paystatus&createtime0&createtime1&motorid&orderstype&paytype',
          templateUrl: 'app/pages/trade_order/view.html',
          controller: 'TradeOrderViewController',
          controllerAs: 'vm',
          title: '订单管理',
          permission: "chebian:store:trade:porder:view"
      })
      .state('trade.order.add', {     // 新增订单
        url: '/add',
        templateUrl: 'app/pages/trade_order/add.html',
        controller: 'TradeOrderAddController',
        controllerAs: 'vm',
        title: '新增订单',
        permission: "chebian:store:trade:porder:add",
        onExit: function (tadeOrderAddData) {
          tadeOrderAddData.updata(undefined)
        }
      })
      .state('trade.order.added', {     // 新增订单2
        url: '/added?mobile&license&motorid',
        templateUrl: 'app/pages/trade_order/change.html',
        controller: 'TradeOrderChangeController',
        controllerAs: 'vm',
        title: '新增订单',
        permission: "chebian:store:trade:porder:add",
        onExit: function (tadeOrderAddData) {
          tadeOrderAddData.updata(undefined)
        }
      })
      .state('trade.order.edit', {     // 编辑订单
        url: '/edit/:orderid',
        templateUrl: 'app/pages/trade_order/change.html',
        controller: 'TradeOrderChangeController',
        controllerAs: 'vm',
        title: '编辑订单',
        permission: "chebian:store:trade:porder:add"
      })
      .state('trade.order.detail', {     // 订单详情
        url: '/detail/:orderid',
        templateUrl: 'app/pages/trade_order/detail.html',
        controller: 'TradeOrderDetailController',
        controllerAs: 'vm',
        title: '订单详情',
        permission: "chebian:store:trade:porder:detail"
      })
      .state('trade.comment', {      // 评价管理
        url: '/comment',
        template: '<div ui-view></div>',
        title: '评价管理',
        permission: "chebian:store:trade:comment:view"
      })
      .state('trade.comment.list', {      // 评价管理
        url: '/list/:page?keyword&skill&environment&replyflag&service&commenttime0&commenttime1',
        templateUrl: 'app/pages/trade_comment/list.html',
        controller: 'TradeCommentListController',
        controllerAs: 'vm',
        title: '评价管理',
        permission: "chebian:store:trade:comment:view"
      })
      .state('trade.fast_orders', {      // 开单模板管理
        url: '/fast_orders',
        template: '<div ui-view></div>',
        title: '开单模板',
        permission: "chebian:store:user:fast:orders"
      })
      .state('trade.fast_orders.list', {      // 开单模板列表
        url: '/list',
        templateUrl: 'app/pages/trade_template/list.html',
        controller:'tradeTemplateListController',
        controllerAs: 'vm',
        title: '开单模板',
        permission: "chebian:store:user:fast:orders"
      })
      .state('finance', {      // 财务管理
        url: '/finance',
        template: '<div ui-view></div>',
        title: '财务管理',
        permission: "chebian:store:finance:journal:view"
      })
      .state('finance.journal', {      // 收支明细
        url: '/journal',
        template: '<div ui-view></div>',
        title: '收支明细',
        permission: "chebian:store:finance:journal:view"
      })
      .state('finance.journal.list', {      // 收支明细
        url: '/list/:page?keyword&journaltime0&journaltime1&tradetype&journalmoney0&journalmoney1&journaltype&paytype',
        templateUrl: 'app/pages/finance_journal/list.html',
        controller: 'FinanceJournalListController',
        controllerAs: 'vm',
        title: '收支明细',
        permission: "chebian:store:finance:journal:view"
      })
      .state('user', {      // 会员管理
        url: '/user',
        template: '<div ui-view></div>',
        title: '会员管理',
        permission: "chebian:store:user:customer:view"
      })
      .state('user.customer', {      // 会员管理
        url: '/customer',
        template: '<div ui-view></div>',
        title: '会员管理',
        permission: "chebian:store:user:customer:view"
      })
      .state('user.customer.list', {      // 会员管理
        url: '/list/:page?keyword&grade&startDate&endDate&role',
        templateUrl: 'app/pages/user_customer/list.html',
        controller: 'UserCustomerListController',
        controllerAs: 'vm',
        title: '会员管理',
        permission: "chebian:store:user:customer:view"
      })
      .state('user.customer.detail', {      // 会员详情
        url: '/detail/:mobile?licence',
        templateUrl: 'app/pages/user_customer/detail.html',
        controller: 'UserCustomerDetailController',
        controllerAs: 'vm',
        title: '会员管理',
        permission: "chebian:store:user:customer:view"
      })
      .state('user.customer.add', {      // 新增会员
        url: '/add',
        templateUrl: 'app/pages/user_customer/add.html',
        controller: 'UserCustomerAddController',
        controllerAs: 'vm',
        title: '新增会员',
        permission: "chebian:store:user:customer:add"
      })
      .state('user.customer.add2', {      // 新增会员
        url: '/add/:mobile',
        templateUrl: 'app/pages/user_customer/change.html',
        controller: 'UserCustomerChangeController',
        controllerAs: 'vm',
        title: '新增会员',
        permission: "chebian:store:user:customer:add"
      })
      .state('user.customer.edit', {      // 编辑会员
        url: '/edit/:mobile',
        templateUrl: 'app/pages/user_customer/change.html',
        controller: 'UserCustomerChangeController',
        controllerAs: 'vm',
        title: '编辑会员',
        permission: "chebian:store:user:customer:edit"
      })
      .state('user.motor', {      // 会员等级  按车辆
        url: '/motor',
        template: '<div ui-view></div>',
        title: '会员管理',
        permission: "chebian:store:user:customer:view"
      })
      .state('user.motor.list', {      // 会员等级 按车辆列表
        url: '/list/:page?keyword&startTotalMile&endTotalMile&startCountdownMile&endCountdownMile&startBuyDate&endBuyDate',
        templateUrl: 'app/pages/user_motor/list.html',
        controller: 'UserMotorListController',
        controllerAs: 'vm',
        title: '车辆列表',
        permission: "chebian:store:user:customer:view"
      })
      .state('user.grades', {      // 会员等级
        url: '/grades',
        template: '<div ui-view></div>',
        title: '会员等级',
        permission: "chebian:store:user:customer:grades:view"
      })
      .state('user.grades.list', {      // 会员等级列表
        url: '/list',
        templateUrl: 'app/pages/user_grade/list.html',
        controller: 'UserGradeListController',
        controllerAs: 'vm',
        title: '会员等级',
        permission: "chebian:store:user:customer:grades:view"
      })
      .state('user.am', {      // 智能提醒
        url: '/am',
        template: '<div ui-view></div>',
        title: '精准提醒',
        permission: "chebian:store:user:am:view"
      })
      .state('user.am.list', {      // 智能提醒列表
        url: '/list',
        templateUrl: 'app/pages/user_am/list.html',
        controller: 'UserAmListController',
        controllerAs: 'vm',
        title: '精准提醒',
        permission: "chebian:store:user:am:view"
      })
      .state('user.debitcard', {      // 储存卡账单
        url: '/debitcard',
        template: '<div ui-view></div>',
        title: '储存卡账单',
        permission: "chebian:store:user:debitcard:view"
      })
      .state('user.debitcard.list', {      // 储存卡账单
        url: '/list/:page?keyword&userbalance0&userbalance1&recharge0&recharge1&cost0&cost1',
        templateUrl: 'app/pages/user_debitcard/list.html',
        controller: 'UserDebitcardLsitController',
        controllerAs: 'vm',
        title: '储存卡账单',
        permission: "chebian:store:user:debitcard:view"
      })
      .state('user.debitcard.detail', {      // 储存卡账单详情
        url: '/detail/:userid?balance&mobile&journaltime0&journaltime1',
        templateUrl: 'app/pages/user_debitcard/detail.html',
        controller: 'UserDebitcardDetailController',
        controllerAs: 'vm',
        title: '储存卡账单详情',
        permission: "chebian:store:user:debitcard:view"
      })
      .state('user.package', {   // 套餐卡账单
        url: '/package',
        template: '<div ui-view></div>',
        title: '套餐卡账单',
        permission: "chebian:store:user:package:view"
      })
      .state('user.package.list', {      //套餐卡账单
        url: '/list/:page?keyword&createtime0&createtime1&con',
        templateUrl: 'app/pages/user_package/list.html',
        controller: 'UserPackageLsitController',
        controllerAs: 'vm',
        title: '储存卡账单',
        permission: "chebian:store:user:package:view"
      })
      .state('user.package.detail', {      //套餐卡账单详情
        url: '/detail/:userpackageid?mobile&createtime0&createtime1&keywords',
        templateUrl: 'app/pages/user_package/detail.html',
        controller: 'UserPackageDetailController',
        controllerAs: 'vm',
        title: '储存卡账单详情',
        permission: "chebian:store:user:package:view"
      })
      .state('stocks', {      // 货源中心
        url: '/stocks',
        template: '<div ui-view></div>',
        title: '货源中心',
        permission: "chebian:store:stocks:terminal:view"
      })
      .state('stocks.terminal', {      // 硬件出库安装
        url: '/terminal',
        template: '<div ui-view></div>',
        title: '硬件出库安装',
        permission: "chebian:store:stocks:terminal:view"
      })
      .state('stocks.terminal.list', {      // 硬件出库安装
        url: '/list/:page',
        templateUrl: 'app/pages/stocks_terminal/list.html',
        controller: 'StocksTerminalListController',
        controllerAs: 'vm',
        title: '硬件出库安装',
        permission: "chebian:store:stocks:terminal:view"
      })
      .state('member', {      // 员工管理
        url: '/member',
        template: '<div ui-view></div>',
        title: '员工管理',
        permission: "chebian:store:member:employee:view"
      })
      .state('member.employee', {      // 员工管理
        url: '/employee',
        template: '<div ui-view></div>',
        title: '员工管理',
        permission: "chebian:store:member:employee:view"
      })
      .state('member.employee.list', {      // 员工管理
        url: '/list/:page?keyword&inService&startDate&endDate&role',
        templateUrl: 'app/pages/member_employee/list.html',
        controller: 'MemberEmployeeListController',
        controllerAs: 'vm',
        title: '员工管理',
        permission: "chebian:store:member:employee:view"
      })
      .state('member.employee.add', {      // 添加新员工管理
        url: '/add',
        templateUrl: 'app/pages/member_employee/change.html',
        controller: 'MemberEmployeeChangeController',
        controllerAs: 'vm',
        title: '添加新员工',
        permission: "chebian:store:member:employee:add"
      })
      .state('member.employee.edit', {      // 编辑员工员工管理
        url: '/edit/:id',
        templateUrl: 'app/pages/member_employee/change.html',
        controller: 'MemberEmployeeChangeController',
        controllerAs: 'vm',
        title: '编辑员工',
        permission: "chebian:store:member:employee:edit"
      })
      .state('member.role', {      // 权限管理
        url: '/role',
        template: '<div ui-view></div>',
        title: '权限管理',
        permission: "chebian:store:member:role:view"
      })
      .state('member.role.list', {      // 权限管理列表
        url: '/list/:page?keyword',
        templateUrl: 'app/pages/member_role/list.html',
        controller: 'MemberRoleLsitController',
        controllerAs: 'vm',
        title: '权限管理',
        permission: "chebian:store:member:role:view"
      })
      .state('system', {      // 系统管理
        url: '/system',
        template: '<div ui-view></div>',
        title: '系统管理',
        permission: "chebian:store:system:modpwd:view"
      })
      .state('system.feedback', { // 反馈页面
        url: '/feedback',
        templateUrl: 'app/pages/system_feedback/feedback.html',
        controller: 'FeedBackController',
        controllerAs: 'vm',
        title: '建议反馈-改进建议',
        permission: 'desktop'
      })
      .state('system.personal', {      // 个人信息
        url: '/personal',
        template: '<div ui-view></div>',
        title: '个人信息',
        permission: "chebian:store:system:personal:view"
      })
      .state('system.modpwd', {      // 修改密码
        url: '/modpwd',
        templateUrl: 'app/pages/system_modpwd/modpwd.html',
        controller: 'SystemModpwdController',
        controllerAs: 'vm',
        title: '修改密码',
        permission: "chebian:store:system:modpwd:view"
      })
      .state('markting', {      // 营销中心
        url: '/markting',
        template: '<div ui-view></div>',
        title: '营销中心',
        permission: "chebian:store:markting:debitcard:view"
      })
      .state('markting.debitcard', {      // 店铺活动
        url: '/debitcard',
        template: '<div ui-view></div>',
        title: '店铺活动',
        permission: "chebian:store:markting:debitcard:view"
      })
      .state('markting.debitcard.list', {      // 店铺活动
        url: '/list',
        templateUrl: 'app/pages/markting_debitcard/debitcard.html',
        controller: 'MarktingDebitcardController',
        controllerAs: 'vm',
        title: '店铺活动',
        permission: "chebian:store:markting:debitcard:view"
      })
      .state('markting.package', {      // 套餐卡活动
        url: '/package',
        template: '<div ui-view></div>',
        title: '套餐卡活动',
        permission: "chebian:store:markting:package:view"
      })
      .state('markting.package.list', { // 套餐卡活动
        url: '/list/:page?keyword&status&originprice0&originprice1&price0&price1',
        templateUrl: 'app/pages/markting_package/package.html',
        controller: 'MarktingPackageController',
        controllerAs: 'vm',
        title: '套餐卡活动',
        permission: "chebian:store:markting:package:view"
      })
      .state('markting.jk', {      // 积客劵活动
        url: '/jk',
        template: '<div ui-view></div>',
        title: '积客劵',
        permission: "chebian:store:markting:jk:view"
      })
      .state('markting.jk.list', { // 积客劵活动列表信息
        url: '/list/:page?status&conditionPriceStart&conditionPriceEnd&scopeType&keywords&conditionPrice&price0&price1',
        templateUrl: 'app/pages/markting_jk/list.html',
        controller: 'MarktingJkListController',
        controllerAs: 'vm',
        title: '积客劵',
        permission: "chebian:store:markting:jk:view"
      })
      .state('markting.jk.new', { // 积客劵详情
        url: '/addnew/:page?status',
        templateUrl: 'app/pages/markting_jk/new.html',
        controller: 'addNewJkController',
        controllerAs: 'vm',
        title: '积客劵详情',
        permission: "chebian:store:markting:jk:view"
      })
      .state('markting.jksendrecorde', { // 发放记录
        url: '/jksendrecorde',
        template: '<div ui-view></div>',
        title: '积客劵发放记录',
        permission: "chebian:store:markting:jk:sendrecorde:view"
      })
      .state('markting.jksendrecorde.list', { // 发放记录
        url: '/list/:page?way&status&keywords',
        templateUrl: 'app/pages/markting_jkrecord/list.html',
        controller: 'MarktingJkRecordController',
        controllerAs: 'vm',
        title: '积客劵发放记录',
        permission: "chebian:store:markting:jk:sendrecorde:view"
      });
  }
})();
