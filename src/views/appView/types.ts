export type GroupData = {
    _id: string
    title: string
    description: string
    groupClick: () => void
}

export type SnackData = {
    open: boolean
    message: string | null
    severity: 'success' | 'error' | undefined
}

