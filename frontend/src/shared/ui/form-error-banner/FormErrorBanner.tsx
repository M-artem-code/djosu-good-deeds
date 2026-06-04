import { ErrorBanner } from "../error-banner";

interface FormErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
  className?: string;
}

export function FormErrorBanner({
  message,
  onDismiss,
  className = "mb-4",
}: FormErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div className={className}>
      <ErrorBanner message={message} onDismiss={onDismiss} />
    </div>
  );
}
