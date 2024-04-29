<template>
  <el-form>
    <el-form-item label="标题">
      <el-input v-model.trim="poetry.poetry_title" />
    </el-form-item>
    <el-form-item label="诗简介" prop="poetry_desc" style="margin-bottom: 30px;">
        <el-input v-model="poetry.poetry_desc"  type="textarea" placeholder="请输入诗简介" />
    </el-form-item>
    <el-form-item label="诗内容"></el-form-item>
    <el-form-item label="内容" prop="poetry.content" style="margin-bottom: 30px;">
        <Tinymce ref="editor"  v-model="poetry.content" :height="200" />
    </el-form-item>

    <el-form-item label="拼音内容"></el-form-item>
    <el-form-item label="拼音内容" prop="poetry.pin_content" style="margin-bottom: 30px;">
        <Tinymce ref="editor"  v-model="poetry.pin_content" :height="200" />
    </el-form-item>

    <el-form-item label="译文"> </el-form-item>
    <el-form-item label="译文" prop="poetry.yiwen" style="margin-bottom: 30px;">
        <Tinymce ref="editor"  v-model="poetry.yiwen" :height="200" />
    </el-form-item>

    <el-form-item label="注释"></el-form-item>
    <el-form-item label="注释" prop="poetry.zhushi" style="margin-bottom: 30px;">
        <Tinymce ref="editor"  v-model="poetry.zhushi" :height="200" />
    </el-form-item>

    <el-form-item label="赏析"></el-form-item>
    <el-form-item label="赏析" prop="poetry.shangxi" style="margin-bottom: 30px;">
        <Tinymce ref="editor"  v-model="poetry.shangxi" :height="200" />
    </el-form-item>
    <el-form-item label="创作背景"></el-form-item>
    <el-form-item label="创作背景" prop="poetry.create_background" style="margin-bottom: 30px;">
        <Tinymce ref="editor"  v-model="poetry.create_background" :height="200" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { updatePoetry } from '@/api/poetry/poetry'
import '@/assets/tinymce/css/prism.css'
import '@/assets/tinymce/css/content.min.css'
import '@/assets/tinymce/css/skin.min.css'
export default {
  components: { Tinymce },
  props: {
    poetry: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    submit() {
      console.log(this.poetry)
      updatePoetry(this.poetry).then(response => {
          if (response.code === 20000) {
              this.$message({
              message: '修改成功',
              type: 'success',
              duration: 5 * 1000
            })
          } else {
            Message.error(response.msg)
          }
        })
    }
  }
}
</script>
