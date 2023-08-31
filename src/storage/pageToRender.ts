import { persist } from './persistSignal';

export enum PageToRender {
    Login,
    CreateAccount,

    Schedule,
    Links,

    Settings,
}

export const pageToRender = persist<PageToRender>('pageToRender', PageToRender.Login);
