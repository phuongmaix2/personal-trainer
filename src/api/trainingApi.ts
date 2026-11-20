import type { Training } from '../types'

export async function getTrainings() {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/gettrainings`,
    )

    if (!response.ok) {
        throw new Error('Failed to fetch trainings')
    }

    const data: Training[] = await response.json()
    return data
}