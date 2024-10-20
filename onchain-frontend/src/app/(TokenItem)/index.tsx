import { LoanPurpose } from "@/types";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Link,
  Typography,
} from "@mui/material";
import Big from "big.js";
import { PageResult } from "../serverSideFunctions";
import classes from "./index.module.css";
import { TokenAvatar } from "./TokenAvatar";

const CONTRACT_ADDRESS = "0xc743d9ab2d396176ade68bf72c5ab1ac20693cbf";
const MONEY_FORMAT = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
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

  const truncatedAddress = nft.to
    ? nft.to.slice(0, 6) + "..." + nft.to.slice(-4)
    : "Unknown";

  const linkToAddress = `https://sepolia.basescan.org/address/${nft.to}#nfttransfers`;
  const text = (
    <>
      {`Loan issued on ${creditDate} to `}
      <Link href={linkToAddress}>{truncatedAddress}</Link>
    </>
  );
  const amount = MONEY_FORMAT.format(Number(creditSum));
  const amountLeftToBeRepaidNumber = creditSum.sub(totalRepaid);
  const amountLeftToBeRepaid = amountLeftToBeRepaidNumber.gt(new Big(0))
    ? MONEY_FORMAT.format(Number(amountLeftToBeRepaidNumber))
    : "Fully repaid";
  const nftUrl = `https://sepolia.basescan.org/nft/${CONTRACT_ADDRESS}/${nft.tokenId}`;

  return (
    <Card className={classes.container}>
      <CardHeader
        title={`Loan #${nft.tokenId}`}
        subheader={text}
        avatar={<TokenAvatar nft={nft} />}
      />
      <CardContent>
        <Typography variant="body2">Loan Purpose</Typography>
        <Typography>{loanPurpose}</Typography>
        <Typography variant="body2">Loan amount</Typography>
        <Typography>{amount}</Typography>
        <Typography variant="body2">To be repaid</Typography>
        <Typography>{amountLeftToBeRepaid}</Typography>
        <Typography variant="body2">Payment History</Typography>
        <Typography>
          {nft.payments.length > 0
            ? `${nft.payments.length} payments made`
            : "No payment history"}
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained" href={nftUrl}>
          View NFT Onchain
        </Button>
      </CardActions>
    </Card>
  );
}
