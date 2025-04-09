import Timer from "@/components/Timer";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Timer />
      </div>
    </main>
  );
}
