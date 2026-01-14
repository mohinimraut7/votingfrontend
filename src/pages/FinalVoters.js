
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Typography,
  Box,
  Button,
  Paper,
  Container,
  TextField,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
// import RefreshIcon from '@mui/icons-material/RefreshIcon';

import ReplayIcon from '@mui/icons-material/Replay';
 
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../config/config';
import {
  Dialog,
  DialogContent,
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useRef } from 'react';
import './FinalVoter.css';
import voterSlipImg from "../Images/voterslipbanner.jpg"

import BulkVoterCard from './BulkVoterCard';
import html2pdf from "html2pdf.js";
// import { bannerBase64 } from '../../public/bannerBase64';



import finvoters from '../data/finalvoters.json';
// import dummyUser from "../Images/voterimages/FXG0649533.jpg";
// import imagesvoters from '../Images/voterimages';

console.log("Length:", finvoters?.length);




/* ================= API ================= */
const API_URL = `${baseUrl}/getFinalVoters`;

/* ================= COLUMNS ================= */


/* ================= COMPONENT ================= */
const FinalVoters = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [voters, setVoters] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Single search
  const [searchText, setSearchText] = useState('');
    const [searchHouse, setSearchHouse] = useState('');

  
  const [appliedSearch, setAppliedSearch] = useState('');
    const [appliedSearchHouse, setAppliedSearchHouse] = useState('');


  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 96,
  });

const [openModal, setOpenModal] = useState(false);
const [selectedVoter, setSelectedVoter] = useState(null);

const [printMode, setPrintMode] = useState(null); // 'A4' | 'SLIP'

const [showBulkSlips, setShowBulkSlips] = useState(false);

const [imageModalOpen, setImageModalOpen] = useState(false);
const [imageUrl, setImageUrl] = useState('');
const [photoExists, setPhotoExists] = useState({});
const checkImageExists = (voterId) => {
  if (photoExists[voterId] !== undefined) return;

  const img = new Image();
  img.src = `https://pub-a4cb67c45dc144a680b4ffe52e34ef06.r2.dev/voters/${voterId}.webp`;

  img.onload = () => {
    setPhotoExists(prev => ({ ...prev, [voterId]: true }));
  };

  img.onerror = () => {
    setPhotoExists(prev => ({ ...prev, [voterId]: false }));
  };
};



const columns = (handleDelete, handleEdit) => [
//   {
//   field: 'voterId',
//   headerName: 'Voter ID',
//   width: 150,
//   renderCell: (params) => {
//     const voterId = params.value;

//     return (
//       <span
//         style={{
//           color: '#1976D2',
//           textDecoration: 'underline',
//           fontWeight: 600,
//           cursor: 'pointer',
//         }}
//         onClick={(e) => {
//           e.stopPropagation();              // 🔥 DataGrid row click block
//           setSelectedVoter(params.row);     // ✅ FULL voter object pass
//           setImageModalOpen(true);          // ✅ SAME dialog open
//         }}
//       >
//         {voterId}
//       </span>
//     );
//   },
// },

{
  field: 'voterId',
  headerName: 'Voter ID',
  width: 150,
  renderCell: (params) => {
    const voterId = params.value;

    // 🔥 image exists check trigger
    checkImageExists(voterId);

    const hasPhoto = photoExists[voterId];

    return (
      <span
        style={{
          color: hasPhoto ? '#1976D2' : '#111827',
          textDecoration: hasPhoto ? 'underline' : 'none',
          fontWeight: 600,
          cursor: hasPhoto ? 'pointer' : 'default',
        }}
        onClick={(e) => {
          if (!hasPhoto) return;        // ❌ image नसेल तर click बंद
          e.stopPropagation();
          setSelectedVoter(params.row);
          setImageModalOpen(true);
        }}
      >
        {voterId}
      </span>
    );
  },
},


 { field: 'name', headerName: 'Name', width: 220 },
  { field: 'srn', headerName: 'Sr No', width: 80 },
   { field: 'boothNumber', headerName: 'Booth', width: 80 },
    { field: 'boothName', headerName: 'Booth Name', width: 260 },
     {
    field: 'mobileOne',
    headerName: 'Mobile 1',
    width: 140,
    renderCell: (p) => p.value || '-',
  },
  {
    field: 'mobileTwo',
    headerName: 'Mobile 2',
    width: 140,
    renderCell: (p) => p.value || '-',
  },
  { field: 'relativeName', headerName: 'Relative Name', width: 200 },
  { field: 'finalSrn', headerName: 'Final Sr No', width: 110 },
  { field: 'corporation', headerName: 'Corporation', width: 150 },
  { field: 'wardNumber', headerName: 'Ward', width: 80 },
  
 
 



 
  
  { field: 'gender', headerName: 'Gender', width: 80 },
  { field: 'age', headerName: 'Age', width: 70 },
  { field: 'village', headerName: 'Village', width: 160 },
  // { field: 'colorCode', headerName: 'Color', width: 100 },
 
  { field: 'houseNo', headerName: 'Address', width: 260 },
 
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
       
      </Box>
    ),
  },
];

  

   const fetchVoters = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          search: appliedSearch,
          houseNo: appliedSearchHouse,
        },
      });

      setVoters(res.data.voters || []);
      setTotal(res.data.pagination.totalVoters);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch voters');
    } finally {
      setLoading(false);
    }
  };
 
 
 
 
 
  useEffect(() => {
    fetchVoters();
  }, [paginationModel, appliedSearch,appliedSearchHouse]);




  useEffect(() => {
  if (voters.length === 1) {
    setSelectedVoter(voters[0]);
    setOpenModal(true);
  } else {
    setOpenModal(false);
    setSelectedVoter(null);
  }
}, [voters]);


  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    toast.info(`Delete voter ${id}`);
  };

  const handleEdit = (row) => {
    console.log('EDIT ROW:', row);
  };

const handleRefresh = () => {
  // 🔹 search clear
  setSearchText('');
  setSearchHouse('');
  setAppliedSearch('');
  setAppliedSearchHouse('');

  // 🔹 pagination reset (first page)
  setPaginationModel(prev => ({
    ...prev,
    page: 0,
  }));

  // 🔹 optional: modal बंद
  setOpenModal(false);
  setSelectedVoter(null);

  // 🔹 data reload
  fetchVoters();

  toast.success('Filters cleared');
};

 

  /* ================= DOWNLOAD ================= */
  const downloadVoterReport = () => {
    if (!voters.length) {
      toast.warn('No data');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(voters);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Voters');
    XLSX.writeFile(wb, 'Voter_Master.xlsx');
  };







const downloadAllSlips = () => {
  if (!voters.length) {
    toast.warn('No data');
    return;
  }

  // 🔥 FIRST SLOT पासून सुरू
  setPaginationModel(prev => ({
    ...prev,
    page:35
  }));

  setShowBulkSlips(true);

  setTimeout(() => {
    window.print();
  }, 300);
};


const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};




const generateSinglePDF = async (voters, index) => {
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-9999px";

  wrapper.innerHTML = `
    <div style="padding:8mm">
      ${chunkArray(voters, 6).map(page => `
        <div style="
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:6mm;
          page-break-after:always;
        ">
          ${page.map(voter => `
            <div style="border:1px solid #000;height:240px;font-size:12px">
             
              import voterSlipImg from "../Images/voterslipbanner.jpg"


              <div style="padding:2mm">
                <p><b>Voter ID:</b> ${voter.voterId}</p>
                <p><b>Name:</b> ${voter.name}</p>
                <p><b>Sr No:</b> ${voter.srn}</p>
                <p><b>Building:</b> ${voter.BuildingName}</p>
                <p><b>Address:</b> ${voter.houseNo}</p>
                <hr/>
                <p><b>Booth:</b> ${voter.boothNumber} - ${voter.BoothName}</p>
              </div>
            </div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  `;

  document.body.appendChild(wrapper);

  await html2pdf().set({
    filename: `Voter_Slips_Part_${index}.pdf`,
    margin: 8,
    html2canvas: { scale: 1.5, useCORS: true }, // 🔥 SCALE REDUCED
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  }).from(wrapper).save();

  document.body.removeChild(wrapper);
};


 


// const handlePrintSlip = () => {
//   setPrintMode("SLIP");
//   setTimeout(() => window.print(), 100);
// };

const handlePrintSlip = () => {
  const payload = {
    slipType: "SLIP",
    voterId: selectedVoter?.voterId || "",
    name: selectedVoter?.name || "",
    ward: selectedVoter?.wardNumber || "",
    booth: selectedVoter?.boothNumber || "",
    date: new Date().toLocaleString(),
  };

  window.print(JSON.stringify(payload));
};

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* HEADER */}
      <Box
      
      sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center',
    mb: 2,
    gap: 2,
    flexDirection: { xs: 'column', md: 'row' },
    // border:'1px solid red'
  }}
      >
      

         
         

<TextField
  size="large"
  label="Search By Name / Mobile / Voter ID"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  sx={{
    width: { xs: '100%', md: '35%' },
  }}
/>
<TextField
  size="large"
  label="Search By House No. / Village"
  value={searchHouse}
  onChange={(e) => setSearchHouse(e.target.value)}
  sx={{
    width: { xs: '100%', md: '35%' },
  }}
/>


        <Box sx={{ flexWrap: 'wrap',

    display: 'flex',
    gap: '5px', 
    justifyContent: {
      xs: 'center', 
      sm: 'center', 
      md: 'center', 
    },
    alignItems: {
      xs: 'center', 
      sm: 'center', 
      md: 'center', 
    },
    // border:'1px solid red',
width: {
      xs: '99%',
      sm: '99%',
      md: '20%',
    },
  

        }}>


  <Button
  variant="contained"
  size="lg"
  onClick={handleRefresh}
  sx={{
    minWidth: '36px',
    backgroundColor: '#1976D2',
    '&:hover': { backgroundColor: '#179e96' },
  }}
>
  <ReplayIcon size="small" />
</Button>

      

 


<Button
  variant="contained"
  size="lg"
  onClick={() => {
    // 🔁 pagination reset
    setPaginationModel((prev) => ({ ...prev, page: 0 }));

    // 🔍 apply both searches
    setAppliedSearch(searchText.trim());
    setAppliedSearchHouse(searchHouse.trim());
  }}
  sx={{
    backgroundColor: '#1976D2',
    color: '#fff',
    '&:hover': { backgroundColor: '#179e96' },
  }}
>
  Search
</Button>




          {/* <Button
            startIcon={<DownloadIcon />}
            onClick={downloadVoterReport}
              size='lg'
            sx={{
              backgroundColor: '#1976D2',
              color: '#fff',
              '&:hover': { backgroundColor: '#179e96' },
            }}
          >
            Download
          </Button> */}

         
        </Box>
      </Box>














      

      {/* TABLE */}
      <Container maxWidth={false} sx={{ p: 0 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <StyledDataGrid
            rows={voters}
            columns={columns(handleDelete, handleEdit)}
            getRowId={(row) => row._id}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 50,96,100]}
            getRowClassName={(params) =>
    params.row.flag === "twice" ? "twice-voter-row" : ""
  }
          />
        </Paper>
      </Container>

<Dialog
  open={openModal}
  onClose={() => setOpenModal(false)}
  maxWidth={false}
  fullWidth
  PaperProps={{
    sx: {
      width: '90%',
      maxWidth: 1200,
      borderRadius: 3,
      overflow: 'hidden',
    },
  }}
>
  <DialogContent sx={{ p: 0 }}>
    {selectedVoter && (
      <Box>

      
        <Box
          sx={{
            bgcolor: '#1e40af',
            color: '#fff',
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Voter Details - 1
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              Election Commission – Voter Information
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
           

<Button
  size="small"
  variant="outlined"
  sx={{ borderColor: '#fff', color: '#fff' }}
  onClick={handlePrintSlip}
>
  Print Slip
</Button>

          </Box>
        </Box>

       
        <Grid container>

        
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              bgcolor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
              gap: 1,
            }}
          >
          
         {/* <img
    src={dummyUser}
    alt="logo"
    style={{
      width: '95%',
      maxWidth: '100%',
      height: 'auto',
      objectFit: 'contain',
    }}
  /> */}


<img
  src={`https://pub-a4cb67c45dc144a680b4ffe52e34ef06.r2.dev/voters/${selectedVoter.voterId}.webp`}
  alt="Voter"
  style={{
    width: "95%",
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
  }}
  onError={(e) => {
    e.target.src = "/images/no-image.jpg";
  }}
/>





          </Grid>

        
          {/* <Grid item xs={12} md={8} sx={{ p: 4 }}>
            <Grid container spacing={2}>
              {(() => {
                const hiddenFields = [
                  '_id',
                  '__v',
                  'firstName',
                  'middleName',
                  'lastName',
                  'colorCode',
                ];

                const orderedPairs = [
                  ['corporation', 'wardNumber'],
                  ['voterId', 'name'],
                  ['boothNumber', 'boothName'],
                  ['srnNo', 'assemblyNo'],
                  ['houseNo', 'PartNo'],
                  ['mobileOne', 'mobileTwo'],
                  ['village', null],
                ];

                  // return orderedPairs.map((pair, rowIndex) =>
                  //   pair.map((key) => {
                  //     if (!key) return null;
                  //     if (hiddenFields.includes(key)) return null;
                  //     if (!(key in selectedVoter)) return null;








  return orderedPairs.map((pair, rowIndex) =>
        pair.map((key) => {
          // 🔥 HANDLE null + flag logic
          const displayKey =
            key === null && selectedVoter.flag === "twice"
              ? "flag"
              : key;

          if (!displayKey) return null;
          if (hiddenFields.includes(displayKey)) return null;









                    return (
                      <Grid item xs={12} sm={6} key={`${key}-${rowIndex}`}>
                        <Box sx={{ py: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#6b7280',
                              letterSpacing: '0.05em',
                              fontSize: '11px',
                            }}
                          >
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .toUpperCase()}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: '#111827',
                            }}
                          >
                            {selectedVoter[key] || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })
                );
              })()}
            </Grid>

          
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="caption"
                sx={{ color: '#6b7280' }}
              >
                This is an official voter information record.
              </Typography>
            </Box>
          </Grid> */}

          <Grid item xs={12} md={8} sx={{ p: 4 }}>
  <Grid container spacing={2}>
    {(() => {
      const hiddenFields = [
        '_id',
        '__v',
        'firstName',
        'middleName',
        'lastName',
        'colorCode',
      ];

      const orderedPairs = [
        ['corporation', 'wardNumber'],
        ['voterId', 'name'],
        ['boothNumber', 'boothName'],
        ['srnNo', 'assemblyNo'],
        ['houseNo', 'PartNo'],
        ['mobileOne', 'mobileTwo'],
        ['village', null], // 👈 village row
      ];

      return orderedPairs.map((pair, rowIndex) =>
        pair.map((key) => {
          if (!key) return null;
          if (hiddenFields.includes(key)) return null;
          if (!(key in selectedVoter)) return null;

          return (
            


            <Grid item xs={12} sm={6} key={`${key}-${rowIndex}`}>
  <Box sx={{ py: 0.5 }}>
    <Typography
      variant="caption"
      sx={{
        color: '#6b7280',
        letterSpacing: '0.05em',
        fontSize: '11px',
      }}
    >
      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
    </Typography>

    <Typography
      variant="body2"
      sx={{
        fontWeight: 600,
        color: key === 'flag' ? 'red' : '#111827',
      }}
    >
      {/* 🔥 FLAG LOGIC */}
      {key === 'flag'
        ? selectedVoter.flag === 'twice'
          ? 'DUBAR'
          : null
        : selectedVoter[key] || '-'}
    </Typography>
  </Box>
</Grid>

          );
        })
      );
    })()}
  </Grid>

  <Box sx={{ mt: 3 }}>
    <Typography variant="caption" sx={{ color: '#6b7280' }}>
      This is an official voter information record.
    </Typography>
  </Box>
</Grid>

        </Grid>
      </Box>
    )}
  </DialogContent>
</Dialog>


{printMode === "SLIP" && selectedVoter && (
  <div className="print-slip-wrapper">
    <div className="print-slip">
     <p><b>Candidate :</b>Shri Rupesh Jadhav</p>
      <p><b>Party Name :</b>BAHUJAN VIKAS AGHADI</p>
            <p><b>Symbol :</b>City</p>
            <hr/>

      <p><b>Name :</b> {selectedVoter.name}</p>
      <p><b>Ward :</b> {selectedVoter.wardNumber}</p>
      <p><b>Sr No :</b> {selectedVoter.srn || selectedVoter.srnNo}</p>

      <p><b>Assembly No :</b> {selectedVoter.assemblyNo}</p>
      <p><b>Voter ID :</b> {selectedVoter.voterId}</p>

      <p>
        <b>Age :</b> {selectedVoter.age}
        &nbsp;&nbsp;
        <b>Gender :</b> {selectedVoter.gender}
      </p>

      <p>
        <b>Booth :</b> {selectedVoter.boothNumber}
      </p>

      <p>
        <b>Booth Name :</b> {selectedVoter.boothName}
      </p>

    </div>
  </div>
)}













<Dialog
  open={imageModalOpen}
   onClose={() => setImageModalOpen(false)}

  maxWidth={false}
  fullWidth
  PaperProps={{
    sx: {
      width: '90%',
      maxWidth: 1200,
      borderRadius: 3,
      overflow: 'hidden',
    },
  }}
>
  <DialogContent sx={{ p: 0 }}>
    {selectedVoter && (
      <Box>

      
        <Box
          sx={{
            bgcolor: '#1e40af',
            color: '#fff',
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Voter Details -2
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              Election Commission – Voter Information
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
           

<Button
  size="small"
  variant="outlined"
  sx={{ borderColor: '#fff', color: '#fff' }}
  onClick={handlePrintSlip}
>
  Print Slip
</Button>

          </Box>
        </Box>

       
        <Grid container>

        
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              bgcolor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
              gap: 1,
            }}
          >
          
         {/* <img
    src={dummyUser}
    alt="logo"
    style={{
      width: '95%',
      maxWidth: '100%',
      height: 'auto',
      objectFit: 'contain',
    }}
  /> */}


<img
  src={`https://pub-a4cb67c45dc144a680b4ffe52e34ef06.r2.dev/voters/${selectedVoter.voterId}.webp`}
  alt="Voter"
  style={{
    width: "95%",
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
  }}
  onError={(e) => {
    e.target.src = "/images/no-image.jpg";
  }}
/>





          </Grid>

        
          <Grid item xs={12} md={8} sx={{ p: 4 }}>
            <Grid container spacing={2}>
              {(() => {
                const hiddenFields = [
                  '_id',
                  '__v',
                  'firstName',
                  'middleName',
                  'lastName',
                  'colorCode',
                ];

                const orderedPairs = [
                  ['corporation', 'wardNumber'],
                  ['voterId', 'name'],
                  ['boothNumber', 'village'],
                  ['srnNo', 'assemblyNo'],
                  ['houseNo', 'PartNo'],
                  ['mobileOne', 'mobileTwo'],
                  ['boothName', "flag"],
                ];

                return orderedPairs.map((pair, rowIndex) =>
                  pair.map((key) => {
                    if (!key) return null;
                    if (hiddenFields.includes(key)) return null;
                    if (!(key in selectedVoter)) return null;




                    

                    return (
                      // <Grid item xs={12} sm={6} key={`${key}-${rowIndex}`}>
                      //   <Box sx={{ py: 0.5 }}>
                      //     <Typography
                      //       variant="caption"
                      //       sx={{
                      //         color: '#6b7280',
                      //         letterSpacing: '0.05em',
                      //         fontSize: '11px',
                      //       }}
                      //     >
                      //       {key
                      //         .replace(/([A-Z])/g, ' $1')
                      //         .toUpperCase()}
                      //     </Typography>

                      //     <Typography
                      //       variant="body2"
                      //       sx={{
                      //         fontWeight: 600,
                      //         color: '#111827',
                      //       }}
                      //     >
                      //       {selectedVoter[key] || '-'}
                      //     </Typography>
                      //   </Box>
                      // </Grid>
// ==========================================

//                       <Grid item xs={12} sm={6} key={`${key}-${rowIndex}`}>
//   <Box sx={{ py: 0.5 }}>
//     <Typography
//       variant="caption"
//       sx={{
//         color: '#6b7280',
//         letterSpacing: '0.05em',
//         fontSize: '11px',
//       }}
//     >
//       {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
//     </Typography>

//     <Typography
//       variant="body2"
//       sx={{
//         fontWeight: 600,
//         color: '#111827',
//         display: 'flex',
//         alignItems: 'center',
//         gap: 1,
//       }}
//     >
//       {selectedVoter[key] || '-'}

//       <Typography
//   variant="body2"
//   sx={{
//     fontWeight: 600,
//     color: '#111827',
//   }}
// >
//   {key === 'flag'
//     ? selectedVoter.flag === 'twice'
//       ? 'DUBAR'
//       : selectedVoter.flag
//     : selectedVoter[key] || '-'}
// </Typography>


//       {/* 🔥 DUBAR FLAG ONLY FOR VILLAGE */}
//       {/* {key === 'village' && selectedVoter.flag === 'twice' && (
//         <span
//           style={{
//             color: 'red',
//             fontWeight: 700,
//             fontSize: '13px',
//           }}
//         >
//           DUBAR
//         </span>
//       )} */}
//     </Typography>
//   </Box>
// </Grid>


// =============================


<Grid item xs={12} sm={6} key={`${key}-${rowIndex}`}>
  {/* <Box sx={{ 
    py: 0.5,
      display: 'flex',         
      alignItems: 'center',
      gap: 1.5,
    }}>
    <Typography
   
      variant="caption"
      sx={{
        color: '#374151',      
    fontWeight: 600,        
    letterSpacing: '0.04em',
    fontSize: '13px',      
    textTransform: 'uppercase',
     border:"2px solid white",
     whiteSpace: 'nowrap',   // 🔥 LABEL ekach line
    display: 'inline-block' // 🔥 wrap band
      }}
    >
      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
    </Typography>

    <Typography
      variant="body2"
      sx={{
        fontWeight: 600,
        color: key === 'flag' ? 'red' : '#000',  

      }}
    >
   
      {key === 'flag'
        ? selectedVoter.flag === 'twice'
          ? 'DUBAR'
          : null
        : selectedVoter[key] || '-'}
    </Typography>
  </Box> */}


  <Box
  sx={{
    py: 0.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    width: '100%',
  }}
>
  {/* 🔹 LABEL – 40% */}
  <Typography
    variant="caption"
    sx={{
      color: '#374151',
      fontWeight: 600,
      letterSpacing: '0.04em',
      fontSize: '13px',
      textTransform: 'uppercase',

      width: '35%',            // 🔥 40%
   
     
    }}
  >
    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
  </Typography>

  {/* 🔹 VALUE – 60% */}
  <Typography
    variant="body2"
    sx={{
      fontWeight: 600,
      color: key === 'flag' ? 'red' : '#000',

      width: '55%',            // 🔥 60%
      
    }}
  >
    {key === 'flag'
      ? selectedVoter.flag === 'twice'
        ? 'DUBAR'
        : null
      : selectedVoter[key] || '-'}
  </Typography>
</Box>

</Grid>













                    );
                  })
                );
              })()}
            </Grid>

          
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="caption"
                sx={{ color: '#6b7280' }}
              >
                This is an official voter information record.
              </Typography>
            </Box>
          </Grid>



        </Grid>
      </Box>
    )}
  </DialogContent>
</Dialog>




{/* ==================================== */}

{/* {showBulkSlips && (
  <div className="bulk-print-container">
    {voters.slice(0, 6).map((voter) => (
      <BulkVoterCard key={voter._id} voter={voter} />
    ))}
  </div>
)} */}

{/* {showBulkSlips && (
  <div className="bulk-print-container">
    {voters.slice(0, 6).map((voter) => (
      <BulkVoterCard key={voter._id} voter={voter} />
    ))}
  </div>
)} */}




{/* {showBulkSlips && (
  <div className="bulk-print-container">
    {voters.slice(0, 96).map((voter) => (
      <BulkVoterCard key={voter._id} voter={voter} />
    ))}
  </div>
)} */}


{/* {voters
  .slice(
    paginationModel.page * paginationModel.pageSize,
    paginationModel.page * paginationModel.pageSize + paginationModel.pageSize
  )
  .map((voter) => (
    <BulkVoterCard key={voter._id} voter={voter} />
  ))}
 */}


 {showBulkSlips && (
  <div className="bulk-print-container">
    {voters.map((voter) => (
      <BulkVoterCard key={voter._id} voter={voter} />
    ))}
  </div>
)}


 
{/* {showBulkSlips && (
  <div className="bulk-print-container">
    {voters.map((voter) => (
      <BulkVoterCard key={voter._id} voter={voter} />
    ))}
  </div>
)}  */}

{/* <div id="bulk-slip-container">
  {voters.map(voter => (
    <BulkVoterCard key={voter._id} voter={voter} />
  ))}
</div> */}

    </div>
  );
};


export default FinalVoters;

/* ================= STYLED GRID ================= */
const StyledDataGrid = styled(DataGrid)(() => ({
  border: 'none',
  borderRadius: '12px',
  backgroundColor: '#fff',
  height: '600px',
  '& .MuiDataGrid-virtualScroller': {
    overflowX: 'auto',  /* ✅ horizontal scroll allow */
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#e3f2fd !important',
  },
}));
