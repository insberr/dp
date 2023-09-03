import { Box, Button, Input, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'preact/hooks';
import { icsFileSignal } from '../../storage/icsfile';
import { PageToRender, pageToRender } from '../../storage/pageToRender';

export default function CreateAccountPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [icsFile_CreateAccount, setIcsFile] = useState<string | null>(null);

    return (
        <Box>
            <Typography variant="h3">Create Account</Typography>
            <Box>
                <Typography variant="h4">Select A Username And Password</Typography>
                <Stack direction="column" width={'50%'}>
                    <Input
                        type="username"
                        placeholder="username"
                        onChange={(change) => {
                            // @ts-ignore
                            setUsername(change?.target?.value || '');
                        }}
                    />
                    <Input
                        type="password"
                        placeholder="password"
                        onChange={(change) => {
                            // @ts-ignore
                            setPassword(change?.target?.value || '');
                        }}
                    />
                </Stack>
            </Box>
            <Box sx={{ marginTop: 10 }}>
                <Typography variant="h4">Upload Your Schedule (Optional)</Typography>
                <div>Upload ICS file, which can be downloaded from Self Service in the schedule section.</div>
                <Input
                    type="file"
                    onChange={(change) => {
                        console.log('change', change);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const file = event.target?.result;
                            icsFileSignal.value = { data: file as string };
                            setIcsFile(file as string);
                            console.log('event:file: ', file); // desired file content
                        };
                        reader.onerror = (error) => {
                            console.log(error);
                            // actually show error to user
                        };
                        // @ts-ignore
                        reader.readAsText(change.target.files[0]); // you could also read images and other binaries
                    }}
                />
            </Box>
            <Box sx={{ display: 'none' }}>
                <div>
                    <div>Add friends?</div>
                    <Input type="text" placeholder="Search friend username" />
                    <div>To do</div>
                </div>
                <div>
                    <div>Customize a few things?</div>
                    <div>Someday</div>
                </div>
            </Box>
            <Button
                sx={{ marginTop: 10 }}
                variant="contained"
                onClick={() => {
                    fetch('https://backend.dpd.insberr.com/createAccount', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password,
                            icsFile: icsFile_CreateAccount !== null ? btoa(icsFile_CreateAccount) : null,
                        }),
                    })
                        .then((res) => {
                            res.json().then((data) => {
                                if (data.data === 'user created successfully') {
                                    pageToRender.value = PageToRender.Schedule;
                                    return;
                                }
                                console.log(data);
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }}
            >
                Create Account
            </Button>
        </Box>
    );
}
