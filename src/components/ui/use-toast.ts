/**
 * Toast Hook (Temporary Implementation)
 * 
 * This is a simple toast implementation
 * Replace this with shadcn/ui toast after running: npx shadcn@latest add toast
 * 
 * For now, this provides basic toast functionality using browser alerts
 */
"use client";

interface ToastOptions{
    title: string,
    description: string;
    variant: "default" | "destructive";
}

/**
 * Simple toast function
 * Shows a browser alert as temporary solution
 * 
 * TODO: Replace with proper shadcn toast component
 */
export function toast({ title, description, variant }: ToastOptions) {
  const message = description ? `${title}\n${description}` : title;
  
  if (variant === "destructive") {
    console.error(message);
    // In production, you'd show a proper toast UI here
    alert(`❌ ${message}`);
  } else {
    console.log(message);
    // In production, you'd show a proper toast UI here
    // For now, just log to console to avoid annoying alerts
  }
}