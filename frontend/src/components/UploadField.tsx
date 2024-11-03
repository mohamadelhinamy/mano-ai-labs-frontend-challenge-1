import React from 'react';
import { FileInput, FileInputProps } from '@mantine/core';

const UploadField: React.FC<FileInputProps> = (props) => {
  return (
    <FileInput
      placeholder="Select a file or drag and drop here"
      accept=".csv"
      {...props}
    />
  );
};

export default UploadField;
