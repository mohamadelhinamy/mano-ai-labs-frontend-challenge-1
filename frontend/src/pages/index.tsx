import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from '../components/Button';
import UploadField from '../components/UploadField';
import { generateMRFFile, uploadCSVFile } from '../services/apiService';
import claimsStore from '~/stores/claimsStore';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

const UploadPage: React.FC = observer(() => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (file) {
      claimsStore.setLoading(true);
      try {
        const response = await uploadCSVFile(file);
        showNotification({
          title: 'Success',
          message: 'CSV file uploaded successfully',
          color: 'green',
        });
        claimsStore.setClaims(response?.data ?? []);
      } catch (error) {
        claimsStore.setError(error?.response?.message ?? 'Failed to upload CSV file');
      } finally {
        claimsStore.setLoading(false);
      }
    } else {
      claimsStore.setError('Please upload a file before submitting.');
    }
  };

  const handleApproveClaims = async () => {
    if (claimsStore.claims.length > 0) {
      claimsStore.setMRFLoading(true);
      try {
        await generateMRFFile({ claims: claimsStore.claims });
        showNotification({
          title: 'Success',
          message: 'MRF file generated successfully',
          color: 'green',
        });
        navigate('/mrf-files');
      } catch (error) {
        console.log(error, 'error')
        claimsStore.setError(error?.response?.message ?? 'Failed to generate MRF file');
      } finally {
        claimsStore.setMRFLoading(false);
      }
    } else {
      claimsStore.setError('No claims available to approve.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload CSV File</h1>
      <div className="flex items-end justify-center space-x-4">
        <UploadField
          label="Upload CSV File"
          onChange={handleFileChange}
          placeholder="Select a file or drag and drop here"
          required
        />
        <Button onClick={handleSubmit} disabled={claimsStore.loading}>
          {claimsStore.loading ? 'Uploading...' : 'Submit'}
        </Button>
      </div>

      {claimsStore.claims.length > 0 && (
      <>
        <div className="ag-theme-alpine mt-6 w-full" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={claimsStore.claims}
            columnDefs={[
              { headerName: 'Claim ID', field: 'claimId' },
              { headerName: 'Subscriber ID', field: 'subscriberId' },
              { headerName: 'Member Sequence', field: 'memberSequence' },
              { headerName: 'Claim Status', field: 'claimStatus' },
              { headerName: 'Billed', field: 'billed' },
              { headerName: 'Allowed', field: 'allowed' },
              { headerName: 'Paid', field: 'paid' },
              { headerName: 'Payment Status Date', field: 'paymentStatusDate' },
              { headerName: 'Service Date', field: 'serviceDate' },
              { headerName: 'Received Date', field: 'receivedDate' },
              { headerName: 'Entry Date', field: 'entryDate' },
              { headerName: 'Processed Date', field: 'processedDate' },
              { headerName: 'Paid Date', field: 'paidDate' },
              { headerName: 'Payment Status', field: 'paymentStatus' },
              { headerName: 'Group Name', field: 'groupName' },
              { headerName: 'Group ID', field: 'groupId' },
              { headerName: 'Division Name', field: 'divisionName' },
              { headerName: 'Division ID', field: 'divisionId' },
              { headerName: 'Plan', field: 'plan' },
              { headerName: 'Plan ID', field: 'planId' },
              { headerName: 'Place of Service', field: 'placeOfService' },
              { headerName: 'Claim Type', field: 'claimType' },
              { headerName: 'Procedure Code', field: 'procedureCode' },
              { headerName: 'Member Gender', field: 'memberGender' },
              { headerName: 'Provider ID', field: 'providerId' },
              { headerName: 'Provider Name', field: 'providerName' },
            ]}
          />
        </div>
        <Button className="mt-4" onClick={handleApproveClaims} disabled={claimsStore.loading}>
        {claimsStore.mrfLoading ? 'Processing...' : 'Approve Claims'}
      </Button>
      </>
      )}
    </div>
  );
});

export default UploadPage;
