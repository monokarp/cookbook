import { create } from 'zustand';

export interface SessionStore {
    user: { id: string; } | null;
    hasInitialized: boolean;
    setUser: (user: { id: string; } | null) => void;
    initialize: () => void;
}

export const useSession = create<SessionStore>((set) => ({
    user: null,
    hasInitialized: false,
    setUser: (user: { id: string; } | null) => set(() => ({ user })),
    initialize: () => set(() => ({ hasInitialized: true })),
}));

