"use server";

import { Card, CardContent, CardHeader, Link, Typography } from "@mui/material";
import { NavBar } from "./(Navbar)";
import { SearchBar } from "./(SearchBar)";
import { getPage } from "./serverSideFunctions";
import { TokenList } from "./TokenList";

export default async function Home() {
  const nfts = await getPage(0);

  return (
    <main>
      <NavBar />
      <SearchBar />

      <Card>
        <CardHeader title="Roda's onchain loanbook" />
        <CardContent>
          <Typography>
            <Link href="https://www.instagram.com/roda.co_/">Roda</Link> is a
            credit company in Colombia that issues loans to delivery drivers,
            micro-entrepreneurs and migrants.
          </Typography>

          <Typography>
            Below is a list of our loans, issued onchain for transparency. If
            you are a capital provider,{" "}
            <Link href="mailto:alejandro@roda.xyz">get in touch</Link> if you
            would like to fund loans for a particular user subset or category.
            We are currently in talks with providers interested in lending up to
            USD 5M.
          </Typography>
        </CardContent>
      </Card>

      <TokenList tokenEvents={nfts} />
    </main>
  );
}
