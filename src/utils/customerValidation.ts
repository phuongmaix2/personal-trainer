export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string) {
    return emailPattern.test(email.trim())
}

export function digitsOnly(value: string) {
    return value.replace(/\D/g, '')
}

export function isValidPhone(phone: string) {
    return /^\d{7,15}$/.test(phone)
}
