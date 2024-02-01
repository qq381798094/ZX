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
        <el-form inline label-width="60">
          <!-- 手机一级 -->
          <el-form-item
            :label="platform.attrName"
            v-for="platform in attributeList"
            :key="platform.id"
          >
            <el-select>
              <el-option
                :label="value.valueName"
                :value="value.id"
                v-for="value in platform.attrValueList"
                :key="value.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form inline label-width="60">
          <!-- 颜色 -->
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in saleAttributeList"
            :key="saleAttr.id"
          >
            <el-select>
              <el-option
                :label="value.saleAttrValueName"
                :value="value.id"
                v-for="value in saleAttr.spuSaleAttrValueList"
                :key="value.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片名称 -->
      <el-form-item label="图片名称">
        <el-table border :data="saleImgList">
          <!-- 选中框 -->
          <el-table-column type="selection" width="80" align="center" />
          <!-- 图片 -->
          <el-table-column label="图片" width="300" align="center">
            <template #="{ row }">
              <img class="table-img" :src="row.imgUrl" />
            </template>
          </el-table-column>
          <!-- 名称 -->
          <el-table-column prop="imgName" label="名称" align="center" />
          <!-- 操作 -->
          <el-table-column label="操作" width="180" align="center">
            <template #="{ row }">
              <el-button type="warning">设置默认</el-button>
            </template>
          </el-table-column>
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
  /** API */
  import { ref } from 'vue'
  /** 接口引入 */
  import { requestGetAttrInfoByCategoryIdData } from '@/api/product/attr'
  import { requestSpuSaleAttributesByIdAPI, requestSpuImgsByIdAPI } from '@/api/product/spu'
  /** 接口类型引入 */
  import type { TAttrResponseData, IAttrResponseDataItem } from '@/api/product/attr/type'
  import type {
    IRecordsItem,
    TSpuSaleAttributesResponseData,
    ISpuSaleAttributeItem,
    TSpuImagesResponseData,
    ISpuImageItem,
  } from '@/api/product/spu/type'
  /** EL 组件引入 */
  import { ElMessage } from 'element-plus'

  /** 定义往上抛出的自定义事件 */
  const emits = defineEmits(['scene'])

  /** 最外部的 Form 表单相关 */
  // 【返回】操作按钮 : @click
  const cancelMainScene = () => {
    emits('scene')
  }

  // 集中存储初始化数据
  const attributeList = ref<IAttrResponseDataItem[]>([]) // 存储当前分类下已有的属性与属性值
  const saleAttributeList = ref<ISpuSaleAttributeItem[]>([]) // 存储某一个 SPU 下全部的销售属性数据
  const saleImgList = ref<ISpuImageItem[]>([]) // 存储某一个 SPU 下全部的售卖商品图片数据

  /** 对父组件暴露的相关数据 */
  // 初始化当前页面数据
  const initData = async (
    spu: IRecordsItem,
    c1Id: number | undefined,
    c2Id: number | undefined,
  ) => {
    try {
      // 获取分类下已有的属性与属性值
      attributeList.value = await fetchAttributeAndValueByCategory(c1Id!, c2Id!, spu.category3Id!)
      // 获取某一个 SPU 下全部的销售属性数据
      saleAttributeList.value = await fetchSpuSaleAttributeById(spu.id!)
      // 获取某一个 SPU 下全部的售卖商品图片数据
      saleImgList.value = await fetchSpuSaleImgsById(spu.id!)
    } catch (e) {
      ElMessage({
        type: 'error',
        message: '数据获取失败',
      })
    }
  }
  defineExpose({
    initData,
  })

  /** 数据请求相关 */
  // 获取分类下已有的属性与属性值
  const fetchAttributeAndValueByCategory = async (c1: number, c2: number, c3: number) => {
    const result: TAttrResponseData = await requestGetAttrInfoByCategoryIdData(c1, c2, c3)
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('分类属性数据获取失败'))
    }
  }
  // 获取某一个 SPU 下全部的销售属性数据
  const fetchSpuSaleAttributeById = async (spuId: number) => {
    const result: TSpuSaleAttributesResponseData = await requestSpuSaleAttributesByIdAPI(spuId)
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('销售属性获取失败'))
    }
  }
  // 获取某一个 SPU 下全部的售卖商品图片数据
  const fetchSpuSaleImgsById = async (spuId: number) => {
    const result: TSpuImagesResponseData = await requestSpuImgsByIdAPI(spuId)
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('图片数据获取失败'))
    }
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
  // 表单内部图片
  .table-img {
    width: 100px;
    height: 100px;
  }
</style>
