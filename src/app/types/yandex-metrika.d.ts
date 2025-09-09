declare global {
    interface Window {
        ym: (
            counterId: number,
            action: 'reachGoal',
            target: string,
            params?: Record<string, any>
        ) => void;
    }
}

export {};
