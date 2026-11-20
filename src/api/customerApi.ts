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

export async function updateCustomer(
    url: string,
    customer: CustomerInput,
) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
    })

    if (!response.ok) {
        throw new Error('Failed to update customer')
    }
}

export async function deleteCustomer(url: string) {
    const response = await fetch(url, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Failed to delete customer')
    }
}