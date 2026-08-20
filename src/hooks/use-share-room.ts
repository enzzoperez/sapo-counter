import { useCallback, useRef, useState } from "react";
import { ref, get, set, update } from "firebase/database";
import { db } from "@/lib/firebase";

function genCode(): string {
  return `SAPO-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function useShareRoom() {
  const [isLive, setIsLive] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  // Ref mirror so syncState reads the code without a stale closure.
  const roomCodeRef = useRef<string | null>(null);

  const startSharing = useCallback(async (initial: object): Promise<string> => {
    let code = genCode();
    // Best-effort uniqueness check (skip silently if Firebase is unreachable).
    try {
      for (let i = 0; i < 5; i++) {
        const snap = await get(ref(db, `rooms/${code}`));
        if (!snap.exists()) break;
        code = genCode();
      }
    } catch {
      // ignore — keep the generated code
    }

    roomCodeRef.current = code;
    setRoomCode(code);
    setIsLive(true);

    try {
      await set(ref(db, `rooms/${code}`), { ...initial, createdAt: Date.now() });
    } catch {
      // ignore — the sheet still opens; writes are best-effort
    }
    return code;
  }, []);

  const stopSharing = useCallback(() => {
    setIsLive(false);
    setRoomCode(null);
    roomCodeRef.current = null;
  }, []);

  const syncState = useCallback((data: object) => {
    const code = roomCodeRef.current;
    if (!code) return;
    update(ref(db, `rooms/${code}`), data).catch(() => {});
  }, []);

  return { isLive, roomCode, startSharing, stopSharing, syncState };
}
