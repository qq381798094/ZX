<template>
  <el-card class="card-box">
    <el-form class="form-box" label-width="100">
      <!-- SKU 名称 -->
      <el-form-item label="SKU 名称">
        <el-input v-model="skuParam.skuName" placeholder="SKU 名称" />
      </el-form-item>
      <!-- 价格(元) -->
      <el-form-item label="价格(元)">
        <el-input v-model="skuParam.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <!-- 重量(克) -->
      <el-form-item label="重量(克)">
        <el-input v-model="skuParam.weight" placeholder="重量(克)" type="number" />
      </el-form-item>
      <!-- SKU 描述 -->
      <el-form-item label="SKU 描述">
        <el-input v-model="skuParam.skuDesc" type="textarea" placeholder="SKU 描述" />
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <el-form inline label-width="80">
          <el-form-item
            style="margin: 5px 0"
            :label="platform.attrName"
            v-for="platform in attributeList"
            :key="platform.id"
          >
            <el-select v-model="platform.attrAndValueId">
              <el-option
                :label="value.valueName"
                :value="`${value.attrId}:${value.id}`"
                v-for="value in platform.attrValueList"
                :key="value.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form inline label-width="80">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in saleAttributeList"
            :key="saleAttr.id"
          >
            <el-select v-model="saleAttr.saleAttrAndValueId">
              <el-option
                :label="value.saleAttrValueName"
                :value="`${saleAttr.id}:${value.id}`"
                v-for="value in saleAttr.spuSaleAttrValueList"
                :key="value.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片名称 -->
      <el-form-item label="图片名称">
        <el-table ref="tableRef" border :data="saleImgList">
          <!-- 选中框 -->
          <el-table-column type="selection" width="80" align="center" />
          <!-- 图片 -->
          <el-table-column label="图片" width="300" align="center">
            <template #default="{ row }">
              <img class="table-img" :src="row.imgUrl" />
            </template>
          </el-table-column>
          <!-- 名称 -->
          <el-table-column prop="imgName" label="名称" align="center" />
          <!-- 操作 -->
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button
                :type="row.selected ? 'success' : 'warning'"
                @click="settingDefaultImg(row)"
              >
                设置默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item>
        <el-button @click="saveParams" type="primary">保存</el-button>
        <el-button @click="cancelMainScene">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
  /** API */
  import { ref, reactive } from 'vue'
  /** 接口引入 */
  import { requestGetAttrInfoByCategoryIdData } from '@/api/product/attr'
  import {
    requestSpuSaleAttributesByIdAPI,
    requestSpuImgsByIdAPI,
    requestAddSkuDataAPI,
  } from '@/api/product/spu'
  /** 接口类型引入 */
  import type { TAttrResponseData, IAttrResponseDataItem } from '@/api/product/attr/type'
  import type {
    IRecordsItem,
    TSpuSaleAttributesResponseData,
    ISpuSaleAttributeItem,
    TSpuImagesResponseData,
    ISpuImageItem,
    SkuAddOrUpdateParams,
    TAddSkuResponseData,
  } from '@/api/product/spu/type'
  /** EL 组件引入 */
  import { ElMessage, ElTable } from 'element-plus'

  /** 定义往上抛出的自定义事件 */
  const emits = defineEmits(['scene'])

  /** 最外部的 Form 表单相关 */
  // 【保存】按钮 : @click
  const saveParams = async () => {
    // 收集销售属性和平台属性
    skuParam.skuAttrValueList = attributeList.value.map((item) => {
      if (item.attrAndValueId) {
        let [attrId, valueId] = item.attrAndValueId.split(':')
        return {
          attrId: Number(attrId),
          valueId: Number(valueId),
        }
      } else {
        return {
          attrId: undefined,
          valueId: undefined,
        }
      }
    })
    skuParam.skuSaleAttrValueList = saleAttributeList.value.map((item) => {
      if (item.saleAttrAndValueId) {
        let [saleAttrId, saleAttrValueId] = item.saleAttrAndValueId.split(':')
        return {
          saleAttrId: Number(saleAttrId),
          saleAttrValueId: Number(saleAttrValueId),
        }
      } else {
        return {
          saleAttrId: undefined,
          saleAttrValueId: undefined,
        }
      }
    })
    // 发送请求
    try {
      await addSkuData(skuParam)
      ElMessage.success('添加成功')
      // 切换场景
      emits('scene')
    } catch (e) {
      ElMessage.error('添加数据失败')
    }
  }
  // 【返回】操作按钮 : @click
  const cancelMainScene = () => {
    emits('scene')
  }

  /** 行内 table 相关 */
  const tableRef = ref<InstanceType<typeof ElTable>>()
  // 设置默认按钮 : @click
  const settingDefaultImg = (row: ISpuImageItem) => {
    // 设置操作按钮颜色
    saleImgList.value.forEach((item) => {
      if (!item.selected) {
        return
      } else {
        item.selected = false
      }
    })
    row.selected = true
    // 勾选
    tableRef.value?.clearSelection()
    tableRef.value?.toggleRowSelection(row, true)
    // 存储默认图片路径
    skuParam.skuDefaultImg = row.imgUrl!
  }

  // 收集 SKU 参数
  const skuParam = reactive<SkuAddOrUpdateParams>({
    category3Id: undefined,
    tmId: undefined,
    spuId: undefined,
    weight: '',
    skuName: '',
    skuDesc: '',
    skuDefaultImg: '',
    price: undefined,
    skuSaleAttrValueList: null,
    skuAttrValueList: null,
  })
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
    // 收集参数数据
    skuParam.category3Id = spu.category3Id
    skuParam.spuId = spu.id
    skuParam.tmId = spu.tmId
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
  // 追加一个新的 SKU 数据
  const addSkuData = async (data: SkuAddOrUpdateParams) => {
    const result: TAddSkuResponseData = await requestAddSkuDataAPI(data)
    if (result.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('添加失败'))
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
