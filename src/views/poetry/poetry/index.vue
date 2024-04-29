<template>
  <div class="app-container" ref="appcontainer">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="标题" prop="poetry_title">
          <el-input
            v-model="queryParams.poetry_title"
            placeholder="请输入标题"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input
            v-model="queryParams.author"
            placeholder="请输入作者"
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
        <el-table-column label="标题" prop="poetry_title" align="center" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="作者" prop="author" align="center" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="朝代" prop="dynasty" align="center" width="75" />
        <el-table-column label="诗简介" prop="poetry_desc" align="center" :show-overflow-tooltip="true" />

        <!-- 48766  10848 -->
        <el-table-column label="更新时间" align="center" prop="create_time">
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
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleDetail(scope.row)"
          >详情</el-button>
            <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
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
      <el-dialog :title="title" :visible.sync="open"  :width="dialogWidth">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="标题" prop="poetry_title" style="width: 90%">
                <el-input v-model="form.poetry_title" placeholder="请输入标题名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="作者" style="width: 90%" prop="author_id">
                <el-select v-model="form.author_id" placeholder="请选择" style="width: 100%" filterable @input.native="handleInput" >
                  <el-option
                    v-for="item in AuthorOptions"
                    :key="item.id"
                    :label="item.author"
                    :value="item.id"
                    :disabled="item.poetry_type == 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="诗分类" style="width: 90%" prop="author_id">
                <el-select v-model="form.poetry_type" placeholder="请选择" style="width: 100%" @input="handlePoetryType" >
                  <el-option
                    v-for="item in poetry_type_arr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :span="24">
              <el-form-item label="诗标签" prop="label" style="width: 90%">
                <el-input v-model="form.label" placeholder="请输入诗标签" />
              </el-form-item>
            </el-col>
             <el-col :span="24">
              <el-form-item label="诗简介" prop="poetry_desc" style="width: 90%">
                <el-input v-model="form.poetry_desc"  type="textarea" placeholder="请输入诗简介" />
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
import { getPoetrylist, getPoetryInfo, addPoetry, updatePoetry,delPoetry } from '@/api/poetry/poetry'
import { listAuthor} from '@/api/poetry/author'

import { formatJson } from '@/utils'
import { Message } from 'element-ui'
export default {
  name: 'Admin',
  data() {
    return {
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' }
      ],
      
      poetry_type_arr: [
        { id: '1', name: '唐' },
        { id: '2', name: '宋' },
        { id: '3', name: '古诗' },
        { id: '4', name: '乐府' },
        { id: '5', name: '楚辞' },
        { id: '6', name: '诗经' },
        { id: '7', name: '小学' },
        { id: '8', name: '初中' },
        { id: '9', name: '高中' },
        { id: '10', name: '元词' },
        { id: '11', name: '明诗' },
        { id: '12', name: '清诗' },
        { id: '13', name: '近现代' },
      ],
      selectedOption: '',
      filteredOptions: [],
      // 遮罩层
      loading: true,
      dialogWidth:'500px', // 弹窗宽度
     
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
      AuthorOptions: [],
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
        author: undefined,
        id: undefined,
        status: undefined,
        poetry_title:undefined
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
        author: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
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
    this.getAllAuthor()
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
    handleInput(value) {
      console.log(value.data)
      this.getAllAuthor(value.data)
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true
      getPoetrylist(this.addDateRange(this.queryParams, this.dateRange)).then(
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
    getAllAuthor(val) {
       const author_param = {
        page: 1,
        page_size: 100,
        author: val,
      }
      listAuthor(author_param).then(response => {
        this.AuthorOptions = response.data.list
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
      this.form = {
        id: 0,
        poetry_title: '',
        poetry_desc: '',
        author_id: '',
        poetry_type: '',
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
      getPoetryInfo(id).then(response => {
        this.form = response.data
        this.form.id = id
      })
    },
        /** 详情跳转 */
    handleDetail(row) {
      this.title = '修改用户'
      const id = row.id || this.ids
      this.$router.push({
        path:'/poetry/poetry-detail',
        query: {
          id: id,
          name: row.poetry_title,
          author_id: row.author_id,
        }
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined && this.form.id !== 0) {
            updatePoetry(this.form).then(response => {
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
            addPoetry(this.form).then(response => {
              if (response.code === 20000) {
                Message.success(response.msg)
                this.open = false
                this.addShow = false
                this.getList()
              } else {
                Message.error(response.msg)
                return 
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
        return delPoetry(admin_ids)
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