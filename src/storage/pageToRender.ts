import { effect } from '@preact/signals';
import { persist } from './persistSignal';

export enum PageToRender {
    Intro,
    Login,
    CreateAccount,

    Schedule,
    Links,

    Settings,
    MoveableTest,
}

export const pageToRender = persist<PageToRender>('pageToRender', PageToRender.Intro);
effect(() => {
    if (typeof pageToRender.value !== 'number') {
        pageToRender.value = PageToRender.Intro;
    }
});
