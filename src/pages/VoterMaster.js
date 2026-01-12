
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';




import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

import { fetchVoters, deleteVoter } from '../store/actions/voterActions';

import axios from 'axios';
import { baseUrl } from '../config/config';

import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';




import DialogContent from '@mui/material/DialogContent';


import ArticleIcon from '@mui/icons-material/Article';

// import votersbanner from '../Images/voterslipbanner.jpg';
import votersbanner from '../Images/voter_slip_720x200.jpg'




/* =====================================================
   COMPONENT
===================================================== */
const VoterMaster = () => {
  const dispatch = useDispatch();
  const { voters, pagination, loading } = useSelector(state => state.voters);
  const isSidebarOpen = useSelector(state => state.sidebar.isOpen);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [searchName, setSearchName] = useState('');
  const [searchVoterId, setSearchVoterId] = useState('');
  const [searchHouseNumber, setSearchHouseNumber] = useState('');

  const [uploading, setUploading] = useState(false);
  const [ocrMap, setOcrMap] = useState({});
const [preview, setPreview] = useState(null);


const fileInputRef = useRef(null);


  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(
      fetchVoters(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchVoterId,
        searchName,
        searchHouseNumber
      )
    );
  }, [dispatch, paginationModel, searchVoterId, searchName, searchHouseNumber]);

  /* ================= ROWS ================= */
  const rows = voters.map((v, index) => ({
    id: index + 1,
    ...v,
  }));

// const columns = (handleDelete, handleEdit) => [
  const columns =[

  { field: 'id', headerName: 'ID', flex: 0.4, align: 'center' },
  { field: 'unuKramank', headerName: 'Sr. No.', width: 70, align: 'center' },
    { field: 'untimAnuKrmank', headerName: 'Final Sr. No', width: 70, align: 'center' },

    { field: 'mahanagarpalika', headerName: 'Corporation', width: 150 },
          { field: 'wardNumber', headerName: 'Ward Number', width: 90 },

  { field: 'boothNumber', headerName: 'Booth Number', width: 90 },
    { field: 'voterId', headerName: 'VOTER ID', width: 150 },


   { field: 'name', headerName: 'Name (English)', width: 220 },
  { field: 'nameMarathi', headerName: 'नाव (मराठी)', width: 220 },

  { field: 'relativeName', headerName: 'Relative (Eng)', width: 200 },
  { field: 'relativeNameMarathi', headerName: 'नातेवाईक (मराठी)', width: 200 },
   { field: 'lastName', headerName: 'Last Name', width: 200 },
   { field: 'lastNameMarathi', headerName: 'Last Name Marathi', width: 200 },

    { field: 'firstName', headerName: 'First Name', width: 200 },
   { field: 'firstNameMarathi', headerName: 'पहिले नाव', width: 200 },

    { field: 'middleName', headerName: 'Middle Name', width: 200 },
   { field: 'middleNameMarathi', headerName: 'मधले नाव', width: 200 },

  { field: 'gender', headerName: 'Gender', width: 90 },
  { field: 'age', headerName: 'Age', width: 80 },
      { field: 'vidhanSabhaKramank No', headerName: 'Assembly No', width: 150 },
  { field: 'village', headerName: 'Village (Eng)', width: 160 },
  { field: 'villageMarathi', headerName: 'गाव (मराठी)', width: 160 },

    { field: 'colorCode', headerName: 'Color Code', width: 160 },
//  { field: 'mobileNumberOne', headerName: 'Mobile Number One', width: 160 },
{
  field: 'mobileNumberOne',
  headerName: 'Mobile Number One',
  width: 160,
  renderCell: (params) =>
    params.value && String(params.value).trim() !== ''
      ? params.value
      : '-',
},
{
  field: 'mobileNumberTwo',
  headerName: 'Mobile Number Two',
  width: 160,
  renderCell: (params) =>
    params.value && String(params.value).trim() !== ''
      ? params.value
      : '-',
},

//  
  { field: 'homeNumber', headerName: 'House Number', width: 260 },
    { field: 'pollingStationName', headerName: 'Polling Station', width: 260 },

   
  { field: 'address', headerName: 'Address (Eng)', width: 260 },
  { field: 'voterTwentyAddress', headerName: 'पत्ता (मराठी)', width: 260 },

  // {
  //   field: 'actions',
  //   headerName: 'Actions',
  //   width: 120,
  //   sortable: false,
  //   renderCell: (params) => (
  //     <Box sx={{ display: 'flex', gap: 1 }}>
  //       <IconButton
  //         sx={{ color: '#e53935' }}
  //         onClick={() => handleDelete(params.row._id)}
  //         size="small"
  //       >
  //         <DeleteIcon fontSize="small" />
  //       </IconButton>

  //       <IconButton
  //         sx={{ color: '#1e88e5' }}
  //         onClick={() => handleEdit(params.row)}
  //         size="small"
  //       >
  //         <EditIcon fontSize="small" />
  //       </IconButton>

  //         {/* 👁️ View (OCR matched image) */}
  //       <IconButton
  //         sx={{ color: imgPath ? '#2e7d32' : '#9e9e9e' }}
  //         disabled={!imgPath}
  //         onClick={() => setPreview(imgPath)}
  //         size="small"
  //       >
  //         <VisibilityIcon fontSize="small" />
  //       </IconButton>
        
  //     </Box>
  //   ),
  // },
//   {
//   field: "slip",
//   headerName: "Slip",
//   width: 120,
//   renderCell: (params) => {
//     const url = `${window.location.origin}/voter-slip/${params.row.voterId}`;

//     return (
//       <Button
//         size="small"
//         onClick={() => window.open(url, "_blank")}
//       >
//         Open Slip
//       </Button>
//     );
//   }
// },

  {
  field: 'actions',
  headerName: 'Actions',
  width: 160,
  sortable: false,
  renderCell: (params) => {
    const imgPath = ocrMap?.[params.row.voterId]; // ✅ FIX

    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* <IconButton
          sx={{ color: '#e53935' }}
          onClick={() => handleDelete(params.row._id)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        <IconButton
          sx={{ color: '#1e88e5' }}
          onClick={() => handleEdit(params.row)}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton> */}

        {/* 👁️ OCR View */}
        {/* <IconButton
          sx={{ color: imgPath ? '#2e7d32' : '#9e9e9e' }}
          disabled={!imgPath}
          onClick={() => setPreview(imgPath)}
          size="small"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton> */}
         {/* 👁️ OCR IMAGE */}
        <IconButton
          sx={{ color: imgPath ? '#2e7d32' : '#9e9e9e' }}
          disabled={!imgPath}
          onClick={() => setPreview(imgPath)}
          size="small"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton
    sx={{ color: '#6a1b9a' }}
    onClick={() => setPreview({ type: "format", data: params.row })}
    size="small"
  >
    <ArticleIcon fontSize="small" />
  </IconButton>
      </Box>
    );
  },
}

];

  // -------------------------------------
  // Upload Pdf


const uploadCropVoters = async () => {
  try {
    if (!fileInputRef.current.files.length) {
      toast.warn('Please select a PDF');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', fileInputRef.current.files[0]);

    await axios.post(`${baseUrl}/upload-pdf-crop`, formData);
    toast.success('PDF cropped');

    await fetchOcrMatches(); // 🔥 refresh eye buttons
  } catch (e) {
    toast.error('Upload failed');
  }
};



const fetchOcrMatches = async () => {
  const res = await axios.get(`${baseUrl}/ocr-match-voters`);
  const map = {};
  res.data.matches.forEach(m => {
    map[m.voterId] = m.imagePath;
  });
  setOcrMap(map);
};


  /* ================= DOWNLOAD ================= */
  const downloadVoterReport = () => {
    if (!rows.length) {
      toast.warn('No voter data available');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      rows.map(r => ({
        'Voter ID': r.voterId,
        'Name (English)': r.name,
        'Name (Marathi)': r.nameMarathi,
        'Ward': r.wardNumber,
        'Booth': r.boothNumber,
        'Address': r.address,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Voters');
    XLSX.writeFile(workbook, 'Voter_Master_Report.xlsx');

    toast.success('Voter report downloaded');
  };

 const propertyNineHundredsMatch= async () => {
  try {
    toast.info('Generating common voter report...');

    const response = await axios.get(
      `${baseUrl}/propertyNineHundredsMatch`
    );



    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'propertyNineHundredsMatch.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }
};




 const sevenkUnMatchThirtyEightk= async () => {
  try {
    toast.info('Generating common voter report...');

    const response = await axios.get(
      `${baseUrl}/sevenkUnMatchThirtyEightk`
    );



    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'sevenkUnMatchThirtyEightk.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }
};
 const fourteenkeightVotersAll= async () => {
  try {
    toast.info('Generating common voter report...');

    const response = await axios.get(
      `${baseUrl}/fourteenkeightVotersAll`
    );



    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'fourteenkeightVotersAll.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }
};


const propertyEightHundredsMatch=async()=>{
  try {
    toast.info('Generating common voter report...');


    const response = await axios.get(
      `${baseUrl}/propertyEightHundredsMatch
`
    );



    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'propertyEightsMatch.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }

}



  const YashSirFiveK= async () => {
  try {
    toast.info('Generating common voter report...');

    const response = await axios.get(
      `${baseUrl}/yashSirFiveKPropertyMatch`
    );



    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'yashsirfivek.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }
};


   const adresstwoThousand = async () => {
  try {
    toast.info('Generating common voter report...');

    const response = await axios.get(
      `${baseUrl}/finalvikassironePropertyCommon`
    );

    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'address2125.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }
};



  const commonVoter = async () => {
  try {
    toast.info('Generating common voter report...');

    const response = await axios.get(
      `${baseUrl}/common-voters-count`
    );

    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'Common_Voters_Report.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }
};



  const noaddresspropertyCommon = async () => {
  try {
    toast.info('Generating common voter report...');

    const response = await axios.get(
      `${baseUrl}/noaddresspropertyCommon`
    );

    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'CommonVotersPropertTaxAndNoAddress.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }
};

  const onlynamespropertyCommon = async () => {
  try {
    toast.info('Generating common voter report...');

    const response = await axios.get(
      `${baseUrl}/onlynamePropertyCommon`
    );


    const { matches } = response.data;

    if (!matches || !matches.length) {
      toast.warn('No common voter data found');
      return;
    }

    // 🔥 Excel sheet ready (FULL rows)
    const worksheet = XLSX.utils.json_to_sheet(matches);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Common Voters'
    );

    XLSX.writeFile(
      workbook,
      'OnlyNamesPropertTax.xlsx'
    );

    toast.success('Common voter report downloaded');

  } catch (error) {
    console.error(error);
    toast.error('Failed to download common voter report');
  }
};
// const VoterSlip = ({ data }) => {
//   return (
//     <Box
//       sx={{
//         border: "2px solid #000",
//         p: 2,
//         fontFamily: "Noto Serif Devanagari",
//         fontSize: 14
//       }}
//     >
//       <Box sx={{ textAlign: "center", fontWeight: 700, mb: 1 }}>
//         वसई विरार शहर महानगरपालिका निवडणूक २०२६
//       </Box>

//       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//         <div>यादी क्रमांक: {data.addressMarathi || data.address}</div>
        
//         <div>अनुक्रमांक: {data.unuKramank}</div>
//       </Box>

//       <hr />

//       <div><b>नाव :</b> {data.nameMarathi || data.name}</div>
//       <div><b>वय :</b> {data.age} &nbsp; <b>लिंग :</b> {data.gender}</div>

//       <div style={{ marginTop: 8 }}>
//         <b>पत्ता :</b> {data.addressMarathi || data.address}
//       </div>

//       <div style={{ marginTop: 8 }}>
//         <b>मतदान केंद्र :</b> {data.votingCenter || "-"}
//       </div>

//       <div style={{ marginTop: 10, fontSize: 12 }}>
//         EPIC / Voter ID : <b>{data.voterId}</b>
//       </div>
//     </Box>
//   );
// };


// const VoterSlip = ({ data }) => {
//   return (
//     <Box
//       sx={{
//         border: "2px solid #000",
//         fontFamily: "Noto Serif Devanagari",
//         fontSize: 14,
//         width: '100%'
//       }}
//     >
//       {/* 🖼️ Banner */}
//       <img
//   src={votersbanner}
//   alt="Voter Banner"
//   style={{
//     width: "100%",
//     height: "460px",      // 🔽 इथे adjust करा (100–140px best)
//     objectFit: "cover",   // crop होईल, stretch नाही
//     display: "block"
//   }}
// />

//       <Box sx={{ p: 2 }}>
//         <Box sx={{ textAlign: "center", fontWeight: 700, mb: 1 }}>
//           वसई विरार शहर महानगरपालिका निवडणूक २०२६
//         </Box>

//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <div>यादी क्रमांक: {data.addressMarathi || data.address}</div>
//           <div>अनुक्रमांक: {data.unuKramank}</div>
//         </Box>

//         <hr />

//         <div><b>नाव :</b> {data.nameMarathi || data.name}</div>
//         <div><b>वय :</b> {data.age} &nbsp; <b>लिंग :</b> {data.gender}</div>

//         <div style={{ marginTop: 8 }}>
//           <b>पत्ता :</b> {data.addressMarathi || data.address}
//         </div>

//         <div style={{ marginTop: 8 }}>
//           <b>मतदान केंद्र :</b> {data.votingCenter || "-"}
//         </div>

//         <div style={{ marginTop: 10, fontSize: 12 }}>
//           EPIC / Voter ID : <b>{data.voterId}</b>
//         </div>
//           <Box
//           sx={{
//             mt: 2,
//             pt: 1,
//             borderTop: "1px solid #000",
//             textAlign: "center",
//             fontSize: 13,
//             fontWeight: 600
//           }}
//         >
//           दिनांक : १५ जानेवारी २०२६ &nbsp; | &nbsp;
//           वेळ : सकाळी ७.०० ते सायं. ५.३०
//         </Box>
//       </Box>
//     </Box>
//   );
// };


const   VoterSlip = ({ data }) => {
  return (
    <Box
      sx={{
        border: "2px solid #000",
        fontFamily: "Noto Serif Devanagari",
        fontSize: 14,
        width: "100%"
      }}
    >
      {/* 🖼️ Banner */}
      <img
        src={votersbanner}
        alt="Voter Banner"
        style={{
          width: "100%",
          height: "460px",      // ⚠️ जर जास्त वाटत असेल तर 120–150px करा
          objectFit: "cover",
          display: "block"
        }}
      />

      <Box sx={{ p: 2 }}>
        <Box sx={{ textAlign: "center", fontWeight:'bold', mb: 1,fontSize:'20px'}}>
          वसई विरार शहर महानगरपालिका निवडणूक २०२६
        </Box>

        {/* 🔹 Ward / Booth info */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <div><b>प्रभाग क्रमांक :</b> {data.wardNumber ?? "-"}</div>
          <div><b>अनुक्रमांक :</b> {data.unuKramank}</div>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 ,fontWeight:'bold'}}>
          यादी क्रमांक: {data.address}
          {/* <div><b>मतदान केंद्र क्रमांक :</b> {data.boothNumber ?? "-"}</div> */}
          {/* <div><b>मतदान केंद्र नाव :</b> {data.boothName ?? "-"}</div> */}
        </Box>

        <hr />
         <div style={{ marginTop: 10, fontSize: 17,fontWeight:'bold' }}>
          EPIC / Voter ID : <b>{data.voterId}</b>
        </div>

        {/* 🔹 Personal info */}
        <div><b>नाव :</b> {data.name}</div>
        <div>
          <b>वय :</b> {data.age} &nbsp; <b>लिंग :</b> {data.gender}
        </div>

        {/* 🔹 Address (Marathi only) */}
        <div style={{ marginTop: 8 }}>
          <b>पत्ता :</b> {data.addressMarathi || "-"}
        </div>
        <div style={{ marginTop: 8 }}>
          <b>मतदान क्रमांक :</b> {data.boothName || "-"}
        </div>

          <div style={{ marginTop: 8 }}>
          <b>मतदान केंद्र :</b> {data.votingCenter || data.boothName || "-"}
        </div>


        
       

        {/* 🔻 Footer */}
        <Box
          sx={{
            mt: 2,
            pt: 1,
            borderTop: "1px solid #000",
            textAlign: "center",
            fontSize: 1,
            fontWeight: 'bold'
          }}
        >
          दिनांक : १५ जानेवारी २०२६ &nbsp; | &nbsp;
          वेळ : सकाळी ७.०० ते सायं. ५.३०
        </Box>
      </Box>
    </Box>
  );
};



  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  /* ================= RESPONSIVE WIDTH ================= */
  // const getWidth = () => {
  //   if (isMobile) return '100%';
  //   if (isTablet) return isSidebarOpen ? '85%' : '95%';
  //   return isSidebarOpen ? '82%' : '92%';
  // };

  const getMargin = () => {
    if (isMobile) return '0';
    if (isTablet) return isSidebarOpen ? '15%' : '5%';
    return isSidebarOpen ? '18%' : '8%';
  };

  return (
    <div
      style={{
     
          width: '100%',
       
        transition: 'all 0.3s',
      }}
    >
       <Box
            sx={{
              
              display: 'flex',
              justifyContent: 'space-around',
              mb: 2,
         
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
            }}
          >
            {/* <Box>
            <Typography variant="h5" fontWeight={600}>
              VOTER MASTER
            </Typography>
            </Box> */}


            <Box>
  <Typography
    fontWeight={600}
    sx={{
      fontSize: {
        xs: '14px',   // extra small devices (mobile)
        sm: '16px',   // small devices
        md: '20px',   // tablet
        lg: '24px',   // desktop
      },
      textAlign: {
        xs: 'center',
        sm: 'center',
        md:'left'
      },
    }}
  >
    VOTER MASTER
  </Typography>
</Box>

            

          
          <Box sx={{ display: 'flex', gap: 1, flexDirection: isMobile ? 'column' : 'row',
    }}>

    
            <TextField
              label="Search By Name"
              size="small"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setSearchVoterId('');
                setSearchHouseNumber('');
              }}
            />

             

            <TextField
              label="Search By House No."
              size="small"
              value={searchHouseNumber}
              onChange={(e) => {
                setSearchHouseNumber(e.target.value);
                setSearchName('');
                setSearchVoterId('');
              }}
            />
            <TextField
              label="Search Voter ID"
              size="small"
              value={searchVoterId}
              onChange={(e) => {
                setSearchVoterId(e.target.value);
                setSearchName('');
                setSearchHouseNumber('');
              }}
            />

               <Box sx={{
    display: 'flex',
    gap: 2,                     // 🔥 buttons मध्ये gap
    flexDirection: {
      xs: 'column',             // 📱 mobile → one below one
      sm: 'column',             // 📱 tablet → one below one
      md: 'row',                // 💻 desktop → side by side
    },
    alignItems: 'flex-start',
  }}>
    <input
  type="file"
  accept="application/pdf"
  ref={fileInputRef}
  // style={{ display: 'none' }}
  onChange={() => uploadCropVoters()}
/>


{/* <Button
              
              onClick={uploadCropVoters}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
             Upload PDF Voters Crop
            </Button> */}
    

    {/* <Button
              startIcon={<DownloadIcon />}
              onClick={sevenkUnMatchThirtyEightk}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
            7527 Vs 38k Uncommon 31k
            </Button> */}

{/* <Button
              startIcon={<DownloadIcon />}
              onClick={propertyNineHundredsMatch}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
          propertyNineHundredsMatch
            </Button> */}
            
{/* 
             <Button
              startIcon={<DownloadIcon />}
              onClick={fourteenkeightVotersAll}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
        14 Vs 38K Common 7527
            </Button> */}

            {/* <Button
              startIcon={<DownloadIcon />}
              onClick={propertyEightHundredsMatch}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
          propertyEightHundredsMatch
            </Button> */}





{/* <Button
              startIcon={<DownloadIcon />}
              onClick={YashSirFiveK}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
            YashSirFiveK
            </Button> */}


 {/* <Button
              startIcon={<DownloadIcon />}
              onClick={adresstwoThousand}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
              2125 Address
            </Button> */}

             {/* <Button
              startIcon={<DownloadIcon />}
              onClick={fourteenkeightVotersAll}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
             fourteenkeightVotersAll
            </Button> */}
{/* /fourteenkeightVotersAll */}


 {/* <Button
              startIcon={<DownloadIcon />}
              onClick={downloadVoterReport}
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
                width: isMobile?'100%':'auto'
              }}
            >
              Download Reports
            </Button>

            
            <Button
              startIcon={<DownloadIcon />}
              onClick={commonVoter}
              sx={{
                backgroundColor: '#1976D2',
                width:isMobile?'100%':'auto',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
              }}
            >
              Common Reports
            </Button>  */}


 {/* <Button
              startIcon={<DownloadIcon />}
              onClick={noaddresspropertyCommon}
              sx={{
                backgroundColor: '#1976D2',
                width:isMobile?'100%':'auto',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
              }}
            >
              Common Voters PopetyTax & No Address
            </Button>

            <Button
              startIcon={<DownloadIcon />}
              onClick={onlynamespropertyCommon}
              sx={{
                backgroundColor: '#1976D2',
                width:isMobile?'100%':'auto',
                color: '#fff',
                '&:hover': { backgroundColor: '#179e96' },
              }}
            >
              Common Voters PopetyTax & Only Names
            </Button> */}

          

            </Box>
          </Box>

       
          </Box>
          
      <Container maxWidth={false} sx={{ p: 0 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          {/* HEADER */}
         

        

          {/* GRID */}
          <StyledDataGrid
            rows={rows}
            // columns={columns((id) => dispatch(deleteVoter(id)))}
            columns={columns}
            paginationMode="server"
            rowCount={pagination?.totalVoters || 0}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 50, 100]}
            autoHeight={false}
          />
        </Paper>
      </Container>
      <Dialog
  open={Boolean(preview)}
  onClose={() => setPreview(null)}
  maxWidth="md"
  fullWidth
>
  <Box sx={{ p: 2, textAlign: 'center' }}>
    <Typography variant="h6" mb={2}>
      OCR Matched Voter Image
    </Typography>

    {preview && (
      <img
        src={`${baseUrl.replace('/api','')}/${preview}`}
        alt="Voter OCR"
        style={{
          maxWidth: '100%',
          maxHeight: '70vh',
          border: '1px solid #ccc',
        }}
      />
    )}

    <Button
      sx={{ mt: 2 }}
      variant="contained"
      onClick={() => setPreview(null)}
    >
      Close
    </Button>
  </Box>
</Dialog>


<Dialog
  open={!!preview}
  onClose={() => setPreview(null)}
  maxWidth="md"
  fullWidth
>
  <DialogContent>
    {preview?.type === "image" && (
      <img
        src={`http://localhost:5000/${preview.data}`}
        alt="OCR"
        style={{ width: "100%" }}
      />
    )}

    {preview?.type === "format" && (
      <VoterSlip data={preview.data} />
    )}
  </DialogContent>
</Dialog>


    </div>
  


);
};

export default VoterMaster;

/* =====================================================
   STYLED GRID – NO HORIZONTAL SCROLL
===================================================== */
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
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
