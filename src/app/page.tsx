import Nav from "@/components/nav";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="font-sans flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-center">
            Welcome to your personal finance tracker
          </p>
        </div>
      </div>
    </div>
  );
}
