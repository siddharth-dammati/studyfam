import { openCashfreeCheckout, CheckoutResult } from "@/utils/cashfree";
import { createClient } from "@/utils/supabase/client";

export interface CandidateOrderInput {
  fullName: string;
  email: string;
  phone: string;
  jeeStatus: "class-11" | "class-12" | "dropper";
  referralCode?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  payment_session_id?: string;
  error?: string;
}

export interface VerifyOrderResponse {
  success: boolean;
  order_id: string;
  registration_id?: string;
  payment_id?: string;
  status: "PAID" | "PENDING" | "FAILED" | "USER_DROPPED";
  error?: string;
}

/**
 * Initiates order creation with backend Cashfree endpoint
 */
export async function createCashfreeOrder(
  input: CandidateOrderInput
): Promise<CreateOrderResponse> {
  const cleanPhone = input.phone.replace(/\D/g, "").slice(-10);

  try {
    const res = await fetch("/api/cashfree/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: cleanPhone,
        jeeStatus: input.jeeStatus,
        referralCode: input.referralCode,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success && data.payment_session_id) {
      return {
        success: true,
        order_id: data.order_id,
        payment_session_id: data.payment_session_id,
      };
    }

    return {
      success: false,
      order_id: data.order_id || "",
      error: data.error || `Payment gateway responded with status ${res.status}`,
    };
  } catch (err: any) {
    return {
      success: false,
      order_id: "",
      error: err.message || "Failed to connect to payment server.",
    };
  }
}

/**
 * Verifies payment status after checkout
 */
export async function verifyCashfreeOrder(
  orderId: string
): Promise<VerifyOrderResponse> {
  try {
    const res = await fetch("/api/cashfree/verify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.status === "PAID") {
      return {
        success: true,
        order_id: data.order_id,
        registration_id: data.registration_id,
        payment_id: data.payment_id,
        status: "PAID",
      };
    }

    if (data.status) {
      return {
        success: false,
        order_id: orderId,
        status: data.status,
        error: data.error || `Payment status: ${data.status}`,
      };
    }
  } catch {
    // Continue to Supabase lookup
  }

  // Direct Supabase lookup to check if webhook or async update already succeeded
  try {
    const supabase = createClient();
    const { data: record } = await supabase
      .from("registrations")
      .select("id, status, payment_status, payment_id")
      .eq("order_id", orderId)
      .single();

    if (record && record.payment_status === "success") {
      return {
        success: true,
        order_id: orderId,
        registration_id: record.id,
        payment_id: record.payment_id,
        status: "PAID",
      };
    }
  } catch {
    // ignore
  }

  return {
    success: false,
    order_id: orderId,
    status: "FAILED",
    error: "Payment verification pending. If amount was debited, your dashboard will update shortly.",
  };
}

