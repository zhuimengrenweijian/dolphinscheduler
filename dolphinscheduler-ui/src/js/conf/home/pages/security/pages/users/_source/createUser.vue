/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
  <m-popover
          okId="btnSubmit"
          cancelId="btnCancel"
          ref="popover"
          :ok-text="item ? $t('Edit') : $t('Submit')"
          @ok="_ok"
          @close="close">
    <template slot="content">
      <div class="create-user-model">
        <m-list-box-f>
          <template slot="name"><strong>*</strong>{{$t('User Name')}}</template>
          <template slot="content">
            <el-input
                    id="inputUserName"
                    type="input"
                    v-model="userName"
                    maxlength="60"
                    size="small"
                    :placeholder="$t('Please enter user name')">
            </el-input>
          </template>
        </m-list-box-f>
        <m-list-box-f v-if="router.history.current.name !== 'account'">
          <template slot="name"><strong>*</strong>{{$t('Password')}}</template>
          <template slot="content">
            <el-input
                    id="inputUserPassword"
                    type="password"
                    v-model="userPassword"
                    size="small"
                    :placeholder="$t('Please enter your password')">
            </el-input>
          </template>
        </m-list-box-f>
        <m-list-box-f v-if="isADMIN">
          <template slot="name"><strong>*</strong>{{$t('Tenant')}}</template>
          <template slot="content">
            <el-select v-model="tenantId" style="width: 100%;" size="small">
              <el-option
                      v-for="city in tenantList"
                      :key="city.id"
                      :value="city.id"
                      :label="city.code">
              </el-option>
            </el-select>
          </template>
        </m-list-box-f>
        <m-list-box-f v-if="isADMIN">
          <template slot="name">{{$t('Queue')}}</template>
          <template slot="content">
            <el-select v-model="queueName" style="width: 100%;" size="small">
              <el-input slot="trigger" slot-scope="{ selectedModel }" readonly :placeholder="$t('Please select a queue')" :value="selectedModel ? selectedModel.label : ''" @on-click-icon.stop="queueName = ''">
                <em slot="suffix" class="el-icon-error" style="font-size: 15px;cursor: pointer;" v-show="queueName ==''"></em>
                <em slot="suffix" class="el-icon-bottom" style="font-size: 12px;" v-show="queueName!=''"></em>
              </el-input>
              <el-option
                      v-for="city in queueList"
                      :key="city.id"
                      :value="city.id"
                      :label="city.code">
              </el-option>
            </el-select>
          </template>
        </m-list-box-f>
        <m-list-box-f>
          <template slot="name"><strong>*</strong>{{$t('Email')}}</template>
          <template slot="content">
            <el-input
                    id="inputEmail"
                    type="input"
                    v-model="email"
                    size="small"
                    :placeholder="$t('Please enter email')">
            </el-input>
          </template>
        </m-list-box-f>
        <m-list-box-f>
          <template slot="name">{{$t('Phone')}}</template>
          <template slot="content">
            <el-input
                    id="inputPhone"
                    type="input"
                    v-model="phone"
                    size="small"
                    :placeholder="$t('Please enter phone number')">
            </el-input>
          </template>
        </m-list-box-f>
        <m-list-box-f v-if="showState" style="line-height: 38px;">
          <template slot="name">{{$t('State')}}</template>
          <template slot="content">
            <el-radio-group v-model="userState" size="small">
              <el-radio :label="'1'">{{$t('Enable')}}</el-radio>
              <el-radio :label="'0'">{{$t('Disable')}}</el-radio>
            </el-radio-group>
          </template>
        </m-list-box-f>
      </div>
    </template>
  </m-popover>
</template>
<script>
  import _ from 'lodash'
  import i18n from '@/module/i18n'
  import store from '@/conf/home/store'
  import router from '@/conf/home/router'
  import mPopover from '@/module/components/popup/popover'
  import mListBoxF from '@/module/components/listBoxF/listBoxF'
  import { mapState } from 'vuex'

  export default {
    name: 'create-user',
    data () {
      return {
        store,
        router,
        queueList: [],
        userName: '',
        userPassword: '',
        tenantId: '',
        queueName: '',
        email: '',
        phone: '',
        userState: '1',
        tenantList: [],
        showState: true,
        // Source admin user information
        isADMIN: store.state.user.userInfo.userType === 'ADMIN_USER' && router.history.current.name !== 'account'
      }
    },
    props: {
      item: Object,
      fromUserInfo: Boolean
    },
    methods: {
      _ok () {
        if (this._verification()) {
          // The name is not verified
          if (this.item && this.item.groupName === this.groupName) {
            this._submit()
            return
          }
          // Verify username
          this.store.dispatch('security/verifyName', {
            type: 'user',
            userName: this.userName
          }).then(res => {
            this._submit()
          }).catch(e => {
            this.$message.error(e.msg || '')
          })
        }
      },
      _verification () {
        let regEmail = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/ // eslint-disable-line

        // Mobile phone number regular
        let regPhone = /^1(3|4|5|6|7|8)\d{9}$/; // eslint-disable-line

        let regPassword = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]+$)[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、0-9A-Za-z]{6,22}$/

        let userNameLength = this.userName.length
        // user name
        if (userNameLength < 3 || userNameLength > 39) {
          this.$message.warning(`${i18n.$t('User name length is between 3 and 39')}`)
          return false
        }
        if (!this.userName.replace(/\s*/g, '')) {
          this.$message.warning(`${i18n.$t('Please enter user name')}`)
          return false
        }
        // password
        if (this.userPassword !== '' && this.item) {
          if (!regPassword.test(this.userPassword)) {
            this.$message.warning(`${i18n.$t('Password consists of at least two combinations of numbers, letters, and characters, and the length is between 6-22')}`)
            return false
          }
        } else if (!this.item) {
          if (!regPassword.test(this.userPassword)) {
            this.$message.warning(`${i18n.$t('Password consists of at least two combinations of numbers, letters, and characters, and the length is between 6-22')}`)
            return false
          }
        }

        // email
        if (!this.email) {
          this.$message.warning(`${i18n.$t('Please enter email')}`)
          return false
        }
        // Verify email
        if (!regEmail.test(this.email)) {
          this.$message.warning(`${i18n.$t('Please enter the correct email format')}`)
          return false
        }
        // Verify phone
        if (this.phone) {
          if (!regPhone.test(this.phone)) {
            this.$message.warning(`${i18n.$t('Please enter the correct mobile phone format')}`)
            return false
          }
        }

        return true
      },
      _getQueueList () {
        return new Promise((resolve, reject) => {
          this.store.dispatch('security/getQueueList').then(res => {
            this.queueList = _.map(res, v => {
              return {
                id: v.id,
                code: v.queueName
              }
            })
            this.$nextTick(() => {
              this.queueName = this.queueList[0].id
            })
            resolve()
          })
        })
      },
      _getTenantList () {
        return new Promise((resolve, reject) => {
          this.store.dispatch('security/getTenantList').then(res => {
            let arr = _.filter(res, (o) => {
              return o.id !== -1
            })
            this.tenantList = _.map(arr, v => {
              return {
                id: v.id,
                code: v.tenantCode
              }
            })
            this.$nextTick(() => {
              if (this.tenantList.length) {
                this.tenantId = this.tenantList[0].id
              }
            })
            resolve()
          })
        })
      },
      _submit () {
        this.$refs.popover.spinnerLoading = true

        let queueCode = ''
        // get queue code
        if (this.queueName !== '') {
          queueCode = this.queueList.length > 0 ? _.find(this.queueList, ['id', this.queueName]).code : ''
        }
        let param = {
          userName: this.userName,
          userPassword: this.userPassword,
          tenantId: this.tenantId,
          email: this.email,
          queue: queueCode,
          phone: this.phone,
          state: this.userState
        }

        if (this.item) {
          param.id = this.item.id
        }

        this.store.dispatch(`security/${this.item ? 'updateUser' : 'createUser'}`, param).then(res => {
          this.$refs.popover.spinnerLoading = false
          this.$emit('onUpdate')
          this.$message.success(res.msg)
        }).catch(e => {
          this.$message.error(e.msg || '')
          this.$refs.popover.spinnerLoading = false
        })
      },
      close () {
        this.$emit('close')
      }
    },
    watch: {},
    created () {
      // Administrator gets tenant list
      this.showState = true
      if (this.isADMIN) {
        Promise.all([this._getQueueList(), this._getTenantList()]).then(() => {
          if (this.item) {
            this.userName = this.item.userName
            this.userPassword = ''
            this.email = this.item.email
            this.phone = this.item.phone
            this.state = this.item.state
            this.userState = this.item.state + '' || '1'
            this.showState = this.item.id !== this.userInfo.id
            if (this.fromUserInfo || this.item.tenantId) {
              this.tenantId = this.item.tenantId
            }
            this.$nextTick(() => {
              let queue = _.find(this.queueList, ['code', this.item.queue])
              if (queue) {
                this.queueName = queue.id || ''
              }
            })
          }
        })
      } else {
        if (this.item) {
          this.userName = this.item.userName
          this.userPassword = ''
          this.email = this.item.email
          this.phone = this.item.phone
          this.state = this.item.state
          this.userState = this.state + '' || '1'
          this.showState = this.item.id !== this.userInfo.id
          if (this.fromUserInfo || this.item.tenantId) {
            this.tenantId = this.item.tenantId
          }
          if (this.queueList.length > 0) {
            let queue = _.find(this.queueList, ['code', this.item.queue])
            if (queue) {
              this.queueName = queue.id || ''
            }
          } else {
            this.queueName = ''
          }
        }
      }
    },
    mounted () {
    },
    computed: {
      ...mapState('user', ['userInfo'])
    },
    components: { mPopover, mListBoxF }
  }
</script>
