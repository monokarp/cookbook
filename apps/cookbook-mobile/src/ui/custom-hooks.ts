import { useEffect } from "react"

export function withUnsub(subscriber: (cb: Function) => ({ unsubscribe: Function }), callback: Function) {
    useEffect(() => {
        const sub = subscriber(callback);

        return () => sub.unsubscribe();
    });
}