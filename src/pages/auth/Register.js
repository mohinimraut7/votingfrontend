import React,{useEffect,useState} from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Container,InputAdornment,IconButton} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import vvcmclogo from '../../Images/vvcmclogo.jpg'; 
import wardData from '../../data/warddata';
import { addUser } from '../../store/actions/userActions';
import LoaderLottie from '../../components/LoaderLottie';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// import './Register.css';
const validationSchema = Yup.object({
    username: Yup.string().required('User Name is required'),
    email: Yup.string().required('Email is required'),
    // password: Yup.string().required('Password is required'),
     password: Yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
            .required('Password is required'),
    // contactNumber: Yup.string().required('Contact Number is required'),
    contactNumber: Yup.string()
        .matches(/^\d{10}$/, "Contact number must be 10 digits")
        .required("Contact number is required"),
    address: Yup.string().required('Address is required'),

    // role: Yup.string().required('Role is required'),
    // ward: Yup.string().required('Ward is required'), // Add validation for ward
});
const Register = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
   
        document.body.classList.add('auth-body');
        return () => {
          document.body.classList.remove('auth-body');
        };
    
      }, [dispatch]);
    const formik = useFormik({
        initialValues: {
            username:'',
            email:'',
            password:'',
            contactNumber:'',
            address:'',
            role:'',
            ward:''
        },
        validationSchema: validationSchema,
        // onSubmit: (values) => {
        //         dispatch(addUser(values));
        //       }
        onSubmit: async (values) => {
            setLoading(true); // Loader सुरू करणे
            try {
                await dispatch(addUser(values));
            } finally {
                setLoading(false); // Loader बंद करणे
            }
        }
    });

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    width: '80%',
                    margin: 'auto',
                    padding: '15px 30px 30px 30px',
                    border: '1px solid #d3d3d3',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    bgcolor: 'background.paper',
                    
                }}
                component='form'
                    onSubmit={formik.handleSubmit}
            >
                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
<Box sx={{ width: '100%',display:'flex',justifyContent:'center',mb:1.2}}>
    <Typography sx={{fontWeight:'bold',fontSize:'20px'}}>Create a new account</Typography>
    </Box>
</Box>

                
                 {/* <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                        USER NAME
                    </Typography> */}
                <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    margin="normal"
                    variant="outlined"
                    className='Auth-Input'
                    sx={{marginBottom:'14px'}}
                    size="small"
                    InputLabelProps={{
                        sx: {
                            color: '#DDDDDD', // Change this to the desired color
                        },
                    }}
                />
                 {/* <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                        EMAIL
                    </Typography> */}
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    margin="normal"
                    variant="outlined"
                    className='Auth-Input'
                    sx={{marginBottom:'14px'}}
                   size="small"
                    InputLabelProps={{
                        sx: {
                            color: '#DDDDDD', // Change this to the desired color
                        },
                    }}
                />
                {/* <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                  PASSWORD
                 </Typography> */}
                <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ?'password':'text'}  
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    margin="normal"
                    variant="outlined"
                    className='Auth-Input'
                    sx={{marginBottom:'14px'}}
                    size="small"
                    InputLabelProps={{
                        sx: {
                            color: '#DDDDDD', // Change this to the desired color
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleTogglePassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {/* <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                 CONTACT NUMBER
                 </Typography> */}
                <TextField
                    fullWidth
                    id="contactNumber"
                    name="contactNumber"
                    label="Contact Number"
                    value={formik.values.contactNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                    helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                    margin="normal"
                    variant="outlined"
                    className='Auth-Input'
                    sx={{marginBottom:'14px'}}
                    size="small"
                    inputProps={{ maxLength: 10 }} 
                    InputLabelProps={{
                        sx: {
                            color: '#DDDDDD', // Change this to the desired color
                        },
                    }}
                />
                {/* <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                 ADDRESS
                 </Typography> */}
                 <TextField
                        fullWidth
                        id="address"
                        name="address"
                        label="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                        margin="normal"
                        variant="outlined"
                        multiline
                        minRows={1}
                       size="small"
                        
                        InputLabelProps={{
                            sx: {
                                color: '#DDDDDD', // Change this to the desired color
                            },
                        }}
    maxRows={10} 
    className='Auth-Input'
    sx={{
        '& .MuiOutlinedInput-root': {
            '& textarea': {
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '10px', 
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555', 
                },
            },
        },
        marginBottom:'14px'
    }}
                    />
                {/* <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                 ROLE
                 </Typography>
                <FormControl fullWidth margin="normal" variant="outlined" className='Auth-Input' sx={{marginBottom:'14px'}}>
                    <InputLabel id="role-label" sx={{color:"#DDDDDD"}}>Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        label="Role"
                        error={formik.touched.role && Boolean(formik.errors.role)}
                    >
                        <MenuItem value="Super Admin">Super Admin</MenuItem>
                        <MenuItem value="Additional Commissioner">Additional Commissioner</MenuItem>
                        <MenuItem value="Deputy Commissioner">Deputy Commissioner</MenuItem>
                        <MenuItem value="Executive Engineer">Executive Engineer</MenuItem>
                        <MenuItem value="Junior Engineer">Junior Engineer</MenuItem>
                        <MenuItem value="Consumer">Consumer</MenuItem>
                    </Select>
                    {formik.touched.role && formik.errors.role && (
                        <Typography color="error" variant="caption">{formik.errors.role}</Typography>
                    )}
                </FormControl> */}

                {/* <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                 WARD
                 </Typography> */}
                {/* <FormControl fullWidth margin="normal" variant="outlined" className='Auth-Input' size="small">
                        <InputLabel id="ward-label" sx={{color:"#DDDDDD"}}>Ward</InputLabel>
                        <Select
                            labelId="ward-label"
                            id="ward"
                            name="ward"
                            value={formik.values.ward}
                            onChange={formik.handleChange}
                            label="Ward"
                            error={formik.touched.ward && Boolean(formik.errors.ward)}

                            
                        >
                            {wardData.map((ward, index) => (
                                <MenuItem key={index} value={ward.ward}>{ward.ward}</MenuItem>
                            ))}
                        </Select>
                       
                    </FormControl> */}
                <Box sx={{display: 'flex', justifyContent: 'center' }}>


                {loading ? <LoaderLottie /> : (
    <Button
    type="submit"
    variant="contained"
    color="primary"
    className='Auth-Button-Signup'
    sx={{
       backgroundColor:'#00A400',
        '&:hover': {
            bgcolor: '#81c784',
        }
    }}
>
    Register
</Button>

)}


                   
                </Box>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',height:'20px',marginTop:'10px'}}>
                <Typography
        component={Link}
        to="/login"
        sx={{
          textDecoration: 'none', // Remove underline
          fontSize:'12px',
          color: '#797DF2',       // Inherit the color from parent, or you can set custom color here
          '&:hover': {
            color: '#1976d2',     // Set hover color if needed
          }
        }}
      >
        Already have an account?
      </Typography>
                    </Box>
            </Box>
        </Container>
    );
};
export default Register;
