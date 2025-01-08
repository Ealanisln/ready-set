// app/page.tsx
import Image from 'next/image';
export default function ConfirmationPage() {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-lg">
          {/* Logo */}
          <div className="mb-8">
        <Image src="/images/logo/logo-white.png"
         alt="Ready Set Logo"
         width={120}
         height={40}
         className="mx-auto"/>
        </div>
  
          {/* Content */}
          <h1 className="mb-4 text-4xl font-bold text-gray-700">
            Thank you for signing up!
          </h1>
          
          <h2 className="mb-8 text-2xl text-gray-600">
            Your free guide is on its way to your email.
          </h2>
          
          <p className="text-gray-500">
            <span className="font-medium">Note: </span>
            Kindly check your inbox for an email from us, and if it isn&apos;t there, please check your spam or junk folder.
          </p>
        </div>
      </main>
    );
  }