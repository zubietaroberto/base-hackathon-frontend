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

const MONEY_FORMAT = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "COP",
});

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
        creditDate = new Date(ms).toLocaleDateString("en-US");
      } catch {}
    }
  }

  const totalRepaid = nft.payments.reduce((prev, value) => {
    return prev.add(new Big(value.paymentAmount ?? "0"));
  }, new Big(0));

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

  const text = `Loan issued on ${creditDate} to ${nft.to}.`;
  const amount = MONEY_FORMAT.format(Number(creditSum));
  const amountLeftToBeRepaidNumber = creditSum.sub(totalRepaid);
  const amountLeftToBeRepaid = amountLeftToBeRepaidNumber.gt(new Big(0))
    ? MONEY_FORMAT.format(Number(amountLeftToBeRepaidNumber))
    : "Fully repaid";

  return (
    <Card className={classes.container}>
      <CardHeader title={`Token Id: ${nft.tokenId}`} />
      <CardContent>
        <Typography className={classes["double-width"]}>{text}</Typography>
        <Typography variant="body2">Loan Purpose</Typography>
        <Typography>{loanPurpose}</Typography>
        <Typography variant="body2">Loan amount</Typography>
        <Typography>{amount}</Typography>
        <Typography variant="body2">Amount left to be repaid</Typography>
        <Typography>{amountLeftToBeRepaid}</Typography>
        <Typography variant="body2">Payment History</Typography>
        <Typography>
          {nft.payments.length > 0
            ? `${nft.payments.length} payments made`
            : "No payment history"}
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained" href={`/t/${nft.tokenId}`}>
          Details
        </Button>

        <Button
          variant="contained"
          href={`https://sepolia.basescan.org/address/${nft.to}`}
        >
          See in BaseScan
        </Button>
      </CardActions>
    </Card>
  );
}
