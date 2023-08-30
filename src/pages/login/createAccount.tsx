import { Button, Input } from '@mui/material';

export default function CreateAccountPage() {
    return (
        <>
            <div>Create account</div>
            Pick a username and password
            <Input type="text" placeholder="username" />
            <Input type="password" placeholder="password" />
            <div>
                <div>Upload ICS schedule file</div>
                <Input type="file" />
                <div>No function yet, also make it look nice</div>
            </div>
            <div>
                <div>Add friends?</div>
                <Input type="text" placeholder="Search friend username" />
                <div>To do</div>
            </div>
            <div>
                <div>Customize a few things?</div>
                <div>Someday</div>
            </div>
            <Button variant="contained">Create Account</Button>
        </>
    );
}
