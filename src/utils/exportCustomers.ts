import dayjs from 'dayjs'
import type { Customer, CustomerInput } from '../types'

const columns: {
    key: keyof CustomerInput
    header: string
}[] = [
        { key: 'firstname', header: 'First name' },
        { key: 'lastname', header: 'Last name' },
        { key: 'streetaddress', header: 'Street address' },
        { key: 'postcode', header: 'Postcode' },
        { key: 'city', header: 'City' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
    ]

function escapeCsvValue(value: string) {
    return `"${value.replaceAll('"', '""')}"`
}

export function exportCustomersToCsv(
    customers: Customer[],
) {
    const headerRow = columns.map((column) => column.header)

    const customerRows = customers.map((customer) =>
        columns.map((column) => customer[column.key]),
    )

    const csvContent = [headerRow, ...customerRows]
        .map((row) => row.map(escapeCsvValue).join(','))
        .join('\r\n')

    const blob = new Blob(['\uFEFF', csvContent], {
        type: 'text/csv;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `customers-${dayjs().format(
        'YYYY-MM-DD',
    )}.csv`

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}