import { effect } from '@preact/signals';
import { persist } from './persistSignal';

export enum PageToRender {
    Intro,
    Login,
    CreateAccount,

    Schedule,
    Links,

    Settings,
    ScheduleX,
}

export const pageToRender = persist<PageToRender>('pageToRender', 'v1', PageToRender.Intro);
effect(() => {
    if (typeof pageToRender.value !== 'number') {
        pageToRender.value = PageToRender.Intro;
    }

    // TODO: TEMPORARY: remove once schedule x replaces schedule
    if (pageToRender.value === PageToRender.Schedule) {
        pageToRender.value = PageToRender.ScheduleX;
    }
});
