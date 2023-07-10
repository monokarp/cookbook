export interface Entity {
    Id: string;
}

export function GroupById<T extends Entity>(rows: T[]): T[][] {
    const groups = new Map<string, T[]>();

    rows.forEach(row => {
        const group = groups.get(row.Id) ?? [];

        group.push(row);

        groups.set(row.Id, group);
    });

    return Array.from(groups.values());
}