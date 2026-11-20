import type { CustomerResponse } from '../types'

export async function getCustomers() {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/customers`,
    )

    if (!response.ok) {
        throw new Error('Failed to fetch customers')
    }

    const data: CustomerResponse = await response.json()
    return data._embedded.customers
}