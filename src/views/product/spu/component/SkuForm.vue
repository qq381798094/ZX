<template>
  <el-card class="card-box">
    <el-form class="form-box" label-width="100">
      <!-- SKU 名称 -->
      <el-form-item label="SKU 名称">
        <el-input placeholder="SKU 名称" />
      </el-form-item>
      <!-- 价格(元) -->
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" />
      </el-form-item>
      <!-- 重量(克) -->
      <el-form-item label="重量(克)">
        <el-input placeholder="重量(克)" type="number" />
      </el-form-item>
      <!-- SKU 描述 -->
      <el-form-item label="SKU 描述">
        <el-input type="textarea" placeholder="SKU 描述" />
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <el-form inline>
          <!-- 手机一级 -->
          <el-form-item label="手机一级">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
          <!-- 电池容量 -->
          <el-form-item label="电池容量">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
          <!-- 运行内存 -->
          <el-form-item label="运行内存">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
          <!-- 机身内存 -->
          <el-form-item label="机身内存">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
          <!-- CPU型号 -->
          <el-form-item label="CPU型号">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
          <!-- 屏幕尺寸 -->
          <el-form-item label="屏幕尺寸">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form inline>
          <!-- 颜色 -->
          <el-form-item label="颜色">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
          <!-- 版本 -->
          <el-form-item label="版本">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
          <!-- 尺寸 -->
          <el-form-item label="尺寸">
            <el-select>
              <el-option label="测试数据" value="test" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片名称 -->
      <el-form-item label="图片名称">
        <el-table border>
          <!-- 选中框 -->
          <el-table-column type="selection" width="80" align="center" />
          <!-- 图片 -->
          <el-table-column label="图片" width="300" align="center" />
          <!-- 名称 -->
          <el-table-column label="名称" align="center" />
          <!-- 操作 -->
          <el-table-column label="操作" width="180" align="center"></el-table-column>
        </el-table>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancelMainScene">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
  /** 定义往上抛出的自定义事件 */
  const emits = defineEmits(['scene'])

  /** 最外部的 Form 表单相关 */
  // 【返回】操作按钮 : @click
  const cancelMainScene = () => {
    emits('scene')
  }
</script>

<style scoped lang="scss">
  .card-box {
    margin: 20px 0;
  }
  // 表单
  .form-box {
    margin: 0 10px;
  }
</style>
