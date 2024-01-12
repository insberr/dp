import { signal, Signal, effect } from '@preact/signals';
// @ts-ignore - No types exist for this package
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

// export interface PersistSignal<Type> extends Signal<Type> {
//     store(): void;
// }

export function persist<Type>(
    key: string,
    version: string,
    defaultValue: Type,
    migrate?: (versionInStorage: string, data: Type) => Type
): Signal<Type> {
    const localStorageItem = localStorage.getItem(key);
    let value = defaultValue;

    if (localStorageItem !== null) {
        const deserialized = deserify(JSON.parse(localStorageItem));
        value = deserialized.data;

        if (deserialized.version !== version && migrate !== undefined) {
            value = migrate(deserialized.version, deserialized.data);
        }
    }

    const internal = signal<Type>(value);
    // const internal: PersistSignal<Type> = signal<Type>(value) as PersistSignal<Type>;
    // internal.store = () => {
    //     localStorage.setItem(key, JSON.stringify(serify({ data: internal.value, version: version })));
    // };

    effect(() => {
        localStorage.setItem(key, JSON.stringify(serify({ data: internal.value, version: version })));
    });

    return internal;
}
