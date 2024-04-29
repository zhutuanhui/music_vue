<template>
  <div class="app-container" ref="appcontainer">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="stocks_id">
            <el-select v-model="queryParams.stocks_id" placeholder="请选择" style="width: 100%" @input="handlQueryName" clearable>
              <el-option clearable
                v-for="item in StocksDaily_type_name"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

         <el-form-item label="收支分类" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择" style="width: 100%" @input="handlequeryType" clearable >
              <el-option
                v-for="item in StocksDaily_type_arr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
         <el-form-item label="详情" prop="content">
          <el-input
            v-model="queryParams.content"
            placeholder="请输入详情"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

           <el-date-picker
      v-model="queryParams.beginTime"
      type="date"
       style="width: 150px;"
      placeholder="选择日期" value-format="yyyy-MM-dd">
    </el-date-picker>
    <el-date-picker
      v-model="queryParams.endTime"
      type="date"
       style="width: 150px;"
      placeholder="选择日期" value-format="yyyy-MM-dd">
    </el-date-picker>

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
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-money"
            size="mini"
          >金额</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" border :data="roleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" align="center" width="75"/>
        <el-table-column label="股票名" prop="stocks_name" align="center" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="股票id" prop="stocks_id" align="center" :show-overflow-tooltip="true" width="150" />
        <!-- <el-table-column label="现价" prop="money" align="center" :show-overflow-tooltip="true" width="150" /> -->
        <el-table-column prop="money" label="现价">
          <template scope="scope">
              <span v-if="scope.row.percent< 0" style="color: green">{{scope.row.money}}</span>
              <span v-else-if="scope.row.isPass==0">{{scope.row.money}}</span>
              <span v-else style="color: red">{{scope.row.money}}</span>
          </template>
      </el-table-column>
        <el-table-column label="最高价" prop="max_money" align="center" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="最低价" prop="min_money" align="center" :show-overflow-tooltip="true" width="150" />
        <!-- <el-table-column label="涨跌百分比" prop="percent" align="center" :show-overflow-tooltip="true" width="150"/> -->

        <el-table-column prop="percent" label="涨跌百分比">
          <template scope="scope">
              <span v-if="scope.row.percent< 0" style="color: green">{{scope.row.percent}}</span>
              <span v-else-if="scope.row.isPass==0">{{scope.row.percent}}</span>
              <span v-else style="color: red">{{scope.row.percent}}</span>
          </template>
      </el-table-column>
        <!-- <el-table-column label="详情" prop="content" align="center" :show-overflow-tooltip="true" /> -->

        <!-- 48766  10848 -->
        <el-table-column label="添加时间" align="center" prop="create_time">
          <template slot-scope="scope">
            <span>{{ scope.row.ctime }}</span>
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
              <el-form-item label="股票id" prop="stocks_id" style="width: 90%">
                <el-input v-model="form.stocks_id" placeholder="请输入账单名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="现价" prop="money" style="width: 90%">
                <el-input v-model="form.money" placeholder="请输入现价" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="最高价" prop="max_money" style="width: 90%">
                <el-input v-model="form.max_money" placeholder="请输入最高价" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="最低价" prop="min_money" style="width: 90%">
                <el-input v-model="form.min_money" placeholder="请输入最低价" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="涨跌百分比" prop="percent" style="width: 90%">
                <el-input v-model="form.percent" placeholder="请输入市值" />
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
import { getStockslist} from '@/api/stocks/stocks'
import { getStocksDailylist, getStocksDailyInfo, addStocksDaily, updateStocksDaily,delStocksDaily } from '@/api/stocks/daily'

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
       pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      //计算日期
      value1: "",
      value2: "",
      StocksDaily_type_arr: [
        { id: '1', name: '收入' },
        { id: '2', name: '支出' },
      ],
      StocksDaily_type_name: [
    
      ],
      selectedOption: '',
      incomeMoney: 0,
      payMoney: 0,
      totalMoney: 0,
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
        type: 0,
        content: "",
        name:"",
        beginTime:"",
        endTime:"",
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
    this.getAllStocks()
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
      // getStocksDailylist(this.addDateRange(this.queryParams, this.dateRange)).then(
      getStocksDailylist(this.queryParams).then(
        response => {
          this.roleList = response.data.list
          this.total = response.data.pages.total
          this.queryParams.page = response.data.pages.current_page
          this.queryParams.page_size = response.data.pages.per_page
          this.loading = false
        }
      )
    },

    /** 查询股票列表 */
    getAllStocks(val) {
       const author_param = {
        page: 1,
        page_size: 100,
      }
      getStockslist(author_param).then(response => {
        this.StocksDaily_type_name = response.data.list
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
        StocksDaily_title: '',
        StocksDaily_desc: '',
        author_id: '',
        StocksDaily_type: '',
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
      this.getStocksDailyMoney()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.queryParams.name = ''
      this.queryParams.content = ''
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
      this.title = '添加账单'
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
      getStocksDailyInfo(id).then(response => {
        this.form = response.data
        this.form.id = id
      })
    },
        /** 详情跳转 */
    handleDetail(row) {
      this.title = '修改用户'
      const id = row.id || this.ids
      this.$router.push({
        path:'/StocksDaily/StocksDaily-detail',
        query: {
          id: id,
          name: row.StocksDaily_title,
          author_id: row.author_id,
        }
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined && this.form.id !== 0) {
            updateStocksDaily(this.form).then(response => {
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
            addStocksDaily(this.form).then(response => {
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
        return delStocksDaily(admin_ids)
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
        this.downloadLoading =    
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