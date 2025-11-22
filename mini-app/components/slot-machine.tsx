"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

function getRandomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit)));
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col, idx) => {
          const newCol = [...col];
          newCol.pop(); // remove bottom
          newCol.unshift(getRandomFruit()); // add new at top
          return newCol;
        });
        return newGrid;
      });
      if (Date.now() - start >= 2000) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setSpinning(false);
      }
    }, 200);
  };

  // Check win condition directly in JSX
  const hasWin =
    // rows
    grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2] ||
    grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2] ||
    grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2] ||
    // columns
    grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0] ||
    grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1] ||
    grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <div key={`${colIdx}-${rowIdx}`} className="w-16 h-16 flex items-center justify-center border rounded">
              <img src={`/${fruit.toLowerCase()}.png`} alt={fruit} width={48} height={48} />
            </div>
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {hasWin && !spinning && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-semibold">You won!</p>
          <Share text={`I just won a slot machine with ${url}`} />
        </div>
      )}
    </div>
  );
}
