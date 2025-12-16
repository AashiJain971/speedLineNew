export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getDisruptionSeverityColor(
  severity: string
): string {
  switch (severity) {
    case "high":
      return "bg-red-50 text-red-800";
    case "medium":
      return "bg-orange-50 text-orange-800";
    case "low":
      return "bg-yellow-50 text-yellow-800";
    default:
      return "bg-gray-50 text-gray-800";
  }
}

export function getTrainTypeColor(type: string): string {
  switch (type) {
    case "Express":
      return "border-blue-500 bg-blue-100";
    case "Local":
      return "border-green-500 bg-green-100";
    case "Freight":
      return "border-gray-500 bg-gray-100";
    case "High-Speed":
      return "border-purple-500 bg-purple-100";
    default:
      return "border-gray-300 bg-gray-100";
  }
}
