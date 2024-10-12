"use server";

import { TransferEvent } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

const PAGE_SIZE = 100;

export async function getPage(page: number): Promise<TransferEvent[]> {
  const result = await supabase
    .from("Transfer")
    .select("*")
    .eq("from", "0x0000000000000000000000000000000000000000")
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return result.data ?? [];
}
