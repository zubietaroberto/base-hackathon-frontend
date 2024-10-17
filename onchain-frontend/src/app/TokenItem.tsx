import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import Big from "big.js";
import { PageResult } from "./serverSideFunctions";
import classes from "./TokenItem.module.css";
import { LoanPurpose } from "@/types";

interface TokenItemProps {
  nft: PageResult;
}

export function TokenItem({ nft }: TokenItemProps) {
  const creditSum = nft.credits.reduce((prev, value) => {
    return prev.add(new Big(value.totalRepaymentAmount ?? "0"));
  }, new Big(0));

  let creditDate = "Unknown";
  if (nft.credits.length > 0) {
    if (nft.credits[0].issuanceDate) {
      try {
        const ms = Number(nft.credits[0].issuanceDate) * 1000;
        creditDate = new Date(ms).toISOString();
      } catch {}
    }
  }

  const paymentsSorted = nft.payments.sort((a, b) => {
    return (
      new Date(b.paymentDate ?? "").getTime() -
      new Date(a.paymentDate ?? "").getTime()
    );
  });

  let lastPaymentDate: string = "Never";
  if (paymentsSorted.length > 0) {
    if (paymentsSorted[0].paymentDate) {
      try {
        const ms = Number(paymentsSorted[0].paymentDate) * 1000;
        lastPaymentDate = new Date(ms).toISOString();
      } catch {}
    }
  }

  let loanPurpose = "Unknown";
  if (nft.credits.length > 0) {
    const purpose = nft.credits[0].loanPurpose;
    if (purpose) {
      const value = LoanPurpose[purpose as keyof typeof LoanPurpose];
      if (value) {
        loanPurpose = value;
      }
    }
  }

  return (
    <Card className={classes.container}>
      <CardHeader title={`Token Id: ${nft.tokenId}`} />
      <CardContent>
        <Typography variant="body2">Credit given</Typography>
        <Typography>{creditSum.toString()}</Typography>
        <Typography variant="body2">Credit Date</Typography>
        <Typography>{creditDate}</Typography>
        <Typography variant="body2">Last Repayment</Typography>
        <Typography>{lastPaymentDate}</Typography>
        <Typography variant="body2">Receiver</Typography>
        <Typography>{nft.to}</Typography>
        <Typography variant="body2">Loan Purpose</Typography>
        <Typography>{loanPurpose}</Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained" href={`/t/${nft.tokenId}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
