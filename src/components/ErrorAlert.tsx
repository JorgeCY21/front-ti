// src/components/ErrorAlert.tsx
interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="flex items-center gap-2 p-3 mt-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>
      <span className="text-sm">{message}</span>
    </div>
  );
}
