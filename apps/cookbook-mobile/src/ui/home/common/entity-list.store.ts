import { create } from 'zustand';
import { NamedEntity } from '../../../domain/types/named-entity';

export interface EntityListStore<T extends NamedEntity> {
    items: T[];
    filteredItems: T[];
    set: (prepacks: T[]) => void;
    filter: (value: string) => void;
    deleteItem: (id: string) => void;
}

export function entityListStoreFactory<T extends NamedEntity>() {
    return create<EntityListStore<T>>((set) => ({
        items: [],
        filteredItems: [],
        set: (entities: T[]) => set(() => ({
            items: entities,
            filteredItems: entities,
        })),
        filter: (value: string) => set((state) => ({
            filteredItems: state.items.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())),
        })),
        deleteItem: (id: string) => set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            filteredItems: state.items.filter((item) => item.id !== id),
        }))
    }));
}