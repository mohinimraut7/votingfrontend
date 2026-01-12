import React, { useEffect, useState } from 'react';
import AddRole from '../components/modals/AddRole';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addRole,fetchRoles,deleteRole,editRole } from '../store/actions/roleActions';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Paper, Container, useTheme, useMediaQuery } from '@mui/material';
import './Rolemaster.css';
import { styled } from '@mui/material/styles';
import { CircularProgress} from '@mui/material';

const columns = (handleDeleteRole,handleEditRole)=>[
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 80,
    minWidth: 60,
    flex: 0.3,
    headerAlign: 'center',
    align: 'center',
    sortable: true
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    minWidth: 120,
    flex: 0.5,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <IconButton 
          sx={{
            color:'#FFA534',
            '&:hover': {
              backgroundColor: 'rgba(255, 165, 52, 0.1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s'
          }}  
          onClick={() => handleDeleteRole(params.row._id)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton 
          sx={{
            color:'#20B2AA',
            '&:hover': {
              backgroundColor: 'rgba(35, 204, 239, 0.1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s'
          }}  
          onClick={() => handleEditRole(params.row)}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
  { 
    field: 'name', 
    headerName: 'ROLE NAME', 
    width: 200,
    minWidth: 150,
    flex: 1,
    headerAlign: 'left',
    align: 'left',
    sortable: true
  },
  { 
    field: 'email', 
    headerName: 'EMAIL', 
    width: 250,
    minWidth: 200,
    flex: 1.2,
    headerAlign: 'left',
    align: 'left',
    sortable: true
  },
];

const Rolemaster = () => {
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.roles);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [roleOpen,setRoleOpen]=useState(false);
  const [role, setRole] = useState('');
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleAddRoleOpen=()=>{
    setCurrentRole(null);
    setRoleOpen(true)
  }

  const handleAddRoleClose=()=>{
    setRoleOpen(false)
  }

  const handleAddRole = (roleData) => {
    dispatch(addRole(roleData));
    handleAddRoleClose();
  };

  const handleEditRole = (role) => {
    setCurrentRole(role); 
    setRoleOpen(true);
  };

  const handleDeleteRole = (roleId) => {
    dispatch(deleteRole(roleId));
  };
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <CircularProgress size={60} sx={{ color: '#23CCEF' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  const rows = roles.map((role,index) => ({
    id:index+1,
    _id: role._id||'-',
    name: role.name||'-',
    username: role.username||'-',
    email:role.email||'-',
    contactNumber: role.contactNumber||'-',
    password:role.password||'-',
    ward:role.ward||'-'
  }));

  const getResponsiveWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return isSidebarOpen ? '85%' : '95%';
    return isSidebarOpen ? '82%' : '92%';
  };

  const getResponsiveMargin = () => {
    if (isMobile) return '0';
    if (isTablet) return isSidebarOpen ? '15%' : '5%';
    return isSidebarOpen ? '18%' : '8%';
  };

  const gridStyle = {
    minHeight: 'calc(100vh - 40px)',
    width: getResponsiveWidth(),
    marginLeft: getResponsiveMargin(),
    marginTop: '20px',
    marginBottom: '20px',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    padding: isMobile ? '10px' : '20px',
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    '& .MuiDataGrid-main': {
      borderRadius: '12px',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #e9ecef',
      borderRadius: '12px 12px 0 0',
      fontSize: '14px',
      fontWeight: 600,
      color: '#495057',
      minHeight: '56px !important',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
      fontSize: '14px',
      color: '#495057',
    },
    '& .MuiDataGrid-cell': {
      padding: theme.spacing(1.5),
      fontSize: '14px',
      color: '#495057',
      borderBottom: '1px solid #f1f3f4',
    },
    '& .MuiDataGrid-row': {
      '&:nth-of-type(odd)': {
        backgroundColor: '#fbfcfd',
      },
      '&:nth-of-type(even)': {
        backgroundColor: 'white',
      },
      '&:hover': {
        backgroundColor: '#e3f2fd !important',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
      },
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: '#f8f9fa',
      borderTop: '2px solid #e9ecef',
      borderRadius: '0 0 12px 12px',
      minHeight: '56px',
    },
    '& .MuiDataGrid-selectedRowCount': {
      color: '#495057',
    },
    '& .MuiCheckbox-root': {
      color: '#23CCEF',
    },
    '& .MuiDataGrid-checkboxInput.Mui-checked': {
      color: '#23CCEF',
    },
    '& .MuiDataGrid-menuIcon': {
      color: '#495057',
    },
    '& .MuiDataGrid-sortIcon': {
      color: '#495057',
    },
    '& .MuiDataGrid-columnSeparator': {
      color: '#e9ecef',
    },
  }));

  return (
    <div style={gridStyle}>
      <Container maxWidth={false} sx={{ padding: '0 !important' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            padding: isMobile ? '20px 15px' : '30px 25px',
            borderRadius: '16px',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef'
          }}
        >
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0
          }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{
                color: '#0d2136',
                fontWeight: 600,
                fontSize: isMobile ? '1.5rem' : '1.75rem',
                letterSpacing: '0.5px',
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              ROLE MASTER
            </Typography>
            <Button
            size="small"
              variant="outlined"
              startIcon={<AddIcon />}
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
                },
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={handleAddRoleOpen}
            >
              Add Role
            </Button>
          </Box>

          <Box sx={{ 
            width: '100%', 
            height: isMobile ? '400px' : '600px',
            '& .MuiDataGrid-root': {
              height: '100%',
            }
          }}>
            <StyledDataGrid
              rows={rows}
              columns={columns(handleDeleteRole,handleEditRole)}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: isMobile ? 5 : 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              // checkboxSelection
              disableRowSelectionOnClick
              autoHeight={false}
              sx={{
                minHeight: isMobile ? '400px' : '500px',
              }}
            />
          </Box>

          <AddRole
            open={roleOpen}
            handleClose={handleAddRoleClose}
            handleAddRole={handleAddRole}
            currentRole={currentRole}
            editRole={(roleId, roleData) => {
              dispatch(editRole(roleId, roleData));
              dispatch(fetchRoles());
            }}
          />
        </Paper>
      </Container>
    </div>
  );
};

export default Rolemaster;