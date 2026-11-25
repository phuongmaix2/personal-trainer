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

    const data = await response.json().catch(() => null) as {
        id?: number
        _links?: { self?: { href?: string } }
    } | null
    const location = response.headers.get('Location')
    const resourceUrl = data?._links?.self?.href ?? location
    const idFromUrl = resourceUrl
        ? Number(resourceUrl.split('/').at(-1))
        : null

    return data?.id ?? (Number.isFinite(idFromUrl) ? idFromUrl : null)
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
