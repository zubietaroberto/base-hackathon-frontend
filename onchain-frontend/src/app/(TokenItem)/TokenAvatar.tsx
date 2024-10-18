import {
  DirectionsBike,
  Folder,
  Handyman,
  MoneyOff,
  School,
  Send,
  Smartphone,
  Storefront,
  TwoWheeler,
  WarningAmber,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { PageResult } from "../serverSideFunctions";
import {
  amber,
  deepOrange,
  lightBlue,
  lightGreen,
  orange,
} from "@mui/material/colors";

interface TokenAvatarProps {
  nft: PageResult;
}

export function TokenAvatar({ nft }: TokenAvatarProps) {
  let color = "primary";
  let inner: string | JSX.Element = "Unknown";

  if (nft.credits.length < 1) {
    inner = <Folder />;
  }

  switch (nft.credits[0].loanPurpose) {
    case "1":
      color = lightBlue[500];
      inner = <Smartphone />;
      break;

    case "2":
      color = lightGreen[500];
      inner = <TwoWheeler />;
      break;

    case "3":
      color = lightGreen[500];
      inner = <DirectionsBike />;
      break;

    case "4":
      color = deepOrange[500];
      inner = <MoneyOff />;
      break;

    case "5":
      color = lightBlue[500];
      inner = <Handyman />;
      break;

    case "6":
      color = amber[500];
      inner = <Storefront />;
      break;

    case "7":
      color = orange[500];
      inner = <Send />;
      break;

    case "8":
      color = lightBlue[500];
      inner = <School />;
      break;

    case "9":
      color = orange[500];
      inner = <WarningAmber />;
      break;
  }

  return <Avatar sx={{ bgcolor: color }}>{inner}</Avatar>;
}
