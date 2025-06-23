"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomInput from "@/app/components/input-fields/CustomInput";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
});

export default function CustomerForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "user",
    },
  });

  const onSubmit = (data: z.infer<typeof customerSchema>) => {
    console.log(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <CustomInput
                    field={field}
                    placeholder="Enter customer name"
                    type="text"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <CustomInput
                    field={field}
                    placeholder="Enter email address"
                    type="email"
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <CustomInput
                    field={field}
                    placeholder="Enter phone number"
                    type="tel"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <CustomInput
                    field={field}
                    placeholder="Enter role"
                    type="text"
                  />
                )}
              />
            </div>
            <PrimaryButton type="submit" className="w-full">
              Add Customer
            </PrimaryButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
