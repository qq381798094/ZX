<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select @change="handleLevelOneChange" v-model="levelOne">
          <el-option
            v-for="item in levelOneOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select @change="handleLevelSecChange" v-model="levelSec">
          <el-option
            v-for="item in levelSecondOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select @change="handleLevelTrdChange" v-model="levelTrd">
          <el-option
            v-for="item in levelThirdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" generic="T extends (id?: number) => Promise<any>">
  import { onMounted, ref, shallowRef } from 'vue'

  defineOptions({
    name: 'CategoryCard',
  })

  const props = defineProps<{
    // 由外部决定1-3级目录请求api方法
    requestFirFn: T
    requestSecFn: T
    requestTrdFn: T
  }>()

  const emits = defineEmits<{
    'on-fetch': [string]
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
    requestFunc: typeof props.requestFirFn | typeof props.requestSecFn | typeof props.requestTrdFn,
    resultOptions: any,
    id?: number,
  ) => {
    try {
      let res = await requestFunc(id as number)
      const { data } = res || {}
      resultOptions.value = generateOptions(data)
    } catch (e) {
      console.log(e)
    }
  }

  const fetchLevelOneOptions = async () => {
    requestOptionsList(props.requestFirFn, levelOneOptions)
  }

  const fetchLevelSecondOptions = async (id: number) => {
    requestOptionsList(props.requestSecFn, levelSecondOptions, id)
  }

  const fetchLevelThirdOptions = async (id: number) => {
    requestOptionsList(props.requestTrdFn, levelThirdOptions, id)
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

  const handleLevelTrdChange = () => {
    emits('on-fetch', `${levelOne.value}-${levelSec.value}-${levelTrd.value}`)
  }
</script>

<style scoped lang="scss"></style>
