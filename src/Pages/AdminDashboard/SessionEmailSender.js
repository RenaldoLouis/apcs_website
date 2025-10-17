import { Button, Card, message } from 'antd';
import { useRef, useState } from 'react';
import * as xlsx from 'xlsx';
import apis from '../../apis';

const SessionEmailSender = () => {
    const [isLoading, setIsLoading] = useState(false);
    // A ref to programmatically click the hidden file input
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        // Trigger the hidden file input when the user clicks the button
        fileInputRef.current.click();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        message.loading({ content: 'Reading and processing your file...', key: 'emailCampaign' });

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = event.target.result;
                const workbook = xlsx.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const winnerListRaw = xlsx.utils.sheet_to_json(worksheet);

                const winnerList = winnerListRaw.filter(winner => {
                    return winner.Name && winner.Email;
                });

                if (winnerList.length === 0) {
                    message.error({ content: 'The selected file is empty or in the wrong format.', key: 'emailCampaign' });
                    return;
                }

                // Basic validation to ensure required columns exist
                const firstWinner = winnerList[0];
                if (!firstWinner.Name || !firstWinner.Email) {
                    message.error({ content: "File must contain 'Name', and 'Email' Column.", key: 'emailCampaign' });
                    return;
                }

                message.loading({ content: `Found ${winnerList.length} winners. Preparing to send emails...`, key: 'emailCampaign' });

                // Send the parsed list to your backend API
                await apis.email.sendEmailSessionWinner(winnerList);

                message.success({ content: `Successfully sent campaign for ${winnerList.length} winners!`, key: 'emailCampaign' });

            } catch (error) {
                console.error("Error processing file or sending campaign:", error);
                message.error({ content: 'An error occurred. Please check the console.', key: 'emailCampaign' });
            } finally {
                setIsLoading(false);
                // Reset the file input value to allow uploading the same file again
                e.target.value = null;
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <Card title="Session Email Campaign" style={{ margin: '40px' }}>
            <p>
                Upload an Excel With Winner list to send Email Session.
            </p>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                accept=".xlsx, .xls, .csv" // Accept standard spreadsheet formats
            />

            <Button
                type="primary"
                onClick={handleButtonClick}
                loading={isLoading}
            >
                Upload Excel & Send Emails
            </Button>
        </Card>
    );
};

export default SessionEmailSender;