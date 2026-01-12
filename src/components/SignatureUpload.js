import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const SignatureUpload = ({ setSignature, initialSignature = null }) => {
    const [image, setImage] = useState(initialSignature);
    const imageRef = useRef(null);
    const cropperRef = useRef(null);

    useEffect(() => {
        if (image && imageRef.current) {
            if (cropperRef.current) {
                cropperRef.current.destroy();
            }

            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: 3 / 1,
                viewMode: 1,
                dragMode: 'move',
                restore: false,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
                background: false
            });
        }

        return () => {
            if (cropperRef.current) {
                cropperRef.current.destroy();
            }
        };
    }, [image]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = () => {
        if (cropperRef.current) {
            const croppedCanvas = cropperRef.current.getCroppedCanvas({
                width: 300,
                height: 100,
                fillColor: '#fff'
            });
            
            const croppedImage = croppedCanvas.toDataURL('image/png');
            setSignature(croppedImage);
        }
    };

    const handleClear = () => {
        setImage(null);
        setSignature(null);
        if (cropperRef.current) {
            cropperRef.current.destroy();
            cropperRef.current = null;
        }
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                Upload your signature:
            </Typography>
            
            <input
                accept="image/*"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="signature-upload"
            />
            
            <label htmlFor="signature-upload">
                <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Choose Image
                </Button>
            </label>

            {image && (
                <Box sx={{ mt: 2 }}>
                    <Box 
                        sx={{ 
                            width: '100%',
                            maxHeight: '300px',
                            overflow: 'hidden',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            mb: 2
                        }}
                    >
                        <img
                            ref={imageRef}
                            src={image}
                            alt="Signature"
                            style={{ maxWidth: '100%', display: 'block' }}
                        />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCrop}
                        >
                            Crop & Save
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default SignatureUpload;