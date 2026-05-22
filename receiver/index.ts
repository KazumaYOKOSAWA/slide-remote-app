import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
// import { keyboard, Key } from "@nut-tree-fork/nut-js";
import { keyboard, Key, mouse, Button, Point } from "@nut-tree-fork/nut-js";

const supabaseUrl = "https://ttefvgwirlglikzufrlm.supabase.co";

const supabaseAnonKey = "sb_publishable_cU7KgP2tUsxDPflor5yzhA_knyeE-6W";

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
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

async function toggleLaserPointer() {
  // PowerPointスライドショー中にレーザーポインターモードへ切り替える想定
  await keyboard.pressKey(Key.LeftControl);
  await keyboard.pressKey(Key.L);
  await keyboard.releaseKey(Key.L);
  await keyboard.releaseKey(Key.LeftControl);
}

// async function movePointer(dx: number, dy: number) {
//   const sensitivity = 1.5;

//   const current = await mouse.getPosition();

//   await mouse.setPosition(
//     new Point(
//       Math.round(current.x + dx * sensitivity),
//       Math.round(current.y + dy * sensitivity)
//     )
//   );
// }
async function movePointer(dx: number, dy: number) {
  const sensitivity = 3.5;

  const current = await mouse.getPosition();

  await mouse.setPosition(
    new Point(
      Math.round(current.x + dx * sensitivity),
      Math.round(current.y + dy * sensitivity)
    )
  );
}

// async function executeCommand(command: string) {
async function executeCommand(command: string, payload?: any) {
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
    case "POINTER_MOVE":
      await movePointer(Number(payload?.dx ?? 0), Number(payload?.dy ?? 0));
      break;

    case "POINTER_CLICK":
      await mouse.click(Button.LEFT);
      break;

    case "POINTER_MODE":
      await toggleLaserPointer();
      break;

    default:
      console.warn("Unknown command:", command);
      return;
  }
}

// async function findSessionByCode(code: string) {
//   const { data, error } = await supabase
//     .from("sessions")
//     .select("id, name, pairing_code, status")
//     .eq("pairing_code", code)
//     .single();

//   if (error || !data) {
//     console.error("session lookup error:", error);
//     throw new Error("Session not found. Check pairing code.");
//   }

//   if (data.status === "ended") {
//     throw new Error("This session has already ended.");
//   }

//   return data;
// }
async function findSessionByCode(code: string) {
  const { data, error } = await supabase.rpc("get_session_by_pairing_code", {
    input_code: code,
  });

  const session = Array.isArray(data) ? data[0] : data;

  if (error || !session) {
    console.error("session lookup error:", error);
    throw new Error("Session not found. Check pairing code.");
  }

  if (session.status === "ended") {
    throw new Error("This session has already ended.");
  }

  return session;
}

// async function main() {
//   console.log("Receiver started");
//   console.log("Pairing code:", pairingCode);

//   const session = await findSessionByCode(pairingCode);
//   const sessionId = session.id as string;

//   console.log("Session:", session.name);
//   console.log("Watching session:", sessionId);

//   // const { data, error } = await supabase
//   //   .from("commands")
//   //   .select("id, session_id, command, created_at, executed_at")
//   //   .eq("session_id", sessionId)
//   //   .order("created_at", { ascending: false })
//   //   .limit(5);

//   // console.log("Initial commands:", data);
//   // console.log("Initial fetch error:", error);
//   console.log("Ready to receive commands.");

//   const commandsChannel = supabase
//   .channel(`commands:${sessionId}`)
//   .on(
//     "postgres_changes",
//     {
//       event: "INSERT",
//       schema: "public",
//       table: "commands",
//     },
//     async (payload) => {
//       const payloadSessionId = payload.new.session_id as string;
//       const command = payload.new.command as string;

//       if (payloadSessionId !== sessionId) {
//         return;
//       }

//       console.log("Received command:", command);

//       try {
//         await executeCommand(command, payload.new.payload);

//         const { error: updateError } = await supabase
//           .from("commands")
//           .update({ executed_at: new Date().toISOString() })
//           .eq("id", payload.new.id);

//         if (updateError) {
//           console.error("executed_at update error:", updateError);
//           return;
//         }

//         console.log("Executed:", command);
//       } catch (error) {
//         console.error("Failed to execute command:", error);
//       }
//     }
//   )
//   .subscribe((status) => {
//     console.log("Commands channel status:", status);
//   });

// const pointerChannel = supabase
//   .channel(`pointer:${sessionId}`)
//   .on("broadcast", { event: "pointer_move" }, async ({ payload }) => {
//     const dx = Number(payload?.dx ?? 0);
//     const dy = Number(payload?.dy ?? 0);

//     await movePointer(dx, dy);
//   })
//   .on("broadcast", { event: "pointer_click" }, async () => {
//     await mouse.click(Button.LEFT);
//   })
//   .subscribe((status) => {
//     console.log("Pointer channel status:", status);
//   });
  
//   // supabase
//   //   .channel(`commands:${sessionId}`)
    
//   //   .on(
//   //     "postgres_changes",
//   //     {
//   //       event: "INSERT",
//   //       schema: "public",
//   //       table: "commands",
//   //     },
//   //     async (payload) => {
//   //       const payloadSessionId = payload.new.session_id as string;
//   //       const command = payload.new.command as string;

//   //       if (payloadSessionId !== sessionId) {
//   //         return;
//   //       }

//   //       console.log("Received command:", command);

//   //       try {
//   //         // await executeCommand(command);
//   //         await executeCommand(command, payload.new.payload);

//   //         const { error: updateError } = await supabase
//   //           .from("commands")
//   //           .update({ executed_at: new Date().toISOString() })
//   //           .eq("id", payload.new.id);

//   //         if (updateError) {
//   //           console.error("executed_at update error:", updateError);
//   //           return;
//   //         }

//   //         console.log("Executed:", command);
//   //       } catch (error) {
//   //         console.error("Failed to execute command:", error);
//   //       }
//   //     }
//   //   )
//   //   .subscribe((status) => {
//   //     console.log("Subscription status:", status);
//   //   });

//   //   supabase
//   //   .channel(`commands:${sessionId}`)
    
//   //   .on(
//   //     "postgres_changes",
//   //     {
//   //       event: "INSERT",
//   //       schema: "public",
//   //       table: "commands",
//   //     },
//   //     async (payload) => {
//   //       const payloadSessionId = payload.new.session_id as string;
//   //       const command = payload.new.command as string;

//   //       if (payloadSessionId !== sessionId) {
//   //         return;
//   //       }

//   //       console.log("Received command:", command);

//   //       try {
//   //         // await executeCommand(command);
//   //         await executeCommand(command, payload.new.payload);

//   //         const { error: updateError } = await supabase
//   //           .from("commands")
//   //           .update({ executed_at: new Date().toISOString() })
//   //           .eq("id", payload.new.id);

//   //         if (updateError) {
//   //           console.error("executed_at update error:", updateError);
//   //           return;
//   //         }

//   //         console.log("Executed:", command);
//   //       } catch (error) {
//   //         console.error("Failed to execute command:", error);
//   //       }
//   //     }
//   //   )
//   //   .subscribe((status) => {
//   //     console.log("Subscription status:", status);
//   //   });
// }

async function main() {
  console.log("Receiver started");
  console.log("Pairing code:", pairingCode);

  const session = await findSessionByCode(pairingCode);
  const sessionId = session.id as string;

  console.log("Session:", session.name);
  console.log("Watching session:", sessionId);
  console.log("Ready to receive commands.");

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
          await executeCommand(command, payload.new.payload);

          const { error: updateError } = await supabase.rpc(
            "mark_command_executed",
            {
              input_command_id: payload.new.id,
              input_session_id: sessionId,
            }
          );

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
      console.log("Commands channel status:", status);
    });

  supabase
    .channel(`pointer:${sessionId}`)
    .on("broadcast", { event: "pointer_move" }, async ({ payload }) => {
      const dx = Number(payload?.dx ?? 0);
      const dy = Number(payload?.dy ?? 0);

      await movePointer(dx, dy);
    })
    .on("broadcast", { event: "pointer_click" }, async () => {
      await mouse.click(Button.LEFT);
    })
    .subscribe((status) => {
      console.log("Pointer channel status:", status);
    });
}

main().catch((error) => {
  console.error("Receiver fatal error:", error.message);
  process.exit(1);
});