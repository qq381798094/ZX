<template>
  <div>
    <!-- 三级分类全局组件 -->
    <CategoryCard :disabled="isAddAttribute" />
    <!-- 搜索结果展示平台卡片 -->
    <!-- 展示属性与属性值的卡片页面 -->
    <div v-show="!isAddAttribute">
      <el-card class="result-card">
        <!-- 添加平台属性按钮 -->
        <el-button
          :icon="Plus"
          type="primary"
          :disabled="categoryStore.thirdCategoryId ? false : true"
          @click="handleAddAttribute"
        >
          添加平台属性
        </el-button>
        <!-- 表格 -->
        <el-table :data="attributeList" border stripe class="table-box">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="100px"
          />
          <el-table-column
            label="属性名称"
            align="center"
            prop="attrName"
            width="140px"
          />
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <!-- 属性值 -->
              <el-tag
                class="tag-box"
                v-for="tag in row.attrValueList"
                :key="tag.id"
              >
                {{ tag.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160px">
            <template #="{ row }">
              <!-- 编辑 -->
              <el-button type="warning" :icon="Edit" size="small" />
              <!-- 删除 -->
              <el-button type="danger" :icon="Delete" size="small" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 《添加属性 && 修改属性》表格页面 -->
    <div v-show="isAddAttribute">
      <el-card class="result-card">
        <!-- form表单 -->
        <el-form inline>
          <el-form-item label="属性名称">
            <el-input
              v-model="addAttributeParams.attrName"
              placeholder="请输入属性名称"
            />
          </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <el-button
          type="primary"
          :disabled="!addAttributeParams.attrName"
          :icon="Plus"
          @click="addAttributeClick"
        >
          添加属性值
        </el-button>
        <el-button @click="cancelAttributeShowCard">取消</el-button>

        <!-- table 表格 -->
        <el-table
          :data="addAttributeParams.attrValueList"
          border
          class="table-box"
        >
          <el-table-column
            label="序号"
            width="100px"
            type="index"
            align="center"
          />
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <!-- :ref -> 存储 input 的实例到 inputRefArr  -->
              <el-input
                :ref="(el: any) => (inputRefArr[$index] = el)"
                v-show="row.stateFlag"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="changeState(row, false, $index)"
              />
              <div
                @click="changeState(row, true, $index)"
                class="value-name"
                v-show="!row.stateFlag"
              >
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作" width="200px">
            <template #="{ row, $index }">
              <el-button
                :icon="Delete"
                @click="addAttributeParams.attrValueList.splice($index, 1)"
                type="danger"
                size="small"
              />
            </template>
          </el-table-column>
        </el-table>

        <!-- 表格操作按钮 -->
        <el-button
          type="primary"
          @click="handleSaveAttributeValue"
          :disabled="
            addAttributeParams.attrValueList.length == 0 ||
            addAttributeParams.attrValueList[0].valueName === ''
          "
        >
          保存
        </el-button>
        <el-button @click="cancelAttributeShowCard">取消</el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  /** API 引入 */
  import { ref, watch, reactive, nextTick } from 'vue'
  /** EL 组件引入 */
  import { Plus, Edit, Delete } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  /** 接口引入 */
  import {
    requestGetAttrInfoByCategoryIdData,
    requestPostAddOrUpdateAttrData,
  } from '@/api/product/attr'
  /** 接口类型引入 */
  import type {
    TAttrResponseData,
    IAttrResponseDataItem,
    IAttributeParams,
    TAddOrUpdateAttributeResponseData,
    IAttributeValueParams,
  } from '@/api/product/attr/type'
  /** 仓库引入 */
  import useCategoryStore from '@/store/modules/category'

  /** 仓库实例化 */
  let categoryStore = useCategoryStore()

  /** 该 watch 监听仓库中的 category3Id */
  watch(
    () => categoryStore.thirdCategoryId,
    () => {
      // 清空表格数组
      attributeList.value = []
      // 3Id 没有值，不做事
      if (!categoryStore.thirdCategoryId) return
      // 有值触发数据请求
      fetchAttributeListData()
    },
  )

  /** 添加平台属性操作相关 */
  // 控制显示的页面
  const isAddAttribute = ref<boolean>(false)
  // 添加平台属性按钮 -> @click ： 设置显示的 card 内容为添加属性值内容
  const handleAddAttribute = () => {
    // 清空需要收集属性的数据变量
    Object.assign(addAttributeParams, {
      attrName: '',
      attrValueList: [],
      categoryId: categoryStore.thirdCategoryId,
      categoryLevel: 3,
    })
    // 场景切换
    isAddAttribute.value = true
  }

  /** 添加属性值页面相关数据 && 方法 */
  // 收集新增属性的数据
  const addAttributeParams = reactive<IAttributeParams>({
    attrName: '',
    attrValueList: [],
    categoryId: undefined,
    categoryLevel: 3,
  })
  // 添加属性值按钮 -> @click ：表格新增数据行
  const addAttributeClick = () => {
    addAttributeParams.attrValueList.push({
      valueName: '',
      // true -> 编辑状态 || false -> 只读状态
      stateFlag: true,
    })
    // 获取最后的 input 实例将其标记为聚焦状态
    nextTick(() => {
      inputRefArr.value[addAttributeParams.attrValueList.length - 1].focus()
    })
  }
  // 保存属性值按钮 -> @click : 保存新添加的属性值数据
  const handleSaveAttributeValue = async () => {
    // 发起添加属性值请求
    try {
      await addOrUpdateAttributeValueData()
      // 场景切换 to -> 属性展示界面
      isAddAttribute.value = false
      // 弹出成功提示
      ElMessage({
        type: 'success',
        message: addAttributeParams.id ? '修改属性值成功' : '添加属性值成功',
      })
      // 再次获取属性数据
      await fetchAttributeListData()
    } catch (e) {
      // 弹出错误提示
      ElMessage({
        type: 'error',
        message: addAttributeParams.id
          ? '修改属性值有误，请重试'
          : '添加属性值有误，请重试',
      })
    }
  }
  // 返回按钮 -> @click ： 返回到属性展示页面
  const cancelAttributeShowCard = () => {
    isAddAttribute.value = false
  }

  /** 属性值界面交互集合 */
  // input -> @blur ： 将当前编辑状态设置为只读状态
  const changeState = (
    row: IAttributeValueParams,
    flag: boolean,
    $index: number,
  ) => {
    // 编辑状态 -> 只读状态
    if (!flag) {
      // 非法情况： 输入值为空时
      if (row.valueName.trim() === '') {
        addAttributeParams.attrValueList.splice($index, 1)
        ElMessage({
          type: 'error',
          message: '输入的属性值内容不能为空！',
        })
        return
      }
      // 非法情况： 属性值不能相同
      let repeat = addAttributeParams.attrValueList.find((item) => {
        if (item != row) {
          return item.valueName === row.valueName
        }
      })
      if (repeat) {
        // 删除重复的属性值
        addAttributeParams.attrValueList.splice($index, 1)
        ElMessage({
          type: 'error',
          message: '属性值不能相同！',
        })
        return
      }
    }
    // 只读状态 -> 编辑状态
    if (flag) {
      // 将其他的属性值状态设置为只读
      addAttributeParams.attrValueList.forEach((item) => {
        if (row === item) {
          return
        }
        item.stateFlag = false
      })
      // 将当前点击的 input 状态设置为聚焦状态
      nextTick(() => {
        inputRefArr.value[$index].focus()
      })
    }
    row.stateFlag = flag
  }
  /** 1. 实现 input 框自动聚焦功能 数据 && 方法 */
  // 用于存储 input 的 ref 实例元素
  let inputRefArr = ref<any[]>([])

  /** 数据请求方法合集 */
  // 获取属性和属性值的数据
  const attributeList = ref<IAttrResponseDataItem[]>([])
  const fetchAttributeListData = async () => {
    // 拿到 3 个 id
    const { firstCategoryId, secondCategoryId, thirdCategoryId } = categoryStore
    const result: TAttrResponseData = await requestGetAttrInfoByCategoryIdData(
      firstCategoryId as number,
      secondCategoryId as number,
      thirdCategoryId as number,
    )
    if (result.code === 200) {
      attributeList.value = result.data
    }
  }
  // 添加或者修改属性的属性值数据
  const addOrUpdateAttributeValueData = async () => {
    const result: TAddOrUpdateAttributeResponseData =
      await requestPostAddOrUpdateAttrData(addAttributeParams)
    if (result.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
</script>
<script lang="ts">
  export default {
    name: 'Attribute',
  }
</script>

<style scoped lang="scss">
  // 搜索结果卡片
  .result-card {
    margin-top: 20px;
  }
  // 表格
  .table-box {
    margin: 20px 0;
  }
  // 标签
  .tag-box {
    margin: 0 5px;
  }
</style>
