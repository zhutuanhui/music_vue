<template>
  <div class="app-container" ref="appcontainer">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="用户ID" prop="uid">
          <el-input
            v-model="queryParams.uid"
            placeholder="请输入用户id"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="时长" prop="music_time">
          <el-input
            v-model="queryParams.music_time"
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
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="Time"
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
        <el-table-column label="ID" prop="id" width="120" />
        <el-table-column label="用户id" prop="uid" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="时长" prop="music_time" align="" width="100" />
        <el-table-column label="添加时时长" prop="total_time" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="更新后时长" prop="play_total_time" width="100" />
        <el-table-column label="执行次数" prop="music_num" width="100" />
        <el-table-column label="是否执行" prop="music_cron" width="100" >
          <template slot-scope="scope" >
            <span v-if="scope.row.music_cron=='1'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="是否完成" prop="is_exec" width="100" >
          <template slot-scope="scope" >
            <span v-if="scope.row.is_exec=='1'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="create_time" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.ctime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="create_time" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.mtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
      <el-dialog :title="title" :visible.sync="open" :width="dialogWidth">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户id" prop="uid" style="width: 90%">
                <el-input v-model="form.uid" placeholder="请输入用户ID" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="听歌时长" prop="music_time" style="width: 90%">
                <el-input v-model="form.music_time" placeholder="请输入听歌时长 单位小时" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="执行脚本" prop="music_cron">
              <el-radio-group v-model="form.music_cron">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行完成" prop="is_exec">
              <el-radio-group v-model="form.is_exec">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { listMusicTime, getMusicTimeInfo, delMusicTime, addMusicTime, updateMusicTime } from '@/api/music/listen'
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
      // 非单个禁用
      Time: true,
      // 非多个禁用
      multiple: true,
      dialogWidth:'500px', // 弹窗宽度
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      add_music_title: '',
      // 是否显示弹出层
      open: false,
      add_music_open: false,
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
        phone: undefined,
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
        music_name: [
          { required: true, message: '歌曲链接不能为空', trigger: 'blur' }
        ],
        music_uid: [
          { required: true, message: '用户id不能为空', trigger: 'blur' },
          {
            pattern: /^\d+$/,
            message: '请输入正确的用户id',
            trigger: 'blur'
          }
        ]
      },
    }
  },
  created() {
    this.getList()
  },
 
  updated(){
    this.setWidths()
  },
  methods: {
    setWidths(){
      const myDivWidth = this.$refs.appcontainer.clientWidth;
      if(myDivWidth < 500){
        this.dialogWidth = "95% !important"
      }
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listMusicTime(this.addDateRange(this.queryParams, this.dateRange)).then(
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
        music_time: 100,
        music_cron: "1",
        is_exec: "0",
        uid: 0,
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
      this.queryParams.phone = ''
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.Time = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.addShow = true
      this.editShow = false
      this.open = true
      this.title = '添加用户'
      this.isEdit = false
      // const myDivWidth = this.$refs.appcontainer.clientWidth;
      // if(myDivWidth < 500){
      //   this.dialogWidth = "95% !important"
      // }
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
      getMusicTimeInfo(id).then(response => {
        this.form = response.data
        this.form.id = id
        this.form.music_cron = this.form.music_cron.toString()
        this.form.is_exec = this.form.is_exec.toString()
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined && this.form.id !== 0) {
            updateMusicTime(this.form).then(response => {
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
            addMusicTime(this.form).then(response => {
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
      const ids = row.id || this.ids
      this.$confirm('是否确认删除角色编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMusicTime(ids)
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
    }
  }
}
</script>