<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="ID" prop="id">
          <el-input
            v-model="queryParams.id"
            placeholder="请输入ID"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入手机号"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="qrcodeAdd"
          >二维码登录</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >编辑</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" border :data="roleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" align="center" width="75"/>
        <el-table-column label="手机号" prop="username" align="center" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="密码" prop="password" align="center" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="等级" prop="level" align="center" :show-overflow-tooltip="true" width="75" />
        <el-table-column label="购买天数" prop="cron_day_num" align="center" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="执行天数" prop="cron_nums" width="100" />
        <el-table-column label="注册听歌量" prop="old_songs" width="100" />
        <el-table-column label="昨日听歌量" prop="yesterday_songs" width="100" />
        <el-table-column label="当前听歌量" prop="listen_songs" align="center" width="150" />
        <!-- <el-table-column label="刷歌状态" prop="status" align="center" width="150" /> -->
        <el-table-column label="创建时间" align="center" prop="create_time">
          <template slot-scope="scope">
            <span>{{ scope.row.ctime }}</span>
          </template>
        </el-table-column>
        <!-- 48766  10848 -->
        <el-table-column label="更新时间" align="center" prop="create_time">
          <template slot-scope="scope">
            <span>{{ scope.row.mtime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="登录时间" align="center" prop="create_time">
          <template slot-scope="scope">
            <span>{{ scope.row.login_time }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope"> 
           <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="addMusic(scope.row)"
            >添加歌曲</el-button>
             <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="musicRankRecord(scope.row)"
            >听歌排行</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-list"
              @click="musicUserPlaylist(scope.row)"
            >用户歌单信息</el-button>
             <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="updateUserInfo(scope.row)"
            >更新登录信息</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="flushMusicLevel(scope.row)"
            >刷等级</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.page_size"
        @pagination="getList"
      />

      <!-- 添加或修改用户 -->
      <el-dialog :title="title" :visible.sync="open" width="50%">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="手机号" prop="username" style="width: 90%">
                <el-input v-model="form.username" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="密码" prop="password" style="width: 90%">
                <el-input v-model="form.password" placeholder="请输入用户昵称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
               <el-form-item label="滑动验证" style="width: 90%">
                <div id="geetest"></div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

           <!-- 添加歌曲 -->
      <el-dialog :title="add_music_title" :visible.sync="add_music_open" width="800px">
        <el-form ref="add_music_form" :model="add_music_form" :rules="add_music_rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="歌曲链接" prop="music_name" style="width: 90%">
                <el-input v-model="add_music_form.music_name" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="歌曲id" prop="music_playid" style="width: 90%">
                <el-input v-model="add_music_form.music_playid" placeholder="请输入用户昵称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="播放次数" prop="music_num" style="width: 90%">
                <el-input v-model="add_music_form.music_num" placeholder="请输入cookie" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="执行脚本" prop="music_cron">
              <el-radio-group v-model="add_music_form.music_cron">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addMusicSubmitForm">确 定</el-button>
          <el-button @click="addMusicCancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 听歌排行 -->
      <el-dialog :title="music_rank_title" :visible.sync="music_rank" width="800px" class="spec-dialog">
        <el-table v-loading="loading" border :data="music_rank_list">
          <el-table-column label="ID" prop="song_id" width="120" />
          <el-table-column label="歌曲" prop="name" :show-overflow-tooltip="true" width="200" />
          <el-table-column label="播放次数" prop="play_count" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="分数" prop="score" :show-overflow-tooltip="true" width="150" />
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="musicRankCancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 二维码登录 -->
      <el-dialog :title="music_qrcode_title" :visible.sync="music_qrcode" width="500px">
        <div style="text-align: center;" >
            <el-button><img :src="music_qrcode_list.qrcode" class="image"></el-button>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="musicQrcodeCheck">验证是否扫码</el-button>
          <el-button @click="musicQrcodeCancel">取 消 扫 码</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { listMusicUser, getMusicUserInfo, delMusicUser, addMusicUser, updateMusicUser, updateMusicUserInfo, addMusicSingle, getMusicRank, getMusicQrcode, checkMusicQrcode, apiFlushMusicLevel, userPlaylist } from '@/api/music/user'
import { addBilibiliUser } from '@/api/bilibili/user'
import { getgeetest } from '@/api/bilibili/user'
import { formatJson } from '@/utils'
import { Message } from 'element-ui'
export default {
  name: 'Admin',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      timer: null,
      music_uid_id: 0,
      music_uid_name: '',
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      music_rank_list: [],
      music_user_playlist: [],
      music_qrcode_list: [],
      // 弹出层标题
      title: '',
      add_music_title: '',
      music_rank_title: '',
      music_user_playlist_title: '',
      music_qrcode_title: '',

      gt: '',
      challenge: '',
      geetest_token: '',
      geetestObj: {},
      // 是否显示弹出层
      open: false,
      music_qrcode: false,
      add_music_open: false,
      music_rank: false,
      music_user_playlist_open: false,
      addShow: false,
      editShow: false,
      dialogVisiblePassword: false, // 修改密码弹窗
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      isEdit: false,
      // 角色选择
      roleOptions: [],
      // 日期范围
      dateRange: [],

      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 20,
        username: undefined,
        id: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      add_music_form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          { required: false, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
         // 表单校验
      add_music_rules: {
        music_url: [
          { required: true, message: '添加歌曲链接不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listMusicUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.data.list
          this.total = response.data.pages.total
          this.queryParams.page = response.data.pages.current_page
          this.queryParams.page_size = response.data.pages.per_page
          this.loading = false
        }
      )
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: 0,
        username: '',
        phone: '',
        status: '0',
        email: '',
        remark: ''
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.queryParams.username = ''
      this.queryParams.id = ''
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },


    /** 新增按钮操作 */
    handleAdd() {
      // 获取bilibili验证信息
     
      getgeetest(this.form).then(response => {
        if (response.code === 20000) {
          Message.success(response.msg)
          console.log(response)
          this.gt = response.data.Data.Geetest.gt
          this.challenge = response.data.Data.Geetest.challenge
          this.geetest_token = response.data.Data.token
          const that  = this
          initGeetest({
              // 以下配置参数来自服务端 SDK
              gt: this.gt ,
              challenge: this.challenge,
              offline: false,
              new_captcha: true  //这个参数先不用管它，放在这里就行了
          }, function (captchaObj) {
            // 这里可以调用验证实例 captchaObj 的实例方法
            console.log(captchaObj);
            //通过调用captchaObj对象的appendTo方法，给某个标签添加上滑动验证对象，就行了，看写法
            captchaObj.appendTo('#geetest') //参数是一个标签选择器，那么这个标签就加上了滑动验证的页面效果
     
            // 这里调用了 onSuccess 方法，该方法介绍见下文 
            captchaObj.onSuccess(function () {  //这是滑动验证成功之后立马发送ajax请求进行登陆，就可以写在这个方法里面，但是我们上面的那个业务场景并不是直接就登陆，还需要点击登陆按钮，所以我们登陆请求不是写在这里的
                that.geetestObj = captchaObj.getValidate()
                console.log(that.geetestObj)
                // console.log('geetest_challenge',result.geetest_challenge)
                // console.log('geetest_validate',result.geetest_validate)
                // console.log('geetest_seccode',result.geetest_seccode)
            });
          })

        } else {
          Message.error(response.msg)
        }
      })
     

      this.reset()
      this.addShow = true
      this.editShow = false
      this.open = true
      this.title = '添加用户'
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.editShow = true
      this.addShow = false
      this.open = true
      this.title = '修改用户'
      this.isEdit = true
      const id = row.id || this.ids
      getMusicUserInfo(id).then(response => {
        this.form = response.data
        this.form.id = id
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if(this.geetestObj.geetest_challenge === undefined){
              Message.error("请点击滑动验证码")
              return
          }
            if(this.geetestObj.geetest_validate === undefined){
              Message.error("请点击滑动验证码")
              return
          }
          this.form.geetest_validate = this.geetestObj.geetest_validate
          this.form.geetest_challenge = this.geetestObj.geetest_challenge
          this.form.geetest_seccode = this.geetestObj.geetest_seccode
          this.form.geetest_token = this.geetest_token

          if (this.form.id !== undefined && this.form.id !== 0) {
            updateMusicUser(this.form).then(response => {
              if (response.code === 20000) {
                Message.success(response.msg)
                this.open = false
                this.editShow = false
                this.getList()
              } else {
                Message.error(response.msg)
              }
            })
          } else {
            addBilibiliUser(this.form).then(response => {
              if (response.code === 20000) {
                Message.success(response.msg)
                this.open = false
                this.addShow = false
                this.getList()
              } else {
                Message.error(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      const admin_ids = row.id || this.ids
      this.$confirm('是否确认删除角色编号为"' + admin_ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMusicUser(admin_ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },


    /** 更新登录状态 */
    updateUserInfo(row) {
      console.log(row)
      const id = row.id || this.ids
      this.$confirm('是否确认更新账号"' + row.username + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return updateMusicUserInfo(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('更新成功')
      }).catch(function() {})
    },

    /** 刷等级 */
    flushMusicLevel(row) {
      console.log(row)
      const id = row.id || this.ids
      this.$confirm('是否确认更新等级用户"' + row.username + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return apiFlushMusicLevel(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('更新成功')
      }).catch(function() {})
    },

    /** 导出按钮操作 */
    handleExport() {
      this.$confirm('是否确认导出所有角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['角色编号', '角色名称', '权限字符', '显示顺序', '状态', '创建时间']
          const filterVal = ['roleId', 'roleName', 'roleKey', 'roleSort', 'status', 'create_time']
          const list = this.roleList
          const data = formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '角色管理',
            autoWidth: true, // Optional
            bookType: 'xlsx' // Optional
          })
          this.downloadLoading = false
        })
      })
    },
    /* 添加歌曲 */
    addMusic(row){
        this.add_music_form = {
        music_name: '',
        music_playid: 0,
        music_num: 2000,
        music_cron: '1',
        music_uid: row.id,
      }
      this.add_music_open = true
      this.add_music_title = '添加用户'+row.username+'播放歌曲'
    },
    addMusicCancel(){
      this.add_music_open = false
    },
    addMusicSubmitForm(){
      console.log(this.add_music_form)
      this.$refs['add_music_form'].validate(valid => {
        if (valid) {
            addMusicSingle(this.add_music_form).then(response => {
              if (response.code === 20000) {
                Message.success(response.msg)
                this.add_music_open = false
                this.getList()
              }
            })
        }
      })
    },

    flushAddPlaylistMusic(row){
        this.add_music_form = {
        music_name: 'https://music.163.com/#/playlist?id='+row.id,
        music_playid: 0,
        music_num: 2000,
        music_cron: '1',
        music_uid: this.music_uid_id,
      }
      this.add_music_open = true
      this.add_music_title = '添加用户'+this.music_uid_name+'播放歌曲'
    },
     /* 听歌排行 */
    musicRankRecord(row){
      this.music_rank = true
      this.music_rank_title = '用户'+row.username+'听歌排行'
      getMusicRank({ 'id': row.id }).then(
        response => {
          this.music_rank_list = response.data
        }
      )
    },
    musicRankCancel(){
      this.music_rank = false
    },
    
       /* 用户歌单信息 */
    musicUserPlaylist(row){
      this.music_uid_id = row.id
      this.music_uid_name = row.username
      this.music_user_playlist_open = true
      this.music_user_playlist_title = '用户'+row.username+'歌单信息'
      userPlaylist({ 'id': row.id }).then(
        response => {
          this.music_user_playlist = response.data
        }
      )
    },
    musicUserPlayCancel(){
      this.music_user_playlist_open = false
    },

    /* 二维码登录 */
    qrcodeAdd(){
      clearInterval(this.timer);
      this.timer = null;
      this.music_qrcode = true
      this.music_qrcode_title = '二维码登录'
      getMusicQrcode().then(
        response => {
          this.music_qrcode_list = response.data
        }
      )
      // 每隔5分钟定时刷新
      this.timer = setInterval(() => {
          const qrcode_key = this.music_qrcode_list.key
        checkMusicQrcode({"qrcode_key":qrcode_key}).then(
          response => {
            if (response.code === 20000) {
              if(response.data.code === 800){
                this.msgError("二维码已过期，请重新更换二维码")
                this.music_qrcode = false
                clearInterval(this.timer);
                this.getList()
              }
              if(response.data.code === 801){
                this.msgError("等待扫码")
              }
              if(response.data.code === 802){
                this.msgError("授权中")
              }  
              if(response.data.code === 803){
                this.msgSuccess("扫码成功")
                this.music_qrcode = false
                clearInterval(this.timer);
                this.getList()
              }  
            }
          }
        )
      }, 5000)
    },
    musicQrcodeCheck(){
      const qrcode_key = this.music_qrcode_list.key
      checkMusicQrcode({"qrcode_key":qrcode_key}).then(
        response => {
          if (response.code === 20000) {
            if(response.data.code === 800){
              this.msgError("二维码已过期，请重新更换二维码")
              this.music_qrcode = false
              this.getList()
            }
            if(response.data.code === 801){
              this.msgError("等待扫码")
            }
            if(response.data.code === 802){
              this.msgError("授权中")
            }  
            if(response.data.code === 803){
              this.msgSuccess("扫码成功")
              this.music_qrcode = false
              this.getList()
            }  
          }
        }
      )
    },
    musicQrcodeCancel(){
      this.music_qrcode = false
      clearInterval(this.timer);
      this.timer = null;
    },

 
}
}
</script>
<style lang="scss">
.spec-dialog .el-dialog__body {
  padding: 3px 30px;
  overflow-y: auto;
  height: calc(100vh - 140px); 
  height: 800px;
}
</style>