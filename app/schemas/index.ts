import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
  });

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const customerSchema = z.object({
  id: z.string().nonempty("NRIC is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  firstName: z.string().nonempty("First Name is required"),
  lastName: z.string().nonempty("Last Name is required"),
  policy: z.string().nonempty("Please select a policy"),
});
