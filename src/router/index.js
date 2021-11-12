import Vue from "vue";
import Router from "vue-router";

const Forbidden = () => import("@/views/error/403");
const NotFound = () => import("@/views/error/404");
const ServerError = () => import("@/views/error/500");
const Login = () => import("@/views/Login");
const Register = () => import("@/views/Register");
const Home = () => import("@/views/home/Home");
const OrderList = () => import("@/views/order/OrderList");
const BookList = () => import("@/views/book/BookList");
const AddBook = () => import("@/views/book/AddBook");
const StockList = () => import("@/views/stock/StockList");

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
    redirect: "bookList",
    hidden: true
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
    },{
      path: "/addBook",
      component: AddBook,
      name: "添加图书"
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
    }]
  },
  {
    path: "/",
    component: Home,
    name: "库存管理",
    iconCls: "iconfont icon-jinhuodan",
    children: [{
      path: "/stockList",
      component: StockList,
      name: "库存列表"
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
