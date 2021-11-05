<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <router-link tag="div" to="/index" class="logo"
        >网上书店管理系统</router-link
      >
      <div class="userinfo">
        <el-dropdown trigger="hover" size="medium">
          <span class="el-dropdown-link userinfo-inner">
            <span>{{ userInfo.username }}</span>
            <img :src="userInfo.userImage || defaulImage" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="linkToUserInfo"
              >个人信息</el-dropdown-item
            >
            <el-dropdown-item @click.native="logout" divided
              >退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
    <el-col :span="24" class="main">
      <aside>
        <el-menu :default-active="$route.path" router unique-opened>
          <template v-for="(item, index) in navRouter">
            <el-menu-item
              v-if="item.isSingle"
              :index="item.path"
              :key="item.children[0].name"
            >
              <i :class="item.iconCls"></i>&nbsp; {{ item.children[0].name }}
            </el-menu-item>
            <el-submenu v-else :index="index + ''" :key="item.name">
              <template slot="title"
                ><i :class="item.iconCls"></i>&nbsp; {{ item.name }}</template
              >
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.name"
              >
                {{ child.name }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </aside>
      <section class="content-container">
        <el-col :span="24">
          <transition name="fade-transform" mode="out-in">
            <router-view v-if="showRouterView" @reload="reload"></router-view>
          </transition>
        </el-col>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { logout } from "../../api/login";
import { handleError } from "../../util/util";

export default {
  data() {
    return {
      sysName: "网上书店管理系统",
      defaulImage:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-b8f57a87ccff572c84bea1c0497f999d_r.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638582622&t=37d104e16c8c351764ebd92b623f6caa",
      showRouterView: true,
      audioTips: true,
      orderNotify: {
        newOrderNum: 0,
        newRefundOrderNum: 0,
        newOrderInstance: "",
        newRefundOrderInstance: "",
      },
      // 是否静音
      isSound: true,
    };
  },
  created() {
    this.getUserInfo();
  },
  computed: {
    navRouter() {
      return this.$router.options.routes.filter((router) => {
        return !router.hidden;
      });
    },
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async getUserInfo() {
      try {
        const res = await this.getUserInfo();
        if (res.code !== 200) {
          this.$message.error({
            message: res.message,
          });
        }
      } catch (error) {
        handleError(error);
      }
    },
    // 跳转个人信息页面
    linkToUserInfo() {
      this.$router.push("/index/adminInfo");
    },
    reload() {
      this.showRouterView = false;
      this.$nextTick(() => {
        this.showRouterView = true;
      });
    },
    // 退出登录
    logout() {
      this.$confirm("确认退出吗?", "提示", {})
        .then(async () => {
          try {
            let res = await logout();
            if (res.code === 200) {
              this.$router.push("/login");
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          } catch (error) {
            handleError(error);
          }
        })
        .catch(() => {});
    },
    ...mapActions(["getUserInfo"]),
  },
};
</script>

<style lang="stylus" scoped>
@import './../../styl/variables.styl';

.container {
  height: 100%;
  width: 100%;

  .header {
    display: flex;
    height: 60px;
    background: $color-primary;
    color: #fff;
    justify-content: space-between;

    .sound-tips {
      flex: 1;
      text-align: right;
      line-height: 60px;
      padding-right: 14px;

      i {
        cursor: pointer;
        font-size: 20px;
      }
    }

    .userinfo {
      text-align: right;
      padding-right: 35px;

      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #94bcf5;
        }

        span {
          margin-right: 10px;
        }
      }
    }

    .logo {
      height: 60px;
      line-height: 60px;
      font-size: 22px;
      font-weight: 600;
      padding-left: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      width: 210px;
      border-right-width: 1px;
      border-right-style: solid;
      cursor: pointer;
    }
  }

  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;

    aside {
      flex: 0 0 230px;

      & > .el-menu {
        height: 100%;

        .el-menu {
          padding-left: 10px;

          .el-menu-item {
            background-color: #fafafa;

            &:hover, &:focus {
              outline: 0;
              background-color: #ecf5ff;
            }
          }
        }
      }
    }

    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;
    }
  }
}
</style>
