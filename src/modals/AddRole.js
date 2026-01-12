import React from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import wardData from '../../data/warddata';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './AddRole.css';
import rolesdata from '../../data/rolesdata';
import FormHelperText from '@mui/material/FormHelperText'; 
const validationSchema = Yup.object({
    name: Yup.string().required('Role name is required'),
    email: Yup.string().required('Email is required'),
});
const AddRole = ({ open, handleClose, handleAddRole, currentRole, editRole }) => {
    const formik = useFormik({
        initialValues: {
            name: currentRole ? currentRole.name : '',
            email: currentRole ? currentRole.email : '',
            // ward: currentRole ? currentRole.ward : '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (currentRole) {
                editRole(currentRole._id, values);
            } else {
                handleAddRole(values);
            }
            handleClose();
        },
    });
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95%', sm: '75%', md: '50%', lg: '53%',xl: '55%' }, 
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '4px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
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
                        borderRadius: '4px',
                    }}
                    component='form'
                    onSubmit={formik.handleSubmit}
                >
<Typography className='Auth-Label' variant="subtitle1" gutterBottom>
    ROLE NAME
</Typography>
<FormControl fullWidth margin="normal" variant="outlined" className='A-U-Input'>
    <InputLabel id="role-label">Role</InputLabel>
    <Select
        labelId="role-label"
        id="name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        label="Role Name"
        error={formik.touched.name && Boolean(formik.errors.name)}
    >
        {rolesdata.map((role, index) => (
            <MenuItem key={role.id} value={role.rolename}>{role.rolename}</MenuItem>
        ))}
    </Select>
    {formik.touched.name && formik.errors.name ? (
        <FormHelperText error>{formik.errors.name}</FormHelperText>
    ) : null}
</FormControl>

                    <Typography className='A-R-Label' variant="subtitle1" gutterBottom>
                        EMAIL
                    </Typography>
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
                        InputLabelProps={{
                            sx: {
                                color: '#DDDDDD',
                            },
                        }}
                    />

                    {/* <Typography className='A-R-Label' variant="subtitle1" gutterBottom>
                        WARD
                    </Typography>
                    <FormControl fullWidth margin="normal" variant="outlined" className='A-U-Input'>
                        <InputLabel id="ward-label">Ward</InputLabel>
                        <Select
                            labelId="ward-label"
                            id="ward"
                            name="ward"
                            value={formik.values.ward}
                            onChange={formik.handleChange}
                            label="Ward"
                        >
                            {wardData.map((ward, index) => (
                                <MenuItem key={index} value={ward.ward}>{ward.ward}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="contained"
                             size="small"
                            sx={{
                                mr: 2,
                                backgroundColor: '#FB404B',
                                width: '100px',
                                '&:hover': {
                                    backgroundColor: '#FB404B',
                                    opacity: '0.8',
                                    transform: 'translateY(-1px)',
                                   boxShadow: '0 4px 12px #FB404B',
                                  
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                          
                             size="small"
                             variant="outlined"
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
                            {currentRole ? 'Update Role' : 'Add Role'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};
export default AddRole;
