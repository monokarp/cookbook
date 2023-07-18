import { TestIds } from "@cookbook/ui/test-ids.enum";
import { element, by, expect } from 'detox';

const DefaultTimeout = 4000;

export function untilVisible(testId: string) {
    return waitFor(element(by.id(testId))).toBeVisible().withTimeout(DefaultTimeout);
}

export function untilNotVisible(testId: string) {
    return waitFor(element(by.id(testId))).not.toBeVisible().withTimeout(DefaultTimeout);
}

export function untilGone(testId: string) {
    return waitFor(element(by.id(testId))).not.toExist().withTimeout(DefaultTimeout);
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
            return element(by.id(`${testId}-${index}`));
        }
    };
}