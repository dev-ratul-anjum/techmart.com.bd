import { z } from "zod";

export const createAddressSchema = z.object({
  address: z.string({ message: "Address is required" }),
  city: z.string({ message: "City is required" }),
  postCode: z.number({ message: "Post code is required" }),
  country: z.string({ message: "Country is required" }),
  region: z.string({ message: "Region is required" }),
  markAsDefault: z.boolean().default(false),
});

export const updateAddressSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  postCode: z.number().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  markAsDefault: z.boolean().optional(),
});

export type TCreateAddress = z.infer<typeof createAddressSchema>;
export type TUpdateAddress = z.infer<typeof updateAddressSchema>;
