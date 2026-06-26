import { NextRequest } from "next/server";




export function getClientIp(request: Request | NextRequest): string {
  try {
   const forwardedFor = request.headers.get("x-forwarded-for");
   if(forwardedFor) return forwardedFor.split(",")[0].trim();
   const realIp = request.headers.get("x-real-ip")
   if(realIp) return realIp;
    // for local dev (Node Request type)
    // @ts-ignore
    if (request.socket?.remoteAddress) return request.socket.remoteAddress;
  } catch {}
  return "unknown";
}