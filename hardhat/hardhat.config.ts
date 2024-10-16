import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";
import { type HardhatUserConfig, task } from "hardhat/config";
import { LoanIssued, PaymentRecordedEvent, TransferEvent } from "./src/types";
import { downloadEvents } from "./src/utils";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "baseSepolia",
  networks: {
    celo: {
      url: `https://celo-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    baseSepolia: {
      url: `https://base-sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
  },
};

task(
  "download-transfers",
  "Downloads existing transfers from the blockchain",
  async (_, hre) =>
    downloadEvents<TransferEvent>(hre, "Transfer", "Transfer", (event) => ({
      from: event.args.from?.toString(),
      to: event.args.to?.toString(),
      tokenId: event.args.tokenId?.toString(),
      blockNumber: event.blockNumber.toString(),
    }))
);

task(
  "download-loan-issued",
  "Downloads existing loans from the blockchain",
  async (_, hre) =>
    downloadEvents<LoanIssued>(hre, "LoanIssued", "Loan Issued", (event) => ({
      to: event.args.to?.toString(),
      tokenId: event.args.tokenId?.toString(),
      principal: event.args.principal?.toString(),
      totalRepaymentAmount: event.args.totalRepaymentAmount?.toString(),
      issuanceDate: event.args.issuanceDate?.toString(),
      loanTerm: event.args.loanTerm?.toString(),
      loanPurpose: event.args.loanPurpose?.toString(),
      blockNumber: event.blockNumber.toString(),
    }))
);

task(
  "download-recorded-payments",
  "Downloads existing payments from the blockchain",
  async (_, hre) =>
    downloadEvents<PaymentRecordedEvent>(
      hre,
      "PaymentRecorded",
      "Payment Recorded",
      (event) => ({
        tokenId: event.args.tokenId?.toString(),
        paymentId: event.args.paymentId?.toString(),
        paymentAmount: event.args.paymentAmount?.toString(),
        paymentDate: event.args.paymentDate?.toString(),
      })
    )
);

export default config;
