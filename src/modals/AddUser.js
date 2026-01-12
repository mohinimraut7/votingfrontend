import React,{useState} from 'react';
import { Modal, Box, Typography, TextField, Button,MenuItem, Select, InputLabel, FormControl,InputAdornment,IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import rolesdata from '../../data/rolesdata';
import rolesupervisors from '../../data/rolesupervisors';
import wardData from '../../data/warddata';
import './AddUser.css';
import SignaturePad from '../SignaturePad';
import SignatureUpload from '../SignatureUpload';

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
        .notRequired(),
    contactNumber: Yup.string().required('Contact Number is required')
    .matches(/^\d{10}$/, 'Contact Number must be exactly 10 digits'),
    address: Yup.string().required('Address is required'),
  });
  const rolesToDisplayField = [
    'Additional Commissioner',
    'Deputy Commissioner',
    'Admin',
    'Junior Engineer',
    'Executive Engineer',
    'Super Admin',
  ];
const AddUser = ({ open, handleClose, handleAddUser,currentUser,editUser }) => {
        const [showPassword, setShowPassword] = useState(false);
        const [signatureMethod, setSignatureMethod] = useState('draw'); // 'draw' or 'upload'
    const formik = useFormik({
        initialValues: {
          username: currentUser ? currentUser.username : '',
          email: currentUser ? currentUser.email : '',
          password: currentUser ? currentUser.password : '',
          contactNumber: currentUser ? currentUser.contactNumber : '',
          address: currentUser ? currentUser.address : '',
          signature: currentUser ? currentUser.signature : '',
        },
        validationSchema: validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        onSubmit: (values) => {
          if (currentUser && !values.password) {
            values.password = currentUser.password;
          }
          if (currentUser) {
            editUser(currentUser._id, values);
          } else {
            handleAddUser(values);
          }
          handleClose();
        },
      });
    const shouldDisplayRoleField = rolesToDisplayField.includes(formik.values.role);
    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    const handleSignatureChange = (signatureData) => {
        formik.setFieldValue('signature', signatureData);
    };
    
    return (
        <Modal open={open} onClose={handleClose}>   
            <Box
                sx={{
                    mb:5,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    // width: 400,
                    width: {xl:'40%',lg:'40%',md:'60%'},
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius:'5px',
                    p: 4,
                    maxHeight: '90%',
                    overflow: 'auto',
                    paddingTop:'20px',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#23CCEF', 
                        borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#1EA2C1', 
                    },
                    
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        padding: '30px',
                        margin: 'auto',
                       
                    }}
                    component='form'
                    onSubmit={formik.handleSubmit}
                >
                    
                     <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                        USER NAME
                    </Typography>
                     <TextField
                        size="small"
                        fullWidth
                        id="username"
                        name="username"
                        label="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        margin="normal"
                        variant="outlined"
                        className='A-U-Input'
                    />
                     <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                        EMAIL
                    </Typography>
                   <TextField
                        size="small"
                        fullWidth
                        id="email"
                        name="email"
                        label="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        margin="normal"
                        variant="outlined"
                        className='A-U-Input'
                    />
                     <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                  PASSWORD
                 </Typography>
                        <TextField
                        size="small"
                        fullWidth
                        id="password"
                        name="password"
                        label="password"
                        type={showPassword ?'password':'text'}  
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        margin="normal"
                        variant="outlined"
                        className='A-U-Input'
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

                <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                 CONTACT NUMBER
                 </Typography>
                        <TextField
                        size="small"
                        fullWidth
                        id="contactNumber"
                        name="contactNumber"
                        label="contactNumber"
                        value={formik.values.contactNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                        helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                        margin="normal"
                        variant="outlined"
                        className='A-U-Input'
                        inputProps={{ maxLength: 10 }} 
                    />
                     <Typography  className='Auth-Label' variant="subtitle1" gutterBottom>
                 ADDRESS
                 </Typography>
                     <TextField
                       size="small"
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
                        className='A-U-Input'
    maxRows={10} 
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
    }}
                    />
                      


 


                   
                     <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center'}}>
                        <Button
                        size="small"
                            type="button"
                            onClick={handleClose}
                            variant="contained"
                            sx={{
                                mr: 2,
                                backgroundColor: '#FB404B',
                                width: '100px',
                                '&:hover': {
                                   backgroundColor: '#FB404B',
                                   opacity:'0.8', 
                                   borderColor: '#FB404B',
                                   transform: 'translateY(-1px)',
                                   boxShadow: '0 4px 12px #FB404B',
                                  
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="small"
                            type="submit"
                            variant="contained"
                            sx={{
                                  backgroundColor:'#20B2AA',
                                  color: '#fff',
                                  borderColor: '#20B2AA',
                                  cursor: 'pointer',
                                  textTransform: 'uppercase',
                                '&:hover': {
                                   backgroundColor: '#20B2AA',
                                   borderColor: '#20B2AA',
                                   transform: 'translateY(-1px)',
                                   boxShadow: '0 4px 12px #20B2AA',
                                   opacity:'0.8'
                                }
                            }}
                        >
                            {currentUser ? 'Update User' : 'Add User'}
                        </Button>
                   
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddUser;
