import bcrypt from "bcryptjs";
import { prisma } from "../../../prisma/prisma.js";
import { TCreateCustomer, TUpdateCustomer } from "./customer.schema.js";
import { uploadToCloudinary } from "../../../utils/fileUploader.js";
import { ApiError } from "../../../middlewares/errorHandler.js";

// Create customer
export const createCustomerService = async (
  payload: TCreateCustomer,
  file?: Express.Multer.File,
) => {
  const isExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
      phone: payload.phone,
    },
  });

  if (isExist) {
    throw new ApiError(400, "Customer already exists with this email or phone");
  }

  let photoUrl;
  if (file) {
    // Upload photo
    const uploadResult = await uploadToCloudinary(file);
    photoUrl = uploadResult.secure_url;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      photo: photoUrl,
      role: "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      createdAt: true,
    },
  });
};

// Get all customers
export const getAllCustomersService = async () => {
  return await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      createdAt: true,
    },
  });
};

// Get customer by ID
export const getCustomerByIdService = async (id: string) => {
  const customer = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      createdAt: true,
    },
  });

  if (!customer) throw new ApiError(404, "Customer not found");

  return customer;
};

// Update customer
export const updateCustomerService = async (
  id: string,
  payload: TUpdateCustomer,
  file?: Express.Multer.File,
) => {
  let photoUrl;

  // Verify existence
  const existing = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
  });
  if (!existing) throw new ApiError(404, "Customer not found");

  if (file) {
    const uploadResult = await uploadToCloudinary(file);
    photoUrl = uploadResult.secure_url;
  }

  const updateData: any = { ...payload };
  if (payload.password) {
    updateData.password = await bcrypt.hash(payload.password, 10);
  }
  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  const customer = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      createdAt: true,
    },
  });

  return customer;
};

// Delete customer
export const deleteCustomerService = async (id: string) => {
  const existing = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
  });
  if (!existing) throw new ApiError(404, "Customer not found");

  await prisma.user.delete({ where: { id } });
};
