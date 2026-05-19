import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { keyboard, Key } from "@nut-tree-fork/nut-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const pairingCode = process.argv[2];

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

if (!pairingCode) {
  throw new Error("Usage: npm run dev -- <pairing_code>");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function tapKey(key: Key) {
  await keyboard.pressKey(key);
  await keyboard.releaseKey(key);
}

async function executeCommand(command: string) {
  console.log("Execute:", command);

  switch (command) {
    case "NEXT_SLIDE":
      await tapKey(Key.Right);
      break;

    case "PREV_SLIDE":
      await tapKey(Key.Left);
      break;

    case "START_PRESENTATION":
      await tapKey(Key.F5);
      break;

    case "END_PRESENTATION":
      await tapKey(Key.Escape);
      break;

    case "BLACKOUT":
      await tapKey(Key.B);
      break;

    case "WHITEOUT":
      await tapKey(Key.W);
      break;

    default:
      console.warn("Unknown command:", command);
      return;
  }
}

async function findSessionByCode(code: string) {
  const { data, error } = await supabase
    .from("sessions")
    .select("id, name, pairing_code, status")
    .eq("pairing_code", code)
    .single();

  if (error || !data) {
    console.error("session lookup error:", error);
    throw new Error("Session not found. Check pairing code.");
  }

  if (data.status === "ended") {
    throw new Error("This session has already ended.");
  }

  return data;
}

async function main() {
  console.log("Receiver started");
  console.log("Pairing code:", pairingCode);

  const session = await findSessionByCode(pairingCode);
  const sessionId = session.id as string;

  console.log("Session:", session.name);
  console.log("Watching session:", sessionId);

  const { data, error } = await supabase
    .from("commands")
    .select("id, session_id, command, created_at, executed_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(5);

  console.log("Initial commands:", data);
  console.log("Initial fetch error:", error);

  supabase
    .channel(`commands:${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "commands",
      },
      async (payload) => {
        const payloadSessionId = payload.new.session_id as string;
        const command = payload.new.command as string;

        if (payloadSessionId !== sessionId) {
          return;
        }

        console.log("Received command:", command);

        try {
          await executeCommand(command);

          const { error: updateError } = await supabase
            .from("commands")
            .update({ executed_at: new Date().toISOString() })
            .eq("id", payload.new.id);

          if (updateError) {
            console.error("executed_at update error:", updateError);
            return;
          }

          console.log("Executed:", command);
        } catch (error) {
          console.error("Failed to execute command:", error);
        }
      }
    )
    .subscribe((status) => {
      console.log("Subscription status:", status);
    });
}

main().catch((error) => {
  console.error("Receiver fatal error:", error.message);
  process.exit(1);
});