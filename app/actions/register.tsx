"use server";

import { db } from "@/db";

export async function register(data) {
  try {
    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  } catch (error) {
    return { error: "Error registering" };
  }
}