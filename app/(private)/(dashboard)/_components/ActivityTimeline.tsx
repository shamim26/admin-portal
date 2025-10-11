import { Card } from "@/components/ui/card";
import React from "react";

interface ActivityTimelineProps {
  activities: {
    id: number;
    text: string;
  }[];
}

function generateRandomColor(text: string) {
  const colors = [
    "red-500",
    "blue-500",
    "green-500",
    "yellow-500",
    "purple-500",
  ];

  const hash = text
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <Card className="rounded">
      <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
      <ol className="border-l-2 border-dashed border-gray-700">
        {activities.map((activity, index) => (
          <li
            key={activity.id}
            className={`relative mb-8 ml-8 ${
              index === activities.length - 1 ? "mb-0" : ""
            }`}
          >
            <span
              className={`absolute -left-[40.5px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-${generateRandomColor(activity.text)} border-2`}
            ></span>
            <p className="relative text-base text-gray-300">{activity.text}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
};

export default ActivityTimeline;
