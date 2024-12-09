"use client";
import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_BASIC_AUTH_USERNAME: z.string(),
  NEXT_PUBLIC_BASIC_AUTH_PASSWORD: z.string(),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_BASIC_AUTH_USERNAME: process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME,
  NEXT_PUBLIC_BASIC_AUTH_PASSWORD: process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD,
});

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
