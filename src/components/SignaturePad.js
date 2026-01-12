// import React, { useRef, useEffect } from 'react';
// import SignatureCanvas from 'react-signature-canvas';
// import { Box, Button, Typography } from '@mui/material';

// const SignaturePad = ({ setSignature, initialSignature = null }) => {
//     const sigCanvas = useRef(null);

//     useEffect(() => {
//         if (initialSignature && sigCanvas.current) {
//             const img = new Image();
//             img.onload = () => {
//                 const ctx = sigCanvas.current.getCanvas().getContext('2d');
//                 ctx.drawImage(img, 0, 0);
//             };
//             img.src = initialSignature;
//         }
//     }, [initialSignature]);

//     const saveSignature = () => {
//         if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
//             const signatureData = sigCanvas.current.toDataURL('image/png');
//             setSignature(signatureData);
//         }
//     };

//     const clearSignature = () => {
//         if (sigCanvas.current) {
//             sigCanvas.current.clear();
//             setSignature(null);
//         }
//     };

//     return (
//         <Box sx={{ width: '100%', mt: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//                 Draw your signature below:
//             </Typography>
//             <Box 
//                 sx={{ 
//                     border: '1px solid #ccc',
//                     borderRadius: '4px',
//                     backgroundColor: '#fff',
//                     mb: 2
//                 }}
//             >
//                 <SignatureCanvas
//                     ref={sigCanvas}
//                     canvasProps={{
//                         width: 500,
//                         height: 200,
//                         className: 'signature-canvas',
//                         style: { 
//                             width: '100%',
//                             height: '200px'
//                         }
//                     }}
//                     backgroundColor="rgb(255, 255, 255)"
//                 />
//             </Box>
//             <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//                 <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={clearSignature}
//                 >
//                     Clear
//                 </Button>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={saveSignature}
//                 >
//                     Save Signature
//                 </Button>
//             </Box>
//         </Box>
//     );
// };

// export default SignaturePad;
// ====================================================
// import React, { useRef, useState, useEffect } from 'react';
// import { Paper, Button, Box } from '@mui/material';
// import { getStroke } from 'perfect-freehand';

// const SignaturePad = ({ onSave, width = 500, height = 200 }) => {
//   const canvasRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [points, setPoints] = useState([]);
//   const [lines, setLines] = useState([]);

//   const getContext = () => {
//     const canvas = canvasRef.current;
//     return canvas ? canvas.getContext('2d') : null;
//   };

//   const drawLine = (points) => {
//     const ctx = getContext();
//     if (!ctx || points.length < 2) return;

//     const stroke = getStroke(points, {
//       size: 3,
//       thinning: 0.5,
//       smoothing: 0.5,
//       streamline: 0.5,
//     });

//     ctx.beginPath();
//     ctx.fillStyle = '#000';
    
//     if (stroke.length > 0) {
//       ctx.moveTo(stroke[0][0], stroke[0][1]);
      
//       for (let i = 1; i < stroke.length; i++) {
//         ctx.lineTo(stroke[i][0], stroke[i][1]);
//       }
      
//       ctx.fill();
//     }
//   };

//   const redrawCanvas = () => {
//     const ctx = getContext();
//     if (!ctx) return;

//     ctx.clearRect(0, 0, width, height);
//     lines.forEach(line => drawLine(line));
//     if (points.length > 0) drawLine(points);
//   };

//   useEffect(() => {
//     redrawCanvas();
//   }, [lines, points]);

//   const handlePointerDown = (e) => {
//     e.preventDefault();
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setIsDrawing(true);
//     setPoints([{ x, y, pressure: e.pressure }]);
//   };

//   const handlePointerMove = (e) => {
//     e.preventDefault();
//     if (!isDrawing) return;

//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setPoints(prev => [...prev, { x, y, pressure: e.pressure }]);
//   };

//   const handlePointerUp = () => {
//     if (!isDrawing) return;
//     setIsDrawing(false);
//     setLines(prev => [...prev, points]);
//     setPoints([]);
//   };

//   const clear = () => {
//     const ctx = getContext();
//     if (!ctx) return;

//     ctx.clearRect(0, 0, width, height);
//     setLines([]);
//     setPoints([]);
//   };

//   const save = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const dataUrl = canvas.toDataURL('image/png');
//     onSave(dataUrl);
//   };

//   return (
//     <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
//       <Paper 
//         elevation={3} 
//         sx={{ 
//           width: width, 
//           height: height,
//           overflow: 'hidden',
//           touchAction: 'none',
//           backgroundColor: '#fff'
//         }}
//       >
//         <canvas
//           ref={canvasRef}
//           width={width}
//           height={height}
//           onPointerDown={handlePointerDown}
//           onPointerMove={handlePointerMove}
//           onPointerUp={handlePointerUp}
//           onPointerLeave={handlePointerUp}
//           style={{
//             width: '100%',
//             height: '100%',
//             cursor: 'crosshair'
//           }}
//         />
//       </Paper>
//       <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//         <Button 
//           variant="outlined" 
//           color="error" 
//           onClick={clear}
//         >
//           Clear
//         </Button>
//         <Button 
//           variant="contained" 
//           onClick={save}
//           disabled={lines.length === 0}
//         >
//           Save
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default SignaturePad;
// =======================================================
import React, { useRef, useState, useEffect } from 'react';
import { Paper, Button, Box, Typography } from '@mui/material';
import { getStroke } from 'perfect-freehand';

const SignaturePad = ({ setSignature, initialSignature = null }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        const ctx = getContext();
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  };

  const drawLine = (points) => {
    const ctx = getContext();
    if (!ctx || points.length < 2) return;

    const stroke = getStroke(points, {
      size: 3,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });

    ctx.beginPath();
    ctx.fillStyle = '#000';
    
    if (stroke.length > 0) {
      ctx.moveTo(stroke[0][0], stroke[0][1]);
      
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i][0], stroke[i][1]);
      }
      
      ctx.fill();
    }
  };

  const redrawCanvas = () => {
    const ctx = getContext();
    if (!ctx) return;

    ctx.clearRect(0, 0, 500, 200);
    lines.forEach(line => drawLine(line));
    if (points.length > 0) drawLine(points);
  };

  useEffect(() => {
    redrawCanvas();
  }, [lines, points]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setPoints([{ x, y, pressure: e.pressure }]);
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(prev => [...prev, { x, y, pressure: e.pressure }]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLines(prev => [...prev, points]);
    setPoints([]);
  };

  const clear = () => {
    const ctx = getContext();
    if (!ctx) return;

    ctx.clearRect(0, 0, 500, 200);
    setLines([]);
    setPoints([]);
    setSignature(null);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas || lines.length === 0) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    setSignature(dataUrl);
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Draw your signature below:
      </Typography>
      <Paper 
        elevation={3} 
        sx={{ 
          width: '100%',
          height: 200,
          overflow: 'hidden',
          touchAction: 'none',
          backgroundColor: '#fff',
          mb: 2
        }}
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'crosshair'
          }}
        />
      </Paper>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={clear}
        >
          Clear
        </Button>
        <Button 
          variant="contained" 
          onClick={save}
          disabled={lines.length === 0}
        >
          Save Signature
        </Button>
      </Box>
    </Box>
  );
};

export default SignaturePad;
