angular.module('myApp', [])
    .run(function($rootScope) {
        $rootScope.$on('$stateChangeStart', function(event,toState,toParams,fromState,fromParams) {
            if(toState.name == 'login') return;//如果是进入登录页面则允许
            //如果用户不存在
            if(!$rootScope.user || $rootScope.user.token) {
                event.preventDefault();//取消默认跳转行为
                $state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
            }

        });
    })
    .config(function($httpProvider,$rootProvider) {
        $httpProvider.interceptors.push('userInterceptor');
        $rootProvider
            .when('/',{
                templateUrl:'views/shopcart.html'
            })
            .when('/login', {
                templateUrl: 'views/account/login/login.html'
            })
            .when('register', {
                templateUrl: 'views/account/register/register.html'
            })
            .otherwise({
                redirectTo:'/login'
            });
    })
    .factory('userInterceptor',["$q","$rootScope",function($q,$rootScope) {
        return {
            request: function(config) {
                config.headers["TOKEN"] = $rootScope.user.token;
                return config;
            },
            responseError: function(response) {
                var data = response.data;
                //判断出错误码，如果是未登录
                if(data["errorCode"] == "500999") {
                    //清空本地token存储信息
                    $rootScope.user = {token: ""};
                    //全局事件，方便其他view获取该事件，并给以相应的提示或处理
                    $rootScope.$emit("userInterceptor","notLogin",response)
                }
                //如果是登录超时
                if(data["errorCode"] == "500998") {
                    $rootScope.$emit("userInterceptor","sessionOut",response);
                }
                return $q.reject(response);
            }
        }
    }]);