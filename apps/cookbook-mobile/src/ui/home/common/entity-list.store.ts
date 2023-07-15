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
            items: entities.sort(byName),
            filteredItems: entities.sort(byName),
        })),
        filter: (value: string) => set((state) => ({
            filteredItems: state.items.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())).sort(byName),
        })),
        deleteItem: (id: string) => set((state) => ({
            items: state.items.filter((item) => item.id !== id).sort(byName),
            filteredItems: state.items.filter((item) => item.id !== id).sort(byName),
        }))
    }));
}

function byName(a: NamedEntity, b: NamedEntity) {
    return a.name.localeCompare(b.name);
}