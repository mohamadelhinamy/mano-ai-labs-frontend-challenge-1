import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Container } from '@mantine/core';
import { fetchMRFFiles } from '../../services/apiService';
import claimsStore from '~/stores/claimsStore';
import { useNavigate } from 'react-router-dom';

interface MRFFile {
  fileName: string;
  lastModified: string;
}

const MRFListPage: React.FC = () => {
  const [mrfFiles, setMRFFiles] = useState<MRFFile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      claimsStore.setLoading(true);
      try {
        const response = await fetchMRFFiles();
        setMRFFiles(response?.files ?? []);
      } catch (error) {
        claimsStore.setError(error?.response?.data ?? 'Failed to fetch MRF files');
      } finally {
        claimsStore.setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleRowClick = (rowData: MRFFile) => {
    console.log('MRF File Clicked:', rowData);
    navigate(`/mrf-files/${rowData.fileName}`);
  };

  return (
    <Container size="lg">
      <h1 className="text-2xl font-bold mb-6 text-center">MRF Files</h1>
      <div className="ag-theme-alpine w-3/4 max-w-lg h-[400px] self-center mx-auto">
        <AgGridReact
          rowData={mrfFiles}
          columnDefs={[
            { headerName: 'File Name', field: 'fileName' },
            { headerName: 'Last Modified', field: 'lastModified' },
          ]}
          rowSelection="single"
          onRowClicked={(event) => handleRowClick(event.data)}
          overlayLoadingTemplate={claimsStore.loading ? '<span class="ag-overlay-loading-center">Loading...</span>' : ''}
        />
      </div>
    </Container>
  );
};

export default MRFListPage;
