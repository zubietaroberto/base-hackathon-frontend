"use client";

import { Button, Input } from "@mui/material";
import { useState } from "react";
import styles from "./index.module.css";

export function SearchBar() {
  const [text, setText] = useState("");

  return (
    <section className={styles.container}>
      <Input
        placeholder="Search by text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="contained" size="large" href={`/search/${text}`}>
        Search
      </Button>
    </section>
  );
}
