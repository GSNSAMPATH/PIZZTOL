"use client";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  Mail,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex min-h-[96px] items-center justify-between gap-6 px-6 sm:px-8">
      {/* Search */}
      <div className="relative w-full max-w-[360px]">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#17223b]"
        />

        <input
          type="text"
          placeholder="Search orders, products, customers..."
          className="h-[44px] w-full rounded-full border-0 bg-white pl-11 pr-5 text-[12px] outline-none placeholder:text-[#17223b]"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-7">
        <div className="hidden text-[14px] font-medium text-[#10203d] xl:block">
          24 Sep 2026&nbsp; - &nbsp;{time}
        </div>

        <button
          type="button"
          className="relative"
          aria-label="Notifications"
        >
          <Bell size={21} />

          <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#e31b23] px-1 text-[9px] font-bold text-white">
            2
          </span>
        </button>

        <button
          type="button"
          aria-label="Messages"
        >
          <Mail size={21} />
        </button>

        <button
          type="button"
          className="h-[38px] w-[38px] overflow-hidden rounded-full"
        >
          <Image
            src="/admin-avatar.png"
            alt="Admin"
            width={38}
            height={38}
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}