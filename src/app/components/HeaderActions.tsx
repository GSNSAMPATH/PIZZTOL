"use client";

import Image from "next/image";
import { Bell, Mail } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderActionsProps {
  notificationCount?: number;
  profileImage?: string;
  profileAlt?: string;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
  onProfileClick?: () => void;
}

export default function HeaderActions({
  notificationCount = 0,
  profileImage = "/premium_photo-1675129779582-d84b954f2397.avif",
  profileAlt = "Admin",
  onNotificationClick,
  onMessageClick,
  onProfileClick,
}: HeaderActionsProps) {
  const [currentDateTime, setCurrentDateTime] =
    useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const formatted =
        new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);

      setCurrentDateTime(formatted);
    };

    updateDateTime();

    const interval = setInterval(
      updateDateTime,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center gap-7">

      {/* Date & Time */}
      <span className="hidden text-[14px] font-medium text-[#09213f] lg:block">
        {currentDateTime}
      </span>

      {/* Notifications */}
      <button
        type="button"
        onClick={onNotificationClick}
        aria-label="Notifications"
        className="relative text-black"
      >
        <Bell
          size={22}
          strokeWidth={2}
        />

        {notificationCount > 0 && (
          <span
            className="
              absolute
              -right-2
              -top-2
              flex
              h-[15px]
              min-w-[15px]
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[9px]
              font-bold
              text-white
            "
          >
            {notificationCount > 99
              ? "99+"
              : notificationCount}
          </span>
        )}
      </button>

      {/* Messages */}
      <button
        type="button"
        onClick={onMessageClick}
        aria-label="Messages"
        className="text-black"
      >
        <Mail
          size={22}
          strokeWidth={2}
        />
      </button>

      {/* Profile */}
      <button
        type="button"
        onClick={onProfileClick}
        aria-label={profileAlt}
        className="
          relative
          h-10
          w-10
          overflow-hidden
          rounded-full
          bg-[#ddd]
        "
      >
        <Image
          src={profileImage}
          alt={profileAlt}
          fill
          className="object-cover"
          sizes="40px"
        />
      </button>

    </div>
  );
}