export type OrderItem = {
  id: string
  menuName: string
  category: string
  quantity: number
  price: number
  options: {
    name: string
    value: string
  }[]
}

export type Order = {
  id: string
  date: string
  time: string
  totalQuantity: number
  totalPrice: number
  deliveryType: 'ทานที่ร้าน' | 'สั่งกลับบ้าน'
  status: 'กำลังทำ' | 'เสร็จสิ้น' | 'ยกเลิก' | 'กำลังรอ'
  items: OrderItem[]
}

export type OrderType = {
  name: string
  value: string
}

export type OrderHistory = {
  id: number
  orderId: string
  date: string
  time: string
  totalQuantity: number
  totalPrice: number
  deliveryType: string
  status: string
  branchId: number | null
  createdAt: string
  updatedAt: string
  items: {
    id: number
    orderHistoryId: number
    menuName: string
    category: string
    quantity: number
    price: number
    options: {
      name: string
      value: string
    }[]
  }[]
}
