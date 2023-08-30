import { Box, Button, Input, Stack } from '@mui/material';
import { useState } from 'preact/hooks';
import CreateAccountPage from './createAccount';

export default function LoginPage() {
    const [passwordValue, setPasswordValue] = useState('');
    const [usernameValue, setUsernameValue] = useState('');

    return (
        <Box sx={{ margin: 10 }}>
            <h1>Login Page</h1>
            <Stack direction="column" width={'50%'}>
                <Input
                    onChange={(value) => {
                        console.log('username', value.target?.value);
                        setUsernameValue(value.target?.value || '');
                    }}
                    type="text"
                    placeholder="Username"
                />
                <Input
                    onChange={(value) => {
                        console.log('username', value.target?.value);
                        setPasswordValue(value.target?.value || '');
                    }}
                    type="password"
                    placeholder="Password"
                />
                <Button
                    variant="contained"
                    onclick={() => {
                        console.log('login', passwordValue, usernameValue);
                    }}
                >
                    Login
                </Button>
                <Button>New? Create Account</Button>
                <Button>Im lazy, no account please</Button>
            </Stack>
            <CreateAccountPage />
        </Box>
    );
}
