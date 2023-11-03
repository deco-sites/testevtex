import {  useState } from "preact/hooks";
import { useEffect } from "preact/compat";



function VisitorsOnline() {
const [visitorCount, setVisitorCount] = useState<number>(0);


// @ts-ignore as `Deno.openKv` is still unstable.

// Função para obter a contagem de visitantes online do armazenamento chave-valor
async function getVisitorCount() {
  const kv = await Deno.openKv();
  await kv?.atomic().sum(["visits"], 1n).commit();
  const res = await kv?.get(["visits"]);
  return res?.value ?? 0;
}
// Atualizar a contagem de visitantes online ao montar o componente
useEffect(() => {
    const fetchVisitorCount = async () => {
        const count = await getVisitorCount();
        setVisitorCount(count as number);
    };
    fetchVisitorCount();
}, []);

  return (
    <div>
      <p>{visitorCount} pessoas viram este produto</p>
    </div>
  );
}

export default VisitorsOnline;

