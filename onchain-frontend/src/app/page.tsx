"use server";

import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import styles from "./page.module.css";

export default async function Home() {
  return (
    <main className={styles.container}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">OnchainBrowser</Typography>
          <Button color="inherit">Browse</Button>
          <Button color="inherit">105</Button>
          <Button color="inherit">Loans</Button>
          <Button color="inherit">Issued</Button>
        </Toolbar>
      </AppBar>
    </main>
  );
}
