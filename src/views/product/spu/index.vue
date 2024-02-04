<template>
  <div>
    <!-- 三级分类结构 -->
    <CategoryCard :disabled="changeSpuScene" />
    <!-- 搜索结果展示平台卡片 -->
    <div v-show="changeSpuScene === 0">
      <el-card class="card-box">
        <!-- 添加 SPU 按钮 -->
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="categoryStore.thirdCategoryId ? false : true"
          @click="changeScene(false)"
        >
          添加 SPU
        </el-button>
        <!-- 表格结构 -->
        <el-table :data="spuList" class="table-box" border>
          <el-table-column label="序号" width="100" type="index" align="center" />
          <el-table-column
            show-overflow-tooltip
            label="SPU 名称"
            prop="spuName"
            width="200"
            align="center"
          />
          <el-table-column label="SPU 描述" show-overflow-tooltip prop="description" />
          <el-table-column label="操作" width="220" align="center">
            <template #default="{ row }">
              <el-button
                @click="changeSceneToSku(row)"
                size="small"
                type="primary"
                :icon="Plus"
                title="添加 SKU"
              />
              <el-button
                size="small"
                type="warning"
                :icon="Edit"
                title="修改 SPU"
                @click="changeScene(true, row)"
              />
              <el-button
                @click="findSkuData(row)"
                size="small"
                type="info"
                :icon="InfoFilled"
                title="查看 SKU 列表"
              />
              <el-popconfirm
                :title="`你确定要删除${row.spuName}吗？`"
                width="200px"
                @confirm="delCurrentData(row.id)"
              >
                <template #reference>
                  <el-button size="small" type="danger" :icon="Delete" title="删除当前 SPU" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="fetchSpuListDataByPage"
          :page-sizes="[3, 5, 7, 9]"
          background
          layout="prev, pager, next, jumper, -> ,sizes, total"
          :total="totalData"
        />
        <!-- 查看 SKU 数据对话框 -->
        <el-dialog v-model="skuDataVisible" title="SKU 列表">
          <el-table :data="skuDataList" border>
            <el-table-column prop="skuName" label="SKU 名称" align="center" />
            <el-table-column prop="price" label="SKU 价格" align="center" />
            <el-table-column prop="weight" label="SKU 重量" align="center" />
            <el-table-column label="SKU 图片" align="center">
              <template #default="scope">
                <img class="dialog-table-img" :src="scope.row.skuDefaultImg" />
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-card>
    </div>
    <!-- 添加 || 修改 SPU 数据平台卡片【组件】 -->
    <div v-show="changeSpuScene === 1">
      <SpuForm ref="spuRef" @scene="spuReturnScene" />
    </div>
    <!-- 添加 SKU 数据平台卡片【组件】 -->
    <div v-show="changeSpuScene === 2">
      <SkuForm ref="skuRef" @scene="skuReturnScene" />
    </div>
  </div>
</template>

<script setup lang="ts">
  /** API 引入 */
  import { ref, watch, onBeforeUnmount } from 'vue'
  /** 子组件引入 */
  import SkuForm from './component/SkuForm.vue'
  import SpuForm from './component/SpuForm.vue'
  /** EL 组件引入 */
  import { ElMessage } from 'element-plus'
  import { Plus, Edit, InfoFilled, Delete } from '@element-plus/icons-vue'
  /** 接口引入 */
  import {
    requestSpuDataByPageAPI,
    requestSkuDataByIdAPI,
    requestDelSpuDataByIdAPI,
  } from '@/api/product/spu'
  /** 接口类型约束引入 */
  import type {
    TGetSpuResponseData,
    IRecordsItem,
    FindSkuDataResponseData,
    FindSkuDataItem,
    ISpuResponseData,
  } from '@/api/product/spu/type'
  /** 仓库引入 */
  import useCategoryStore from '@/store/modules/category'

  /** 仓库实例化 */
  let categoryStore = useCategoryStore()

  /** 路由组件销毁时执行当前函数 */
  onBeforeUnmount(() => {
    // 清空仓库
    categoryStore.$reset()
  })

  /** 该 watch 监听仓库中的 category3Id */
  watch(
    () => categoryStore.thirdCategoryId,
    () => {
      // 清空数组
      spuList.value = []
      // 若 category3Id 没有值，则直接返回
      if (!categoryStore.thirdCategoryId) return
      // 有值则触发请求
      fetchSpuListDataByPage()
    },
  )

  /** 场景切换变量聚集地 */
  // 控制添加 || 展示 SPU 页面平台的切换 👇
  // 0 ： 展示 SPU 数据页面 || 1 ： 添加或修改 SPU 数据页面 || 2 : 添加 SKU 数据页面
  type Main = 0
  type Spu = 1
  type Sku = 2
  const changeSpuScene = ref<Main | Spu | Sku>(0)

  /**======展示 SPU 数据的页面平台====== */
  /* 分页器组件部分 数据 && 方法 */
  const pageNo = ref<number>(1) // 分页器默认页码
  const pageSize = ref<number>(3) // 每页展示多少张数据
  const totalData = ref<number>(50) // 数据总量
  // @size-change -> pageSize 改变时触发
  const handleSizeChange = () => {
    fetchSpuListDataByPage()
  }

  /** 关于 SPU 子组件 || SKU 子组件需要用到的属性值 && 回调方法 */
  // spu 子组件 button -> @click 回调 ： 切换回主场景
  type Status = 'create' | 'update' | ''
  const spuReturnScene = (params: { status: Status }) => {
    changeSpuScene.value = 0
    if (params.status == 'create') {
      fetchSpuListDataByPage()
    } else {
      fetchSpuListDataByPage(pageNo.value)
    }
  }
  // sku 子组件返回按钮 ： @click : 切换回主场景
  const skuReturnScene = () => {
    // 切换场景
    changeSpuScene.value = 0
  }

  /**======添加 SPU 数据的页面平台====== */
  const spuRef = ref() // spuForm 子组件实例
  // button -> @click 事件 ： 添加 || 编辑 SPU 数据
  const changeScene = (flag: boolean, item?: IRecordsItem) => {
    if (flag) {
      // 编辑状态
      spuRef.value.initData(item)
    } else {
      // 新增状态
      spuRef.value.initAddData(categoryStore.thirdCategoryId)
    }
    // 切换场景
    changeSpuScene.value = 1
  }
  // 删除 SPU 按钮 : @click
  const delCurrentData = async (spuId: number) => {
    try {
      await removeSpuDataById(spuId)
      ElMessage.success('成功删除 SPU 数据')
      // 重新获取
      await fetchSpuListDataByPage(pageNo.value)
    } catch (e) {
      ElMessage.error('删除失败')
    }
  }

  /**====== SKU 数据的页面平台====== */
  const skuRef = ref() // skuForm 子组件实例
  // 添加 SKU 按钮 ： @click ： 添加 SKU数据
  const changeSceneToSku = (item: IRecordsItem) => {
    const { firstCategoryId, secondCategoryId } = categoryStore
    // 初始化子组件数据
    skuRef.value.initData(item, firstCategoryId, secondCategoryId)
    // 场景切换
    changeSpuScene.value = 2
  }
  // 关于 SKU 展示对话框相关
  const skuDataVisible = ref<boolean>(false)
  // 查看 SKU 数据按钮 ： @click
  const skuDataList = ref<FindSkuDataItem[]>([])
  const findSkuData = async (item: IRecordsItem) => {
    // 打开对话框
    skuDataVisible.value = true
    // 请求发送
    try {
      skuDataList.value = await fetchSkuListDataById(item.id!)
    } catch (e) {
      ElMessage.error('数据获取失败')
    }
  }

  /**======数据请求方法合集====== */
  // 获取 SPU 的数据
  const spuList = ref<IRecordsItem[]>([])
  const fetchSpuListDataByPage = async (pager = 1) => {
    // 给页面赋默认值
    pageNo.value = pager
    const result: TGetSpuResponseData = await requestSpuDataByPageAPI(
      pageNo.value,
      pageSize.value,
      categoryStore.thirdCategoryId,
    )
    if (result.code === 200) {
      spuList.value = result.data.records
      totalData.value = result.data.total
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
  // 获取 SKU 的数据
  const fetchSkuListDataById = async (id: number) => {
    const result: FindSkuDataResponseData = await requestSkuDataByIdAPI(id)
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('数据请求失败'))
    }
  }
  // 删除当前 SPU 数据
  const removeSpuDataById = async (spuId: number) => {
    const result: ISpuResponseData<string | null> = await requestDelSpuDataByIdAPI(spuId)
    if (result.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('删除失败'))
    }
  }
</script>
<script lang="ts">
  export default {
    name: 'SPU',
  }
</script>

<style scoped lang="scss">
  // 卡片样式
  .card-box {
    margin: 20px 0;
  }
  // 表格样式
  .table-box {
    margin: 20px 0;
  }
  // SKU 展示表格图片
  .dialog-table-img {
    width: 100px;
    height: 100px;
  }
</style>
