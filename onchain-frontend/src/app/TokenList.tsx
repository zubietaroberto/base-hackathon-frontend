"use client";

import { Button } from "@mui/material";
import { useState } from "react";
import { TokenItem } from "./(TokenItem)";
import { getPage, PageResult } from "./serverSideFunctions";
import styles from "./TokenList.module.css";

interface TokenListProps {
  tokenEvents: PageResult[];
}

export function TokenList({ tokenEvents }: TokenListProps) {
  const [nfts, setNfts] = useState(tokenEvents);
  const [page, setPage] = useState(0);

  async function onNextPage() {
    setNfts(await getPage(page + 1));
    setPage(page + 1);
  }

  async function onPreviousPage() {
    setNfts(await getPage(Math.max(page - 1, 0)));
    setPage(Math.max(page - 1, 0));
  }

  return (
    <>
      <section className={styles.listContainer}>
        {nfts.map((nft) => (
          <TokenItem nft={nft} key={nft.tokenId} />
        ))}
      </section>

      <footer className={styles.footer}>
        <Button variant="contained" color="primary" onClick={onPreviousPage}>
          Previous Page
        </Button>

        <Button variant="contained" color="primary" onClick={onNextPage}>
          Next Page
        </Button>
      </footer>
    </>
  );
}
