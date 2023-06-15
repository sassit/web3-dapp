import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from './ui/Button';
import axios from 'axios';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 'auto',
  height: '30vh',
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  width: 'auto',
  height: '100%',
  marginLeft: '0',
  marginRight: '0',
};

export default function FileDrop(props) {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [confirmUpload, setConfirmUpload] = useState(false);
  console.log(uploadStatus);
  console.log(files);

  useEffect(() => {
    if (files.length !== 0) {
      setConfirmUpload(true);
    }
  }, [files]);

  const handleUpload = async () => {
    setUploadStatus('Uploading...');

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('image', file);
      });
      formData.append('nftName', 'Hello');
      formData.append('nftDescription', 'Test');
      formData.append('address', '0x63Ec8bcF66479CE5844Eb8cb5147C9D1CC448B95');

      const response = await axios.post(
        'http://localhost:3001/ipfs/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Handle the response from the server as needed
      console.log('Upload response:', response.data);

      setUploadStatus('Upload successful!');
    } catch (error) {
      setUploadStatus('Upload failed!');
      console.error('Error uploading files:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <>
      <section
        className='container'
        style={{
          backgroundColor: 'grey',
          width: '50vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          borderRadius: '2rem',
          border: '4px dotted black',
        }}
      >
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag and drop files here, or click to select files</p>
          )}
        </div>
      </section>
      <aside style={thumbsContainer}>{thumbs}</aside>
      {uploadStatus}
      {confirmUpload && <Button onClick={handleUpload}>Confirm Upload</Button>}
    </>
  );
}
