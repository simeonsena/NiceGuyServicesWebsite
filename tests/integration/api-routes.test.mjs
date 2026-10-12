import assert from "node:assert/strict";
import test from "node:test";

import { POST as checkArea } from "../../app/api/v1/service-area/route.ts";
import { POST as createBooking } from "../../app/api/v1/bookings/route.ts";
import { POST as createContact } from "../../app/api/v1/contact/route.ts";

test("service-area API handles likely, outside, and manual-review results", async () => {
  for (const [location, status] of [
    ["45202", "likely-inside"],
    ["43004", "outside"],
    ["Main Street", "manual-review"],
  ]) {
    const response = await checkArea(
      new Request("http://localhost/api/v1/service-area", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ location }),
      }),
    );
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, status);
  }
});

test("retired submission APIs reject old form posts without issuing receipts", async () => {
  for (const [route, handler] of [
    ["bookings", createBooking],
    ["contact", createContact],
  ]) {
    const response = await handler(
      new Request(`http://localhost/api/v1/${route}`, {
        method: "POST",
        body: new FormData(),
      }),
    );
    assert.equal(response.status, 410);
    const data = await response.json();
    assert.match(data.message, /513-804-7766/);
    assert.match(data.message, /ssena@niceguyservices\.com/);
    assert.equal(data.reference, undefined);
  }
});
import {handleWebsiteBooking} from '../../worker/booking.ts';
test('website gateway enforces origin, consent and service area before forwarding',async()=>{
 const env={WEBSITE_OPS_URL:'https://backend.invalid/website',WEBSITE_OPS_KEY:'test-private-server-key',WEBSITE_REQUESTS_ENABLED:'true'};
 const request=(body,origin='https://niceguyservices.com')=>new Request('https://niceguyservices.com/api/v1/bookings',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await handleWebsiteBooking(request({}),{})).status,503);
 assert.equal((await handleWebsiteBooking(request({},'https://other.invalid'),env)).status,403);
 assert.equal((await handleWebsiteBooking(request({action:'submit',consent:false}),env)).status,400);
 assert.equal((await handleWebsiteBooking(request({action:'submit',consent:true,data:{zip:'43004'}}),env)).status,400);
 const previous=globalThis.fetch;
 try {let forwarded;
 globalThis.fetch=async(url,options)=>{forwarded=options;return Response.json({received:true,id:'fixture'});};
 const response=await handleWebsiteBooking(request({action:'submit',id:'fixture',consent:true,data:{zip:'45202'}}),env);
 assert.equal(response.status,200);assert.equal((await response.json()).received,true);
 assert.equal(forwarded.headers['x-website-key'],env.WEBSITE_OPS_KEY);
 assert.equal(JSON.parse(forwarded.body).clientHash.length,64);
 globalThis.fetch=async()=>{throw Error('Network timeout');};
 assert.equal((await handleWebsiteBooking(request({action:'slots',data:{date:'2026-10-20'}}),env)).status,502);
 } finally {globalThis.fetch=previous;}
});
