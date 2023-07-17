import { TestIds } from "@cookbook/ui/test-ids.enum";
import { element, by, expect } from 'detox';

const DefaultTimeout = 4000;

export function waitUntilVisible(testId: string) {
    return waitFor(element(by.id(testId))).toBeVisible().withTimeout(DefaultTimeout);
}

export function waitUntilNotVisible(testId: string) {
    return waitFor(element(by.id(testId))).not.toBeVisible().withTimeout(DefaultTimeout);
}

export function waitUntilGone(testId: string) {
    return waitFor(element(by.id(testId))).not.toExist().withTimeout(DefaultTimeout);
}

export async function assertDisplayedSummaryListItems(listItemText: string[]) {
    let idx = 0;

    for (const text of listItemText) {
        await waitFor(collectionElement(TestIds.ListItem.Label).at(idx++)).toHaveText(text).withTimeout(DefaultTimeout);
    }

    await expect(collectionElement(TestIds.ListItem.Label).at(idx)).not.toExist();
}

export function collectionElement(testId: string) {
    return {
        at: (index: number) => {
            return element(by.id(`${testId}-${index}`));
        }
    };
}