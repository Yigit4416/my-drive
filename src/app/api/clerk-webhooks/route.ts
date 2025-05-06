"use server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { folderForSignUp } from "~/server/queries";

export async function POST(request: Request) {
  console.log("ok");
  try {
    const payload: WebhookEvent = await request.json();
    console.log(payload);
    if (payload.type === "user.created") {
      const result = await folderForSignUp({ userId: payload.data.id });
      console.info(result);
    } else if (payload.type === "user.deleted") {
      console.log("user deleted");
    }
    return Response.json({ message: "Received" });
  } catch (e) {
    console.error(e);
    return Response.error();
  }
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}
