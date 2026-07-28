import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FileDropzone } from './FileDropzone';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';

export default {
  title: 'Component/7. Input & Control/FileDropzone',
  component: FileDropzone,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## FileDropzone

A drag and drop file upload area component.

### Features
- Drag and drop file selection
- Supports default, compact, and minimal variants
- File preview and upload progress display
        `,
      },
    },
  },
};

/**
 * FileDropzone basic usage example
 */
export const Default = {
  render: () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleSelect = (selectedFile) => {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      }
    };

    const handleRemove = () => {
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    };

    return (
      <Box sx={ { maxWidth: 400 } }>
        <FileDropzone
          onFileSelect={ handleSelect }
          onFileRemove={ handleRemove }
          selectedFile={ file }
          previewUrl={ preview }
        />
      </Box>
    );
  },
};

/**
 * FileDropzone variants
 */
export const Variants = {
  render: () => (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400 } }>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Default
        </Typography>
        <FileDropzone onFileSelect={ (f) => console.log(f) } variant="default" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Compact
        </Typography>
        <FileDropzone onFileSelect={ (f) => console.log(f) } variant="compact" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Minimal
        </Typography>
        <FileDropzone onFileSelect={ (f) => console.log(f) } variant="minimal" />
      </Box>
    </Box>
  ),
};

/**
 * FileDropzone uploading state
 */
export const Uploading = {
  render: () => (
    <Box sx={ { maxWidth: 400 } }>
      <Typography variant="subtitle2" sx={ { mb: 2, fontWeight: 600 } }>
        Uploading State
      </Typography>
      <FileDropzone
        onFileSelect={ () => {} }
        selectedFile={ { name: 'sample-image.jpg', size: 2500000 } }
        previewUrl={ placeholderSvg(600, 400) }
        isUploading
        uploadProgress={ 65 }
      />
    </Box>
  ),
};
