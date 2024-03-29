<template>
  <div>
    <el-card class="box-card">
      <!-- 顶部添加品牌按钮 -->
      <el-button
        v-has="`btn.Trademark.add`"
        @click="openChangeOrCreateBrand({})"
        type="primary"
        size="default"
        :icon="Plus"
      >
        添加品牌
      </el-button>
      <!-- 表格：展示已有品牌数据 -->
      <el-table :data="brandList" style="margin: 20px 0" border>
        <el-table-column type="index" label="序号" align="center" width="80" />
        <el-table-column prop="tmName" label="品牌名称" align="center" />
        <el-table-column label="品牌 Logo" align="center">
          <template #default="{ row }">
            <div class="brand-img">
              <img :src="row.logoUrl" alt="图片加载出错" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template #default="{ row }">
            <!-- 编辑 -->
            <el-button
              v-has="`btn.Trademark.update`"
              type="warning"
              :icon="Edit"
              size="small"
              @click="openChangeOrCreateBrand(row)"
            />
            <!-- 删除 -->
            <el-popconfirm
              :title="`您确定要删除${row.tmName}吗`"
              width="240"
              :icon="DeleteFilled"
              icon-color="#F56C6C"
              @confirm="deleteCurrentBrand(row)"
            >
              <template #reference>
                <el-button
                  v-has="`btn.Trademark.remove`"
                  type="danger"
                  :icon="Delete"
                  size="small"
                />
              </template>
            </el-popconfirm>
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
      <el-form style="width: 80%" ref="brandFormRef" :model="brandParams" :rules="rules">
        <el-form-item label="品牌名称" prop="tmName" label-width="100px">
          <el-input v-model="brandParams.tmName" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌 LOGO" prop="logoUrl" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleBrandImgSuccess"
            :before-upload="beforeBrandImgUpload"
          >
            <img v-if="brandParams.logoUrl" :src="brandParams.logoUrl" class="avatar" />
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
  </div>
</template>

<script setup lang="ts">
  /** EL 组件引入 */
  import { Delete, DeleteFilled, Edit, Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules, UploadProps } from 'element-plus'
  /** 接口引入 */
  import {
    requestGetHasBrandByPageAPI,
    requestAddOrUpdateBrandAPI,
    requestDeleteBrandByIdAPI,
  } from '@/api/product/brand'
  /** 类型引入 */
  import {
    TRecordsItem,
    IGetBrandResponseByPageData,
    TAddOrUpdateBrandParams,
  } from '@/api/product/brand/type'
  /** API 引入 */
  import { ref, onMounted, reactive, nextTick } from 'vue'

  /** 组件挂载后调用 */
  onMounted(() => {
    // 获得已有的品牌数据
    getHasBrandData()
  })

  /** 表单校验 数据 && 方法 */
  // 获取表单实例
  const brandFormRef = ref<FormInstance>()
  // 品牌名的自定义校验规则
  const tmNameValidator = (_rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
      callback()
    } else {
      callback(new Error('品牌名过短'))
    }
  }
  // 上传图片的自定义校验规则
  const logoUrlValidator = (_rule: any, value: any, callback: any) => {
    if (value) {
      callback()
    } else {
      callback(new Error('请上传品牌图片！'))
    }
  }
  // 表单规则校验对象
  const rules = reactive<FormRules<typeof brandParams>>({
    tmName: [{ required: true, trigger: 'blur', validator: tmNameValidator }],
    logoUrl: [{ required: true, validator: logoUrlValidator }],
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
  const openChangeOrCreateBrand = (item: TRecordsItem | any) => {
    // 清空曾收集的数据
    brandParams.id = undefined
    brandParams.tmName = ''
    brandParams.logoUrl = ''
    // 打开对话框
    dialogVisible.value = true
    if (Object.keys(item).length) {
      // 设置标题名
      dialogTitle.value = '修改界面'
      // 编辑修改需要设置初始值
      brandParams.id = item.id
      brandParams.tmName = item.tmName
      brandParams.logoUrl = item.logoUrl
    } else {
      // 设置标题名
      dialogTitle.value = '添加界面'
    }
    // 当 form 实例挂载后，清除掉上一次的校验结果【红色提示文字】
    nextTick(() => {
      brandFormRef.value?.clearValidate('tmName')
      brandFormRef.value?.clearValidate('logoUrl')
    })
  }
  // 对话框确定按钮的点击事件
  const dialogConfirm = async () => {
    try {
      // first: 进行一次表单验证
      await brandFormRef.value?.validate()
      // 调用请求接口方法：该方法返回的是一个 Promise
      await addOrUpdateBrandData(brandParams)
      // 先设置为隐藏对话框
      dialogVisible.value = false
      // 弹出对话框，告诉用户添加商品成功
      // 根据是否带有 id 值区分提示内容
      ElMessage({
        type: 'success',
        message: brandParams.id ? '已修改当前品牌' : '成功添加新品牌',
      })
      // 获取已有品牌数据
      getHasBrandData()
    } catch (error) {
      ElMessage({
        type: 'error',
        message: brandParams.id ? '修改品牌时出错，请稍后再试' : '当前添加品牌失败，请重新尝试',
      })
    }
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
    // 将返回数据保存到收集对象中
    brandParams.logoUrl = response.data
    // 并且清除图片验证的红色提示文字
    brandFormRef.value?.clearValidate('logoUrl')
  }

  /** 删除品牌的 数据 && 方法 */
  // 气泡提示框<确定>按钮回调事件
  const deleteCurrentBrand = async (item: TRecordsItem) => {
    try {
      // 调用请求删除品牌数据方法
      await deleteBrandByIdData(item.id as number)
      // 提示框
      ElMessage({
        type: 'success',
        message: '删除品牌成功',
      })
      // 再次获取数据
      getHasBrandData()
    } catch (error) {
      // 提示框
      ElMessage({
        type: 'error',
        message: '删除品牌失败',
      })
    }
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
    const result: IGetBrandResponseByPageData = await requestGetHasBrandByPageAPI({
      page: pageNo.value,
      limit: pageLimit.value,
    })
    if (result.code === 200) {
      // 存储数据
      brandList.value = result.data.records
      totalData.value = result.data.total
    }
  }

  // 请求添加&&修改品牌数据
  const addOrUpdateBrandData = async (data: TAddOrUpdateBrandParams) => {
    const result = await requestAddOrUpdateBrandAPI(data)
    if (result.code === 200) {
      // 添加成功
      return result.message
    } else {
      // 添加失败
      return Promise.reject(new Error(result.message))
    }
  }

  // 删除已有品牌数据
  const deleteBrandByIdData = async (id: number) => {
    const result = await requestDeleteBrandByIdAPI(id)
    if (result.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
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
