<template>
  <div class="content">
    <div class="logbox">
      <h1>后台管理系统</h1>
      <a-form-model
        :model="form"
        ref="ruleForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <!-- 账号 -->
        <a-form-model-item label="账号" prop="uname" ref="uname" has-feedback>
          <a-input
            v-model="form.uname"
            placeholder="请输入账号"
            autocomplete="off"
            @blur="
              () => {
                $refs.uname.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <!-- 密码 -->
        <a-form-model-item label="密码" prop="pwd" ref="pwd" has-feedback>
          <a-input
            v-model="form.pwd"
            placeholder="请输入密码"
            autocomplete="off"
            @blur="
              () => {
                $refs.pwd.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <!-- 密保 -->
        <a-form-model-item
          label="Activity zone"
          prop="security"
          ref="security"
          has-feedback
        >
          <a-select
            v-model="form.question"
            placeholder="请输入密保问题"
            autocomplete="off"
          >
            <a-select-option value="您其中一位老师的名字"
              >您其中一位老师的名字</a-select-option
            >
            <a-select-option value="xxxxxxxxxx"> xxxxxxxxxx </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 密保答案 -->
        <a-form-model-item
          label="密保密码"
          prop="answer"
          ref="answer"
          has-feedback
        >
          <a-input
            v-model="form.answer"
            placeholder="请输入密保答案"
            autocomplete="off"
            @blur="
              () => {
                $refs.answer.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <!-- 按钮 -->
        <a-form-model-item :wrapper-col="{ span: 18, offset: 4 }">
          <a-button type="primary" @click="showcode">
            <a-icon type="wechat" />
          </a-button>
          <a-button type="primary" style="margin-left: 30px">
            <a-icon type="mobile" />
          </a-button>
          <a-button type="primary" @click="onSubmit" style="margin-left: 30px">
            登录
          </a-button>
          <a-button style="margin-left: 30px" @click="resetForm">
            清除
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
      <!-- 验证码框 -->
      <a-form-item label="手机号">
        <a-input
          v-model="tel"
          v-decorator="[
            'phone',
            {
              rules: [
                {
                  required: true,
                  message: '请输入您的手机号',
                },
              ],
            },
          ]"
          style="width: 100%"
        >
          <a-select
            slot="addonBefore"
            v-decorator="['prefix', { initialValue: '86' }]"
            style="width: 70px"
          >
            <a-select-option value="86"> +86 </a-select-option>
            <a-select-option value="87"> +87 </a-select-option>
          </a-select>
        </a-input>
      </a-form-item>
      <a-form-item label="验证码">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-input
              v-model="captcha"
              v-decorator="[
                'captcha',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码',
                    },
                  ],
                },
              ]"
            />
          </a-col>
          <a-col :span="12">
            <a-button @click="getcaptcha">获取验证码</a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20">
            <a-button @click="captchalog">登录</a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form-model>
    <div v-show="isshowcode" class="code">
      <div class="qrcode" id="qrcode" ref="qrCodeUrl"></div>
    </div>
  </div>
</template>

<script>
import {
  postLoginApi2,
  postLoginApi,
  codelog,
  getnum,
  captchalog,
} from "@/api/axios";
import QRCode from "qrcodejs2";

export default {
  data() {
    let checkPending;
    let checkAge = (rule, value, callback) => {
      clearTimeout(checkPending);
      if (!value) {
        return callback(new Error("Please input the age"));
      }
      checkPending = setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("Please input digits"));
        } else {
          if (value < 18) {
            callback(new Error("Age must be greater than 18"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      isshowcode: false,
      timer: null,
      uid: "",
      captcha: "",
      tel: "",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        uname: "",
        pwd: "",
        question: "",
        answer: "",
      },
      rules: {
        uname: [
          {
            pattern: new RegExp(/^[a-zA-z][a-zA-Z0-9_]{4,9}$/),
            required: true,
            message: "请输入非数字开头的5-10位账号",
            trigger: "blur",
          },
        ],
        pwd: [
          {
            pattern: new RegExp(/^[a-zA-Z0-9_]{4,9}$/),
            required: true,
            message: "请输入5-8位数字密码",
            trigger: "blur",
          },
        ],
        question: [
          {
            required: true,
            message: "请添加密保问题",
          },
        ],
        answer: [
          {
            type: "string",
            required: true,
            message: "请输入密保答案",
            trigger: "blur",
          },
        ],
      },
    };
  },

  computed: {},

  components: {},

  created() {},

  mounted() {
    this.uuid();
    console.log(this.uid);
    this.$nextTick(function () {
      this.creatQrCode();
    });
    let _this = this;
    const timer = setInterval(() => {
      // 可以实现登录
      _this.codelogin();
    }, 500);
    // 通过$once来监听定时器
    // 在beforeDestroy钩子触发时清除定时器
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    async captchalog() {
      console.log(this.tel, this.captcha);
      let res = await captchalog("/sms/login.php", {
        mobile: this.tel,
        code: this.captcha,
      });
      if (res.data.meta.state === 200) {
        // h5存储   先储存再跳转
        localStorage.setItem("uname", res.data.data.uname);
        localStorage.setItem("roleName", res.data.data.roleName);
        localStorage.setItem("token", res.data.data.token);
        this.$message.success(res.data.meta.msg);
        this.$router.push("/");
      } else {
        this.$message.error(res.data.meta.msg);
      }
      console.log(res);
    },
    async getcaptcha() {
      console.log(this.tel);
      let res = await getnum("/sms/send.php", { mobile: this.tel });
      console.log(res.data);
    },
    showcode() {
      this.isshowcode = !this.isshowcode;
    },

    async codelogin() {
      if (this.isshowcode) {
        console.log("111");

        // setInterval(() => {
        console.log(1);
        let res = await codelog("/qr/check.php", { state: this.uid });
        if (res.data.meta.state === 200) {
          console.log(res);

          // h5存储   先储存再跳转
          localStorage.setItem("uname", res.data.data.uname);
          localStorage.setItem("roleName", res.data.data.roleName);
          localStorage.setItem("token", res.data.data.token);
          this.$message.success(res.data.meta.msg);
          this.$router.push("/");
        } else {
          // this.$message.error(res.data.meta.msg);
        }

        // }, 500);
      }
    },

    creatQrCode() {
      document.getElementById("qrcode").innerHTML = "";
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed58e834201d0894&redirect_uri=http://kg.zhaodashen.cn/v2/qr/login.php&response_type=code&scope=snsapi_base&state=${this.uid}&connect_redirect=1#wechat_redirect`, // 需要转换为二维码的内容
        width: 500,
        height: 500,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      this.uid = new Date().getTime() + "-" + uuid;
      return new Date().getTime() + "-" + uuid;
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          console.log(111);
          let res = await postLoginApi("/users/login.php", this.form);

          // 这样传参不可以登录成功
          // uname: this.form.uname,
          //   pwd: this.form.pwd,
          //   question: this.form.question,
          //   answer: this.form.answer,
          console.log(res.data);
          if (res.data.meta.state === 200) {
            // h5存储   先储存再跳转
            localStorage.setItem("uname", res.data.data.uname);
            localStorage.setItem("roleName", res.data.data.roleName);
            localStorage.setItem("token", res.data.data.token);
            this.$message.success(res.data.meta.msg);
            this.$router.push("/");
          } else {
            this.$message.error(res.data.meta.msg);
          }
          // let res = await postLoginApi2("/users/login.php", this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style scoped lang='scss'>
.content {
  background: dimgrey;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .logbox {
    width: 700px;
    height: 500px;
    background: gray;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h1 {
      margin-bottom: 20px;
      font-size: 30px;
    }
  }
}
.ant-select-selection__placeholder {
  display: block !important;
}
.ant-form {
  width: 100%;
}
.code {
  position: absolute;
  left: calc(50% - 150px);
  top: calc(50% - 150px);
}
/deep/ .qrcode {
  display: inline-block;

  img {
    width: 300px;
    height: 300px;
    background-color: #fff; //设置白色背景色
    padding: 6px; // 利用padding的特性，挤出白边
    box-sizing: border-box;
  }
}
</style>