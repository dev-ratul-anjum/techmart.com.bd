import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string("Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string("Email is required"),
  password: z.string("Password is required").min(6, "Password must be at least 6 characters"),
  phone: z.string("Phone number is required").min(10, "Invalid phone number"),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  phone: z.string().min(10, "Invalid phone number").optional(),
});

export type TCreateCustomer = z.infer<typeof createCustomerSchema>;
export type TUpdateCustomer = z.infer<typeof updateCustomerSchema>;
