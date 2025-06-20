"use client";

import CustomInput from "@/app/components/input-fields/CustomInput";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import PrimaryButton from "@/app/components/button/PrimaryButton";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white/80 p-8 rounded shadow-lg max-w-md w-[90%] md:w-full space-y-2"
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-8">Forgot Password</h1>

        {/* form input */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <CustomInput
              field={field}
              label="Email"
              type="email"
              placeholder="Enter your account email"
            />
          )}
        />

        <PrimaryButton type="submit" className="w-full mt-4">
          Send Reset Link
        </PrimaryButton>
      </form>
    </Form>
  );
}
