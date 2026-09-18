export async function POST() {
  return Response.json(
    {
      message:
        "Online contact submissions are unavailable. Call 513-804-7766 or email ssena@niceguyservices.com.",
    },
    { status: 410 },
  );
}
