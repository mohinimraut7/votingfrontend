


import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Container, Divider, InputAdornment, IconButton, Paper, Fade } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/actions/loginActions';
// import MathCaptcha from "./MathCapcha"; // Import Captcha
import { useNavigate } from 'react-router-dom';
import vvcmclogo from '../../Images/vvcmclogo.jpg';
import { baseUrl } from '../../config/config';
import LoaderLottie from '../../components/LoaderLottie'; // Import Loader

import './Auth.css';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login = () => {
    const [captchaValid, setCaptchaValid] = useState(false);
    const [showResend, setShowResend] = useState(false); // State to show resend button
    const [userEmail, setUserEmail] = useState(""); // Store email for resend
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authError = useSelector((state) => state.auth.error);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        document.body.classList.add('auth-body');
        // document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        document.body.style.minHeight = '100vh';
        document.body.style.margin = '0';
        return () => {
            document.body.classList.remove('auth-body');
            document.body.style.background = '';
            document.body.style.minHeight = '';
        };
    }, [dispatch]);

    useEffect(() => {
        if (authError === "Email is not verified. Please verify your email to login.") {
            setShowResend(true);
        } else {
            setShowResend(false);
        }
    }, [authError]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
          
            setUserEmail(values.email); // Store email for resend verification
            setLoading(true);

            try {
                await dispatch(login(values, navigate));
                resetForm();
            } catch (error) {
                setSubmitting(false);
            } finally {
                setLoading(false); // ✅ Hide Loader
            }
        },
    });

   

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box 
            sx={{ 
              
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                
            }}
        >
            <Container className="Auth-Container" maxWidth="sm">
                <Fade in={true} timeout={800}>
                    <Paper
                        elevation={24}
                        sx={{
                            width: { xs: '70%', sm: '70%', md: '55%' },
                            margin: 'auto',
                            padding: { xs: '20px', sm: '30px', md: '20px' },
                            borderRadius: { xs: '16px', sm: '20px' },
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                            bgcolor: 'background.paper',
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                        component='form'
                        onSubmit={formik.handleSubmit}
                    >
                       

                        
                        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                            
                            <Typography 
                                 variant="h4" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#333',
                                    mb: 1,
                                    fontSize: '25px',
                                    background: 'linear-gradient(135deg, #4caf50, #45a049)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Log In
                            </Typography>
                        </Box>

                        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>

                               {/* Email Field */}
                        <TextField
                        size="lg"
                            fullWidth
                            id="email"
                            name="email"
                            label="Enter email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                sx: { 
                                    color: 'gray',
                                    fontSize: { xs: '14px', sm: '16px' }
                                },
                            }}
                            sx={{
                                  width: '90%',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#fff',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
                                    },
                                    '& fieldset': {
                                        borderColor: '#e0e0e0',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#4caf50',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4caf50',
                                        borderWidth: '2px',
                                    },
                                },
                                mb: { xs: 1, sm: 2 }
                            }}
                        />

                        {/* Password Field */}
                        <TextField
                        size="lg"
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                sx: { 
                                    color: 'gray',
                                    fontSize: { xs: '14px', sm: '16px' }
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton 
                                            onClick={handleTogglePassword} 
                                            edge="end"
                                            sx={{
                                                color: '#4caf50',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                    transform: 'scale(1.1)'
                                                }
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: '90%',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#fff',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
                                    },
                                    '& fieldset': {
                                        borderColor: '#e0e0e0',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#4caf50',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4caf50',
                                        borderWidth: '2px',
                                    },
                                },
                                mb: { xs: 2, sm: 3 }
                            }}
                        />
                        </Box>

                     

                       
                        {authError && (
                            <Fade in={Boolean(authError)}>
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        mb: 2,
                                        p: 2,
                                        backgroundColor: '#ffebee',
                                        borderRadius: '12px',
                                        border: '1px solid #ffcdd2'
                                    }}
                                >
                                    <Typography 
                                        variant="body2" 
                                        color="error" 
                                        align="center" 
                                        sx={{ 
                                            fontSize: { xs: '12px', sm: '14px' },
                                            fontWeight: 500
                                        }}
                                    >
                                        {authError}
                                    </Typography>
                                </Paper>
                            </Fade>
                        )}

                     
                     
                        {loading && (
                            <Fade in={loading}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    width: '100%',
                                    // mb: 2,
                                    // p: 2
                                }}>
                                    <LoaderLottie />
                                </Box>
                            </Fade>
                        )}

                        {/* Login Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className='Auth-Button'
                                size="lg"
                                sx={{
                                    width: { xs: '100%', sm: '90%' },
                                    // py: { xs: 1.5, sm: 2 },
                                    borderRadius: '12px',
                                    fontSize: { xs: '14px', sm: '16px' },
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
                                    textTransform: 'none',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)',
                                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Login
                            </Button>
                        </Box>

                        {/* Divider */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mt: { xs: 3, sm: 1.5 },
                            mb: { xs: 2, sm: 1.5 }
                        }}>
                            <Divider 
                                sx={{ 
                                    width: '30%', 
                                    borderColor: '#e0e0e0', 
                                    borderWidth: '1px',
                                    '&::before, &::after': {
                                        borderColor: '#e0e0e0',
                                        borderWidth: '1px'
                                    }
                                }} 
                            />
                            <Typography sx={{ 
                                fontSize: { xs: '12px', sm: '14px' }, 
                                color: 'gray', 
                                fontWeight: 'bold',
                                // mx: 2,
                                // px: 2,
                                // py: 1,
                                backgroundColor: '#f5f5f5',
                                borderRadius: '20px'
                            }}>
                                Or
                            </Typography>
                            <Divider 
                                sx={{ 
                                    width: '30%', 
                                    borderColor: '#e0e0e0', 
                                    borderWidth: '1px',
                                    '&::before, &::after': {
                                        borderColor: '#e0e0e0',
                                        borderWidth: '1px'
                                    }
                                }} 
                            />
                        </Box>

                        {/* Create Account Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                // className='Auth-Button-Signup'
                                size="lg"
                                sx={{
                                    width: { xs: '100%', sm: '90%' },
                                    // py: { xs: 1.5, sm: 2 },
                                    borderRadius: '12px',
                                    fontSize: { xs: '12px', sm: '14px' },
                                    fontWeight: 'bold',
                                    borderColor: '#4caf50',
                                    color: '#fff',
                                    backgroundColor: '#4caf50',
                                    borderWidth: '2px',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#4caf50',
                                        color: 'white',
                                        borderColor: '#4caf50',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
                                        borderWidth: '2px'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Typography
                                    component={Link}
                                    to="/register"
                                    sx={{
                                        fontSize: 'inherit',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        fontWeight: 'inherit',
                                        '&:hover': { 
                                            textDecoration: 'none'
                                        },
                                    }}
                                >
                                    Create New Account
                                </Typography>
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default Login;