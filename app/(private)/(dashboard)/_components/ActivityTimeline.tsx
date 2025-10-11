import PageHeader from "@/app/components/PageHeader";
import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
} from "@/components/ui/timeline";
import React from "react";

interface ActivityTimelineProps {
  activities: {
    id: number;
    text: string;
  }[];
}

const generateRandomColor = (text: string): string => {
  // Use hex codes instead of Tailwind class names
  const colors = [
    "#22c55e", // green-500
    "#6366f1", // indigo-500
    "#06b6d4", // cyan-500
    "#ef4444", // red-500
    "#eab308", // yellow-500
    "#ec4899", // pink-500
    "#a855f7", // purple-500
    "#3b82f6", // blue-500
    "#f97316", // orange-500
    "#14b8a6", // teal-500
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded p-6">
      <PageHeader title="Recent Activities" />
      <Timeline>
        {activities.map((activity) => (
          <TimelineItem key={activity.id}>
            <TimelineHeader
              style={
                {
                  "--dot-color": generateRandomColor(activity.text),
                } as React.CSSProperties
              }
            />
            <TimelineDescription className="">{activity.text}</TimelineDescription>
          </TimelineItem>
        ))}
        {activities.length === 0 && (
          <p className="text-muted-foreground">No recent activities.</p>
        )}
      </Timeline>
    </div>
  );
};

export default ActivityTimeline;
