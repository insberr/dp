import 'preact/debug';

import { render } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import PreactErrorCatcher from './components/PreactErrorCatcher';
import ThemeWrapper from './components/ThemeWrapper';
import LoadSpinner from './components/LoadingSpinner';
const App = lazy(() => import('./App'));

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const isProductionBuild = process.env.NODE_ENV === 'production';

// ! To Do
// if (navigator.serviceWorker) {
//     if (isProductionBuild || new URLSearchParams(window.location.search).get('serviceworker') === 'true') {
//         navigator.serviceWorker.register(new URL('./serviceworker.ts', import.meta.url), { type: 'module' });
//     }
// }

const documentApp = document.getElementById('app');
if (!documentApp) {
    console.error('What the fuck? theres no app element? wtf?');
    throw new Error('God is dead and we have killed him');
}

const mainComponentToRender = (
    <ThemeWrapper>
        <PreactErrorCatcher>
            <Suspense fallback={<LoadSpinner />}>
                <App />
            </Suspense>
        </PreactErrorCatcher>
    </ThemeWrapper>
);

render(mainComponentToRender, documentApp);
