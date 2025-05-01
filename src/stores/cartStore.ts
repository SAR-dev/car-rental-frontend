import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { constants } from '../constants'

type CartStore = {
  products: string[]
  addProduct: (productId: string) => void
  removeProduct: (productId: string) => void
}

function removeFirstMatch(
  list: string[],
  predicate: (value: string) => boolean
): string[] {
  const index = list.findIndex(predicate)
  return index !== -1
    ? [...list.slice(0, index), ...list.slice(index + 1)]
    : [...list]
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (productId) => {
        set((state) => ({ products: [...state.products, productId] }))
      },
      removeProduct: (productId) => {
        set((state) => ({
          products: removeFirstMatch(state.products, (id) => id === productId),
        }))
      },
    }),
    {
      name: constants.CART_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
