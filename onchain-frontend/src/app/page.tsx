"use server";

import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { NavBar } from "./(Navbar)";
import { getPage } from "./serverSideFunctions";
import { TokenList } from "./TokenList";

export default async function Home() {
  const nfts = await getPage(0);

  return (
    <main>
      <NavBar />

      <Card>
        <CardHeader title="NFTs available onchain" />
        <CardContent>
          <Typography>
            This is a list of all NFTs recorded in the blockchain. If your loan
            is approved it will appear here too
          </Typography>
        </CardContent>
      </Card>

      <TokenList tokenEvents={nfts} />
    </main>
  );
}
