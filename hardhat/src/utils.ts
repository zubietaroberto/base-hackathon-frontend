import { createClient } from "@supabase/supabase-js";
import { HardhatRuntimeEnvironment } from "hardhat/types";

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

export async function downloadEvents<T>(
  hre: HardhatRuntimeEnvironment,
  eventName: "LoanIssued" | "PaymentRecorded" | "Transfer",
  tableName: string,
  mapEvent: (event: any) => T
) {
  const contract = await hre.viem.getContractAt(
    "RodaLoanCOP",
    CONTRACT_ADDRESS
  );

  const lastBlock = TO_BLOCK ?? (await getLastBlockNumber(hre));
  const events: T[] = [];

  for (let i = FROM_BLOCK; i < lastBlock; i += BLOCKS_PER_QUERY) {
    console.log("Downloading events from block", i.toString());
    const newEvents = await contract.getEvents[eventName](
      {},
      { fromBlock: i, toBlock: i + BLOCKS_PER_QUERY }
    );

    if (newEvents.length < 1) continue;

    const itemsToRecord = newEvents.map(mapEvent);
    await supabaseClient.from(tableName).insert(itemsToRecord);
    events.push(...itemsToRecord);
    console.log("Downloaded", events.length, "events");
  }

  console.log("Done");
}

export async function getLastBlockNumber(
  hre: HardhatRuntimeEnvironment
): Promise<bigint> {
  const client = await hre.viem.getPublicClient();
  return client.getBlockNumber();
}
