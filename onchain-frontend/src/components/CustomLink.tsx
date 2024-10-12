import NextLink from "next/link";
import { Link as MuiLink } from "@mui/material";
import { forwardRef } from "react";
import styles from "./CustomLink.module.css";

// Based on: https://stackoverflow.com/a/72224893
export const Link = forwardRef((props: any, ref: any) => {
  const { href } = props;
  return (
    <NextLink href={href} passHref>
      <MuiLink ref={ref} {...props} />
    </NextLink>
  );
});

Link.displayName = "CustomLink";
