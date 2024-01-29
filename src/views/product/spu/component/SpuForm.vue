<template>
  <el-card class="card-box">
    <el-form label-width="100">
      <!-- SPU 名称 -->
      <el-form-item label="SPU 名称">
        <el-input v-model="spuParams.spuName" placeholder="请输入 SPU 名称" />
      </el-form-item>
      <!-- SPU 品牌 -->
      <el-form-item label="SPU 品牌">
        <el-select v-model="spuParams.tmId">
          <el-option
            v-for="brand in allBrandList"
            :key="brand.id"
            :label="brand.tmName"
            :value="brand.id"
          />
        </el-select>
      </el-form-item>
      <!-- SPU 描述 -->
      <el-form-item label="SPU 描述">
        <el-input
          v-model="spuParams.description"
          type="textarea"
          placeholder="请输入 SPU 的描述"
        />
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
  /** API */
  import { ref } from 'vue'
  /** EL 组件引入 */
  import { Plus, Delete } from '@element-plus/icons-vue'
  /** 接口引入 */
  import {
    requestAllBrandDataAPI,
    requestSpuImgsByIdAPI,
    requestSpuSaleAttributesByIdAPI,
    requestAllSaleAttributeAPI,
  } from '@/api/product/spu'
  /** 接口类型引入 */
  import type {
    IAllBrandItem,
    ISpuImageItem,
    ISpuSaleAttributeItem,
    IAllSaleAttributeItem,
    TAllBrandResponseData,
    TSpuImagesResponseData,
    TSpuSaleAttributesResponseData,
    TAllSaleAttributesResponseData,
    IAddOrUpdateParams,
  } from '@/api/product/spu/type'

  // 自定义事件
  const emits = defineEmits(['scene'])

  /** SPU 操作按钮数据 && 方法 */
  // 取消 button -> @click : 往父组件传一个事件
  const cancelForm = () => {
    emits('scene')
  }
  /** 此处集中存放 ： 获取当前组件所请求的初始化数据【数组】 */
  const allBrandList = ref<IAllBrandItem[]>([]) // 存放当前全部品牌数据
  const allSaleGoodsImgsList = ref<ISpuImageItem[]>([]) // 存放当前 SPU 的图片集
  const allSaleAttributesList = ref<ISpuSaleAttributeItem[]>([]) // 存放当前 SPU 的销售属性
  const allAttributesList = ref<IAllSaleAttributeItem[]>([]) // 存放全部的销售属性

  /** 需要暴露给父组件的方法 */
  // 存储已有的 SPU 对象【父组件传过来的】
  const spuParams = ref<IAddOrUpdateParams>({
    category3Id: undefined,
    spuName: '',
    description: '',
    tmId: undefined,
    spuImageList: [],
    spuSaleAttrList: [],
  })
  const initData = async (item: IAddOrUpdateParams) => {
    try {
      // 将父组件传过来的 spu 数据先存储并展示
      spuParams.value = item
      // 获取全部品牌数据
      allBrandList.value = await fetchAllBrandData()
      // 获取某一个 SPU 下全部的售卖商品图片数据
      allSaleGoodsImgsList.value = await fetchAllSaleGoodsImgsDataById(
        item.id as number,
      )
      // 获取某一个 SPU 下全部的销售属性数据
      allSaleAttributesList.value = await fetchAllSaleAttrDataById(
        item.id as number,
      )
      // 获取整个项目全部的销售属性属性[颜色、版本、尺码]
      allAttributesList.value = await fetchAllAttrData()
    } catch (e) {
      console.log(e)
    }
  }

  // 对父组件暴露的数据 && 事件
  defineExpose({
    initData,
  })

  /** 数据请求的方法归类 */
  // 获取全部品牌数据
  const fetchAllBrandData = async () => {
    const result: TAllBrandResponseData = await requestAllBrandDataAPI()
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('获取品牌数据失败！'))
    }
  }
  // 获取某一个 SPU 下全部的售卖商品图片数据
  const fetchAllSaleGoodsImgsDataById = async (id: number) => {
    const result: TSpuImagesResponseData = await requestSpuImgsByIdAPI(id)
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('获取商品图片失败！'))
    }
  }
  // 获取某一个 SPU 下全部的销售属性数据
  const fetchAllSaleAttrDataById = async (id: number) => {
    const result: TSpuSaleAttributesResponseData =
      await requestSpuSaleAttributesByIdAPI(id)
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('获取销售属性失败！'))
    }
  }
  // 获取整个项目全部的销售属性属性[颜色、版本、尺码]
  const fetchAllAttrData = async () => {
    const result: TAllSaleAttributesResponseData =
      await requestAllSaleAttributeAPI()
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('获取所有销售属性数据失败！'))
    }
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
