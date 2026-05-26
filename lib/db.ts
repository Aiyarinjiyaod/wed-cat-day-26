import { neon, NeonQueryFunction } from '@neondatabase/serverless'

function getDbConnection(): NeonQueryFunction<false, false> {
  if (!process.env.DATABASE_URL) {
    // Return a mock function that throws a helpful error when called
    return (() => {
      throw new Error(
        'DATABASE_URL is not configured. Please add your Neon database connection string in Settings → Vars.'
      )
    }) as unknown as NeonQueryFunction<false, false>
  }
  return neon(process.env.DATABASE_URL)
}

export const sql = getDbConnection()

export type Admin = {
  id: number
  username: string
  email: string
  password_hash: string
  role: 'admin' | 'superadmin'
  last_login: string | null
  created_at: string
  updated_at: string
}
export type Product = {
  id: number
  name: string
  name_th: string
  description: string
  description_th: string
  price: number
  category: string
  image_url: string
  model_url: string
  model_usdz_url: string | null
  dimensions: string
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
}

export type CartItem = {
  id: number
  session_id: string
  product_id: number
  quantity: number
  created_at: string
  product?: Product
}

export type Order = {
  id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  total_amount: number
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled'
  payment_slip_url: string | null
  tracking_number: string | null
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price_at_time: number
  created_at: string
  product?: Product
}

export type OrderWithItems = Order & {
  items: OrderItem[]
}
