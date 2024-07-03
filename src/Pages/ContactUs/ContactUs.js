import React, { useState } from "react";
import podcastBacgkorund from "../../assets/images/podcastBacgkorund.png"
import contactUsPageBackground from "../../assets/images/contactUsPageBackground.png"
import lineContactUs from "../../assets/images/lineContactUs.png"
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"
import BackgroundWithText from "../../components/molecules/BacgkroundWithText";
import { ContentPosition } from "../../constant/ContentPosition";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        multilineField: '',
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        // Handle form submission here
    };

    return (
        <div class="container-fluid mx-0 my-0 px-0 py-0" style={{ background: "black" }}>
            <div class="row gx-0 gy-0">
                <div class="col-7">
                    <img src={contactUsPageBackground} style={{ width: '100%' }} />
                </div>
                <div class="col-5">
                    <div className="d-flex flex-column justify-content-center" style={{ height: "100%" }}>
                        <div className="container" style={{ color: "white" }}>
                            <div className="row">
                                <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                                    <img className="mb-5" src={lineContactUs} style={{ width: "60%" }} />
                                    <Box component="form" onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                                        <div className="contaier">
                                            <div className="row">
                                                <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                                                    <TextField
                                                        id="standard-basic"
                                                        label="Standard" variant="standard" className="custom-textfield mb-4" />
                                                    <TextField
                                                        id="filled-multiline-static"
                                                        label="Multiline"
                                                        multiline
                                                        rows={4}
                                                        defaultValue="Default Value"
                                                        variant="filled"
                                                        className="custom-textfield mb-4"
                                                        value={formData.multilineField}
                                                        onChange={handleChange}
                                                        sx={{
                                                            margin: 0,
                                                            padding: 0,
                                                            '& .MuiInput-underline:before': { borderBottomColor: 'green' },
                                                            '& .MuiInput-underline:after': { borderBottomColor: 'green' },
                                                        }}
                                                    />

                                                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                                        Submit
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <TextField
                                            className="custom-textfield"
                                            name="field1"
                                            label="Field 1"
                                            value={formData.field1}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            className="custom-textfield"
                                            name="field2"
                                            label="Field 2"
                                            value={formData.field2}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            className="custom-textfield"
                                            name="field3"
                                            label="Field 3"
                                            value={formData.field3}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            className="custom-textfield"
                                            name="field4"
                                            label="Field 4"
                                            value={formData.field4}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            className="custom-textfield"
                                            name="multilineField"
                                            label="Multiline Field"
                                            multiline
                                            rows={4}
                                            value={formData.multilineField}
                                            onChange={handleChange}
                                        /> */}
                                    </Box>
                                    <img className="mt-5" src={lineContactUs} style={{ width: "60%" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactUs;