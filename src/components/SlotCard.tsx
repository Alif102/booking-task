type Props = {
  startTime: string;
  endTime: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function SlotCard({
  startTime,
  endTime,
  selected,
  disabled,
  onClick,
}: Props) {
  const start = new Date(startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const end = new Date(endTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full rounded-xl border p-4 text-left transition
        ${
          selected
            ? "border-black bg-black text-white"
            : "border-gray-300 bg-white hover:border-black"
        }
        ${disabled ? "cursor-not-allowed opacity-40" : ""}
      `}
    >
      <p className="text-lg font-semibold">
        {start} - {end}
      </p>

      <p className="mt-1 text-sm">
        {disabled ? "Unavailable" : "Available"}
      </p>
    </button>
  );
}