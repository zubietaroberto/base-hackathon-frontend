"use server";

import { NavBar } from "@/components/Navbar";
import { getPage } from "./serverSideFunctions";
import { TokenList } from "./TokenList";

export default async function Home() {
  const nfts = await getPage(0);

  return (
    <main>
      <NavBar />

      <TokenList tokenEvents={nfts} />
    </main>
  );
}
