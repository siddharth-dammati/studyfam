"use client";

declare global {
  interface Window {
    Cashfree?: (config: { mode: "sandbox" | "production" }) => any;
  }
}

let cashfreePromise: Promise<any> | null = null;

export function loadCashfreeSDK(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  const mode = (process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox") as "sandbox" | "production";

  if (window.Cashfree) {
    return Promise.resolve(window.Cashfree({ mode }));
  }

  if (cashfreePromise) {
    return cashfreePromise;
  }

  cashfreePromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="cashfree.com"]');
    if (existing && window.Cashfree) {
      resolve(window.Cashfree({ mode }));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      if (window.Cashfree) {
        resolve(window.Cashfree({ mode }));
      } else {
        reject(new Error("Cashfree SDK failed to initialize"));
      }
    };
    script.onerror = () => {
      cashfreePromise = null;
      reject(new Error("Failed to load Cashfree checkout script"));
    };
    document.head.appendChild(script);
  });

  return cashfreePromise;
}

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
