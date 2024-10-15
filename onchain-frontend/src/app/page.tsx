"use server";

import { NavBar } from "./(Navbar)";
import { SearchBar } from "./(SearchBar)";
import { getPage } from "./serverSideFunctions";
import { TokenList } from "./TokenList";

export default async function Home() {
  const nfts = await getPage(0);

  return (
    <main>
      <NavBar />
      <SearchBar />
      <TokenList tokenEvents={nfts} />
    </main>
  );
}
