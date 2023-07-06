import { useEffect } from "react";

export function useUnsub<S>(subscriber: (cb: S) => ({ unsubscribe: () => void }), callback: S) {
    useEffect(() => {
        const sub = subscriber(callback);

        return () => sub.unsubscribe();
    });
}