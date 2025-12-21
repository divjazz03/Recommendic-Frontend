import { z } from "zod";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; //5MB
export const fileSchema = z
  .array(z.instanceof(File))
  .length(1, "Provide one resume file")
  .refine(
    (files) => files.every((f) => f.size <= MAX_FILE_SIZE_BYTES),
    "Each file must be under 5MB"
  )
  .refine(
    (files) =>
      files.every((file) =>
        ["image/png", "image/jpeg", "application/pdf"].includes(file.type)
      ),
    "Invalid file detected (only PNG, JPG, PDF allowed)"
  );
export const fileListSchema = z
  .array(z.instanceof(File))
  .min(1, "At least one file is required")
  .refine((files) => files.length <= 3, "You can upload a maximum of three files")
  .refine(
    (files) => files.every((f) => f.size <= MAX_FILE_SIZE_BYTES),
    "Each file must be under 5MB"
  )
  .refine(
    (files) =>
      files.every((file) =>
        ["image/png", "image/jpeg", "application/pdf"].includes(file.type)
      ),
    "Invalid file detected (only PNG, JPG, PDF allowed)"
  );
