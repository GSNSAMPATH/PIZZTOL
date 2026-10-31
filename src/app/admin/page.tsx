import {
  Clock3,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-[1200px]">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-[22px] font-bold text-[#10203d]">
          Dashboard
        </h1>

        <button
          type="button"
          className="flex h-[38px] items-center gap-3 rounded-full bg-white px-4 text-[12px] font-medium text-[#10203d]"
        >
          <span className="flex items-center gap-2">
            {/* <CalendarDays size={15} /> */}
            Aug 07 - Aug 14, 2026
          </span>

          <span className="text-lg">⌄</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* <StatCard
          title="Total Revenue"
          value="LKR 12,145"
          change="10.5%"
          positive
          icon={Wallet}
        /> */}

        {/* <StatCard
          title="Total Orders"
          value="248"
          change="10.5%"
          positive
          icon={ShoppingBag}
        /> */}

        {/* <StatCard
          title="Pending Orders"
          value="48"
          change="10.5%"
          positive={false}
          icon={Clock3}
        /> */}

        {/* <StatCard
          title="Total Customers"
          value="390"
          change="10.5%"
          positive
          icon={Users}
        /> */}
      </div>

      {/* Charts */}
      <div className="mt-10 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        {/* <SalesOverview />

        <CategoryChart /> */}
      </div>
    </div>
  );
}