import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  userType?: "admin" | "user";
  className?: string;
}

export function Header({
  title = "Dashboard",
  userType,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "bg-card border-b border-border p-4 flex justify-between items-center",
        className,
      )}
    >
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">{title}</h1>
        {userType && (
          <span className="px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">
            {userType === "admin" ? "Admin" : "User"}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <ThemeSwitcher />
        {/* Add any additional header elements here */}
      </div>
    </header>
  );
}
