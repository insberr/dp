import { signal } from '@preact/signals';

export const dateForDisplay = signal<Date>(new Date());

export const currentDate = signal<Date>(new Date());

setInterval(() => {
    currentDate.value = new Date();
}, 1000);
