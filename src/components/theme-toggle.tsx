"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

type Position = "left" | "right" | "top" | "bottom";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const dragOffset = 20;
  const dragThreshold = 5;
  const edgeOffset = dragOffset * 2 + 16;
  const [position, setPosition] = React.useState<Position>("right");
  const [previousPosition, setPreviousPosition] =
    React.useState<Position>("right");
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = React.useState(false);
  const [hasDragged, setHasDragged] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getSnapPosition = (x: number, y: number): Position => {
    const distToLeft = x;
    const distToRight = window.innerWidth - x;
    const distToTop = y;
    const distToBottom = window.innerHeight - y;

    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

    if (minDist === distToLeft) return "left";
    if (minDist === distToRight) return "right";
    if (minDist === distToTop) return "top";
    return "bottom";
  };

  const getTransitionDuration = (currentPos: Position, prevPos: Position) => {
    // Smooth transitions for up and left movements
    if (
      (currentPos === "top" && prevPos !== "top") ||
      (currentPos === "left" && prevPos !== "left")
    ) {
      return "800ms cubic-bezier(0.4, 0, 0.2, 1)";
    }
    // Also smooth for right and bottom movements (but slightly faster)
    if (
      (currentPos === "right" && prevPos !== "right") ||
      (currentPos === "bottom" && prevPos !== "bottom")
    ) {
      return "600ms cubic-bezier(0.4, 0, 0.2, 1)";
    }
    // Default for same position
    return "300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsClicked(false);
    setHasDragged(false);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setDragPosition({ x: e.clientX - dragOffset, y: e.clientY - dragOffset });
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isDragging) {
      if (hasDragged) {
        const snapPos = getSnapPosition(
          dragPosition.x + dragOffset,
          dragPosition.y + dragOffset,
        );
        setPreviousPosition(position);
        setPosition(snapPos);
      }
    }
    setIsDragging(false);
    // Reset hasDragged after a short delay to prevent click
    setTimeout(() => setHasDragged(false), 50);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      setDragPosition({
        x: e.clientX - dragOffset,
        y: e.clientY - dragOffset,
      });

      // Only consider it a drag if moved more than 5 pixels
      const deltaX = Math.abs(e.clientX - startPosition.x);
      const deltaY = Math.abs(e.clientY - startPosition.y);

      if (deltaX > dragThreshold || deltaY > dragThreshold) {
        setHasDragged(true);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragPosition, startPosition]);

  const transition = getTransitionDuration(position, previousPosition);

  // Calculate current position based on state
  const currentStyles = isDragging
    ? {
        position: "fixed" as const,
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        zIndex: 50,
        transition: "none",
        cursor: "grabbing",
      }
    : {
        position: "fixed" as const,
        zIndex: 50,
        cursor: "grab",
        transition: `transform ${transition}, top ${transition}, left ${transition}`,
        ...(position === "left" && {
          left: "16px",
          top: "50%",
          transform: "translateY(-50%)",
        }),
        ...(position === "right" && {
          left: `calc(100% - ${edgeOffset}px)`,
          top: "50%",
          transform: "translateY(-50%)",
        }),
        ...(position === "top" && {
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
        }),
        ...(position === "bottom" && {
          top: `calc(100% - ${edgeOffset}px)`,
          left: "50%",
          transform: "translateX(-50%)",
        }),
      };

  return (
    <div ref={dragRef} style={currentStyles} onMouseDown={handleMouseDown}>
      <Button
        variant="outline"
        size="icon"
        className={`rounded-full h-10 w-10 p-0 shadow-lg hover:shadow-xl ${
          isClicked ? "bg-primary text-primary-foreground" : ""
        } ${isDragging && hasDragged ? "pointer-events-none" : ""}`}
        onClick={(e) => {
          if (!isDragging && !hasDragged) {
            e.stopPropagation();
            setIsClicked(true);
            setTimeout(() => setIsClicked(false), 200);
            toggleTheme();
          }
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
