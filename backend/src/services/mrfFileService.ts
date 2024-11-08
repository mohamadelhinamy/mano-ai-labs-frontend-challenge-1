import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { type RowData } from '../types/index.js';

export const generateMRFFile = async (claimsData: RowData[]): Promise<string> => {
  const mrfData = aggregateClaimsData(claimsData);

  const fileName = `mrf_${Date.now()}.json`;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, '../mrf_files', fileName);

  try {
    await fs.writeFile(filePath, JSON.stringify(mrfData, null, 2));
    console.log(`MRF file saved successfully: ${fileName}`);
    return fileName;
  } catch (error) {
    console.error('Error saving MRF file:', error);
    throw new Error('Could not save MRF file');
  }
};

const aggregateClaimsData = (claimsData: RowData[]): any => {
  const aggregatedData: { [key: string]: any } = {};

  claimsData.forEach((claim) => {
    const key = `${claim.providerId}_${claim.procedureCode}_${claim.placeOfService}_${claim.claimType}`;

    if (!aggregatedData[key]) {
      aggregatedData[key] = {
        name: claim.procedureCode,
        billing_code_type: 'CPT',
        billing_code: claim.procedureCode,
        billing_code_type_version: '2024',
        description: `Service provided: ${claim.procedureCode}`,
        allowed_amounts: [],
      };
    }

    aggregatedData[key].allowed_amounts.push({
      tin: {
        type: 'npi',
        value: claim.providerId,
      },
      service_code: claim.claimType === 'Professional' ? [claim.placeOfService] : [],
      billing_class: claim.claimType === 'Professional' ? 'professional' : 'institutional',
      payments: [
        {
          allowed_amount: parseFloat(claim.allowed.toString()),
          billing_code_modifier: [],
          providers: [
            {
              billed_charge: parseFloat(claim.billed.toString()),
              npi: [claim.providerId],
            },
          ],
        },
      ],
    });
  });


  const uniqueEntities = Array.from(new Set(claimsData.map((claim) => claim.groupName)));
  const mrfData = uniqueEntities.map((entity) => {
    const entityClaims = claimsData.filter((claim) => claim.groupName === entity);
    const planName = entityClaims[0].plan;
    const planId = entityClaims[0].planId;
    const entityType = entityClaims[0].divisionName.includes('Health') ? 'health insurance issuer' : 'group health plan';

    return {
      reporting_entity_name: entity,
      reporting_entity_type: entityType,
      plan_name: planName,
      plan_id_type: planId ? 'EIN' : 'HIOS',
      plan_id: planId,
      plan_market_type: entityClaims[0].divisionId === 'I' ? 'individual' : 'group',
      last_updated_on: new Date().toISOString().split('T')[0],
      version: '1.0.0',
      out_of_network: Object.values(aggregatedData).filter((data) => entityClaims.some((claim) => claim.procedureCode === data.name)),
    };
  });

  return mrfData;
};
