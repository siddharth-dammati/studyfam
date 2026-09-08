"use client";

// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";

export interface CheckoutResult {
  error?: {
    message: string;
    code?: string;
  };
  paymentDetails?: {
    paymentMessage?: string;
  };
  redirect?: boolean;
}

let cashfreeInstance: any = null;

export async function loadCashfreeSDK(): Promise<any> {
  if (typeof window === "undefined") {
    return null;
  }

  if (cashfreeInstance) {
    return cashfreeInstance;
  }

  const mode = (process.env.NEXT_PUBLIC_CASHFREE_MODE || "production") as "sandbox" | "production";

  try {
    cashfreeInstance = await load({ mode });
    return cashfreeInstance;
  } catch (err: any) {
    console.error("Failed to load Cashfree SDK:", err);
    throw new Error("Could not initialize Cashfree checkout. Please try again.");
  }
}

/**
 * Opens the Cashfree seamless modal popup for UPI, Cards, Netbanking
 */
export async function openCashfreeCheckout(paymentSessionId: string): Promise<CheckoutResult> {
  const cashfree = await loadCashfreeSDK();
  if (!cashfree) {
    throw new Error("Unable to load Cashfree payment SDK");
  }

  return new Promise((resolve) => {
    cashfree
      .checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      })
      .then((result: any) => {
        resolve(result || {});
      })
      .catch((err: any) => {
        resolve({
          error: {
            message: err?.message || "Payment cancelled or modal closed",
          },
        });
      });
  });
}

