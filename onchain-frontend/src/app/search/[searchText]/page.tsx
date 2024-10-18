"use server";

import { NavBar } from "@/app/(Navbar)";
import { searchByAddress, searchByTokenId } from "@/app/serverSideFunctions";
import { Typography } from "@mui/material";
import styles from "./page.module.css";
import { TokenItem } from "@/app/(TokenItem)";

interface Params {
  searchText: string;
}

export default async function SearchPage({
  params: { searchText },
}: {
  params: Params;
}) {
  if (!searchText) {
    return <Typography variant="h1">No search text provided</Typography>;
  }

  const [tokensByAddress, tokensById] = await Promise.all([
    searchByAddress(searchText),
    searchByTokenId(searchText),
  ]);

  return (
    <main>
      <NavBar />

      <header className={styles.header}>
        <h1>Search Results for: {searchText}</h1>
      </header>

      {tokensByAddress.length > 0 ? (
        <section className={styles.section}>
          <Typography variant="h4">Results by receiving address</Typography>
          {tokensByAddress.map((token) => (
            <TokenItem key={token.id} nft={token} />
          ))}
        </section>
      ) : (
        <section className={styles.section}>
          <Typography variant="h4">No results by address found</Typography>
        </section>
      )}

      {tokensById.length > 0 ? (
        <section className={styles.section}>
          <Typography variant="h4">Results by token ID</Typography>
          {tokensById.map((token) => (
            <TokenItem key={token.id} nft={token} />
          ))}
        </section>
      ) : (
        <section className={styles.section}>
          <Typography variant="h4">No results by token ID found</Typography>
        </section>
      )}
    </main>
  );
}
