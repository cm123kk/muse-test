import { useState, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * FileDropzone component
 *
 * An area for uploading files via drag and drop or click.
 * Provides preview, upload progress, and file info display.
 *
 * Behavior:
 * 1. Select a file via drag and drop or click
 * 2. Show a thumbnail preview of the selected file
 * 3. Show upload progress (isUploading state)
 * 4. Show the success state after the upload completes
 *
 * Props:
 * @param {function} onFileSelect - file select handler (file) => void [Required]
 * @param {function} onFileRemove - file remove handler [Optional]
 * @param {File} selectedFile - currently selected file [Optional]
 * @param {string} previewUrl - preview image URL [Optional]
 * @param {boolean} isUploading - uploading state [Optional, default: false]
 * @param {number} uploadProgress - upload progress (0-100) [Optional, default: 0]
 * @param {boolean} isComplete - upload complete state [Optional, default: false]
 * @param {string} accept - allowed file types [Optional, default: 'image/*,video/*']
 * @param {number} maxSize - maximum file size (bytes) [Optional, default: 50MB]
 * @param {string} variant - style variant ('default' | 'compact' | 'minimal') [Optional, default: 'default']
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <FileDropzone
 *   onFileSelect={handleFileSelect}
 *   selectedFile={file}
 *   previewUrl={preview}
 *   isUploading={uploading}
 *   uploadProgress={progress}
 * />
 */
export function FileDropzone({
  onFileSelect,
  onFilesSelect,
  onFileRemove,
  selectedFile,
  previewUrl,
  isUploading = false,
  uploadProgress = 0,
  isComplete = false,
  accept = 'image/*,video/*',
  maxSize = 50 * 1024 * 1024,
  multiple = false,
  variant = 'default',
  sx,
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  /**
   * File validation
   */
  const validateFile = useCallback(
    (file) => {
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        return `File size exceeds ${maxSizeMB}MB limit`;
      }
      return null;
    },
    [maxSize]
  );

  /**
   * File handling
   */
  const handleFile = useCallback(
    (file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  /**
   * Drag event handlers
   */
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFiles = useCallback(
    (files) => {
      const list = Array.from(files || []);
      if (!list.length) return;
      // Validate size
      for (const f of list) {
        const err = validateFile(f);
        if (err) { setError(err); return; }
      }
      setError(null);
      if (multiple && onFilesSelect) onFilesSelect(list);
      else onFileSelect?.(list[0]);
    },
    [validateFile, multiple, onFilesSelect, onFileSelect]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        if (multiple) handleFiles(files);
        else handleFile(files[0]);
      }
    },
    [handleFile, handleFiles, multiple]
  );

  /**
   * Select a file via click
   */
  const handleClick = useCallback(() => {
    if (!isUploading && !isComplete) {
      fileInputRef.current?.click();
    }
  }, [isUploading, isComplete]);

  /**
   * File input change handler
   */
  const handleInputChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        if (multiple) handleFiles(files);
        else handleFile(files[0]);
      }
      e.target.value = '';
    },
    [handleFile, handleFiles, multiple]
  );

  /**
   * File removal
   */
  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      setError(null);
      onFileRemove?.();
    },
    [onFileRemove]
  );

  /**
   * Height per variant
   */
  const variantHeight = {
    default: 240,
    compact: 160,
    minimal: 120,
  };

  /**
   * File size formatting
   */
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /**
   * Rendering when a preview is present
   */
  if (previewUrl || selectedFile) {
    return (
      <Box
        sx={{
          position: 'relative',
          height: variantHeight[variant],
          borderRadius: 2,
          overflow: 'hidden',
          border: '2px solid',
          borderColor: isComplete ? 'success.main' : 'divider',
          backgroundColor: 'grey.900',
          ...sx,
        }}
      >
        {/* Preview image */}
        {previewUrl && (
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        )}

        {/* Upload progress overlay */}
        {isUploading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
              Uploading... {uploadProgress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ width: '60%', height: 6, borderRadius: 1 }}
            />
          </Box>
        )}

        {/* Complete state overlay */}
        {isComplete && !isUploading && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'success.main',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <CheckCircleIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Uploaded
            </Typography>
          </Box>
        )}

        {/* File info */}
        {selectedFile && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 1.5,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'grey.400' }}>
              {formatFileSize(selectedFile.size)}
            </Typography>
          </Box>
        )}

        {/* Delete button */}
        {!isUploading && onFileRemove && (
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                bgcolor: 'error.main',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  }

  /**
   * Rendering the default dropzone state
   */
  return (
    <Box
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        height: variantHeight[variant],
        borderRadius: 2,
        border: '2px dashed',
        borderColor: error ? 'error.main' : isDragActive ? 'primary.main' : 'divider',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: error ? 'error.main' : 'primary.main',
          backgroundColor: 'action.hover',
        },
        ...sx,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* Icon */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isDragActive ? 'primary.main' : 'action.selected',
          color: isDragActive ? 'white' : 'text.secondary',
          transition: 'all 0.2s ease',
        }}
      >
        {isDragActive ? (
          <CloudUploadIcon sx={{ fontSize: 28 }} />
        ) : (
          <ImageIcon sx={{ fontSize: 28 }} />
        )}
      </Box>

      {/* Guidance text */}
      <Box sx={{ textAlign: 'center' }}>
        {variant !== 'minimal' && (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: isDragActive ? 'primary.main' : 'text.primary',
            }}
          >
            {isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
          </Typography>
        )}
        {variant === 'default' && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Supports images and videos up to {Math.round(maxSize / (1024 * 1024))}MB
          </Typography>
        )}
      </Box>

      {/* Error message */}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
