import { Component, ComponentChildren, ErrorInfo } from 'preact';
// import * as Sentry from '@sentry/react';
// import { identifyCommit } from '../lib/lib'; // From Schedule Personalizer
import { Box, Button } from '@mui/material';
// import { resetStorage } from '../storage/store';

type props = { children: ComponentChildren };
type state = { hasError: boolean };

const isProductionBuild = process.env.NODE_ENV === 'production';
// const tracesSampleRate = isProductionBuild ? 0.2 : 1.0;

export default class PreactErrorCatcher extends Component<props, state> {
    constructor(props: props) {
        super(props);
        this.state = { hasError: false };

        // Sentry.init({
        //     dsn: 'https://a5ab5a1946bd4e31a06ca456fc5b30fc@o1233680.ingest.sentry.io/6382608',
        //     integrations: [
        //         new Sentry.BrowserTracing({
        //             tracingOrigins: ['localhost', 'schedule.insberr.com', 'insberr.github.io', 'schedule.insberr.live'],
        //         }),
        //     ],
        //     normalizeDepth: 10,
        //     tracesSampleRate,
        //     environment: process.env.NODE_ENV,
        //     release: identifyCommit() || 'dev',
        // });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError(_: Error) {
        // Update state so the next render will show the fallback UI.
        console.error(_);
        return { hasError: true };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidCatch(_q: Error, _e: ErrorInfo) {
        // You can also log the error to an error reporting service
        // console.error(error, errorInfo);

        // sentry should also go here. How Do You Do This?
        // Sentry.captureException(_q);
        this.setState({ hasError: true });
    }

    render(props: props, state: state) {
        if (state.hasError) {
            return (
                <Box>
                    <h2 className="text-center full-center">
                        Hmmm... Something went wrong, Try refreshing. If the error continues, please let me know!
                    </h2>
                    <h4 className="text-center full-center">If you are a developer, check the console for more details</h4>
                    <div className="text-center full-center">
                        <div>You can also try resetting the website</div>
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => {
                                // resetStorage();
                                localStorage.removeItem('icsFile');
                                location.reload();
                            }}
                        >
                            Reset (To Do)
                        </Button>
                    </div>
                </Box>
            );
        }

        return props.children;
    }
}
