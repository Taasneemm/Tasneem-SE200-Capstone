import { LoginForm } from "@/components/auth/login-form";

export default function AppPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left Column: 50% width, light black background, with the text aligned to the left */}
      <div className="flex w-1/2 items-center justify-start bg-black/50 p-8">
        <h1 className="text-6xl font-bold text-white">
          T&amp;S Insurance Inc
        </h1>
      </div>

      {/* Right Column: 50% width, white background, with login form centered */}
      <div className="flex w-1/2 flex-col items-center justify-center bg-white p-6">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
