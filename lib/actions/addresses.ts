"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  address_type: string;
  created_at: string;
  updated_at: string;
}

export interface AddressInput {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  address_type?: string;
  is_default?: boolean;
}

/**
 * Get all addresses for the current user
 */
export async function getAddresses(): Promise<Address[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }

  return data || [];
}

/**
 * Get default address
 */
export async function getDefaultAddress(): Promise<Address | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get address by ID
 */
export async function getAddress(addressId: string): Promise<Address | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", addressId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Create a new address
 */
export async function createAddress(addressData: AddressInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // If this is set as default, unset other defaults
  if (addressData.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      ...addressData,
      user_id: user.id,
      country: addressData.country || "India",
      address_type: addressData.address_type || "home",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating address:", error);
    return { success: false, error: "Failed to create address" };
  }

  revalidatePath("/account/addresses");
  return { success: true, data, message: "Address added successfully" };
}

/**
 * Update an existing address
 */
export async function updateAddress(addressId: string, addressData: Partial<AddressInput>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // If this is set as default, unset other defaults
  if (addressData.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .neq("id", addressId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .update({
      ...addressData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating address:", error);
    return { success: false, error: "Failed to update address" };
  }

  revalidatePath("/account/addresses");
  return { success: true, data, message: "Address updated successfully" };
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting address:", error);
    return { success: false, error: "Failed to delete address" };
  }

  revalidatePath("/account/addresses");
  return { success: true, message: "Address deleted successfully" };
}

/**
 * Set an address as default
 */
export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Unset all defaults
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);

  // Set the selected address as default
  const { error } = await supabase
    .from("addresses")
    .update({
      is_default: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error setting default address:", error);
    return { success: false, error: "Failed to set default address" };
  }

  revalidatePath("/account/addresses");
  return { success: true, message: "Default address updated" };
}

/**
 * Validate address data
 */
export function validateAddress(addressData: AddressInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!addressData.full_name || addressData.full_name.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }

  if (!addressData.phone || !/^\d{10}$/.test(addressData.phone.replace(/\D/g, ""))) {
    errors.push("Please enter a valid 10-digit phone number");
  }

  if (!addressData.address_line1 || addressData.address_line1.trim().length < 5) {
    errors.push("Address line 1 must be at least 5 characters");
  }

  if (!addressData.city || addressData.city.trim().length < 2) {
    errors.push("City must be at least 2 characters");
  }

  if (!addressData.state || addressData.state.trim().length < 2) {
    errors.push("State must be at least 2 characters");
  }

  if (!addressData.postal_code || !/^\d{6}$/.test(addressData.postal_code)) {
    errors.push("Please enter a valid 6-digit postal code");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
