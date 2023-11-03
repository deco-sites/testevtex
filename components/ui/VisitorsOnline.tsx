import { timingSafeEqual } from "https://deno.land/std@0.203.0/crypto/timing_safe_equal.ts";
// @ts-ignore as `Deno.openKv` is still unstable.
const kv = await Deno.openKv();

const uuid = self.crypto.randomUUID();

window.onunload = () => {
  console.log("onunload is called");
};

globalThis.addEventListener("unload", () => {
  decreaseVisitorOnUnload();
});

async function decreaseVisitorOnUnload() {
  await kv.delete([`${uuid}`]);
}

async function getVisitorCount() {
  await kv.atomic().sum([`${uuid}`], 1n).commit();

  const res = await kv.get([`${uuid}`]);
  console.log("key", res.key);
  console.log("value", res.value);
  console.log("versionstamp", res.versionstamp);
  return res.value;
}

function addIfUnique(set: Set<Deno.KvKeyPart>, item: Uint8Array) {
  for (const i of set) {
    if (ArrayBuffer.isView(i) && timingSafeEqual(i, item)) {
      return;
    }
  }
  set.add(item);
}

export async function unique(
  kv: Deno.Kv,
  prefix: Deno.KvKey = [],
  options?: Deno.KvListOptions,
): Promise<Deno.KvKey[]> {
  getVisitorCount();
  const list = kv.list({ prefix }, options);
  const prefixLength = prefix.length;
  const prefixes = new Set<Deno.KvKeyPart>();
  for await (const { key } of list) {
    if (key.length <= prefixLength) {
      throw new TypeError(`Unexpected key length of ${key.length}.`);
    }
    const part = key[prefixLength];
    if (ArrayBuffer.isView(part)) {
      addIfUnique(prefixes, part);
    } else {
      prefixes.add(part);
    }
  }
  return [...prefixes].map((part) => [...prefix, part]);
}

const visitorCount = (await unique(kv, [])).length;

function VisitorsOnline() {

  
  return (
    <div class="rounded-full badge badge-primary p-4 align-middle self-center mt-4">
    <div class="flex align-center gap-4 p-4">
    <span class='flex justify-center align-middle items-center animate-pulse'>
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" fill="green"/></svg>
    </span>
    <span class="min-w-full p-2">
    {visitorCount.toString() + " pessoas viram este produto"}
    </span>
  </div>
    </div>
  );
}

export default VisitorsOnline;

