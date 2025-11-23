import RateLimitDisplay from "../RateLimitDisplay";

export default function RateLimitDisplayExample() {
  // Set next available time to 5 hours from now
  const nextAvailableTime = new Date(Date.now() + 5 * 60 * 60 * 1000);

  return (
    <div className="p-8">
      <RateLimitDisplay nextAvailableTime={nextAvailableTime} />
    </div>
  );
}
