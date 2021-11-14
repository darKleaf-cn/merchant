<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" class="header">
        <el-col :span="6">
          <h3>网上书店管理系统</h3>
        </el-col>
        <el-col :span="3">
          <span @click="backLogin">返回首页 &gt;</span>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="main-form">
        <el-form
          ref="form"
          :model="formData"
          :rules="formRules"
          label-width="80px"
        >
          <h1>欢迎注册</h1>
          <el-form-item label="登陆账号" prop="phone">
            <el-input
              v-model.trim="formData.phone"
              maxlength="11"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="username">
            <el-input
              v-model.trim="formData.username"
              maxlength="20"
              placeholder="请输入昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="登陆密码" prop="password">
            <el-input
              v-model.trim="formData.password"
              maxlength="16"
              placeholder="密码要求8-16位数字、字母组合"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="repPwd">
            <el-input
              v-model.trim="formData.repPwd"
              maxlength="16"
              placeholder="重复输入密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')"
              >注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    <el-footer>&copy; Power By Peng Wenxiang</el-footer>
  </el-container>
</template>

<script>
// import MD5 from "crypto-js/md5";
// import { JSEncrypt } from "jsencrypt";
import { register } from "./../api/login";
// import { getPublicKey } from "./../api/common";
import { mobileReg, passwordReg, handleError } from "./../util/util";

export default {
  data() {
    return {
      logining: false,
      formData: {
        phone: "",
        username: "",
        password: "",
        repPwd: "",
      },
      formRules: {
        phone: [{ validator: this.mobileRegFun, trigger: "blur" }],
        username: [{ validator: this.usernameFun, trigger: "blur" }],
        password: [{ validator: this.passwordRegFun, trigger: "blur" }],
        repPwd: [{ validator: this.repPwdRegFun, trigger: "blur" }],
      },
      checked: true,
    };
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            const { username, password, phone } = this.formData;
            const res = await register({
              username,
              password,
              phone,
            });
            if (res.rtnCode === '200') {
              this.$message({
                type: "success",
                message: "注册成功",
              });
              this.$router.push("/login");
            } else {
              this.$message.error({
                message: res.message,
              });
            }
          } catch (error) {
            handleError(error);
          }
        }
      });
    },
    backLogin() {
      this.$router.push("/login");
    },
    mobileRegFun(rule, value, callback) {
      if (!mobileReg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    },
    usernameFun(rule, value, callback) {
      if (!value || value.length == 0) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    },
    passwordRegFun(rule, value, callback) {
      if (!passwordReg.test(value)) {
        callback(new Error("请输入符合格式的密码"));
      } else {
        callback();
      }
    },
    repPwdRegFun(rule, value, callback) {
      if (!passwordReg.test(value)) {
        callback(new Error("请输入符合格式的密码"));
      } else if (this.formData.password !== this.formData.repPwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
@import './../styl/variables.styl';

.el-container {
  height: 100%;

  .el-header {
    background-color: $color-primary;

    h3 {
      text-align: center;
      color: #fff;
      margin: 0;
      line-height: 60px;
      font-size: 20px;
    }

    .el-col-3 {
      text-align: center;
      line-height: 60px;
      color: #fff;

      span {
        cursor: pointer;
      }
    }
  }

  .el-main {
    display: flex;
    padding: 40px;
    background-color: #f5f5f5;

    .main-form {
      width: 100%;
      padding: 60px;
      background-color: #fff;
      display: flex;
      justify-content: center;

      .el-form {
        width: 400px;

        h1 {
          text-align: center;
          padding-left: 40px;
          margin-bottom: 30px;
        }

        .el-button {
          width: 100%;
        }
      }
    }
  }

  .el-footer {
    text-align: center;
    background-color: $color-primary;
    line-height: 60px;
    color: #fff;
  }
}
</style>

