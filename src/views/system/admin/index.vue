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
        <el-table-column label="用户编号" prop="id" width="120" />
        <el-table-column label="用户昵称" prop="nickname" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="用户名" prop="username" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="手机号" prop="phone" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="邮箱" prop="email" width="100" />
        <!-- <el-table-column label="头像" prop="avatar" :show-overflow-tooltip="true" width="150" /> -->
        <el-table-column label="角色名称" prop="role_name" width="100" />
        <el-table-column label="是否启用" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_active"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否是超级管理员" prop="is_admin" width="100" />
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
            <el-button
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="handleClick(scope.row.id)"
            >修改密码</el-button>
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
            <el-col :span="12">
              <el-form-item label="用户名称" prop="username" style="width: 90%">
                <el-input v-model="form.username" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickname" style="width: 90%">
                <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phone" style="width: 90%">
                <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email" style="width: 90%">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色" style="width: 90%" prop="role_id">
                <el-select v-model="form.role_id" placeholder="请选择" style="width: 100%" @change="$forceUpdate()">
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.id"
                    :label="item.role_name"
                    :value="item.id"
                    :disabled="item.status == 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" style="width: 95%">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 密码修改 -->
      <el-dialog title="修改密码" :visible.sync="dialogVisiblePassword" width="420px">
        <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="modifyPassWordRules" label-width="93px">
          <el-form-item label="新密码" prop="password">
            <el-input v-model="changePasswordForm.password" type="password" placeholder="新密码" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="password_confirm">
            <el-input v-model="changePasswordForm.password_confirm" type="password" placeholder="再次输入新密码" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('changePasswordForm')">取 消</el-button>
          <el-button v-loading="loading" type="primary" @click="changePassword('changePasswordForm')">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { listAdmin, getAdminInfo, delAdmin, addAdmin, updateAdmin, updateAdminUserPassword, changeAdminIsActive } from '@/api/system/admin'
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
      listAdmin(this.addDateRange(this.queryParams, this.dateRange)).then(
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
      const text = row.is_active === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.username + '"用户名吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeAdminIsActive(row.id, row.is_active)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.is_active = row.is_active === 0 ? 1 : 0
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
        admin_id: undefined,
        roleId: undefined,
        role_id: undefined,
        username: '',
        phone: '',
        nickname: '',
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
      this.title = '修改角色'
      this.isEdit = true
      const admin_id = row.id || this.ids
      getAdminInfo(admin_id).then(response => {
        this.form = response.data
        this.form.admin_id = admin_id
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateAdmin(this.form).then(response => {
              if (response.code === 20000) {
                Message.success(response.msg)
                this.open = false
                this.getList()
              } else {
                Message.error(response.msg)
              }
            })
          } else {
            addAdmin(this.form).then(response => {
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
        return delAdmin(admin_ids)
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
    changePassword(formName) {
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePasswordForm.admin_id = this.admin_id
          updateAdminUserPassword(this.changePasswordForm).then(res => {
            if (res.code === 20000) {
              this.dialogVisiblePassword = false
              Message.success(res.msg)
            }
          })
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
      this.loading = false
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
