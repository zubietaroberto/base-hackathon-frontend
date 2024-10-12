import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import styles from "./index.module.css";
import Link from "next/link";

export function NavBar() {
  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar>
        <Typography variant="h6">OnchainBrowser</Typography>
        <Link href="/">
          <Button color="inherit">Home</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
