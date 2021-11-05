import Vue from "vue";
import Router from "vue-router";

const Forbidden = () => import("@/views/error/403");
const NotFound = () => import("@/views/error/404");
const ServerError = () => import("@/views/error/500");
const Login = () => import("@/views/Login");
const Register = () => import("@/views/Register");
const Home = () => import("@/views/home/Home");
const Index = () => import("@/views/index/Index");
const OrderList = () => import("@/views/order/OrderList");
const DeliveryCompany = () => import("@/views/order/DeliveryCompany");
const RefundOrderRecord = () => import("@/views/order/RefundOrderRecord");
const UserList = () => import("@/views/user/UserList");
const BookList = () => import("@/views/book/BookList");
const BookClassify = () => import("@/views/book/BookClassify");
const StockPurchase = () => import("@/views/stock/StockPurchase");
const StockRecord = () => import("@/views/stock/StockRecord");
const AdminInfo = () => import("@/views/system/AdminInfo");
const ShopManagement = () => import("@/views/system/ShopManagement");
const ShopOptionRecord = () => import("@/views/system/ShopOptionRecord");

Vue.use(Router);

export default new Router({
  routes: [{
    path: "/login",
    component: Login,
    name: "",
    hidden: true
  },
  {
    path: "/register",
    component: Register,
    name: "",
    hidden: true
  },
  {
    path: "/",
    redirect: "index",
    hidden: true
  },
  {
    path: "/",
    component: Home,
    isSingle: true,
    iconCls: "iconfont icon-home",
    children: [{
      path: "index",
      component: Index,
      name: "首页"
    }]
  },
  {
    path: "/",
    component: Home,
    name: "订单管理",
    iconCls: "iconfont icon-emaxcitygerenxinxitubiaoji03",
    children: [{
      path: "/orderList",
      component: OrderList,
      name: "订单列表"
    }, {
      path: "/refundOrderRecord",
      component: RefundOrderRecord,
      name: "退款订单处理记录"
    }, {
      path: "/deliveryCompany",
      component: DeliveryCompany,
      name: "物流公司列表"
    }]
  },
  {
    path: "/",
    component: Home,
    name: "图书管理",
    iconCls: "iconfont icon-book",
    children: [{
      path: "/bookList",
      component: BookList,
      name: "图书列表"
    },
    {
      path: "/bookClassify",
      component: BookClassify,
      name: "分类管理"
    }
    ]
  },
  {
    path: "/",
    component: Home,
    name: "用户管理",
    iconCls: "iconfont icon-icon_user_management",
    children: [{
      path: "/userList",
      component: UserList,
      name: "用户列表"
    }]
  },
  {
    path: "/",
    component: Home,
    name: "进货管理",
    iconCls: "iconfont icon-jinhuodan",
    children: [{
      path: "/stockPurchase",
      component: StockPurchase,
      name: "库存管理"
    }, {
      path: "/stockRecord",
      component: StockRecord,
      name: "进货记录"
    }]
  },
  {
    path: "/index",
    component: Home,
    name: "系统管理",
    iconCls: "iconfont icon-setting",
    children: [{
      path: "/adminInfo",
      component: AdminInfo,
      name: "个人信息修改"
    }, {
      path: "/shopManagement",
      component: ShopManagement,
      name: "店铺管理"
    }, {
      path: "/shopOptionRecord",
      component: ShopOptionRecord,
      name: "店铺操作日志"
    }]
  },
  {
    path: "/",
    component: Home,
    hidden: true,
    children: [{
      path: "/forbidden",
      component: Forbidden,
      name: "forbidden"
    }, {
      path: "/serverError",
      component: ServerError,
      name: "serverError"
    }, {
      path: "*",
      component: NotFound,
      name: "404"
    }]
  },
  {
    path: "*",
    hidden: true,
    component: NotFound,
    name: "404"
  }
  ]
});
