"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { useState } from "react";
import styles from "./page.module.css";
import { getPage, PageResult } from "./serverSideFunctions";
import Big from "big.js";

interface TokenListProps {
  tokenEvents: PageResult[];
}

export function TokenList({ tokenEvents }: TokenListProps) {
  const [nfts, setNfts] = useState(tokenEvents);
  const [page, setPage] = useState(0);

  async function onNextPage() {
    setNfts(await getPage(page + 1));
    setPage(page + 1);
  }

  async function onPreviousPage() {
    setNfts(await getPage(Math.max(page - 1, 0)));
    setPage(Math.max(page - 1, 0));
  }

  return (
    <>
      <section className={styles.listContainer}>
        {nfts.map((nft) => {
          const creditSum = nft.credits.reduce((prev, value) => {
            return prev.add(new Big(value.totalRepaymentAmount ?? "0"));
          }, new Big(0));

          const paymentsSorted = nft.payments.sort((a, b) => {
            return (
              new Date(b.paymentDate ?? "").getTime() -
              new Date(a.paymentDate ?? "").getTime()
            );
          });

          let lastPaymentDate: string = "";
          if (paymentsSorted.length > 0) {
            if (paymentsSorted[0].paymentDate) {
              try {
                lastPaymentDate = new Date(
                  Number(paymentsSorted[0].paymentDate) * 1000
                ).toISOString();
              } catch (error) {}
            }
          }

          return (
            <Card key={nft.tokenId}>
              <CardHeader title={`Token Id: ${nft.tokenId}`} />
              <CardContent>
                <Typography>Credit given</Typography>
                <Typography variant="body2">{creditSum.toString()}</Typography>
                <Typography>Last Repayment</Typography>
                {lastPaymentDate && (
                  <Typography variant="body2">{lastPaymentDate}</Typography>
                )}
                <Typography>Receiver</Typography>
                <Typography variant="body2">{nft.to}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <footer className={styles.footer}>
        <Button variant="contained" color="primary" onClick={onPreviousPage}>
          Previous Page
        </Button>

        <Button variant="contained" color="primary" onClick={onNextPage}>
          Next Page
        </Button>
      </footer>
    </>
  );
}
