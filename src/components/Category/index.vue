<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select>
          <el-option label="模拟选项" value="first-option" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select>
          <el-option label="二级分类模拟" value="second-option" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select>
          <el-option label="三级分类模拟" value="third-option" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
