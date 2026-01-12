
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
const columns = (handleDelete, handleEdit) => [
  { field: 'srn', headerName: 'Sr No', width: 80 },
  { field: 'finalSrn', headerName: 'Final Sr No', width: 110 },
  { field: 'corporation', headerName: 'Corporation', width: 150 },
  { field: 'wardNumber', headerName: 'Ward', width: 80 },
  { field: 'boothNumber', headerName: 'Booth', width: 80 },
  { field: 'voterId', headerName: 'Voter ID', width: 150 },
  { field: 'name', headerName: 'Name', width: 220 },
  { field: 'relativeName', headerName: 'Relative Name', width: 200 },
  { field: 'gender', headerName: 'Gender', width: 80 },
  { field: 'age', headerName: 'Age', width: 70 },
  { field: 'village', headerName: 'Village', width: 160 },
  // { field: 'colorCode', headerName: 'Color', width: 100 },
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
  { field: 'houseNo', headerName: 'Address', width: 260 },
  { field: 'boothName', headerName: 'Booth Name', width: 260 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* <IconButton
          size="small"
          sx={{ color: '#e53935' }}
          onClick={() => handleDelete(params.row._id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: '#1e88e5' }}
          onClick={() => handleEdit(params.row)}
        >
          <EditIcon fontSize="small" />
        </IconButton> */}
      </Box>
    ),
  },
];

/* ================= COMPONENT ================= */
const FinalVoters = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [voters, setVoters] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Single search
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 96,
  });

const [openModal, setOpenModal] = useState(false);
const [selectedVoter, setSelectedVoter] = useState(null);

const [printMode, setPrintMode] = useState(null); // 'A4' | 'SLIP'

const [showBulkSlips, setShowBulkSlips] = useState(false);

  /* ================= FETCH ================= */
  // const fetchVoters = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await axios.get(API_URL, {
  //       params: {
  //         page: paginationModel.page + 1,
  //         limit: paginationModel.pageSize,
  //         search: appliedSearch,
  //       },
  //     });

  //     setVoters(res.data.voters || []);
  //     setTotal(res.data.pagination.totalVoters);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Failed to fetch voters');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

   const fetchVoters = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          search: appliedSearch,
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
  }, [paginationModel, appliedSearch]);




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
  setAppliedSearch('');

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
// const downloadAllSlips = () => {
//     if (!voters.length) {
//       toast.warn('No data');
//       return;
//     }

//     const ws = XLSX.utils.json_to_sheet(voters);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Voters');
//     XLSX.writeFile(wb, 'Voter_Master.xlsx');
//   };





// const downloadAllSlips = () => {
//   if (!voters.length) {
//     toast.warn('No data');
//     return;
//   }

//   setShowBulkSlips(true);

//   setTimeout(() => {
//     window.print();   // 👈 print preview
//   }, 300);
// };

// ====================
// slot wise

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

// ==================

// const downloadAllSlips = async () => {
//   try {
//     toast.info("Fetching all voters for PDF, please wait...");

//     const res = await axios.get(API_URL, {
//       params: {
//         page: 1,
//         limit: 20000,
//         search: appliedSearch || ""
//       }
//     });

//     const allVoters = res.data.voters || [];

//     if (!allVoters.length) {
//       toast.warn("No data found");
//       return;
//     }

//     toast.success(`Loaded ${allVoters.length} voters. Preparing PDF...`);

//     setVoters(allVoters);
//     setShowBulkSlips(true);

//     setTimeout(() => {
//       window.print();

//       setTimeout(() => {
//         setShowBulkSlips(false);
//         fetchVoters();
//       }, 500);
//     }, 800);

//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to fetch all voters");
//   }
// };



// const chunkArray = (arr, size) => {
//   const chunks = [];
//   for (let i = 0; i < arr.length; i += size) {
//     chunks.push(arr.slice(i, i + size));
//   }
//   return chunks;
// };
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};


// const downloadAllSlips = async () => {
//   try {
//     toast.info("Fetching all voters for PDF, please wait...");

//     const res = await axios.get(API_URL, {
//       params: {
//         page: 1,
//         limit: 20000,        // 🔥 large data
//         search: appliedSearch || ""
//       }
//     });

//     const allVoters = res.data.voters || [];

//     if (!allVoters.length) {
//       toast.warn("No data found");
//       return;
//     }

//     toast.success(`Loaded ${allVoters.length} voters. Generating PDF...`);

//     /* -----------------------------
//        🔥 IMPORTANT PART START
//        NO setShowBulkSlips
//        NO React render
//     ------------------------------*/

//     // 1️⃣ hidden container
//     const wrapper = document.createElement("div");
//     wrapper.style.position = "fixed";
//     wrapper.style.left = "-9999px"; // 👈 screen वर दिसणार नाही

//     // 2️⃣ same design HTML (BulkVoterCard सारखाच)
//     // wrapper.innerHTML = `
//     //   <div style="padding:8mm">
//     //     <div style="
//     //       display:grid;
//     //       grid-template-columns:repeat(3,1fr);
//     //       gap:6mm;
//     //     ">
//     //       ${allVoters.map(voter => `
//     //         <div style="
//     //           border:1px solid #000;
//     //           height:240px;
//     //           display:flex;
//     //           flex-direction:column;
//     //           overflow:hidden;
//     //           font-size:12px;
//     //         ">
//     //           <img
//     //             src="${voterSlipImg}"
//     //             style="width:100%;height:80px;object-fit:cover;"
//     //           />
//     //           <div style="padding:2mm 3mm;flex:1;">
//     //             <p><b>Voter ID :</b> ${voter.voterId || ""} &nbsp;&nbsp; <b>Ward :</b> ${voter.wardNumber || ""}</p>
//     //             <p><b>Name :</b> ${voter.name || ""}</p>
//     //             <p><b>Sr No :</b> ${voter.srn || ""} &nbsp;&nbsp; <b>Building :</b> ${voter.BuildingName || ""}</p>
//     //             <p><b>Address :</b> ${voter.houseNo || ""}</p>
//     //             <hr/>
//     //             <p><b>Booth :</b> ${voter.boothNumber || ""} - ${voter.BoothName || ""}</p>
//     //           </div>
//     //         </div>
//     //       `).join("")}
//     //     </div>
//     //   </div>
//     // `;


//     const pages = chunkArray(allVoters, 6);

// wrapper.innerHTML = `
//   <div style="padding:8mm">
//     ${pages.map(page => `
//       <div style="
//         display:grid;
//         grid-template-columns:repeat(3,1fr);
//         gap:6mm;
//         page-break-after: always;
//       ">
//         ${page.map(voter => `
//           <div style="
//             border:1px solid #000;
//             height:240px;
//             display:flex;
//             flex-direction:column;
//             overflow:hidden;
//             font-size:12px;
//           ">
//             <img
//               src="${voterSlipImg}"
//               style="width:100%;height:80px;object-fit:cover;"
//             />
//             <div style="padding:2mm 3mm;flex:1;">
//               <p><b>Voter ID :</b> ${voter.voterId || ""} &nbsp;&nbsp; <b>Ward :</b> ${voter.wardNumber || ""}</p>
//               <p><b>Name :</b> ${voter.name || ""}</p>
//               <p><b>Sr No :</b> ${voter.srn || ""}</p>
//               <p><b>Building Name :</b> ${voter.BuildingName || ""}</p>
//               <p><b>Address :</b> ${voter.houseNo || ""}</p>
//               <hr/>
//               <p><b>Booth :</b> ${voter.boothNumber || ""} - ${voter.BoothName || ""}</p>
//             </div>
//           </div>
//         `).join("")}
//       </div>
//     `).join("")}
//   </div>
// `;

//     document.body.appendChild(wrapper);

//     // 3️⃣ DIRECT PDF DOWNLOAD (NO preview)
//     await html2pdf()
//       .set({
//         margin: [8, 8, 8, 8],
//         filename: "Voter_SlipsNew.pdf",
//         html2canvas: { scale: 2, useCORS: true },
//         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//         pagebreak: { mode: ["css", "legacy"] },
//       })
//       .from(wrapper)
//       .save();

//     document.body.removeChild(wrapper);

//     toast.success("Voter slips PDF downloaded successfully");

//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to download voter slips");
//   }
// };


// directly download pdf

// const downloadAllSlips = () => {
//   if (!voters.length) {
//     toast.warn('No data');
//     return;
//   }

//   setShowBulkSlips(true);

//   setTimeout(() => {
//     const element = document.getElementById('bulk-slip-container');

//     const opt = {
//       margin: 5,
//       filename: 'Voter_Slips.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true
//       },
//       jsPDF: {
//         unit: 'mm',
//         format: 'a4',
//         orientation: 'portrait'
//       }
//     };

//     html2pdf().set(opt).from(element).save(); // 👈 DIRECT DOWNLOAD
//   }, 300);
// };



// const downloadAllSlips = () => {
//   if (!voters.length) {
//     toast.warn('No data');
//     return;
//   }

//   setShowBulkSlips(true);

//   setTimeout(() => {
//     window.print();   // Save as PDF = softcopy
//   }, 300);
// };

  
// const downloadAllSlips = async () => {
//   try {
//     toast.info("Fetching all voters for print...");

//     const res = await axios.get(API_URL, {
//       params: {
//         page: 1,
//         limit: 15804, // 🔥 ALL DATA IN ONE SHOT
//         search: appliedSearch || ""
//       }
//     });

//     const allVoters = res.data.voters || [];

//     if (!allVoters.length) {
//       toast.warn("No data");
//       return;
//     }

//     setVoters(allVoters);     // 🔥 overwrite current page data
//     setShowBulkSlips(true);

//     setTimeout(() => {
//       window.print();         // Save as PDF
//     }, 700);

//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to fetch all voters");
//   }
// };

// const downloadAllSlips = async () => {
//   try {
//     toast.info("Preparing PDF, please wait...");

//     const res = await axios.get(API_URL, {
//       params: {
//         page: 1,
//         limit: 15804, // 🔥 ALL voters
//         search: appliedSearch || ""
//       }
//     });

//     const allVoters = res.data.voters || [];

//     if (!allVoters.length) {
//       toast.warn("No data");
//       return;
//     }

//     setVoters(allVoters);
//     setShowBulkSlips(true);

//     setTimeout(() => {
//       const element = document.querySelector(".bulk-print-container");

//       html2pdf()
//         .from(element)
//         .set({
//           margin: 5,
//           filename: "Bulk_Voter_Slips.pdf",
//           image: { type: "jpeg", quality: 0.98 },
//           html2canvas: {
//             scale: 2,
//             useCORS: true,
//           },
//           jsPDF: {
//             unit: "mm",
//             format: "a4",
//             orientation: "portrait",
//           },
//           pagebreak: { mode: ["css", "legacy"] },
//         })
//         .save();   // 🔥 DIRECT DOWNLOAD

//     }, 800);

//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to generate PDF");
//   }
// };

// const downloadAllSlips = async () => {
//   try {
//     toast.info("Fetching all voters...");

//     const res = await axios.get(API_URL, {
//       params: { page: 1, limit: 20000, search: appliedSearch || "" }
//     });

//     const allVoters = res.data.voters || [];
//     if (!allVoters.length) return toast.warn("No data");

//     const batches = chunkArray(allVoters, 300); // 🔥 SAFE LIMIT
//     toast.success(`Total ${batches.length} PDFs will be generated`);

//     for (let i = 0; i < batches.length; i++) {
//       toast.info(`Generating PDF ${i + 1}/${batches.length}`);

//       await generateSinglePDF(batches[i], i + 1);

//       // 🧠 browser ला श्वास घेऊ दे
//       await new Promise(r => setTimeout(r, 300));
//     }

//     toast.success("All PDFs downloaded successfully ✅");

//   } catch (e) {
//     console.error(e);
//     toast.error("PDF generation failed");
//   }
// };


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


  const handlePrintA4 = () => {
  setPrintMode('A4');
  setTimeout(() => window.print(), 100);
};



const handlePrintSlip = () => {
  setPrintMode("SLIP");
  setTimeout(() => window.print(), 100);
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
      

         
          {/* <Typography
            fontWeight={600}
           sx={{
    fontSize: {
      xs: '14px',
      sm: '16px',
      md: '20px',
      lg: '24px',
    },
    textAlign: { xs: 'center', md: 'left' },
    width: { xs: '100%', md: 'auto' },
  }}
          >
            VOTER MASTER
          </Typography> */}
       
      {/* <TextField
        sx={{
          
         width: {
      xs: '99%',
      sm: '99%',
      md: '60%',
    },
        
        }}
            size="large"
        
            label="Search By Name / Mobile / Voter ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          /> */}
<TextField
  size="large"
  label="Search By Name / Mobile / Voter ID"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  sx={{
    width: { xs: '100%', md: '55%' },
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
               {/* 🔍 SINGLE SEARCH */}
         
           {/* <Button
            startIcon={<DownloadIcon />}
            onClick={downloadAllSlips}
            sx={{
              backgroundColor: '#1976D2',
              color: '#fff',
              '&:hover': { backgroundColor: '#179e96' },
            }}
          >
            Download All Slips
          </Button> */}

{/* 
            <Button variant="contained" size="sm" startIcon={<ReplayIcon />}>
    
  </Button> */}


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
            size='lg'
            onClick={() => {
              setPaginationModel({ ...paginationModel, page: 0 });
              setAppliedSearch(searchText);
            }}
            sx={{
              backgroundColor: '#1976D2',
              color: '#fff',
              '&:hover': { backgroundColor: '#179e96' },
            }}
          >
            Search
          </Button>

          <Button
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
          </Button>

         
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
          />
        </Paper>
      </Container>
{/* 
      <Dialog
  open={openModal}
  onClose={() => setOpenModal(false)}
  maxWidth="md"
  fullWidth
>
  <DialogContent>
    {selectedVoter && (
      <Grid container spacing={3}>
      
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f7fa',
            borderRadius: 2,
          }}
        >
          <Avatar
            src="/voter-placeholder.png" 
            sx={{ width: 180, height: 180 }}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Voter Details
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {Object.entries(selectedVoter).map(([key, value]) => {
            if (key === '_id' || key === '__v') return null;

            return (
              <Box
                key={key}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                  p: 1,
                  borderBottom: '1px solid #eee',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                >
                  {key.replace(/([A-Z])/g, ' $1')}
                </Typography>

                <Typography variant="body2">
                  {String(value || '-')}
                </Typography>
              </Box>
            );
          })}
        </Grid>
      </Grid>
    )}
  </DialogContent>
</Dialog> */}

{/* <Dialog
  open={openModal}
  onClose={() => setOpenModal(false)}
  maxWidth="md"
  fullWidth
>
  <DialogContent>
    {selectedVoter && (
      
<Grid container spacing={2}>
  {(() => {
    if (!selectedVoter) return null;

    const hiddenFields = [
      '_id',
      '__v',
      'firstName',
      'middleName',
      'lastName',
      'colorCode',
      'BoothEnglish',
      'Booth_English',
      'Booth ( English )',
    ];

    // 👇 CUSTOM ORDER
    const orderedKeys = [
      'corporation',
      'wardNumber',

       'voterId',     // ✅ voterId just below srn
         'name',
      'boothNumber',
    'boothName',

    

      'srn',
      'assemblyNo',
 'houseNo',
     
      'partNo',
 'village',
     
     

      'gender',      // ✅ age & gender at bottom
      'age',
    ];

    return orderedKeys.map((key) => {
      if (hiddenFields.includes(key)) return null;
      if (!(key in selectedVoter)) return null;

      const value = selectedVoter[key];

      return (
        <Grid item xs={12} md={6} key={key}>
          <Box
            sx={{
              p: 1.5,
              border: '1px solid #eee',
              borderRadius: 1,
              height: '100%',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                textTransform: 'capitalize',
              }}
            >
              {key.replace(/([A-Z])/g, ' $1')}
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontWeight: 600 }}
            >
              {String(value || '-')}
            </Typography>
          </Box>
        </Grid>
      );
    });
  })()}
</Grid>


    )}
  </DialogContent>
</Dialog> */}

{/* ------------------------- */}


{/* <Dialog
  open={openModal}
  onClose={() => setOpenModal(false)}
  maxWidth={false}
  fullWidth
  PaperProps={{
    sx: {
      width: '90%',          
      maxWidth: '1400px',
      borderRadius: 2,
    },
  }}
>
  <DialogContent sx={{ p: 0 }}>
    {selectedVoter && (
      <Grid container minHeight="70vh">

        <Grid
          item
          xs={12}
          md={4} // ~30%
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f7fa',
          }}
        >
          <Avatar
            src="/voter-placeholder.png" // dummy image (public folder)
            alt="Voter"
            sx={{
              width: 220,
              height: 220,
              bgcolor: '#d1d5db',
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={8} 
          sx={{
            p: 3,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Voter Details
          </Typography>

           <Button
    variant="outlined"
    startIcon={<PrintIcon />}
    onClick={() => window.print()}
  >
    Print
  </Button>

          <Grid container spacing={2}>
            {(() => {
              const hiddenFields = [
                '_id',
                '__v',
                'firstName',
                'middleName',
                'lastName',
                'colorCode',
                'BoothEnglish',
                'Booth_English',
                'Booth ( English )',
              ];

              // 🔹 FIXED PAIRS (each pair = one row)
              const orderedPairs = [
                ['corporation', 'wardNumber'],
                ['voterId', 'name'],
                ['boothNumber', 'BoothName'],
                ['srn', 'assemblyNo'],
                ['houseNo', 'PartNo'],
                  ['mobileOne', 'mobileTwo'],
                ['village', null],
                // ['gender', 'age'], // always last
              ];

              return orderedPairs.map((pair, rowIndex) =>
                pair.map((key) => {
                  if (!key) return null;
                  if (hiddenFields.includes(key)) return null;
                  if (!(key in selectedVoter)) return null;

                  const value = selectedVoter[key];

                  return (
                    <Grid item xs={12} sm={6} key={`${key}-${rowIndex}`}>
                      <Box
                        sx={{
                          p: 1.5,
                          border: '1px solid #eee',
                          borderRadius: 1,
                          height: '100%',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            textTransform: 'capitalize',
                          }}
                        >
                          {key.replace(/([A-Z])/g, ' $1')}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {String(value || '-')}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })
              );
            })()}
          </Grid>
        </Grid>

      </Grid>
    )}
  </DialogContent>
</Dialog> */}

{/* ---------------------------------- */}
{/* <Dialog
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
              Voter Details
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Election Commission – Voter Information
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              sx={{ bgcolor: '#fff', color: '#1e40af' }}
              onClick={() => window.print()}
            >
              Print A4
            </Button>

            <Button
              size="small"
              variant="outlined"
              sx={{ borderColor: '#fff', color: '#fff' }}
              onClick={() => window.print()}
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
              bgcolor: '#f1f5f9',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <Avatar
              sx={{
                width: 180,
                height: 180,
                bgcolor: '#cbd5e1',
                fontSize: 48,
              }}
            >
              {selectedVoter.name?.[0] || 'V'}
            </Avatar>
          </Grid>

         
          <Grid item xs={12} md={8} sx={{ p: 3 }}>
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
                  ['boothNumber', 'BoothName'],
                  ['srn', 'assemblyNo'],
                  ['houseNo', 'PartNo'],
                  ['mobileOne', 'mobileTwo'],
                  ['village', null],
                ];

                return orderedPairs.map((pair, rowIndex) =>
                  pair.map((key) => {
                    if (!key) return null;
                    if (hiddenFields.includes(key)) return null;
                    if (!(key in selectedVoter)) return null;

                    return (
                      <Grid item xs={12} sm={6} key={`${key}-${rowIndex}`}>
                        <Box
                          sx={{
                            border: '1px solid #e5e7eb',
                            borderRadius: 2,
                            p: 1.5,
                            bgcolor: '#fff',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: '#6b7280' }}
                          >
                            {key.replace(/([A-Z])/g, ' $1')}
                          </Typography>

                          <Typography
                            variant="body2"
                            fontWeight={600}
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
          </Grid>
        </Grid>

      </Box>
    )}
  </DialogContent>
</Dialog> */}
{/* ================================== */}
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
              Voter Details
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              Election Commission – Voter Information
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* <Button
              size="small"
              variant="contained"
              sx={{ bgcolor: '#fff', color: '#1e40af' }}
              onClick={() => window.print()}
            >
              Print A4
            </Button>

            <Button
              size="small"
              variant="outlined"
              sx={{ borderColor: '#fff', color: '#fff' }}
              onClick={() => window.print()}
            >
              Print Slip
            </Button> */}
            {/* <Button
  size="small"
  variant="contained"
  sx={{ bgcolor: '#fff', color: '#1e40af' }}
  onClick={handlePrintA4}
>
  Print A4
</Button> */}

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
 src="https://res.cloudinary.com/dsg5ctnc0/image/upload/v1768061618/RBG7230485_a7d5jj.jpg"

  alt="Voter"
  style={{
    width: '95%',
    maxWidth: '100%',
    height: 'auto',
    objectFit: 'contain',
  }}
  onError={(e) => {
    e.target.src = '/images/no-image.jpg';
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
                  ['boothNumber', 'boothName'],
                  ['srnNo', 'assemblyNo'],
                  ['houseNo', 'PartNo'],
                  ['mobileOne', 'mobileTwo'],
                  ['village', null],
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
    overflowX: 'hidden',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#e3f2fd !important',
  },
}));
