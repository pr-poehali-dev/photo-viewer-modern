import { Button } from "@/components/ui/button";
import { ViewMode } from "@/types";
import { GridIcon, List, LayoutGridIcon } from "lucide-react";

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const ViewModeSelector = ({ currentMode, onChange }: ViewModeSelectorProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={currentMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("grid")}
        title="Сетка"
      >
        <GridIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={currentMode === "masonry" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("masonry")}
        title="Мозаика"
      >
        <LayoutGridIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={currentMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("list")}
        title="Список"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewModeSelector;