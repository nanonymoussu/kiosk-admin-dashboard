export type OrderOptionChoice = {
  id: number
  nameTH: string
  nameEN: string
  orderOptionId: number
}

export type OrderOption = {
  id: number
  nameTH: string
  nameEN: string
  type: 'single' | 'multiple'
  menuItemId: number
  choices: OrderOptionChoice[]
}

// Update the response type to match the API response
export type OrderOptionResponse = {
  id: number
  nameTH: string
  nameEN: string
  type: 'single' | 'multiple'
  choices: Array<{
    nameTH: string
    nameEN: string
  }>
}

// Update input type to match the API expectations
export type CreateOrderOptionInput = {
  nameTH: string
  nameEN: string
  type: 'single' | 'multiple'
  choices: Array<{
    nameTH: string
    nameEN: string
  }>
}
