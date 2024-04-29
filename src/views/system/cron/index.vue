<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="用户名" prop="roleName">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入角色名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="roleKey">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item> -->
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
      </el-row>

      <el-table v-loading="loading" border :data="roleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="脚本编号" prop="id" width="120" />
        <el-table-column label="脚本名称" prop="name" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="脚本描述" prop="descript" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="执行时间" prop="cron_time" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="cmd" prop="cmd" :show-overflow-tooltip="true" width="150" />
        <!-- <el-table-column label="主机ip" prop="host" width="100" /> -->
        <!-- <el-table-column label="user" prop="user" width="100" /> -->
        <!-- <el-table-column label="头像" prop="avatar" :show-overflow-tooltip="true" width="150" /> -->
        <!-- <el-table-column label="password" prop="password" width="100" /> -->
        <el-table-column label="是否启用" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="rsa_path" prop="rsa_path" width="100" /> -->
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

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="800px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="脚本名称" prop="name" style="width: 90%">
                <el-input v-model="form.name" placeholder="请输入脚本名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="脚本描述" prop="descript" style="width: 90%">
                <el-input v-model="form.descript" placeholder="请输入脚本描述" />
              </el-form-item>
            </el-col>
              <el-col :span="24">
              <el-form-item label="执行时间" prop="cron_time" style="width: 90%">
                <el-input v-model="form.cron_time" placeholder="请输入脚本命令" maxlength="250" />
                <span>秒 分 时 天 月 星期</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="脚本命令" prop="cmd" style="width: 90%">
                <el-input v-model="form.cmd" placeholder="请输入脚本命令" maxlength="250" />
              </el-form-item>
            </el-col>
             <!-- <el-col :span="24">
              <el-form-item label="主机host" prop="host" style="width: 90%">
                <el-input v-model="form.host" placeholder="请输入主机host" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="用户" prop="user" style="width: 90%">
                <el-input v-model="form.user" placeholder="请输入用户" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="密码" prop="password" style="width: 90%">
                <el-input v-model="form.password" placeholder="请输入密码" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="rsa路径" prop="rsa_path" style="width: 90%">
                <el-input v-model="form.rsa_path" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col> -->
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
import { listCron, delCron,getCronInfo, addCron, updateCron, changeCronIsActive } from '@/api/system/cron'
import { allRole } from '@/api/system/role'
import { formatJson } from '@/utils'
import { Message } from 'element-ui'
export default {
  name: 'Admin',
  data() {
    var validateModifyPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        if (this.changePasswordForm.password_confirm !== '') {
          this.$refs.changePasswordForm.validateField('password_confirm')
        }
        callback()
      }
    }
    var validateModifyPasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      dialogVisiblePassword: false, // 修改密码弹窗
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      isEdit: false,
      // 角色选择
      roleOptions: [],
      // 日期范围
      dateRange: [],
      changePasswordForm: { // 修改密码的form数据
        password: '',
        password_confirm: ''
      },
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
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        role_id: [
          { required: true, message: '请选择用户角色', trigger: 'blur' }
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
      modifyPassWordRules: {
        password: [
          { required: true, validator: validateModifyPassword, trigger: 'blur' }
        ],
        password_confirm: [
          { required: true, validator: validateModifyPasswordConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getAllRole()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listCron(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.data.list
          this.total = response.data.pages.total
          this.queryParams.page = response.data.pages.current_page
          this.queryParams.page_size = response.data.pages.per_page
          this.loading = false
        }
      )
    },
    /** 获取角色选项 */
    getAllRole() {
      allRole().then(response => {
        this.roleOptions = response.data
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      console.log(row)
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.name + '"脚本吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeCronIsActive(row.id, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === 0 ? 1 : 0
      })
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
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        id: undefined,
        cron_id: undefined,
        name: '',
        cmd: '',
        user: '',
        password: '0',
        rsa_path: '',
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加角色'
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.open = true
      this.title = '修改脚本'
      this.isEdit = true
      const admin_id = row.id || this.ids
      getCronInfo(admin_id).then(response => {
        this.form = response.data
        this.form.admin_id = admin_id
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateCron(this.form).then(response => {
              if (response.code === 20000) {
                Message.success(response.msg)
                this.open = false
                this.getList()
              } else {
                Message.error(response.msg)
              }
            })
          } else {
            addCron(this.form).then(response => {
              if (response.code === 20000) {
                Message.success(response.msg)
                this.open = false
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
        return delCron(admin_ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 重置密码按钮操作 */
    // 点击修改密码
    handleClick(id) {
      this.loading = true
      this.admin_id = id
      this.dialogVisiblePassword = true
      this.loading = false
      this.changePasswordForm.password_confirm = ''
      this.changePasswordForm.password = ''
    },
    // 取消弹框
    closeDialog(formName) {
      this.dialogVisiblePassword = false
      this.dialogVisibleRole = false
      this.$refs[formName].resetFields()
    },
  }
}
</script>
