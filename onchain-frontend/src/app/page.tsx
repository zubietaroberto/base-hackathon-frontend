"use server";

import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import styles from "./page.module.css";
import { getPage } from "./serverSideFunctions";
import { TokenList } from "./TokenList";

export default async function Home() {
  const nfts = await getPage(0);

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

      <TokenList tokenEvents={nfts} />
    </main>
  );
}
