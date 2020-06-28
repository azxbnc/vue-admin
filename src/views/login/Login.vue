<template>
    <div id="login">
      <div class="login_nav">
        <ul>
          <li v-for="(item,index) in items" :key='index' @click.prevent="isCurrent(index)"><a href="" :class="{current: CurrentIndex == index}">{{item}}</a></li>
        </ul>
      </div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" size="medium" class="login_content">
          
          <el-form-item  prop="Username" class="item_form">
            <label for="" class="label">用户名</label>
            <el-input type="text" v-model="ruleForm.Username" autocomplete="off"></el-input>
          </el-form-item>
          
          <el-form-item prop="Pwd" class="item_form">
            <label for="" class="label">密码</label>
            <el-input type="password" v-model="ruleForm.Pwd" autocomplete="off" maxlength="20" minlength="6" ></el-input>
          </el-form-item>
          
          <el-form-item prop="Pwdss" class="item_form" v-show="isShow">
            <label for="" class="label">重复密码</label>
            <el-input type="password" v-model="ruleForm.Pwdss" autocomplete="off" maxlength="20" minlength="6" ></el-input>
          </el-form-item>
         
          <el-form-item prop="Checkpass" class="item_form">
            <label for="" class="label">验证码</label>          
            <el-row :gutter="10">
              <el-col :span="15"><el-input v-model="ruleForm.Checkpass" type="text" maxlength="6" minlength="6" class="block"></el-input></el-col>
              <el-col :span="9"><el-button type="success" class="block" @click="getMsg" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button></el-col>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button type="danger" @click="submitForm('ruleForm')" class="login_btn elButton"  :disabled="false">{{CurrentIndex == 0 ? '登录' : '注册' }}</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>

import { stripscript, validateEmail } from '@/common/utils/utils.js'
import { reactive, ref, onMounted } from '@vue/composition-api'
import { GetSms, Register, Login } from '@/api/login.js'
export default {
  name: "Login",
  setup(props, { refs, root }) {
    var validateUsername = (rule, value, callback) => {
        let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(!reg.test(value)) {
          callback(new Error('用户名格式错误'));
          }
          else {
          callback();
        }
      };
      var validatePwd = (rule, value, callback) => {
        let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/;
        ruleForm.Pwd = stripscript(value);
        value = ruleForm.Pwd;
        value = stripscript(value);
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!reg.test(value)) {
          callback(new Error('密码格式错误'));
        } else {
          callback();
        }
      };
      var validatePwdss = (rule, value, callback) => {
        if(CurrentIndex.value === 0) {return callback();}
        let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/;
        ruleForm.Pwdss = stripscript(value);
        value = ruleForm.Pwdss;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== ruleForm.Pwd) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      var validateCode = (rule, value, callback) => {
        let reg = /^[a-z0-9]{6}$/;
        ruleForm.Checkpass = stripscript(value);
        value = ruleForm.Checkpass;
        if (!value) {
          callback(new Error('验证码不能为空'));
        } else if (!reg.test(value)) {
          callback(new Error('验证码格式错误'));
        } else {
          callback();
        }
      };
    const items = reactive([
        '登录',
        '注册'
      ]);
    const isShow =  ref(null);
    const CurrentIndex = ref(0);
    const codeButtonStatus = reactive({
      status: false,
      text: '获取验证码'
    })
    const timer = ref(null);
    const module = ref('login')
    const ruleForm = reactive({
          Username: '',
          Pwd: '',
          Pwdss: '',
          Checkpass: ''
        });
    const rules = reactive({
          Username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          Pwd: [
            { validator: validatePwd, trigger: 'blur' }
          ],
          Pwdss: [
            { validator: validatePwdss, trigger: 'blur' }
          ],
          Checkpass: [
            { validator: validateCode, trigger: 'blur' }
          ]
        });
    const isCurrent = (index => {
      CurrentIndex.value = index;
      if(index == 0) {
        isShow.value = false;
        module.value = 'login'
      } else {
        isShow.value = true;
        module.value = 'register'
      }
      refs.ruleForm.resetFields();
    });
    const submitForm = (formName => {
        refs[formName].validate((valid) => {
          if (valid) {
            module.value === 'login'? login() : register();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    });
    const login = (()=> {
      let requestData = {
        username: ruleForm.Username,
        Password: ruleForm.Pwd,
        code: ruleForm.Checkpass,
        module: 'login'
      }
      Login(requestData).then(res=> {
        console.log(res);
        root.$message({
          message: res.data.message,
          type: 'success'
        })
      }, error=> {

      })
        })
    const register = (()=> {
      let requestData = {
        username: ruleForm.Username,
        Password: ruleForm.Pwd,
        code: ruleForm.Checkpass,
        module: 'register'
      }
      Register(requestData).then(res=> {
        console.log(res);          
        let data = res.data;
        root.$message({
          showClose: 'true',
          message: data.message,
          type: 'success'
        })
        isCurrent(0);
        clearInt();              
      },error=> {
        console.log(error);       
      })           
    })
    const countDown = ((num) => {
      if(timer.value) { clearInterval(timer.value); }
      let time = num;
      timer.value = setInterval(() => {
        time--;
        // console.log(time);
        if(time === 0) {
          clearInterval(timer.value);
          codeButtonStatus.status = false;
          codeButtonStatus.text = '重新获取';
      } else {
          codeButtonStatus.text = `倒计时${time}秒`;
      }
      }, 1000);
      
    })
    const clearInt = (()=> {
      codeButtonStatus.status = false;
      codeButtonStatus.text = '获取验证码';
      clearInterval(timer.value);
    })
    const getMsg = (() => {

      if(ruleForm.Username == '') {
        root.$message.error('邮箱不能为空！！');
        return false;
      }
      if(validateEmail(ruleForm.Username)) {
        root.$message.error('邮箱格式有误！！')
        return false;
      }
      codeButtonStatus.status = true;
      codeButtonStatus.text = '发送中';
      let data = {
        username: ruleForm.Username,
        module: module
      }
      console.log(module.value);
      
      setTimeout(() => {
        GetSms(data).then(res => {
        let data = res.data;
        root.$message({
          showClose: 'true',
          message: data.message,
          type: 'success'
        })
        countDown(30);
      }, error => {
        console.log(error);
        
      })
      }, 3000)
    })
    return {
      items,
      CurrentIndex,
      isShow,
      ruleForm,
      rules,
      isCurrent,
      submitForm,
      getMsg,
      codeButtonStatus
    };
    onMounted(() => {
      
    })
  }
}
</script>
<style lang="scss" scoped>
  #login {
    height: 100vh;
    background-color: #344a5f;
    overflow: hidden;
  }
  .login_nav {
    margin: 50px auto;
    // width: 450px;
    // height: 530px;
    // background-color: pink;
  }
  .login_nav ul {
    display: flex;
    justify-content: center;
  }
  .login_nav li {
    display: flex;
    line-height: 36px;
    text-align: center;
    overflow: hidden;
  }
  .login_nav a {
    width: 88px;
    height: 36px;
    border-radius: 2px;
    color: #fff;
    font-size: 16px;
  }
  .current {
    background-color: rgba(0, 0, 0, .5);
  }

  .login_content {
    width: 330px;
    margin: auto;
    margin-top: 29px;
  }
  .elButton {
    display: block;
    width: 100%;
  }
  .item_form {
    margin: 15px auto;
  }
  .label {
    display: block;
    margin-bottom: 3px;
    color: #fff;
    font-size: 14px;
  }
  .login_btn {
    margin-top: 19px;
  }
  .block {
    display: block;
    width: 100%;
  }
</style>