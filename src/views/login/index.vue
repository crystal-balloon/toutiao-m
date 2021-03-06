<template>
  <div class="login-container">
    <!--
      el-form 表单组件
      每个表单项都必须使用 el-form-item 组件包裹
     -->
    <div class="logo">
      <div class="login-head"></div>
    </div>
    <!-- 配置 form 表单验证：
        1.必须给 el-form 组件绑定 model 为表单数据对象
        2.给需要验证的表单项 el-form-item 绑定 prop 属性
        注意：prop 属性需要指定表单对象中的数据名称
        3.通过 el-form 组件的 rules 属性配置验证规则
          具体的验证规则可以参考：https://github.com/yiminghe/async-validator
          如果内置的验证规则不满足，也可以自定义验证规则
        手动触发表单验证
        1.给 el-form 设置 ref 起个名字（随便起名，不要重复即可）
        2.通过 ref 获取 el-form 组件，调用组件的 validate 进行验证  -->
    <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile"
        placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code"
        placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin" class="login-btn" :loading="loginLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        // 手机号
        mobile: '',
        // 验证码
        code: '',
        // 是否同意协议
        agree: false
      },
      // 是否同意协议的选中状态
      // checked: false,
      // 登录的loading状态
      loginLoading: false,
      formRules: {
        // 表单验证规则配置
        // 要验证的数据名称：规则列表[]
        mobile: [
          // trigger 用来配置触发校验的时机，有两个选项，change 是当输入的内容发生变化的时候，blur 是当失去焦点的时候
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'change' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            // validator 验证函数不是我们调用的，是当 element 表单触发验证的时候它会自己内部调用，故只需提供校验函数处理逻辑就可以了
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'blur'
          }
        ]
      }

    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // const user = this.user
      // 表单验证
      // validate方法是异步的
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证失败，停止请求提交( valid 是布尔值)
        if (!valid) {
          return
        }
        // 验证通过，提交登录
        this.login()
      })
      // 处理后端响应结果
      //    成功
      //    失败
    },
    login () {
    // 开启登陆中 loading
      this.loginLoading = true
      // 对于代码中的请求操作
      // 1.接口请求可能需要重用
      // 2.实际工作中，接口非常容易变动，改起来麻烦
      // 我们建议的做法是把所有的请求都封装成函数然后统一组织到模块中进行管理
      // 这样做的好处是：管理维护方便，好重用
      login(this.user).then(res => {
        console.log(res)
        // 登录成功
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 关闭 loading
        this.loginLoading = false
        // 将接口返回的用户数据放到本地存储，方便应用数据共享
        // 本地存储只能存储字符串
        // 如果需要存储对象、数组类型的数据，则把他们转为 JSON 格式字符串进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 跳转到首页
        // this.$router.push('/')

        this.$router.push({
          name: 'Home'
        })
      }).catch(err => {
        console.log('登陆失败', err)
        this.$message.error('登录失败，手机号或验证码错误')
        // 关闭loading
        this.loginLoading = false
        // 在这里登录失败也跳转进新页面，因为可能账号密码不能用了，无法显示登录成功界面
        this.$router.push({
          name: 'Home'
        })
      })
    }
  }
}
</script>
<style scoped lang='less'>
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('./sky.jpg') no-repeat;
  background-size: cover;
  .logo {
    width:348px;
    background: #fff;
    text-align: center;
    padding-top: 20px;
    .login-head {
    width: 519/3px;
    height: 181/3px;
    background:  url("./logo.jpg") no-repeat;
    background-size: cover;
    display: inline-block;
    }
  }
  .login-form {
    background: #fff;
    padding: 50px;
    padding-top: 20px;
    .login-btn{
      width: 100%;
    }
  }
}
</style>
