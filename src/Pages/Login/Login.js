import { useState } from "react";
import { useAuth } from "../../context/DataContext";
// UI Imports (MUI to match your Modal)
import { Google, Visibility, VisibilityOff } from "@mui/icons-material"; // Material Icons
import {
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";

// Asset Import
import { toast } from "react-toastify";
import poster from "../../assets/images/poster.jpeg"; // Using the same poster as the modal

const Login = () => {
    const { signInWithGoogle, signInWithEmail } = useAuth();
    // State
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // --- Handlers ---

    const handleEmailLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.warn("Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);
            // Call the Context function which handles Role & Navigation
            await signInWithEmail(email, password);
        } catch (error) {
            // The context throws an error message if it fails
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };



    const pageContainerStyle = {
        height: '100vh',
        width: '100vw',
        bgcolor: '#121212', // Slightly darker than the card
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
    };

    const loginCardStyle = {
        bgcolor: '#1E1E1E', // Matches Modal
        border: `1px solid #EBBC64`, // Matches Modal border
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
        borderRadius: '16px',
        display: 'flex',
        overflow: 'hidden', // Keeps the image inside the border radius
        maxWidth: '900px',
        width: '100%',
        flexDirection: { xs: 'column', md: 'row' } // Stack on mobile, side-by-side on desktop
    };

    const imageSideStyle = {
        flex: 1,
        position: 'relative',
        backgroundImage: `url(${poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '200px'
    };

    // Overlay to make the image blend better if needed
    const imageOverlayStyle = {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)'
    };

    const formSideStyle = {
        flex: 1.2,
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: '#fff'
    };

    const textFieldSx = {
        mb: 3,
        '& .MuiInputLabel-root': { color: '#aaa' }, // Label color
        '& .MuiInputLabel-root.Mui-focused': { color: '#EBBC64' }, // Focus label color
        '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: '#444' }, // Default border
            '&:hover fieldset': { borderColor: '#EBBC64' }, // Hover border
            '&.Mui-focused fieldset': { borderColor: '#EBBC64' }, // Focus border
        }
    };

    return (
        <Box sx={pageContainerStyle}>
            <Box sx={loginCardStyle}>

                {/* Left Side: Image */}
                <Box sx={imageSideStyle}>
                    <Box sx={imageOverlayStyle} />
                </Box>

                {/* Right Side: Login Form */}
                <Box sx={formSideStyle}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#EBBC64', mb: 1 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ccc', mb: 4 }}>
                        Please login to access the APCS Jury & Admin Portal.
                    </Typography>

                    <form onSubmit={handleEmailLogin}>
                        <TextField
                            label="Email Address"
                            fullWidth
                            variant="outlined"
                            sx={textFieldSx}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            variant="outlined"
                            sx={textFieldSx}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: '#aaa' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{
                                backgroundColor: '#EBBC64',
                                color: '#1E1E1E',
                                fontWeight: 700,
                                padding: '12px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '16px',
                                '&:hover': {
                                    backgroundColor: '#D4A54E'
                                }
                            }}
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </Button>
                    </form>

                    <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
                        <Divider sx={{ flex: 1, bgcolor: '#444' }} />
                        <Typography sx={{ mx: 2, color: '#666', fontSize: '14px' }}>OR</Typography>
                        <Divider sx={{ flex: 1, bgcolor: '#444' }} />
                    </Box>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Google />}
                        onClick={signInWithGoogle}
                        disabled={loading}
                        sx={{
                            borderColor: '#444',
                            color: '#fff',
                            padding: '10px',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '15px',
                            '&:hover': {
                                borderColor: '#EBBC64',
                                backgroundColor: 'rgba(235, 188, 100, 0.05)'
                            }
                        }}
                    >
                        Sign in with Google
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;