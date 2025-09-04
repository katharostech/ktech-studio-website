import { AutoRouter, cors, error } from "npm:itty-router";

const { preflight, corsify } = cors();
const router = AutoRouter({
  before: [preflight],
  finally: [corsify],
});

const contactWebhook = Deno.env.get("CONTACT_WEBHOOK");
if (!contactWebhook) throw "Missing CONTACT_WEBHOOK env var";
const turnstileSecret = Deno.env.get("TURNSTILE_SECRET");
if (!turnstileSecret) throw "Missing TURNSTILE_SECRET env var";

router.post("/contact", async ({ formData }) => {
  const data = await formData();
  const cloudflareToken = data.get("cf-turnstile-response");
  if (!cloudflareToken) return error(400, "Cloudflare captcha token missing.");
  const name = data.get("name");
  const email = data.get("email");
  if (!email) return error(400, "Missing email field");
  const message = data.get("message");
  if (!message) return error(400, "Missing message field");

  const turnstileData = new FormData();
  turnstileData.append("secret", turnstileSecret);
  turnstileData.append("response", cloudflareToken);
  // turnstileData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: turnstileData,
    method: "POST",
  });
  if (!result.ok) {
    console.error("Error validating turnstile challenge:", await result.text());
    return error(400, "Invalid turnstile challenge response");
  }

  const response = await fetch(contactWebhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: `New message from contact form:`,
      attachments: [
        {
          title: `${name}${name && " "}<${email}>`,
          text: message,
        },
      ],
    }),
  });
  if (response.ok) {
    return new Response(undefined, { status: 200 });
  } else {
    return new Response(undefined, {
      status: 500,
      statusText: "Failed to send message to contact webhook.",
    });
  }
});

Deno.serve(router.fetch);
