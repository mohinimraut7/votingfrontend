

import { Box } from "@mui/material";
import votersbanner from "../Images/voter_slip_720x200.jpg";

const VoterSlip = ({ data }) => {

 return (
    <Box
      sx={{
        border: "2px solid #000",
        fontFamily: "Noto Serif Devanagari",
        fontSize: 14,
        width: "60%"
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
          <div><b>प्रभाग क्रमांक :</b> {data?.wardNumber ?? "-"}</div>
          <div><b>अनुक्रमांक :</b> {data?.unuKramank}</div>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 ,fontWeight:'bold'}}>
          यादी क्रमांक: {data?.address}
          {/* <div><b>मतदान केंद्र क्रमांक :</b> {data.boothNumber ?? "-"}</div> */}
          {/* <div><b>मतदान केंद्र नाव :</b> {data.boothName ?? "-"}</div> */}
        </Box>

        <hr />
         <div style={{ marginTop: 10, fontSize: 17,fontWeight:'bold' }}>
          EPIC / Voter ID : <b>{data?.voterId}</b>
        </div>

        {/* 🔹 Personal info */}
        <div><b>नाव :</b> {data?.nameMarathi || data?.name}</div>
        <div>
          <b>वय :</b> {data?.age} &nbsp; <b>लिंग :</b> {data?.gender}
        </div>

        {/* 🔹 Address (Marathi only) */}
        <div style={{ marginTop: 8 }}>
          <b>पत्ता :</b> {data?.addressMarathi || "-"}
        </div>
        <div style={{ marginTop: 8 }}>
          <b>मतदान क्रमांक :</b> {data?.boothName || "-"}
        </div>

          <div style={{ marginTop: 8 }}>
          <b>मतदान केंद्र :</b> {data?.votingCenter || data?.boothName || "-"}
        </div>


        
       

        {/* 🔻 Footer */}
        <Box
          sx={{
            mt: 2,
            pt: 1,
            borderTop: "1px solid #000",
            textAlign: "center",
            fontSize: 17,
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

export default VoterSlip;

