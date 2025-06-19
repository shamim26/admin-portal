"use client";

import { Form, FormField } from "@/components/ui/form";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "./components/CustomInput";
import Link from "next/link";
import PrimaryButton from "./components/PrimaryButton";

const loginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(6).max(100),
});

export default function Home() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    console.log(data);
  };

  return (
    <main className="relative min-h-screen w-full bg-primary overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Shape.png"
          alt="Shape"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Foreground Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white/80 p-8 rounded shadow-lg max-w-md w-full"
          >
            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-8">
              Login to your account
            </h1>

            {/* form input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <CustomInput
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Email"
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <CustomInput
                  field={field}
                  label="Password"
                  type="password"
                  placeholder="Password"
                />
              )}
            />

            <Link href="/" className="text-sm mx-auto text-primary">
              Forgot password?
            </Link>

            <PrimaryButton
              type="submit"
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
            >
              Login
            </PrimaryButton>
            {/* Add more fields and a submit button as needed */}
          </form>
        </Form>
      </div>
    </main>
  );
}
