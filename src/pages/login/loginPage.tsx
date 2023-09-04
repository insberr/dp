import { Box, Button, Input, Stack } from '@mui/material';
import { useState } from 'preact/hooks';
import { PageToRender, pageToRender } from '../../storage/pageToRender';
import { icsFileSignal } from '../../storage/icsfile';

export default function LoginPage() {
    const [passwordValue, setPasswordValue] = useState('');
    const [usernameValue, setUsernameValue] = useState('');
    const [isError, setisError] = useState<null | string>(null);

    return (
        <Box sx={{ width: '50%' }} justifyContent={'center'}>
            <h1>Login Page</h1>
            <Stack direction="column">
                {isError && <Box>{isError}</Box>}
                <Input
                    onChange={(value) => {
                        // @ts-ignore
                        setUsernameValue(value.target?.value || '');
                    }}
                    type="text"
                    placeholder="Username"
                />
                <Input
                    onChange={(value) => {
                        // @ts-ignore
                        setPasswordValue(value.target?.value || '');
                    }}
                    type="password"
                    placeholder="Password"
                />
                <Button
                    variant="contained"
                    onclick={() => {
                        fetch('https://backend.dpd.insberr.com/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },

                            body: JSON.stringify({
                                username: usernameValue,
                                password: passwordValue,
                            }),
                        })
                            .then((res) => {
                                res.json().then((data) => {
                                    console.log(data);
                                    if (data.error) {
                                        setisError(data.error);
                                        throw new Error(data.error);
                                    }
                                    if (data.icsFile !== null) icsFileSignal.value = { data: atob(data.icsFile) };
                                    pageToRender.value = PageToRender.Schedule;
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                setisError(err.error);
                            });
                    }}
                >
                    Login
                </Button>
                <Button
                    onClick={() => {
                        pageToRender.value = PageToRender.CreateAccount;
                    }}
                >
                    New? Create Account
                </Button>

                <Button
                    onClick={() => {
                        pageToRender.value = PageToRender.Schedule;
                    }}
                >
                    Im lazy, no account please
                </Button>
            </Stack>
        </Box>
    );
}
