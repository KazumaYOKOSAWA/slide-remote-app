import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { keyboard, Key } from "@nut-tree-fork/nut-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const sessionId = process.env.SESSION_ID;

if (!supabaseUrl || !supabaseAnonKey || !sessionId) {
  throw new Error("Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SESSION_ID");
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

async function main() {
  console.log("Receiver started");
  console.log("Supabase URL:", supabaseUrl);
  console.log("Watching session:", sessionId);

  // 既存commandsを読めるか確認
  const { data, error } = await supabase
    .from("commands")
    .select("id, session_id, command, created_at, executed_at")
    .order("created_at", { ascending: false })
    .limit(5);

  console.log("Initial commands:", data);
  console.log("Initial fetch error:", error);

  supabase
    .channel("commands-debug")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "commands",
      },
      async (payload) => {
        console.log("Raw payload received:");
        console.log(payload);

        const payloadSessionId = payload.new.session_id as string;
        const command = payload.new.command as string;

        console.log("Payload session_id:", payloadSessionId);
        console.log("Receiver session_id:", sessionId);
        console.log("Command:", command);

        if (payloadSessionId !== sessionId) {
          console.log("Ignored: session_id does not match");
          return;
        }

        console.log("Matched command:", command);

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
  console.error("Receiver fatal error:", error);
  process.exit(1);
});