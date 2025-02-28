import { CreateOrderOptionInput, OrderOptionResponse } from './order-options'
import { MenuCategory } from './menu-category'

export type MenuItem = {
  id: number
  nameTH: string
  nameEN: string
  price: number
  image: string | null
  menuCategoryId: number | null
  menuCategory?: MenuCategory
  orderOptions: OrderOptionResponse[]
}

export type CreateMenuItem = Omit<
  MenuItem,
  'id' | 'orderOptions' | 'menuCategory'
>

export type UpdateMenuItem = Partial<CreateMenuItem> & {
  orderOptions?: CreateOrderOptionInput[]
}
