import { User } from "@/app/types";

type Props = {
  users: User[];
  value: string;
  onChange: (value: string) => void;
};

export default function UserSelect({
  users,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Booking As
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
      >
        <option value="">Select User</option>

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}