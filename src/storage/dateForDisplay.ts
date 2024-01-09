import { signal } from '@preact/signals';

export const dateForDisplay = signal<Date>(new Date());
// 'January 8, 2024'
export const currentDate = signal<Date>(new Date());

setInterval(() => {
    if (currentDate.value.getMinutes() === new Date().getMinutes()) return;
    currentDate.value = new Date();
}, 1000);
