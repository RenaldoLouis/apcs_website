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
import { db } from '../../firebase';
import { collection, addDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        phone_number: '',
        comment: '',
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {

        try {
            event.preventDefault();
            console.log(formData);

            // Add a new document to a collection
            const docRef = await addDoc(collection(db, "users"), formData);
            toast.success("Data Saved, Thank you")
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            toast.error("failed to save data, please try again");
            console.error("Error adding document: ", e);
        }
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
                                                        required
                                                        onChange={handleChange}
                                                        name="name"
                                                        id="standard-basic"
                                                        label="Name" variant="standard" className="custom-textfield mb-4" />
                                                    <TextField
                                                        required
                                                        onChange={handleChange}
                                                        name="email"
                                                        id="standard-basic"
                                                        label="Email" variant="standard" className="custom-textfield mb-4" />
                                                    <TextField
                                                        required
                                                        onChange={handleChange}
                                                        name="country"
                                                        id="standard-basic"
                                                        label="Country" variant="standard" className="custom-textfield mb-4" />
                                                    <TextField
                                                        required
                                                        onChange={handleChange}
                                                        name="phone_number"
                                                        id="standard-basic"
                                                        label="Phone Number" variant="standard" className="custom-textfield mb-4" />
                                                    <TextField
                                                        id="filled-multiline-static"
                                                        name="comment"
                                                        label="Comment"
                                                        multiline
                                                        rows={4}
                                                        variant="standard"
                                                        className="custom-textfield mb-4"
                                                        value={formData.multilineField}
                                                        onChange={handleChange}
                                                        sx={{
                                                            margin: 0,
                                                            padding: 0,
                                                            '& .MuiInput-underline:before': { borderBottomColor: 'orange' },
                                                            '& .MuiInput-underline:after': { borderBottomColor: 'orange' },
                                                        }}
                                                    />

                                                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                                        Submit
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
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