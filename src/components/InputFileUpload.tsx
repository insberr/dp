import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Input } from '@mui/material';
import { icsFileSignal } from '../storage/icsfile';

export default function InputFileUpload() {
    return (
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <Input
                sx={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1,
                }}
                type="file"
                onChange={(change) => {
                    if (change === null) {
                        console.log('Uploaded ICS file is null. How ???');
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const file = event.target?.result;
                        icsFileSignal.value = { data: file as string };
                        console.log('event:file: ', file); // desired file content
                    };
                    reader.onerror = (error) => {
                        console.log(error);
                        // actually show error to user
                    };

                    // Bad, fix later
                    // @ts-ignore
                    reader.readAsText(change.target?.files[0]); // you could also read images and other binaries
                }}
            />
        </Button>
    );
}
