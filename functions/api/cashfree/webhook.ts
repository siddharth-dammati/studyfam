interface Env {
  CASHFREE_SECRET_KEY?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const body: any = await request.json();

    // Cashfree PG webhook format
    const eventType = body?.type || body?.event;
    const data = body?.data || body;
    const order = data?.order || data;
    const payment = data?.payment || data;

    const orderId = order?.order_id || data?.order_id;
    const paymentStatus = (payment?.payment_status || order?.order_status || "").toUpperCase();
    const paymentId = String(payment?.cf_payment_id || payment?.payment_id || "");
    const paymentMethod = String(payment?.payment_group || "online");

    if (orderId && (paymentStatus === "SUCCESS" || paymentStatus === "PAID")) {
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
      const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

      await fetch(`${supabaseUrl}/rest/v1/registrations?order_id=eq.${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "registered",
          amount_paid: 27,
          payment_status: "success",
          payment_id: paymentId,
          payment_method: paymentMethod,
        }),
      });
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
