import {
    WhatsAppOutlined
} from '@ant-design/icons';
import { Fab, Popper, Zoom } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import contactUsPageBackground from "../../assets/images/contactUsPageBackground.png";
import lineContactUs from "../../assets/images/lineContactUs.png";
import textPromptWa from "../../assets/images/textPromptWa.png";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import { db } from '../../firebase';


const fabStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
};

const fabGreenStyle = {
    color: 'common.white',
    bgcolor: '#25D366',
    '&:hover': {
        bgcolor: '#128C7E',
    },
};

const fab = {
    color: 'primary',
    sx: { ...fabStyle, ...fabGreenStyle },
    icon: <WhatsAppOutlined />,
    label: 'WhatsApp',
};


const ContactUs = () => {
    const { t } = useTranslation();

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

    const [isFabVisible, setIsFabVisible] = useState(true);

    const handleSubmit = async (event) => {

        try {
            event.preventDefault();

            //TODO: Send email when people submit contact us
            const docRef = await addDoc(collection(db, "conctactUsSubmitted"), formData);
            toast.success("Data Saved, Thank you")
        } catch (e) {
            toast.error("failed to save data, please try again");
            console.error("Error adding document: ", e);
        }
    };

    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6282213002686", '_blank');
    }

    const [showInitialPopper, setShowInitialPopper] = useState(false);
    const fabRef = useRef(null);


    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopperOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setShowInitialPopper(false);
    };

    const handlePopperClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setTimeout(() => {
            setShowInitialPopper(true)
            if (fabRef.current) {
                setAnchorEl(fabRef.current);
            }
            const timer = setTimeout(() => {
                setShowInitialPopper(false);
                setAnchorEl(null);
            }, 5000); // Hide after 5 seconds

            return () => clearTimeout(timer);
        }, 2000);
    }, []);

    return (
        <div className="container-fluid mx-0 my-0 px-0 py-0" style={{ background: "black" }}>
            <div className="row gx-0 gy-0">
                <div className="col-sm-12 col-md-7">
                    <img src={contactUsPageBackground} style={{ width: '100%' }} />
                </div>
                <div className="col-sm-12 col-md-5">
                    <div className="d-flex flex-column justify-content-center" style={{ height: "100%" }}>
                        <div className="container" style={{ color: "white" }}>
                            <div className="row">
                                <AnimatedComponent animationClass="animate__fadeIn">
                                    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                                        <div className="mangolaineFont goldenTextColor" style={{ fontSize: "6vmin" }}>
                                            CONTACT US
                                        </div>
                                        {/* <img className="mb-5" src={lineContactUs} style={{ width: "60%" }} /> */}
                                        <Box component="form" onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                                            <div className="contaier">
                                                <div className="row">
                                                    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                                                        <TextField
                                                            required
                                                            onChange={handleChange}
                                                            name="name"
                                                            id="standard-basic"
                                                            label={t("name")} variant="standard" className="custom-textfield mb-4" />
                                                        <TextField
                                                            required
                                                            onChange={handleChange}
                                                            name="email"
                                                            id="standard-basic"
                                                            label={t("email")} variant="standard" className="custom-textfield mb-4" />
                                                        <TextField
                                                            required
                                                            onChange={handleChange}
                                                            name="country"
                                                            id="standard-basic"
                                                            label={t("country")} variant="standard" className="custom-textfield mb-4" />
                                                        <TextField
                                                            required
                                                            onChange={handleChange}
                                                            name="phone_number"
                                                            id="standard-basic"
                                                            label={t("phoneNumber")} variant="standard" className="custom-textfield mb-4" />
                                                        <TextField
                                                            id="filled-multiline-static"
                                                            name="comment"
                                                            label={t("commentContact")}
                                                            multiline
                                                            rows={4}
                                                            variant="standard"
                                                            className="custom-textfield mb-4"
                                                            value={formData.multilineField}
                                                            onChange={handleChange}
                                                            sx={{
                                                                margin: 0,
                                                                padding: 0,
                                                                '& .MuiInput-underline:before': { borderBottomColor: '#e5cc92' },
                                                                '& .MuiInput-underline:after': { borderBottomColor: '#e5cc92' },
                                                            }}
                                                        />
                                                        <Button type="submit" variant="outlined" sx={{ mt: 2, padding: " 8px 50px 8px 50px" }}>
                                                            Send
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Box>
                                        <img className="mt-5" src={lineContactUs} style={{ width: "60%" }} />
                                    </div>
                                </AnimatedComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Zoom
                in={isFabVisible}
                timeout={500}
                style={{
                    transitionDelay: `${isFabVisible ? 500 : 0}ms`,
                }}
                unmountOnExit
            >
                <div>
                    <Fab
                        ref={fabRef}
                        sx={fab.sx}
                        aria-label={fab.label}
                        color={fab.color}
                        onClick={handleDirectToWhatsApp}
                        onMouseEnter={handlePopperOpen}
                        onMouseLeave={handlePopperClose}
                    >
                        {fab.icon}
                    </Fab>
                    <Popper
                        open={showInitialPopper || Boolean(anchorEl)}
                        anchorEl={anchorEl || fabRef.current}
                        placement="left"
                        transition
                    >
                        {({ TransitionProps }) => (
                            <Zoom {...TransitionProps}>
                                <img src={textPromptWa} alt="textPromptWa" style={{ width: 120, paddingBottom: 36 }} />
                            </Zoom>
                        )}
                    </Popper>
                </div>
            </Zoom>
        </div >
    )
}

export default ContactUs;