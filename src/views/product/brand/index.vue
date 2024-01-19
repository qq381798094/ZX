<template>
  <el-card class="box-card">
    <!-- 顶部添加品牌按钮 -->
    <el-button
      type="primary"
      size="default"
      :icon="Plus"
      @click="openChangeOrCreateBrand('添加品牌')"
    >
      添加品牌
    </el-button>
    <!-- 表格：展示已有品牌数据 -->
    <el-table :data="brandList" style="margin: 20px 0" border>
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column prop="tmName" label="品牌名称" align="center" />
      <el-table-column label="品牌 Logo" align="center">
        <template #="{ row }">
          <div class="brand-img">
            <img :src="row.logoUrl" alt="图片加载出错" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品牌操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="warning"
            :icon="Edit"
            size="small"
            @click="openChangeOrCreateBrand('修改品牌')"
          />
          <el-button type="danger" :icon="Delete" size="small" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
      v-model:current-page="pageNo"
      v-model:page-size="pageLimit"
      :page-sizes="[3, 5, 7, 9]"
      background
      layout="prev, pager, next, jumper, -> ,sizes, total"
      :total="totalData"
    />
  </el-card>

  <!-- 添加 && 修改品牌数据时弹出该对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <!-- 中间内容区域 -->
    <el-form style="width: 80%">
      <el-form-item label="品牌名称" label-width="90px">
        <el-input v-model="brandParams.tmName" placeholder="请输入品牌名称" />
      </el-form-item>
      <el-form-item label="品牌 LOGO" label-width="90px">
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleBrandImgSuccess"
          :before-upload="beforeBrandImgUpload"
        >
          <img
            v-if="brandParams.logoUrl"
            :src="brandParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 底部按钮部分 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  /** EL 组件引入 */
  import { Delete, Edit, Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { UploadProps } from 'element-plus'
  /** 接口引入 */
  import { requestGetHasBrandByPageAPI } from '@/api/product/brand'
  /** 类型引入 */
  import {
    TRecordsItem,
    IGetBrandResponseByPageData,
    TAddOrUpdateBrandParams,
  } from '@/api/product/brand/type'
  /** API 引入 */
  import { ref, onMounted, reactive } from 'vue'

  /** 组件挂载后调用 */
  onMounted(() => {
    // 获得已有的品牌数据
    getHasBrandData()
  })

  /** 添加 && 修改品牌数据对话框的数据 && 方法 */
  // 收集新增品牌的数据
  let brandParams = reactive<TAddOrUpdateBrandParams>({
    tmName: '',
    logoUrl: '',
  })
  // 控制对话框显示与隐藏
  let dialogVisible = ref<boolean>(false)
  // 控制对话框的标题内容
  let dialogTitle = ref<string>('')
  // 添加以及编辑现有品牌的按钮点击事件
  const openChangeOrCreateBrand = (title: string) => {
    dialogTitle.value = title
    dialogVisible.value = true
  }
  // 对话框确定按钮的点击事件
  const dialogConfirm = () => {
    // 先设置为隐藏对话框
    dialogVisible.value = false
  }
  // 上传组件：-> 图片上传之前的钩子
  // 方法目的：用于对文件进行过筛，筛选掉非图片类型以及 > 4M 的文件
  const beforeBrandImgUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // 对上传文件的类型先过一遍筛
    if (rawFile.type.includes('png' || 'gif' || 'jpeg')) {
      // 则表示为允许通过的文件类型
      // 再过一遍筛：若是文件 > 4M，则拒绝上传
      if (rawFile.size / 1024 / 1024 <= 4) {
        return true
      } else {
        ElMessage({
          type: 'error',
          message: '上传的文件过大，请压缩后再上传',
        })
        return false
      }
    } else {
      // 则为其他类型文件，表示不通过
      ElMessage({
        type: 'error',
        message: '上传文件类型错误，请重新上传',
      })
      return false
    }
  }
  // 上传组件： -> 图片上传成功后的钩子
  // 方法目的： 将返回的上传成功的图片路径保存到变量中
  const handleBrandImgSuccess: UploadProps['onSuccess'] = (response) => {
    brandParams.logoUrl = response.data
  }

  /** 分页器组件数据&&方法 */
  // 当前页码
  const pageNo = ref<number>(1)
  // 每页显示数据的条数
  const pageLimit = ref<number>(3)
  // 数据总条数
  const totalData = ref<number>(0)
  // page-size 更改时触发
  const pageSizeChange = () => {
    pageNo.value = 1
    // 重新获取一次页面数据
    getHasBrandData()
  }
  // current-page 更改时触发
  const currentPageChange = () => {
    // 重新获取一次页面数据
    getHasBrandData()
  }

  /** 数据请求方法 */
  // 请求已有的品牌数据【需要 page && limit 】
  const brandList = ref<TRecordsItem[]>([]) // 存储列表数据
  const getHasBrandData = async () => {
    const result: IGetBrandResponseByPageData =
      await requestGetHasBrandByPageAPI({
        page: pageNo.value,
        limit: pageLimit.value,
      })
    if (result.code === 200) {
      // 存储数据
      brandList.value = result.data.records
      totalData.value = result.data.total
    }
  }
</script>
<script lang="ts">
  export default {
    name: 'Brand',
  }
</script>

<style scoped lang="scss">
  // 品牌列表图片
  .brand-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    margin: 0 auto;

    > img {
      width: 100%;
      height: 100%;
    }
  }
  // 上传
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
