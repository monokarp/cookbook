import { collectionElementId } from "@cookbook/ui/test-ids";
import { element, by, expect } from 'detox';

const DefaultTimeout = 4000;

export function untilVisible(testId: string, index?: number) {
    return waitFor(findElement(testId, index)).toBeVisible().withTimeout(DefaultTimeout);
}

export function untilNotVisible(testId: string, index?: number) {
    return waitFor(findElement(testId, index)).not.toBeVisible().withTimeout(DefaultTimeout);
}

export function untilGone(testId: string, index?: number) {
    return waitFor(findElement(testId, index)).not.toExist().withTimeout(DefaultTimeout);
}

export async function assertListItems(testId: string, listItemText: string[]) {
    let idx = 0;

    for (const text of listItemText) {
        await waitFor(collectionElement(testId).at(idx++)).toHaveText(text);
    }

    await expect(collectionElement(testId).at(idx)).not.toExist();
}

export function collectionElement(testId: string) {
    return {
        at: (index: number) => {
            return element(by.id(collectionElementId(testId, index)));
        }
    };
}

function findElement(testId: string, index?: number) {
    return Number.isInteger(index)
        ? collectionElement(testId).at(index)
        : element(by.id(testId))
}