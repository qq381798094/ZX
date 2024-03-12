<template>
  <el-card class="card-box">
    <el-table :data="skuList" class="table-box" border>
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="80" />
      <!-- 名称 -->
      <el-table-column label="名称" prop="skuName" width="160" show-overflow-tooltip />
      <!-- 描述 -->
      <el-table-column label="描述" prop="skuDesc" width="200" show-overflow-tooltip />
      <!-- 默认图片 -->
      <el-table-column label="默认图片" width="200" align="center">
        <template #default="{ row }">
          <img class="default-img" :src="row.skuDefaultImg" />
        </template>
      </el-table-column>
      <!-- 重量 -->
      <el-table-column label="重量" prop="weight" width="120" align="center" />
      <!-- 价格 -->
      <el-table-column label="价格" prop="price" width="120" align="center" />
      <!-- 操作 -->
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            v-has="`btn.Sku.updown`"
            @click="handleSaleOption(row)"
            :icon="row.isSale === 1 ? Bottom : Top"
            :type="row.isSale === 1 ? 'info' : 'success'"
            size="small"
          />
          <el-button
            v-has="`btn.Sku.update`"
            @click="handleUpdateOption"
            :icon="Edit"
            type="primary"
            size="small"
          />
          <el-button
            v-has="`btn.Sku.detail`"
            @click="handleShowGoodsInfoDrawer(row)"
            :icon="InfoFilled"
            type="info"
            size="small"
          />
          <el-popconfirm
            @confirm="handleDeleteSkuGoods(row)"
            :title="`你确定要删除${row.skuName}吗？`"
            width="200"
          >
            <template #reference>
              <el-button v-has="`btn.Sku.remove`" :icon="Delete" type="danger" size="small" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      background
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="totalData"
      @current-change="fetchSkuListData"
      @size-change="handleSizeChange"
    />
    <!-- 抽屉 : 商品详情 -->
    <el-drawer v-model="drawerVisible">
      <!-- 标题 -->
      <template #header>
        <h4>商品详情</h4>
      </template>
      <!-- 正文内容 -->
      <template #default>
        <!-- 名称 -->
        <el-row class="row-content">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuGoodsInfo.skuName }}</el-col>
        </el-row>
        <!-- 描述 -->
        <el-row class="row-content">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuGoodsInfo.skuDesc }}</el-col>
        </el-row>
        <!-- 价格 -->
        <el-row class="row-content">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuGoodsInfo.price }}</el-col>
        </el-row>
        <!-- 平台属性 -->
        <el-row class="row-content">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag class="row-tag" v-for="attr in skuGoodsInfo.skuAttrValueList" :key="attr.id">
              {{ attr.attrName }}
            </el-tag>
          </el-col>
        </el-row>
        <!-- 销售属性 -->
        <el-row class="row-content">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              class="row-tag"
              v-for="sale in skuGoodsInfo.skuSaleAttrValueList"
              :key="sale.id"
              type="danger"
            >
              {{ sale.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <!-- 商品图片 -->
        <el-row class="row-content">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel type="card" height="100px" indicator-position="outside" :interval="5000">
              <el-carousel-item v-for="img in skuGoodsInfo.skuImageList" :key="img.id">
                <img class="carousel-img" :src="img.imgUrl" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** 接口引入 */
  import {
    requestSkuDataByPageAPI,
    requestCancelSaleSkuByIdAPI,
    requestOnSaleSkuByIdAPI,
    requestSkuInfoByIdAPI,
    requestDeleteSkuGoodsByIdAPI,
  } from '@/api/product/sku'
  /** 接口类型引入 */
  import {
    SkuListResponseData,
    SkuListDataRecordsItem,
    SkuGoodsInfoObject,
  } from '@/api/product/sku/type'
  /** EL 组件相关引入 */
  import { ElMessage, ElNotification } from 'element-plus'
  import { Bottom, Edit, InfoFilled, Delete, Top } from '@element-plus/icons-vue'

  /** 组件初次挂载完毕执行 */
  onMounted(async () => {
    try {
      // 获取数据
      await fetchSkuListData()
    } catch (e) {
      ElMessage.error('数据初始化失败')
    }
  })

  /**  SKU 列表数据相关 */
  const skuList = ref<SkuListDataRecordsItem[]>([])
  const skuGoodsInfo = ref<SkuGoodsInfoObject>({} as SkuGoodsInfoObject)

  // 列表操作按钮
  // 控制 SKU 商品上架 or 下架
  const handleSaleOption = async (item: SkuListDataRecordsItem) => {
    // isSale=1 : 上架 -> 下架
    if (item.isSale === 1) {
      try {
        await handleCancelSale(item.id)
        ElMessage.info(`成功下架商品${item.skuName}`)
      } catch (e) {
        ElMessage.error('操作失败')
      }
    } else {
      try {
        await handleOnSale(item.id)
        ElMessage.success(`成功上架商品${item.skuName}`)
      } catch (e) {
        ElMessage.error('操作失败')
      }
    }
    fetchSkuListData(pageNo.value)
  }
  // 更新 SKU 商品【施工中】
  const handleUpdateOption = () => {
    ElNotification({
      type: 'info',
      message: '当前功能正在施工中...请耐心等候',
      title: '温馨提示',
    })
  }
  // 查看商品详情 @click【抽屉效果】
  const handleShowGoodsInfoDrawer = async (item: SkuListDataRecordsItem) => {
    const { id } = item
    // 召唤抽屉
    drawerVisible.value = true
    try {
      // 请求详情数据
      skuGoodsInfo.value = await fetchSkuGoodsInfoData(id)
    } catch (e) {
      ElMessage.error('获取数据失败')
    }
  }
  // 删除 SKU 商品【行】
  const handleDeleteSkuGoods = async (item: SkuListDataRecordsItem) => {
    const { id } = item
    try {
      await handleDelSkuInfoById(id)
      // 提示
      ElMessage.success('成功删除该商品')
      // 重新获取数据列表 -> 若是最后一页的最后一条【也是第一条】数据被删除，则回跳到上一页
      await fetchSkuListData(skuList.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } catch (e) {
      ElMessage.error('操作失败')
    }
  }

  /** 抽屉【商品详情】相关 */
  const drawerVisible = ref<boolean>(false)

  /** 分页器相关 */
  const pageNo = ref<number>(1)
  const pageSize = ref<number>(10)
  const totalData = ref<number>(100)
  const handleSizeChange = () => {
    fetchSkuListData()
  }

  /** 数据请求相关 */
  // 获取 SKU 列表数据
  const fetchSkuListData = async (pager = 1) => {
    pageNo.value = pager
    const result: SkuListResponseData = await requestSkuDataByPageAPI(pageNo.value, pageSize.value)
    const { code, data } = result
    if (code === 200) {
      const { records, total } = data
      // 存储数据
      skuList.value = records
      totalData.value = total
      return data
    } else {
      return Promise.reject(new Error('数据请求失败'))
    }
  }
  // SKU 下架请求
  const handleCancelSale = async (skuId: number) => {
    const result = await requestCancelSaleSkuByIdAPI(skuId)
    const { code } = result
    if (code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // SKU 上架请求
  const handleOnSale = async (skuId: number) => {
    const result = await requestOnSaleSkuByIdAPI(skuId)
    const { code } = result
    if (code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 获取 SKU 某一个商品的商品详情
  const fetchSkuGoodsInfoData = async (skuId: number) => {
    const result = await requestSkuInfoByIdAPI(skuId)
    const { code, data } = result
    if (code === 200) {
      return data
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
  // 删除某个 SKU 商品
  const handleDelSkuInfoById = async (skuId: number) => {
    const result = await requestDeleteSkuGoodsByIdAPI(skuId)
    if (result.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  }
</script>
<script lang="ts">
  export default {
    name: 'SKU',
  }
</script>

<style scoped lang="scss">
  .card-box {
    // width: 100%;
  }
  .table-box {
    width: 100%;
    margin-bottom: 20px;
  }
  .default-img {
    width: 100px;
    height: 100px;
  }
  .row-content {
    margin-bottom: 30px;
    line-height: 25px;
    &:last-child {
      margin-bottom: none;
    }
  }
  .row-tag {
    margin-right: 8px;
    margin-bottom: 10px;
    &:last-child {
      margin-right: none;
    }
  }
  .carousel-img {
    width: 100%;
    height: 100%;
  }
  // 走马灯
  .el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>
