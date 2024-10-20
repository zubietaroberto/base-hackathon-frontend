import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import styles from "./index.module.css";

export function NavBar() {
  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar>
        <Typography variant="h6">Loans explorer</Typography>
      </Toolbar>
    </AppBar>
  );
}
