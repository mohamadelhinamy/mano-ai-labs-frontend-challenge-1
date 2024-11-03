import { z } from 'zod';
import { type RowData } from '../types/index.js';

export const rowSchema = z.object({
  claimId: z.string().min(1, { message: 'Claim Id is required' }),
  subscriberId: z.string().min(1, { message: 'Subscriber Id is required' }),
  memberSequence: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => Number.isInteger(val) && val >= 0, {
      message: 'Member Sequence must be a non negative integer',
    }),
  claimStatus: z.enum(['Payable', 'Denied', 'Partial Deny']),
  billed: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, { message: 'Billed amount must be non-negative' }),
  allowed: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, { message: 'Allowed amount must be non-negative' }),
  paid: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, { message: 'Paid amount must be non-negative' }),
  paymentStatusDate: z.preprocess((val) => new Date(val as string), z.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid Payment Status Date',
  })),
  serviceDate: z.preprocess((val) => new Date(val as string), z.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid Service Date',
  })),
  receivedDate: z.preprocess((val) => new Date(val as string), z.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid Received Date',
  })),
  entryDate: z.preprocess((val) => new Date(val as string), z.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid Entry Date',
  })),
  processedDate: z.preprocess((val) => new Date(val as string), z.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid Processed Date',
  })),
  paidDate: z.preprocess((val) => new Date(val as string), z.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid Paid Date',
  })),
  paymentStatus: z.string().min(1, { message: 'Payment Status is required' }),
  groupName: z.string().min(1, { message: 'Group Name is required' }),
  groupId: z.string().min(1, { message: 'Group Id is required' }),
  divisionName: z.string().min(1, { message: 'Division Name is required' }),
  divisionId: z.string().min(1, { message: 'Division Id is required' }),
  plan: z.string().min(1, { message: 'Plan is required' }),
  planId: z.string().min(1, { message: 'Plan Id is required' }),
  placeOfService: z.string().min(1, { message: 'Place of Service is required' }),
  claimType: z.enum(['Professional', 'Institutional']),
  procedureCode: z.string().min(1, { message: 'Procedure Code is required' }),
  memberGender: z.enum(['Male', 'Female']),
  providerId: z.string().min(1, { message: 'Provider Id is required' }),
  providerName: z.string().min(1, { message: 'Provider Name is required' }),
});

export const validateRowSchema = (row: RowData) => {
  const result = rowSchema.safeParse(row);

  if (!result.success) {
    const errors = result.error.errors.map((err) => err.message).join(', ');
    throw new Error(`Validation Error: ${errors}`);
  }
};
