import axios from "axios";
import { z } from "zod";

const baseUrl = "http://localhost:8000/api";

export const axiosConfig = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 15000,
});

// zod schema
export const registerSchema = z.object({
  fullName: z
    .string()
    .refine(
      (val) => /^[a-zA-Z ]+$/.test(val.trim()),
      "Full name must contain only letters and spaces"
    )
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name too long")
    .transform((val) => val.trim()),

  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required")
    .transform((val) => val.trim().toLowerCase()),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .transform((val) => val.trim()),
});

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address")
    .transform((val) => val.trim().toLowerCase()),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .transform((val) => val.trim()),
});
