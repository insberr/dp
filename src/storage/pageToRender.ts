import { persist } from './persistSignal';

export enum PageToRender {
    Intro,
    Login,
    CreateAccount,

    Schedule,
    Links,

    Settings,
}

export const pageToRender = persist<PageToRender>('pageToRender', PageToRender.Intro);
