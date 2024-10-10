import { Button } from "../components/ui/button";

import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "../lib/utils";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

type Props = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

const DateSelector = ({ selectedDate, setSelectedDate }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("", !selectedDate && "text-muted-foreground")}
        >
          <CalendarIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
