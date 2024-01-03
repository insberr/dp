import { signal, Signal, effect } from '@preact/signals';
import { serify, deserify } from '@karmaniverous/serify-deserify';

export function persistJSON<Type>(key: string, defaultValue: Type): Signal<Type> {
    const localStorageItem = localStorage.getItem(key);
    let value = defaultValue;

    if (localStorageItem !== null) {
        value = deserify(JSON.parse(localStorageItem));
    }

    const internal = signal<Type>(value);

    effect(() => {
        localStorage.setItem(key, JSON.stringify(serify(internal.value)));
    });

    return internal;
}

export interface PersistSignal<Type> extends Signal<Type> {
    store(): void;
}

export function persist<Type>(key: string, defaultValue: Type): PersistSignal<Type> {
    const localStorageItem = localStorage.getItem(key);
    let value = defaultValue;

    if (localStorageItem !== null) {
        value = deserify(JSON.parse(localStorageItem)).data;
    }

    const internal: PersistSignal<Type> = signal<Type>(value) as PersistSignal<Type>;
    internal.store = () => {
        localStorage.setItem(key, JSON.stringify(serify({ data: internal.value })));
    };

    effect(() => {
        localStorage.setItem(key, JSON.stringify(serify({ data: internal.value })));
    });

    return internal;
}
