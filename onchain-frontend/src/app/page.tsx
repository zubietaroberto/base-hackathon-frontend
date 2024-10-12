"use server";

import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import styles from "./page.module.css";
import { createClient } from "@supabase/supabase-js";
import { TransferEvent } from "@/types";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

export default async function Home() {
  const nfts = await supabase
    .from<"Transfer", TransferEvent>("Transfer")
    .select("*")
    .limit(100);

  return (
    <main className={styles.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">OnchainBrowser</Typography>
          <Button color="inherit">Browse</Button>
          <Button color="inherit">105</Button>
          <Button color="inherit">Loans</Button>
          <Button color="inherit">Issued</Button>
        </Toolbar>
      </AppBar>

      <section className={styles.listContainer}>
        {nfts.data &&
          nfts.data.map((nft: TransferEvent) => (
            <div key={nft.tokenId}>
              <h1>{nft.tokenId}</h1>
              <p>
                {nft.from} -{">"} {nft.to}
              </p>
            </div>
          ))}
      </section>
    </main>
  );
}
