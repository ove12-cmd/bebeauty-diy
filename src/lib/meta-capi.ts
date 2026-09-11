import "server-only";

const META_PIXEL_ID = "3246042772233645";
const META_API_VERSION = "v21.0";

export type MetaCapiUserData = {
  em?: string;
  ph?: string;
  external_id?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
};

/**
 * Posts one event to the Meta Conversions API. Shared by every server-side
 * Meta event (Purchase from the Stripe webhook, AddToCart/InitiateCheckout
 * from /api/track/meta) so the endpoint, pixel id, and test-event routing
 * only live in one place.
 */
export async function sendMetaCapiEvent(params: {
  eventName: string;
  eventId: string;
  eventTime: number;
  userData: MetaCapiUserData;
  customData: Record<string, unknown>;
  eventSourceUrl?: string;
}): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.warn(`[meta-capi] META_CAPI_TOKEN missing — skipping ${params.eventName}`);
    return;
  }

  const metaEvent: Record<string, unknown> = {
    event_name: params.eventName,
    event_time: params.eventTime,
    event_id: params.eventId,
    action_source: "website",
    user_data: params.userData,
    custom_data: params.customData,
  };
  if (params.eventSourceUrl) metaEvent.event_source_url = params.eventSourceUrl;

  const payload: Record<string, unknown> = { data: [metaEvent] };
  // Diverts the event to Events Manager → Test Events for verification.
  // Leaving this set in production stops events reaching live reporting.
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) payload.test_event_code = testCode;

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    console.error(`[meta-capi] request failed for ${params.eventName}:`, res.status, await res.text());
  }
}
