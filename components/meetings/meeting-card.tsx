import { format, formatDistanceToNow, isValid } from "date-fns";

//import convex stuff
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

//import shadcnui stuff
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";

//import icone stuff
import {
  Dot,
  Star,
  Trash2,
  Circle,
  CheckCircle,
  CalendarIcon,
  Timer,
} from "lucide-react";

interface MeetingCardProps {
  meeting: {
    _id: Id<"meetings">;
    title: string;
    _creationTime: number; // Using _creationTime as the timestamp
    duration: number; // Duration in seconds
    isFavorite: boolean; // Assuming this is a boolean
    isDeleted: boolean; // Assuming this is a boolean
  };
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const { _id, title, _creationTime, duration, isFavorite, isDeleted } =
    meeting;

  // Convert _creationTime to a Date object
  const date = new Date(_creationTime);

  // Check if the date is valid before formatting
  const formattedDate = isValid(date)
    ? format(date, "EEE MM/dd/yyyy '@' h:mm a")
    : "Invalid date";
  const timeAgo = isValid(date)
    ? formatDistanceToNow(date, { addSuffix: true })
    : "Invalid date";

  // Format the duration to a readable format, e.g., "27:10"
  const formattedDuration = new Date(duration * 1000)
    .toISOString()
    .substr(11, 8);

  const toggleFavorite = useMutation(api.meetings.updateMeetingDetails);

  const handleToggleFavorite = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log("Toggling favorite:", isFavorite);
    event.stopPropagation(); // Prevent click from bubbling up to parent elements
    await toggleFavorite({
      meetingID: _id as Id<"meetings">,
      updates: { isFavorite: !isFavorite },
    });
  };

  return (
    <div className="group relative rounded-xl border bg-card text-card-foreground p-6 pb-8">
      <Toggle size="sm" className="absolute top-2 right-2">
        <Circle size={16} className="hidden group-hover:block" />
      </Toggle>

      <div className="flex flex-col space-y-3">
        <div className="flex flex-row items-center space-x-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Toggle
            size="sm"
            className=""
            pressed={isFavorite}
            aria-label="Toggle favorite"
            onClick={(event) => handleToggleFavorite(event)}
          >
            {/* Change here: Apply conditional rendering based on isFavorite */}
            {isFavorite ? (
              <Star size={20} fill="white" strokeWidth={0} />
            ) : (
              <Star size={20} className="hidden group-hover:block" />
            )}
          </Toggle>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <CalendarIcon size={16} />
          <p className="text-sm">{formattedDate}</p>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <Timer size={16} />
          <p className="text-sm">{formattedDuration}</p>
        </div>
        <p className="absolute bottom-3 right-3 text-sm text-muted-foreground">
          {timeAgo}
        </p>
      </div>
      {/* Add more details here as needed */}
    </div>
  );
};

export default MeetingCard;
