import React from "react";
// import voterSlipImg from "../Images/voterslipbanner.jpg";
import voterSlipImg from "../Images/newbannerBulkSlipImage.jpeg";


import "./BulkVoterCard.css";

const BulkVoterCard = ({ voter }) => {
  if (!voter) return null;

  return (
    <div className="bulk-voter-card">

      {/* 🔶 TOP IMAGE (neat fit) */}
      <img
        src={voterSlipImg}
        alt="Voter Slip"
        className="bulk-voter-banner"
      />

      {/* 🔶 SLIP BODY (exact screenshot feel) */}
      <div className="bulk-voter-body">
           <p><b>Voter ID :</b> {voter.voterId} &nbsp;&nbsp; <b>Ward :</b> {voter.wardNumber}</p>
        <p><b>Name :</b> {voter.name}</p>
         
        <p><b>Building Name :</b> {voter.BuildingName}</p>
<p> <b>Sr No :</b> {voter.srn}</p>
 <p><b>Address : {voter.houseNo}</b></p>
  <hr className="bulk-divider" />


        <p className="booth-line">
          <b>Booth :</b> {voter.boothNumber} : <span className="booth-name">{voter.BoothName}</span>
        </p>

      
      </div>

    </div>
  );
};

export default BulkVoterCard;
