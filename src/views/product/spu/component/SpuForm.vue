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
        <el-input v-model="spuParams.description" type="textarea" placeholder="请输入 SPU 的描述" />
      </el-form-item>
      <!-- SPU 照片 -->
      <el-form-item label="SPU 照片">
        <el-upload
          v-model:file-list="allSaleGoodsImgsList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :before-upload="handleBeforeUpload"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <!-- SPU 销售属性 -->
      <el-form-item label="SPU 销售属性">
        <!-- 展示销售属性的下拉菜单 -->
        <el-select
          v-model="selectedAttribute"
          :placeholder="
            unSelectedAttribute.length ? `还有${unSelectedAttribute.length}个属性未选择` : '无'
          "
        >
          <el-option
            v-for="item in unSelectedAttribute"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <!-- 添加销售属性按钮 -->
        <el-button
          @click="handleAddAttribute"
          :disabled="selectedAttribute ? false : true"
          class="add-sale-button"
          type="primary"
          :icon="Plus"
        >
          添加销售属性
        </el-button>
        <!-- 展示销售属性和属性值【表格】 -->
        <el-table class="table-box" :data="allSaleAttributesList" border>
          <el-table-column label="序号" type="index" width="100" align="center" />
          <el-table-column label="属性名" prop="saleAttrName" width="150" align="center" />
          <el-table-column label="属性值">
            <template #default="{ row, $index }">
              <el-tag
                class="tag-item"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                @close="handleRemoveTag(index, $index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 编辑模式切换 -->
              <el-button
                v-show="!row.flag"
                @click="handleChangeModel(row)"
                type="success"
                size="small"
                :icon="Plus"
              />
              <el-input
                class="model-input"
                v-model="row.attributeValue"
                v-show="row.flag"
                size="small"
                placeholder="请输入属性值"
                @blur="collectionAttributeValue(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template #default="{ $index }">
              <el-button
                @click="handleRemoveAttribute($index)"
                size="small"
                type="danger"
                :icon="Delete"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- SPU 操作按钮 -->
      <el-form-item>
        <el-button
          @click="saveForm"
          type="primary"
          :disabled="allSaleAttributesList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button @click="cancelForm">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 预览图片 -->
  <el-dialog v-model="dialogVisible">
    <img class="preview-img" w-full :src="dialogImgUrl" alt="预览图片" />
  </el-dialog>
</template>

<script setup lang="ts">
  /** API */
  import { ref, computed } from 'vue'
  /** EL 组件引入 */
  import { Plus, Delete } from '@element-plus/icons-vue'
  import { type UploadProps, ElMessage, ElNotification } from 'element-plus'
  /** 接口引入 */
  import {
    requestAllBrandDataAPI,
    requestSpuImgsByIdAPI,
    requestSpuSaleAttributesByIdAPI,
    requestAllSaleAttributeAPI,
    requestAddOrUpdateSpuDataAPI,
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
    TAddOrUpdateSpuResponseData,
  } from '@/api/product/spu/type'

  // 自定义事件
  const emits = defineEmits(['scene'])

  // 存储已有的 SPU 对象【父组件通过 initData() 传过来的】
  const spuParams = ref<IAddOrUpdateParams>({
    category3Id: undefined,
    spuName: '',
    description: '',
    tmId: undefined,
    spuImageList: [],
    spuSaleAttrList: [],
  })

  /** SPU 操作按钮数据 && 方法 */
  // 保存 button -> @click
  const saveForm = async () => {
    // 整理参数
    spuParams.value.spuImageList = allSaleGoodsImgsList.value.map((item: any) => {
      return {
        imgName: item.name,
        imgUrl: (item.response && item.response.data) || item.url,
      }
    })
    spuParams.value.spuSaleAttrList = allSaleAttributesList.value
    // 发送请求
    try {
      await updateSpuFormData(spuParams.value)
      ElMessage({
        type: 'success',
        message: spuParams.value.id ? '修改成功' : '添加成功',
      })
      // 跳转
      emits('scene', { status: spuParams.value.id ? 'update' : 'create' })
    } catch (e) {
      ElMessage({
        type: 'error',
        message: spuParams.value.id ? '更新出错' : '新增出错',
      })
    }
  }
  // 取消 button -> @click : 往父组件传一个事件
  const cancelForm = () => {
    emits('scene', { status: '' })
  }

  /** 上传图片相关 */
  const dialogImgUrl = ref<string>('') // 需要预览的图片路径
  const dialogVisible = ref<boolean>(false) // 控制预览图片对话框 显示|隐藏
  // 预览钩子
  const handlePictureCardPreview: UploadProps['onPreview'] = (file) => {
    // 预览图片
    dialogImgUrl.value = file.url!
    dialogVisible.value = true
  }
  // 上传文件之前的钩子
  const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type.includes('png' || 'gif' || 'jpeg')) {
      if (rawFile.size / 1024 / 1024 < 3) {
        return true
      } else {
        ElMessage({
          type: 'error',
          message: '上传文件过大，请重新上传',
        })
        return false
      }
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件类型有误，请重新上传',
      })
      return false
    }
  }

  /** SPU 销售属性相关 */
  // 计算出当前 SPU 剩余未赋值的销售属性
  const unSelectedAttribute = computed(() =>
    allAttributesList.value.filter((all) =>
      allSaleAttributesList.value.every((item) => all.name != item.saleAttrName),
    ),
  )
  // 绑定销售属性 select 数据
  const selectedAttribute = ref<number | undefined>(undefined)
  // 添加销售属性按钮 @click
  const handleAddAttribute = () => {
    // 根据传过来的 id 值去拿到数组里当前的属性数据
    let { id, name } = allAttributesList.value.find(
      (item) => item.id === selectedAttribute.value,
    ) as IAllSaleAttributeItem
    // 追加数组
    allSaleAttributesList.value.push({
      baseSaleAttrId: id,
      saleAttrName: name,
      spuSaleAttrValueList: [],
    })
    // 清空 select 值
    selectedAttribute.value = undefined
  }
  // tag 删除钩子
  const handleRemoveTag = (index: number, $index: number) => {
    allSaleAttributesList.value[$index].spuSaleAttrValueList.splice(index, 1)
    ElMessage({
      type: 'success',
      message: '删除属性值成功',
    })
  }
  // 表格每行的删除按钮
  const handleRemoveAttribute = ($index: number) => {
    allSaleAttributesList.value.splice($index, 1)
    ElMessage({
      type: 'success',
      message: '删除属性成功',
    })
  }

  /** SPU 销售属性 / 属性值相关 */
  // 添加 SPU 属性值按钮 ： @click
  const handleChangeModel = (row: ISpuSaleAttributeItem) => {
    // 模式切换： 只读(false) -> 编辑(true)
    row.flag = true
    // 设置其他行为只读
    allSaleAttributesList.value.forEach((item) => {
      if (item === row) {
        return
      }
      item.flag = false
    })
  }
  // 属性值 input 框失焦触发 ： @blur
  const collectionAttributeValue = (item: ISpuSaleAttributeItem) => {
    const { baseSaleAttrId, attributeValue } = item
    // 非法情况排除
    if (attributeValue!.trim() === '') {
      ElMessage({
        type: 'error',
        message: '新属性值内容不能为空!',
      })
      item.attributeValue = ''
      item.flag = false
      return
    }

    if (
      item.spuSaleAttrValueList.find((item) => item.saleAttrValueName === attributeValue!.trim())
    ) {
      ElMessage({
        type: 'error',
        message: '属性值不能和已有属性值名称相同!',
      })
      item.attributeValue = ''
      item.flag = false
      return
    }

    // 数组追加数据
    item.spuSaleAttrValueList.push({
      baseSaleAttrId,
      saleAttrValueName: attributeValue as string,
    })
    item.attributeValue = ''
    // 模式切换： 编辑 -> 只读
    item.flag = false
    // 提示
    ElMessage({
      type: 'success',
      message: '添加属性值成功',
    })
  }

  /** 此处集中存放 ： 获取当前组件所请求的初始化数据【数组】 */
  const allBrandList = ref<IAllBrandItem[]>([]) // 存放当前全部品牌数据
  const allSaleGoodsImgsList = ref<ISpuImageItem[]>([]) // 存放当前 SPU 的图片集
  const allSaleAttributesList = ref<ISpuSaleAttributeItem[]>([]) // 存放当前 SPU 的销售属性
  const allAttributesList = ref<IAllSaleAttributeItem[]>([]) // 存放全部的销售属性

  /** 需要暴露给父组件的方法 */
  // 【修改】初始化数据【父组件调用】
  const initData = async (item: IAddOrUpdateParams) => {
    try {
      // 将父组件传过来的 spu 数据先存储并展示
      spuParams.value = item
      // 获取全部品牌数据
      allBrandList.value = await fetchAllBrandData()
      // 获取某一个 SPU 下全部的售卖商品图片数据
      allSaleGoodsImgsList.value = await fetchAllSaleGoodsImgsDataById(item.id as number)
      // 获取某一个 SPU 下全部的销售属性数据
      allSaleAttributesList.value = await fetchAllSaleAttrDataById(item.id as number)
      // 获取整个项目全部的销售属性属性[颜色、版本、尺码]
      allAttributesList.value = await fetchAllAttrData()
    } catch (e) {
      ElNotification({
        type: 'error',
        message: '数据获取失败！',
        title: '提示',
      })
    }
  }
  // 【添加】初始化数据【父组件调用】
  const initAddData = async (category3Id: number) => {
    try {
      // 清空整个数据
      await Object.assign(spuParams.value, {
        category3Id,
        id: undefined,
        spuName: '',
        description: '',
        tmId: undefined,
        spuImageList: [],
        spuSaleAttrList: [],
      })
      allSaleGoodsImgsList.value = []
      allSaleAttributesList.value = []
      selectedAttribute.value = undefined
      // 获取全部品牌数据
      allBrandList.value = await fetchAllBrandData()
      // 获取整个项目全部的销售属性属性[颜色、版本、尺码]
      allAttributesList.value = await fetchAllAttrData()
    } catch (e) {
      ElMessage({
        type: 'error',
        message: '数据请求失败！',
      })
    }
  }

  // 对父组件暴露的数据 && 事件
  defineExpose({
    initData,
    initAddData,
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
      return result.data.map((item) => {
        return {
          name: item.imgName,
          url: item.imgUrl,
        }
      })
    } else {
      return Promise.reject(new Error('获取商品图片失败！'))
    }
  }
  // 获取某一个 SPU 下全部的销售属性数据
  const fetchAllSaleAttrDataById = async (id: number) => {
    const result: TSpuSaleAttributesResponseData = await requestSpuSaleAttributesByIdAPI(id)
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('获取销售属性失败！'))
    }
  }
  // 获取整个项目全部的销售属性属性[颜色、版本、尺码]
  const fetchAllAttrData = async () => {
    const result: TAllSaleAttributesResponseData = await requestAllSaleAttributeAPI()
    if (result.code === 200) {
      return result.data
    } else {
      return Promise.reject(new Error('获取所有销售属性数据失败！'))
    }
  }
  // 添加（新的） && 更新（一个）SPU 数据
  const updateSpuFormData = async (data: IAddOrUpdateParams) => {
    const result: TAddOrUpdateSpuResponseData = await requestAddOrUpdateSpuDataAPI(data)
    if (result.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
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
  // 预览图片
  .preview-img {
    width: 100%;
    height: 100%;
  }
  // 属性值 tag
  .tag-item {
    margin: 0 5px;
  }
  // 模式切换 input
  .model-input {
    width: 120px;
  }
</style>
