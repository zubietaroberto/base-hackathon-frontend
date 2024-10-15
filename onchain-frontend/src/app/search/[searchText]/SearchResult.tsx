import { PageResult } from "@/app/serverSideFunctions";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

interface SearchResultProps {
  item: PageResult;
}

export function SearchResult({ item }: SearchResultProps) {
  return (
    <Card>
      <CardHeader title={`Token Id ${item.tokenId}`} />
      <CardContent>
        <Typography>To: {item.to}</Typography>
        <Typography>From: {item.from}</Typography>
        <Typography>Blocknumber: {item.blockNumber}</Typography>
      </CardContent>
      <CardActions>
        <Button href={`/t/${item.tokenId}`}>View</Button>
      </CardActions>
    </Card>
  );
}
