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
              <el-col :span="15"><el-input v-model.number="ruleForm.Checkpass" type="text" maxlength="6" minlength="6" class="block"></el-input></el-col>
              <el-col :span="9"><el-button type="success" class="block">获取验证码</el-button></el-col>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button type="danger" @click="submitForm('ruleForm')" class="login_btn elButton">提交</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>

import {stripscript} from '@/common/utils/utils.js'
export default {
  name: "Login",
  data () {
      
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
        this.ruleForm.Pwd = stripscript(value);
        value = this.ruleForm.Pwd;
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
        if(this.CurrentIndex === 0) {return callback();}
        let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/;
        this.ruleForm.Pwdss = stripscript(value);
        value = this.ruleForm.Pwdss;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== this.ruleForm.Pwd) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      var validateCode = (rule, value, callback) => {
        let reg = /^[a-z0-9]{6}$/;
        this.ruleForm.Checkpass = stripscript(value);
        value = this.ruleForm.Checkpass;
        if (!value) {
          callback(new Error('验证码不能为空'));
        } else if (!reg.test(value)) {
          callback(new Error('验证码格式错误'));
        } else {
          callback();
        }
      };
    return {
      items: [
        '登录',
        '注册'
      ],
      isShow: null,
      CurrentIndex: 0,
      ruleForm: {
          Username: '',
          Pwd: '',
          Pwdss: '',
          Checkpass: ''
        },
        rules: {
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
        }
    };
  },
  methods: {
    isCurrent(index) {
      this.CurrentIndex = index;
      if(index == 0) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }   
    },

    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
  },
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