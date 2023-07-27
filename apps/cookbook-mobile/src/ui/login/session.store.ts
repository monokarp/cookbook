import { create } from 'zustand';

export interface SessionStore {
    user: { id: string; } | null;
    setUser: (user: { id: string; } | null) => void;
}

export const useSession = create<SessionStore>((set) => ({
    user: null,
    setUser: (user: { id: string; } | null) => set(() => ({ user })),
}));

