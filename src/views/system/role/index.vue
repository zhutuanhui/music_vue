<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
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
        <el-table-column label="角色编号" prop="id" width="120" />
        <el-table-column label="角色名称" prop="role_name" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="角色描述" prop="role_desc" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="显示顺序" prop="roleSort" width="100" />
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="create_time" width="180">
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

      <!-- 添加或修改角色配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="form.role_name" placeholder="请输入角色名称" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="权限字符" prop="role_desc">
            <el-input v-model="form.role_key" placeholder="请输入权限字符" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="角色顺序" prop="role_sort">
            <el-input-number v-model="form.role_sort" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree
              ref="menu"
              :data="menuOptions"
              show-checkbox
              node-key="id"
              empty-text="加载中，请稍后"
              :props="defaultProps"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.role_desc" type="textarea" placeholder="请输入内容" />
          </el-form-item>
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
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus } from '@/api/system/role'
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/system/menu'
import { formatJson } from '@/utils'
import { Message } from 'element-ui'
export default {
  name: 'Role',
  data() {
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
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 20,
        roleName: undefined,
        roleKey: undefined,
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
        role_name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        role_key: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        role_sort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
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
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.data.list
          this.total = response.data.pages.total
          this.queryParams.page = response.data.pages.current_page
          this.queryParams.page_size = response.data.pages.per_page
          this.loading = false
        }
      )
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      const checkedKeys = this.$refs.dept.getCheckedKeys()
      // 半选中的部门节点
      // const halfCheckedKeys = this.$refs.dept.getCheckedKeys()
      // checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.data.menus
        this.$nextTick(() => {
          this.$refs.menu.setCheckedKeys(response.data.checkedKeys)
        })
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.roleId, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
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
        roleId: undefined,
        role_id: undefined,
        roleName: undefined,
        roleKey: undefined,
        role_sort: 0,
        status: '0',
        menuIds: [],
        routers: [],
        deptIds: [],
        remark: undefined
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
      this.getMenuTreeselect()
      this.open = true
      this.title = '添加角色'
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.id || this.ids
      getRole(roleId).then(response => {
        this.form = response.data
        this.form.role_id = roleId
        this.open = true
        this.title = '修改角色'
        this.isEdit = true
        this.getRoleMenuTreeselect(roleId)
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            this.form.routers = this.getMenuAllCheckedKeys()
            updateRole(this.form).then(response => {
              if (response.code === 20000) {
                Message.success(response.msg)
                this.open = false
                this.getList()
              } else {
                Message.error(response.msg)
              }
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            this.form.routers = this.getMenuAllCheckedKeys()
            addRole(this.form).then(response => {
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
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId !== undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys()
        dataScope(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.openDataScope = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      const roleIds = row.id || this.ids
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
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
