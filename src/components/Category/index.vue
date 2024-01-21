<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select @change="handleLevelOneChange" v-model="levelOne">
          <el-option
            v-for="(item, index) in levelOneOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select @change="handleLevelSecChange" v-model="levelSec">
          <el-option
            v-for="(item, index) in levelSecondOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="levelTrd">
          <el-option
            v-for="(item, index) in levelThirdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
  import { onMounted, ref, shallowRef } from 'vue'

  defineOptions({
    name: 'CategoryCard',
  })

  /** 接口引入 */
  import {
    requestFirstCategoryData,
    requestSecondCategoryByFirstIdData,
    requestThirdCategoryBySecondIdData,
  } from '@/api/product/attr'

  const props = defineProps<{
    modelValue: string
  }>()

  const emits = defineEmits<{
    'update:modelValue': [string]
  }>()

  type OptionType = {
    label: string
    value: number
  }

  const generateOptions = (arr: any[]): OptionType[] => {
    return arr.map((item) => ({
      label: item.name,
      value: item.id,
    }))
  }

  /**
   * 列表数据相关
   */
  const levelOne = ref<number | undefined>(undefined)
  const levelSec = ref<number | undefined>(undefined)
  const levelTrd = ref<number | undefined>(undefined)
  const levelOneOptions = shallowRef<OptionType[]>([])
  const levelSecondOptions = shallowRef<OptionType[]>([])
  const levelThirdOptions = shallowRef<OptionType[]>([])

  const requestOptionsList = async (
    requestFunc: (id: number) => Promise<any>,
    resultOptions: any,
    id?: number,
  ) => {
    try {
      const res = await requestFunc(id)
      const { data } = res || {}
      resultOptions.value = generateOptions(data)
    } catch (e) {
      console.log(e)
    }
  }

  const fetchLevelOneOptions = async () => {
    requestOptionsList(requestFirstCategoryData, levelOneOptions)
  }

  const fetchLevelSecondOptions = async (id: number) => {
    requestOptionsList(
      requestSecondCategoryByFirstIdData,
      levelSecondOptions,
      id,
    )
  }

  const fetchLevelThirdOptions = async (id: number) => {
    requestOptionsList(
      requestThirdCategoryBySecondIdData,
      levelThirdOptions,
      id,
    )
  }

  onMounted(() => {
    fetchLevelOneOptions()
  })

  /**
   * select相关
   */
  const handleLevelOneChange = (val: number) => {
    levelSec.value = undefined
    levelTrd.value = undefined
    fetchLevelSecondOptions(val)
  }

  const handleLevelSecChange = (val: number) => {
    levelTrd.value = undefined
    fetchLevelThirdOptions(val)
  }

  /**  */
</script>

<style scoped lang="scss"></style>
