import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import Big from "big.js";
import { PageResult } from "./serverSideFunctions";
import { useRouter } from "next/navigation";
import { Link } from "@/components/CustomLink";

interface TokenItemProps {
  nft: PageResult;
}

export function TokenItem({ nft }: TokenItemProps) {
  const router = useRouter();
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
        const ms = Number(paymentsSorted[0].paymentDate) * 1000;
        lastPaymentDate = new Date(ms).toISOString();
      } catch {}
    }
  }

  return (
    <Card>
      <CardHeader title={`Token Id: ${nft.tokenId}`} />
      <CardContent>
        <Typography>Credit given</Typography>
        <Typography variant="body2">{creditSum.toString()}</Typography>
        <Typography>Last Repayment</Typography>
        {lastPaymentDate ? (
          <Typography variant="body2">{lastPaymentDate}</Typography>
        ) : (
          <Typography variant="body2">Never</Typography>
        )}
        <Typography>Receiver</Typography>
        <Typography variant="body2">{nft.to}</Typography>
      </CardContent>

      <CardActions>
        <Link href={`/t/${nft.tokenId}`}>
          <Button color="primary" variant="contained">
            Details
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
