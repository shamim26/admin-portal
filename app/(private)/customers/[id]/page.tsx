"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CustomerService } from "../customer.service";
import { Customer } from "../customer.dto";
import PageHeader from "@/app/components/PageHeader";
import KpiCard from "@/app/components/card/KPICard";
import {
  ShoppingBag,
  DollarSign,
  CalendarDays,
  User as UserIcon,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/app/components/modal/DeleteModal";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/lib/slugs";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import Loader from "@/app/components/Loader";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await CustomerService.getCustomerById(id);
        if (response.success) {
          setCustomer(response.payload.user);
        }
      } catch (error: unknown) {
        toast.error((error as Error).message);
        router.push("/customers");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id, router]);

  const handleToggleBan = async () => {
    if (!customer) return;
    try {
      if (customer.isBanned) {
        await CustomerService.unbanCustomer(customer._id);
        toast.success("User restored successfully");
        setCustomer({ ...customer, isBanned: false });
      } else {
        await CustomerService.banCustomer(customer._id);
        toast.success("User banned successfully");
        setCustomer({ ...customer, isBanned: true });
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const handleChangeRole = async (role: string) => {
    if (!customer) return;
    try {
      await CustomerService.updateRole(customer._id, role);
      toast.success(`Role updated to ${role}`);
      setCustomer({ ...customer, role });
    } catch {
      toast.error("Failed to update role");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!customer) return <div>User not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`${customer.name}'s Profile`}
          showBackButton={true}
        />
        <div className="flex gap-2">
          {customer.role !== "admin" && (
            <>
              <Button
                variant="outline"
                onClick={() => handleChangeRole("admin")}
              >
                Promote to Admin
              </Button>

              <DeleteModal
                title={customer.isBanned ? "Lift Ban" : "Ban User"}
                description={
                  customer.isBanned
                    ? "Are you sure you want to unban this user?"
                    : "Are you sure you want to ban this user? They will not be able to log in."
                }
                onConfirm={handleToggleBan}
              >
                <Button variant={customer.isBanned ? "default" : "destructive"}>
                  {customer.isBanned ? "Unban User" : "Ban User"}
                </Button>
              </DeleteModal>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-card border p-6 rounded-lg space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-lg border-b pb-2">
              <UserIcon size={18} /> Contact Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail size={14} /> Email Address
                </p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone size={14} /> Phone
                </p>
                <p className="font-medium">
                  {customer.phone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Role</p>
                <Badge variant="outline" className="capitalize mt-1">
                  {customer.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <Badge
                  variant={customer.isBanned ? "destructive" : "secondary"}
                  className="mt-1"
                >
                  {customer.isBanned ? "Banned" : "Active"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-card border p-6 rounded-lg space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-lg border-b pb-2">
              <MapPin size={18} /> Address Book
            </h3>
            {customer.address?.street ? (
              <div className="text-sm">
                <p>{customer.address.street}</p>
                <p>
                  {customer.address.city}, {customer.address.state}{" "}
                  {customer.address.zipCode}
                </p>
                <p>{customer.address.country}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No address on file.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <KpiCard
            title="Lifetime Value"
            value={`৳ ${customer.totalSpent?.toLocaleString() || 0}`}
            icon={<DollarSign />}
          />
          <KpiCard
            title="Total Orders"
            value={customer.totalOrders?.toString() || "0"}
            icon={<ShoppingBag />}
          />
          <KpiCard
            title="Joined On"
            value={new Date(customer.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            icon={<CalendarDays />}
          />

          <Link
            href={`${ROUTES.ORDERS}?search=${customer.phone || customer.email}`}
            className="block mt-4"
          >
            <PrimaryButton className="w-full">View Order History</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
