type firstCategoryList = {
  label: string
  value: number
}

export interface ICategoryState {
  firstCategoryList: firstCategoryList[]
  firstCategoryId?: number
}
