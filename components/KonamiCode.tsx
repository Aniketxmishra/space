"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// The classic Konami Code sequence:
// Up, Up, Down, Down, Left, Right, Left, Right, B, A
const KONAMI_SEQUENCE = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a"
];

export default function KonamiCode() {
    const router = useRouter();
    const [keySequence, setKeySequence] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Add the new key to the sequence
            const newSequence = [...keySequence, e.key];

            // Keep only the last N keys where N is the konami sequence length
            if (newSequence.length > KONAMI_SEQUENCE.length) {
                newSequence.shift();
            }

            setKeySequence(newSequence);

            // Check if sequence matches
            if (newSequence.join("").toLowerCase() === KONAMI_SEQUENCE.join("").toLowerCase()) {
                // Success! Route to the secret room
                router.push("/lofi");
                setKeySequence([]); // Reset
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [keySequence, router]);

    return null; // This component doesn't render anything visible
}
