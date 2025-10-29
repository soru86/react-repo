type StatusChipProps = {
  status: string;
  type?: "payment" | "payout" | "dispute";
};

export function StatusChip({ status, type = "payment" }: StatusChipProps) {
  const getStatusConfig = () => {
    if (type === "payment") {
      switch (status) {
        case "SUCCEEDED":
          return {
            bg: "bg-green-100 dark:bg-green-900/30",
            text: "text-green-700 dark:text-green-300",
            border: "border-green-200 dark:border-green-800",
          };
        case "PENDING":
          return {
            bg: "bg-yellow-100 dark:bg-yellow-900/30",
            text: "text-yellow-700 dark:text-yellow-300",
            border: "border-yellow-200 dark:border-yellow-800",
          };
        case "FAILED":
          return {
            bg: "bg-red-100 dark:bg-red-900/30",
            text: "text-red-700 dark:text-red-300",
            border: "border-red-200 dark:border-red-800",
          };
        case "REFUNDED":
          return {
            bg: "bg-slate-100 dark:bg-slate-800",
            text: "text-slate-700 dark:text-slate-300",
            border: "border-slate-200 dark:border-slate-700",
          };
        default:
          return {
            bg: "bg-gray-100 dark:bg-gray-800",
            text: "text-gray-700 dark:text-gray-300",
            border: "border-gray-200 dark:border-gray-700",
          };
      }
    }

    if (type === "payout") {
      switch (status) {
        case "PAID":
          return {
            bg: "bg-green-100 dark:bg-green-900/30",
            text: "text-green-700 dark:text-green-300",
            border: "border-green-200 dark:border-green-800",
          };
        case "PROCESSING":
          return {
            bg: "bg-yellow-100 dark:bg-yellow-900/30",
            text: "text-yellow-700 dark:text-yellow-300",
            border: "border-yellow-200 dark:border-yellow-800",
          };
        case "REQUESTED":
          return {
            bg: "bg-blue-100 dark:bg-blue-900/30",
            text: "text-blue-700 dark:text-blue-300",
            border: "border-blue-200 dark:border-blue-800",
          };
        case "FAILED":
          return {
            bg: "bg-red-100 dark:bg-red-900/30",
            text: "text-red-700 dark:text-red-300",
            border: "border-red-200 dark:border-red-800",
          };
        default:
          return {
            bg: "bg-gray-100 dark:bg-gray-800",
            text: "text-gray-700 dark:text-gray-300",
            border: "border-gray-200 dark:border-gray-700",
          };
      }
    }

    // dispute
    switch (status) {
      case "RESOLVED":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
        };
      case "UNDER_REVIEW":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-700 dark:text-yellow-300",
          border: "border-yellow-200 dark:border-yellow-800",
        };
      case "OPEN":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
        };
      case "REJECTED":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-700 dark:text-red-300",
          border: "border-red-200 dark:border-red-800",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
        };
    }
  };

  const config = getStatusConfig();
  const displayText = status.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {displayText}
    </span>
  );
}
