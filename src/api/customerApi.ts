import type {
    CustomerInput,
    CustomerResponse,
} from '../types'

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
export async function addCustomer(customer: CustomerInput) {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/customers`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        },
    )

    if (!response.ok) {
        throw new Error('Failed to add customer')
    }
}