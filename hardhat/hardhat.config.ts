import "@nomicfoundation/hardhat-toolbox-viem";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { type HardhatUserConfig, task } from "hardhat/config";
import { LoanIssued, PaymentRecordedEvent, TransferEvent } from "./src/types";
import { getLastBlockNumber } from "./src/utils";

/* OLD CONTRACT DATA */
// const CONTRACT_ADDRESS = "0xcF8D5F4a495d94B6A5e2a9E43A909B9631F56247";
// const FROM_BLOCK: bigint = 21808180n;
// const TO_BLOCK: bigint = 23672246n;

const CONTRACT_ADDRESS = "0xC743D9AB2D396176Ade68Bf72C5Ab1ac20693cbf";
const FROM_BLOCK: bigint = 16488000n;
const TO_BLOCK: bigint | null = null;
const BLOCKS_PER_QUERY = 600n;

const supabaseClient = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

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
  async (_, hre) => {
    const contract = await hre.viem.getContractAt(
      "RodaLoanCOP",
      CONTRACT_ADDRESS
    );

    const lastBlock = TO_BLOCK ?? (await getLastBlockNumber(hre));

    // Iterate over the events since the FROM_BLOCK
    let events: TransferEvent[] = [];
    for (let i = FROM_BLOCK; i < lastBlock; i += BLOCKS_PER_QUERY) {
      console.log("Downloading events from block", i.toString());
      const newEvents = await contract.getEvents.Transfer(
        {},
        { fromBlock: i, toBlock: i + BLOCKS_PER_QUERY }
      );

      if (newEvents.length < 1) {
        continue;
      }

      const eventsToRecord = newEvents.map<TransferEvent>((event) => ({
        from: event.args.from?.toString(),
        to: event.args.to?.toString(),
        tokenId: event.args.tokenId?.toString(),
        blockNumber: event.blockNumber.toString(),
      }));

      await supabaseClient.from("Transfer").insert(eventsToRecord);
      events.push(...eventsToRecord);
      console.log("Downloaded", events.length, "events");
    }

    console.log("Done");
  }
);

task(
  "download-loan-issued",
  "Downloads existing payments from the blockchain",
  async (_, hre) => {
    const contract = await hre.viem.getContractAt(
      "RodaLoanCOP",
      CONTRACT_ADDRESS
    );

    const lastBlock = TO_BLOCK ?? (await getLastBlockNumber(hre));

    // Iterate over the events since the FROM_BLOCK
    let events: LoanIssued[] = [];
    for (let i = FROM_BLOCK; i < lastBlock; i += BLOCKS_PER_QUERY) {
      console.log("Downloading events from block", i.toString());
      const newEvents = await contract.getEvents.LoanIssued(
        {},
        { fromBlock: i, toBlock: i + BLOCKS_PER_QUERY }
      );

      if (newEvents.length < 1) {
        continue;
      }

      const itemsToRecord = newEvents.map<LoanIssued>((event) => ({
        to: event.args.to?.toString(),
        tokenId: event.args.tokenId?.toString(),
        principal: event.args.principal?.toString(),
        totalRepaymentAmount: event.args.totalRepaymentAmount?.toString(),
        issuanceDate: event.args.issuanceDate?.toString(),
        loanTerm: event.args.loanTerm?.toString(),
        loanPurpose: event.args.loanPurpose?.toString(),
        blockNumber: event.blockNumber.toString(),
      }));

      await supabaseClient.from("Loan Issued").insert(itemsToRecord);
      events.push(...itemsToRecord);

      console.log("Downloaded", events.length, "events");
    }

    console.log("Done");
  }
);

task(
  "download-recorded-payments",
  "Downloads existing payments from the blockchain",
  async (_, hre) => {
    const contract = await hre.viem.getContractAt(
      "RodaLoanCOP",
      CONTRACT_ADDRESS
    );

    const lastBlock = TO_BLOCK ?? (await getLastBlockNumber(hre));

    // Iterate over the events since the FROM_BLOCK
    let events: PaymentRecordedEvent[] = [];
    for (let i = FROM_BLOCK; i < lastBlock; i += BLOCKS_PER_QUERY) {
      console.log("Downloading events from block", i.toString());
      const newEvents = await contract.getEvents.PaymentRecorded(
        {},
        { fromBlock: i, toBlock: i + BLOCKS_PER_QUERY }
      );

      if (newEvents.length < 1) {
        continue;
      }

      const itemsToSave = newEvents.map<PaymentRecordedEvent>((event) => ({
        tokenId: event.args.tokenId?.toString(),
        paymentId: event.args.paymentId?.toString(),
        paymentAmount: event.args.paymentAmount?.toString(),
        paymentDate: event.args.paymentDate?.toString(),
      }));

      await supabaseClient.from("Payment Recorded").insert(itemsToSave);
      events.push(...itemsToSave);

      console.log("Downloaded", events.length, "events");
    }

    console.log("Done");
  }
);

export default config;
