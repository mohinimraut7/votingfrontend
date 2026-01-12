import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

const SignaturePad = () => {
  const [signature, setSignature] = useState(null);
  const signaturePadRef = useRef(null);

  const clearSignature = () => {
    signaturePadRef.current.clear();
  };

  const saveSignature = () => {
    const signatureData = signaturePadRef.current.getTrimmedCanvas().toDataURL('image/png');
    setSignature(signatureData); // Store the base64 image data in the state
  };

  
  const handleSubmit = async () => {
    if (signature) {
      try {
        const response = await axios.post('http://localhost:2000/api/saveSignature', {
          signature,
        });
        console.log('Signature saved successfully:', response.data);
      } catch (error) {
        console.error('Error saving signature:', error);
      }
    }
  };

  return (
    <div>
      <h2>Sign Below:</h2>
      <SignatureCanvas
        ref={signaturePadRef}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: 'signatureCanvas' }}
      />
      <button onClick={clearSignature}>Clear</button>
      <button onClick={saveSignature}>Save Signature</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SignaturePad;
