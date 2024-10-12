import NextLink from "next/link";
import { Link as MuiLink } from "@mui/material";
import { forwardRef } from "react";

// Based on: https://stackoverflow.com/a/72224893
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Link = forwardRef((props: any, ref: any) => {
  const { href } = props;
  return (
    <NextLink href={href} passHref>
      <MuiLink ref={ref} {...props} />
    </NextLink>
  );
});

Link.displayName = "CustomLink";
