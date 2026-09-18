export async function POST() {
  return Response.json(
    {
      message:
        "Online booking is unavailable. Call 513-804-7766 or email ssena@niceguyservices.com to arrange service.",
    },
    { status: 410 },
  );
}
