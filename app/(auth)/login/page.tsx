"use client";

import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../../components/input-fields/CustomInput";
import Link from "next/link";
import PrimaryButton from "../../components/button/PrimaryButton";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth.store";
import { ROUTES } from "@/lib/slugs";

const loginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(6).max(100),
});

export default function LoginPage() {
  const router = useRouter();
  const { user, setGuest, login } = useAuthStore((state) => state);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const res = await login(data.email, data.password);
    if (res.success) {
      router.replace(ROUTES.HOME);
    }
  };

  console.log(user);

  const onGuest = () => {
    setGuest(true);
    router.replace(ROUTES.HOME);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white/80 p-8 rounded shadow-lg max-w-md w-[90%] md:w-full space-y-2"
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

        <Link
          href="/forgot-password"
          className="text-sm text-primary float-end m-0"
        >
          Forgot password?
        </Link>

        <PrimaryButton
          type="submit"
          className="w-full mt-4"
          onClick={form.handleSubmit(onSubmit)}
        >
          Login
        </PrimaryButton>

        <button
          type="button"
          onClick={onGuest}
          className="w-full mt-2 border border-gray-300 rounded py-2 text-sm"
        >
          Continue as guest (read-only)
        </button>
      </form>
    </Form>
  );
}
