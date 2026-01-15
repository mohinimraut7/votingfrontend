
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

import { Checkbox, FormControlLabel} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import IconButton from '@mui/material/IconButton';


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
const [visitedChecked, setVisitedChecked] = useState(false);
const [checked, setChecked] = useState(false);
const [checkedele, setCheckedEle] = useState(false);


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

const handleVisitedChange = (e) => {
  const checked = e.target.checked;
  setVisitedChecked(checked);

  if (checked) {
    toast.success("✅ Voter Visited");
  }
};



 useEffect(() => {
    if (selectedVoter) {
      setChecked(!!selectedVoter.voterVisited);
    }
  }, [selectedVoter]);

useEffect(() => {
  if (selectedVoter) {
    setCheckedEle(!!selectedVoter.voterVisited);
  }
}, [selectedVoter]);

const storedResdata = JSON.parse(localStorage.getItem("resdata") || "{}");
const userRole = storedResdata?.user?.role || "";





const columns = (handleDelete, handleEdit) => [
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
    boothName: selectedVoter?.boothName || "",
     srn: selectedVoter?.srn || "",
      assemblyNo: selectedVoter?.assemblyNo|| "",

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
      

         
           {/* <Typography style={{color:'blue'}}>{userRole}</Typography> */}
         

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
          getRowClassName={(params) => {
  let cls = params.row.flag === "twice" ? "twice-voter-row" : "";
  if (params.row.voterVisited === true) cls += " visited-voter-row";
  return cls;
}
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
              Voter Details
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


<IconButton
     size="large"
    onClick={() => setOpenModal(false)}
    sx={{ color: '#fff' }}
  >
    <CloseIcon />
  </IconButton>

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
    {/* ***** form 11*/}


{/* =======>>>>>>>>>>> */}

{/* he uncommit kara approrval aalyavar */}
<FormControlLabel 
  control={
    <Checkbox
      checked={checked}
      onChange={async (e) => {
        const isChecked = e.target.checked;
        setChecked(isChecked);

        try {
          await axios.put(
            `${baseUrl}/getByVisitorAndUpdate/${selectedVoter.voterId}`,
            {
              voterId: selectedVoter.voterId,
              voterVisited: isChecked,
            }
          );

          toast.success(
            isChecked
              ? "✅ Voter Visited"
              : "ℹ️ Voter Visit Removed"
          );

          setSelectedVoter(prev => ({
            ...prev,
            voterVisited: isChecked,
          }));

          fetchVoters();
        } catch (error) {
          toast.error("❌ Failed to update voter");
          setChecked(!isChecked);
        }
      }}
      sx={{
        transform: 'scale(2.3)',
        '&.Mui-checked': {
          color: '#16a34a',
        },
      }}
    />
  }
  label={
    <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
      Voter Visited
    </Typography>
  }
/>




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
                  ['boothName', 'srn',],
                  ["flag"],
               
                ];

                

                return orderedPairs.map((pair, rowIndex) =>
                  pair.map((key) => {
                    if (!key) return null;
                    if (hiddenFields.includes(key)) return null;
                    if (!(key in selectedVoter)) return null;

   // 🔥 FLAG CONDITION
    if (key === 'flag' && selectedVoter.flag !== 'twice') {
      return null; // key + value hide
    }



                    

                    return (
                     


<Grid item xs={12} sm={6} key={`${key}-${rowIndex}`}>
 

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

 
  <Typography
    variant="body2"
    sx={{
      fontWeight: 600,
      color: key === 'flag' ? 'red' : '#000',

      width: '55%',            
      
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
              Voter Details
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


  <IconButton
    onClick={() =>setImageModalOpen(false)}   // किंवा setImageModalOpen(false)
    sx={{ color: '#fff' }}
  >
    <CloseIcon />
  </IconButton>

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

            


{/* he uncommit kara aaproval aalyavar */}

<FormControlLabel
  control={
    <Checkbox
     checked={checkedele}   
      onChange={async (e) => {
        const isChecked = e.target.checked;
        setCheckedEle(isChecked);   

        try {
          await axios.put(
            `${baseUrl}/getByVisitorAndUpdate/${selectedVoter.voterId}`,
            {
              voterId: selectedVoter.voterId,
              voterVisited: isChecked,
            }
          );

          toast.success(
            isChecked
              ? "✅ Voter Visited"
              : "ℹ️ Voter Visit Removed"
          );

          setSelectedVoter(prev => ({
            ...prev,
            voterVisited: isChecked,
          }));

          fetchVoters();
        } catch (error) {
          toast.error("❌ Failed to update voter");
          setChecked(!isChecked);
        }
      }}
      sx={{
        transform: 'scale(2.3)',
        '&.Mui-checked': {
          color: '#16a34a',
        },
      }}
    />
  }
  label={
    <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
      Voter Visited
    </Typography>
  }
/>






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
                  ['srn',null]
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
    py: 0.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    width: '100%',
  }}
>
 
  <Typography
    variant="caption"
    sx={{
      color: '#374151',
      fontWeight: 600,
      letterSpacing: '0.04em',
      fontSize: '13px',
      textTransform: 'uppercase',

      width: '35%',            
   
     
    }}
  >
    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
  </Typography>



  <Typography
  variant="body2"
  sx={{
    fontWeight: 600,
    color: key === 'flag' ? 'red' : '#000',
    width: '55%',

  
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


 {showBulkSlips && (
  <div className="bulk-print-container">
    {voters.map((voter) => (
      <BulkVoterCard key={voter._id} voter={voter} />
    ))}
  </div>
)}


 


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
    backgroundColor: 'rgba(0, 0, 0, 0.01)', // 🔥 sam
  
  },
}));
