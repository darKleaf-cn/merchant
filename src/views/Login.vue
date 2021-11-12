<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="header">
        <el-col :span="6">
          <h3>网上书店管理系统</h3>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="main-bg"></div>
      <div class="main-form">
        <el-form
          ref="form"
          :model="formData"
          :rules="formRules"
          :hide-required-asterisk="true"
          label-width="80px"
        >
          <el-form-item label="登陆账号" prop="username">
            <el-input
              v-model.trim="formData.username"
              maxlength="11"
              placeholder="请输入登陆手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="登陆密码" prop="password">
            <el-input
              v-model.trim="formData.password"
              maxlength="16"
              placeholder="请输入密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formData.savePwd">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')"
              >登陆
            </el-button>
            <el-button @click.native="linkToReg">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    <el-footer>&copy; Power By Peng Wenxiang</el-footer>
  </el-container>
</template>

<script>
import Base64 from "./../util/base64";
import { login } from "./../api/login";
import { mobileReg, handleError } from "./../util/util";
import { mapMutations} from "vuex";

const SAVE_NAME = "saveItem";

export default {
  data() {
    return {
      logining: false,
      formData: {
        username: "",
        password: "",
        savePwd: false,
      },
      formRules: {
        username: [
          {
            validator: this.mobileRegFun,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    let saveItem = localStorage.getItem(SAVE_NAME);
    if (saveItem) {
      saveItem = JSON.parse(saveItem);
      this.formData.username = Base64.decode(saveItem.username);
      this.formData.password = Base64.decode(saveItem.password);
    }
  },
  methods: {
    ...mapMutations(["SET_USERINFO"]),
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          if (this.formData.savePwd) {
            // base64编码存储
            var obj = {
              username: Base64.encode(this.formData.username),
              password: Base64.encode(this.formData.password),
            };
            localStorage.setItem(SAVE_NAME, JSON.stringify(obj));
          } else {
            localStorage.removeItem(SAVE_NAME);
          }
          try {
            let username = this.formData.username;
            let password = this.formData.password;
            const res = await login({
              username,
              password,
            });
            if (res.code === 200) {
              this.SET_USERINFO(res.result);
              this.$message({
                message: "登陆成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.$router.push({
                    path: "/",
                  });
                },
              });
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
    linkToReg() {
      this.$router.push("/register");
    },
    mobileRegFun(rule, value, callback) {
      if (!mobileReg.test(value)) {
        callback(new Error("请输入正确的手机号"));
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
  }

  .el-main {
    display: flex;
    padding: 80px;

    .main-bg {
      flex: 1;
      background-image: url('/images/login/login-bg-2.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: 0 0 100px 60px rgba(255, 255, 255, 0.7) inset;
      margin-right: 100px;
      border-radius: 6px;
    }

    .main-form {
      display: flex;
      align-items: center;
      flex: 0 0 360px;

      form {
        width: 100%;
        box-shadow: 0 0 25px #cac6c6;
        padding: 60px 30px 20px 20px;
        border-radius: 6px;
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