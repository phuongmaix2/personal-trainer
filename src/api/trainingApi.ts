import type { Training, TrainingInput } from '../types'

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

export async function addTraining(training: TrainingInput) {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainings`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(training),
        },
    )

    if (!response.ok) {
        throw new Error('Failed to add training')
    }
}

export async function deleteTraining(id: number) {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainings/${id}`,
        {
            method: 'DELETE',
        },
    )

    if (!response.ok) {
        throw new Error('Failed to delete training')
    }
}