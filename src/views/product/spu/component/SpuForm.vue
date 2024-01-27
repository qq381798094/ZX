<template>
  <el-card class="card-box">
    <el-form label-width="100">
      <!-- SPU 名称 -->
      <el-form-item label="SPU 名称">
        <el-input placeholder="请输入 SPU 名称" />
      </el-form-item>
      <!-- SPU 品牌 -->
      <el-form-item label="SPU 品牌">
        <el-select>
          <el-option label="测试数据" value="test" />
        </el-select>
      </el-form-item>
      <!-- SPU 描述 -->
      <el-form-item label="SPU 描述">
        <el-input type="textarea" placeholder="请输入 SPU 的描述" />
      </el-form-item>
      <!-- SPU 照片 -->
      <el-form-item label="SPU 照片">
        <el-upload
          v-model:file-list="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <!-- SPU 销售属性 -->
      <el-form-item label="SPU 销售属性">
        <!-- 展示销售属性的下拉菜单 -->
        <el-select>
          <el-option label="测试数据" value="test" />
        </el-select>
        <!-- 添加销售属性按钮 -->
        <el-button class="add-sale-button" type="primary" :icon="Plus">
          添加销售属性
        </el-button>
        <!-- 展示销售属性和属性值【表格】 -->
        <el-table class="table-box" border>
          <el-table-column
            label="序号"
            type="index"
            width="100"
            align="center"
          />
          <el-table-column label="属性名" width="150" align="center" />
          <el-table-column label="属性值" />
          <el-table-column label="操作" width="150" align="center">
            <template #="{ row, $index }">
              <el-button size="small" type="danger" :icon="Delete" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- SPU 操作按钮 -->
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancelForm">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
  /** EL 组件引入 */
  import { Plus, Delete } from '@element-plus/icons-vue'

  // 自定义事件
  const emits = defineEmits(['scene'])

  /** SPU 操作按钮数据 && 方法 */
  // 取消 button -> @click : 往父组件传一个事件
  const cancelForm = () => {
    emits('scene')
  }
</script>

<style scoped lang="scss">
  .card-box {
    margin: 20px 0;
  }
  //   添加销售属性按钮
  .add-sale-button {
    margin: 0 15px;
  }
  //   展示的表格
  .table-box {
    margin: 15px 0;
  }
</style>
