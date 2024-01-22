type TCategoryList = {
  label: string
  value: number
  category1Id?: number
  category2Id?: number
}

export interface ICategoryState {
  firstCategoryList: TCategoryList[]
  firstCategoryId?: number
  secondCategoryList: TCategoryList[]
  secondCategoryId?: number
  thirdCategoryList: TCategoryList[]
  thirdCategoryId?: number
}
