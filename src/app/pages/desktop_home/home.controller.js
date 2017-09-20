/**
 * Created by Administrator on 2016/10/10.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('DesktopHomeController', DesktopHomeController);

  /** @ngInject */
  function DesktopHomeController(shophomeService, financeJournal,dragHandlerService,cbAlert,desktopRequestService,configuration,$state,$document,$scope) {
    var vm = this;
    /**
     * 获取当前店铺信息
     */

    desktopRequestService.message().then(function(res){
      console.log(res);
      if(res.data.status === 0){
        vm.dataBase = _.omit(res.data,['status','data']);
        console.log(vm.dataBase);
      } else {
        cbAlert.error("错误提示", res.data.data);
      }
    });
    shophomeService.getInfo().then(function (res) {
      if(res.status *1 === 0){
        vm.shopData = res.data.store;
      }else {
        cbAlert.error("错误提示", res.data);
      }
    });
    vm.dateArr = [
      {
        label: '今日',
        current: true,
        type: '0'
      },
      {
        label: '本周',
        current: false,
        type: '1'
      },
      {
        label: '本月',
        current: false,
        type: '2'
      },
      {
        label: '本年度',
        current: false,
        type: '3'
      }
    ];
    vm.todayData = [
      {
        label: '今日开单',
        data: {},
        style: 'background-color:#108ee9'
      },
      {
        label: '服务中',
        data: {},
        style: 'background-color:#f56a00'
      },
      {
        label: '未结算',
        data: {},
        style: 'background-color:#f04134'
      },
      {
        label: '会员总数',
        data: {},
        style: 'background-color:#7265e6'
      },
      {
        label: '今日领券',
        data: {},
        style: 'background-color:#00a2ae'
      },
      {
        label: '今日用券',
        data: {},
        style: 'background-color:#00a854'
      }
    ];
    vm.option2 = {

      tooltip: {
        trigger: 'axis'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 50,
        itemGap: 20,
        data: ['订单金额', '订单笔数', '到店车辆', '客单价', '会员总数','办卡充值','领券','用券']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        // type: 'value'
        show: false
      },
      series: [
        {
          name: '订单金额',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '订单笔数',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '到店车辆',
          type: 'line',
          stack: '总量',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '客单价',
          type: 'line',
          stack: '总量',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '会员总数',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        },
        {
          name: '办卡充值',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        },
        {
          name: '领券',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 2000, 1290, 1330, 1320]
        },
        {
          name: '用券',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    vm.showResult = false;
    /*
    * 悬浮窗拖动
    * */
    var box = angular.element('#j-guide')[0];
    dragHandlerService.startDrag(box);

    $document.on('click', function () {
      $scope.$apply(function () {
        vm.showResult = false;
      });
    });

    /*
    * 输入框查询
    * */

    vm.searchToStart = _.debounce(function(){
      if(vm.keyword === ""){
        vm.searchResult = [];
        vm.showResult = false;
        console.log('nothing',vm.searchResult);
        return false;
      }
      desktopRequestService.list({keyword:vm.keyword}).then(function(res){
        console.log(res);
        if(res.data.status === 0){
          vm.showResult = true;
          vm.searchResult = res.data.data;
          _.forEach(vm.searchResult,function(v){
            v.motorindex.logo = configuration.getStatic() + v.motorindex.logo.replace("http://app.chebian.vip","")
          })
          console.log('+++++++',vm.searchResult.length);
        }else {
          cbAlert.error("错误提示", res.data.data);
        }
      })
    },500);

    vm.gotoOrder = function (event,item) {
      event.stopPropagation();
      event.preventDefault();

      $state.go('trade.order.added',{mobile:item.mobile,license:item.motorindex.licence,orderid:item.motorindex.guid});
    };

    vm.addCustomerHandler = function (data) {

    };

    /*
    * 默认显示饼图、可切换
    * */
    vm.chartType = 'pie';
    vm.switchType = function (type) {
      vm.chartType = type;
    };

    vm.fetchDataByDate = function (item) {
      _.forEach(vm.dateArr, function (item) {
        item.current = false;
      });
      item.current = true;
      var condition = {
        journaltime0: item.type
      };
      getData(condition);
    };
    /*
    * 默认获取今日的数据
    * */
    vm.fetchDataByDate(vm.dateArr[0]);

    /*
     * 获取财务信息
     * */
    function getData(params) {
      var config = {
        page: 1,
        pageSzie: 10
      };
      params = _.assign(config, params);
      financeJournal.search(params).then(function (results) {
        if(results.data.status*1 === 0){
          if(!results.data.message){
            results.data.message = {
              "gift" : 0,
              "others" : 0,
              "weixin" : 0,
              "alipay" : 0,
              "totolMoney" : 0,
              "cardOrCash" : 0,
              "card" : 0,
              "userAccount" : 0
            }
          }
          setChartOption(results.data);
        }else {
          cbAlert.error("错误提示", results.data.data);
        }
      })
    }


    /*
     * 更新图表配置
     * */
    function setChartOption(data) {
      var DEFAULT_CONFIG = {
        color: ['#59c2df', '#f98740', '#09bb07', '#00a0e9', '#ffd766', '#f96868', '#558693'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: '10%',
          top: '20%',
          // top:-50,
          itemGap: 20,
          tooltip: {
            show: true
          },
          data: ['现金', '银行卡', '微信支付', '支付宝', 'POS', '支票', '其他'],
          formatter: '{name} '
        },
        series: [
          {
            name: '结算方式',
            type: 'pie',
            radius: '55%',
            center: ['70%', '50%'],
            label: {
              normal: {
                formatter: '{d}%',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 12
                }
              }
            },
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      [].push.apply(DEFAULT_CONFIG.series[0].data, [
        {
          value: (data.message.cardOrCash / 100 ).toFixed(2)*1,
          name: '现金'
        },
        {value: (data.message.card / 100).toFixed(2)*1, name: '银行卡'},
        {value: (data.message.weixin / 100).toFixed(2)*1, name: '微信支付'},
        {value: (data.message.alipay /100).toFixed(2)*1, name: '支付宝'},
        {value: 0, name: 'POS'},
        {value: 0, name: '支票'},
        {value: (data.message.others / 100).toFixed(2)*1, name: '其他'}
      ]);
      console.log(DEFAULT_CONFIG);
      vm.option = DEFAULT_CONFIG;
    }
  }
})();
