import type { Timestamp } from 'firebase/firestore'

export const formatPhoneNumber = (value: string): string => {
    if (!value) return ''

    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')

    if (numbers.length <= 2) {
        return numbers
    }
    if (numbers.length <= 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    }
    if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    // Para números com 11 dígitos (celular)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

export const formatDate = (date: Timestamp | null | undefined, includeTime = false): string => {
    if (!date) return '-'

    const d = date.toDate()

    if (includeTime) {
        return d.toLocaleString('pt-BR')
    }

    return d.toLocaleDateString('pt-BR')
}

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}
