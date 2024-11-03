import { RowData } from "~/types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const uploadCSVFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${apiBaseUrl}files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload CSV file');
  }

  return await response.json();
};

export const generateMRFFile = async (claimsData: { claims: RowData[] }) => {
    const response = await fetch(`${apiBaseUrl}files/generate-mrf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(claimsData),
    });

    if (!response.ok) {
      console.log(response, 'response')
      throw new Error('Failed to generate MRF file');
    }

    return await response.json();
};

export const fetchMRFFiles = async () => {
  const response = await fetch(`${apiBaseUrl}files/mrf-files`);
  console.log(response, 'response')

  if (!response.ok) {
    throw new Error('Failed to fetch MRF files');
  }

  return await response.json();
}

export const fetchMRFFile = async (fileName: string) => {
  const response = await fetch(`${apiBaseUrl}files/mrf-files/${fileName}`);

  if (!response.ok) {
    throw new Error('Failed to fetch MRF file');
  }

  return await response.json();
}
