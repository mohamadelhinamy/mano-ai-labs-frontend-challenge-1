import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { fetchMRFFile } from '../../services/apiService';

interface FileDetails {
  fileName: string;
  content: unknown;
}

const MRFDetailsPage: React.FC = () => {
  const { filename } = useParams<{ filename: string }>();
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await fetchMRFFile(filename);
        console.log('response', response);
        setFileDetails(response);
      } catch (err) {
        setError(err?.response?.data?.message ?? "Failed to fetch file details");
        showNotification({
          title: 'Error',
          message: err.message,
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [filename]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">MRF File Details</h1>
      {fileDetails ? (
        <pre className="bg-gray-100 p-4 rounded w-full max-w-3xl">
          {JSON.stringify(fileDetails, null, 2)}
        </pre>
      ) : (
        <p>No file details available.</p>
      )}
    </div>
  );
};

export default MRFDetailsPage;
