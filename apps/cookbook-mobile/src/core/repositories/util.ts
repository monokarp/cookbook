export interface Entity {
    Id: string;
}

export function GroupById<T extends Entity>(rows: T[]): Map<string, T[]> {
    const groups = new Map<string, T[]>();

    rows.forEach(row => {
        const group = groups.get(row.Id) ?? [];

        group.push(row);

        groups.set(row.Id, group);
    });

    return groups;
}

export function MapById<T extends { id: string }>(rows: T[]): Map<string, T> {
    const result = new Map<string, T>();

    for (const one of rows) {
        result.set(one.id, one);
    }

    return result;
}