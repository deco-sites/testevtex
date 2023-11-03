import Component from "$store/components/product/AddToCartButton/vtex.tsx";
import type { Props } from "$store/components/product/AddToCartButton/vtex.tsx";

function Island(props: Props) {
  const handler = (e: Event): void => {
    console.log(`got ${e.type} event in event handler (imported)`);
  };
  
  globalThis.addEventListener("load", handler);
  globalThis.addEventListener("beforeunload", handler);
  globalThis.addEventListener("unload", handler);
  
  globalThis.onload = (e: Event): void => {
    console.log(`got ${e.type} event in onload function (imported)`);
  };
  
  globalThis.onbeforeunload = (e: Event): void => {
    console.log(`got ${e.type} event in onbeforeunload function (imported)`);
  };
  
  globalThis.onunload = (e: Event): void => {
    console.log(`got ${e.type} event in onunload function (imported)`);
  };
  
  console.log("log from imported script");
  return <Component {...props} />;
}

export default Island;
