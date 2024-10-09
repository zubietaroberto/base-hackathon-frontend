import "@nomicfoundation/hardhat-toolbox-viem";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { type HardhatUserConfig, task } from "hardhat/config";
import {
  CreditIssuedEvent,
  PaymentRecordedEvent,
  TransferEvent,
} from "./src/types";

const CONTRACT_ADDRESS = "0xcF8D5F4a495d94B6A5e2a9E43A909B9631F56247";
const FROM_BLOCK: bigint = 21808180n;
const TO_BLOCK: bigint = 23672246n;
const BLOCKS_PER_QUERY = 600n;

const supabaseClient = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    celo: {
      url: `https://celo-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
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
      "RodaCreditCOP",
      CONTRACT_ADDRESS
    );

    // Iterate over the events since the FROM_BLOCK
    let events: TransferEvent[] = [];
    for (let i = FROM_BLOCK; i < TO_BLOCK; i += BLOCKS_PER_QUERY) {
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
  "download-credit-issued",
  "Downloads existing payments from the blockchain",
  async (_, hre) => {
    const contract = await hre.viem.getContractAt(
      "RodaCreditCOP",
      CONTRACT_ADDRESS
    );

    // Iterate over the events since the FROM_BLOCK
    let events: CreditIssuedEvent[] = [];
    for (let i = FROM_BLOCK; i < TO_BLOCK; i += BLOCKS_PER_QUERY) {
      console.log("Downloading events from block", i.toString());
      const newEvents = await contract.getEvents.CreditIssued(
        {},
        { fromBlock: i, toBlock: i + BLOCKS_PER_QUERY }
      );

      if (newEvents.length < 1) {
        continue;
      }

      const itemsToRecord = newEvents.map<CreditIssuedEvent>((event) => ({
        to: event.args.to?.toString(),
        tokenId: event.args.tokenId?.toString(),
        principal: event.args.principal?.toString(),
        totalRepaymentAmount: event.args.totalRepaymentAmount?.toString(),
        issuanceDate: event.args.issuanceDate?.toString(),
        creditTerm: event.args.creditTerm?.toString(),
        blockNumber: event.blockNumber.toString(),
      }));

      await supabaseClient.from("Credit Issued").insert(itemsToRecord);
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
      "RodaCreditCOP",
      CONTRACT_ADDRESS
    );

    // Iterate over the events since the FROM_BLOCK
    let events: PaymentRecordedEvent[] = [];
    for (let i = FROM_BLOCK; i < TO_BLOCK; i += BLOCKS_PER_QUERY) {
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
