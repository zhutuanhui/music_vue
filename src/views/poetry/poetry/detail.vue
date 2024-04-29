<template>
  <div class="app-container">
    <div v-if="author">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :author="author" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="诗基础信息" name="activity">
                <activity :poetry="poetry" />
              </el-tab-pane>
              <el-tab-pane label="修改" name="account">
                <account :poetry="poetry" />
              </el-tab-pane>
              <el-tab-pane label="修改日志" name="timeline">
                <timeline />
              </el-tab-pane>
              
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import {  getPoetryInfo } from '@/api/poetry/poetry'
import {  getAuthorInfo } from '@/api/poetry/author'
export default {
  name: 'PoetryDetail',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      activeTab: 'activity',
      id:'',
      author_id:'',
      name:'',
      poetry:{},
      author:{},
      
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'roles'
    ])
  },
  created() {
    this.id = this.$route.query.id
    this.name = this.$route.query.name
    this.author_id = this.$route.query.author_id
    this.getAuthor(this.author_id)
    this.getPoetry(this.id)
  },
  methods: {
  
    getPoetry(id) {
      getPoetryInfo(id).then(response => {
        this.poetry = response.data
        this.author_id = response.data.author_id
        console.log(this.author_id)
      })
    },
    getAuthor(id) {
       getAuthorInfo(id).then(response => {
        this.author = response.data
this.author.img = 'https://wpimg.wallstcn.com/57ed425a-c71e-4201-9428-68760c0537c4.jpg'
      })
    }
  }
}
</script>
