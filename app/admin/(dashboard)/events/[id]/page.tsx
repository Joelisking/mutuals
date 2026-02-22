
"use client";

import { EventForm } from "@/components/admin/EventForm";
import { useGetEventsByIdQuery, usePutEventsByIdMutation } from "@/lib/redux/api/openapi.generated";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import React from "react";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const { data: eventData, isLoading: isFetching } = useGetEventsByIdQuery({ id });
  const [updateEvent, { isLoading: isUpdating }] = usePutEventsByIdMutation();

  const onSubmit = async (values: any) => {
    try {
       const payload = {
          ...values,
          ticketLink: values.ticketLink || undefined,
       };
      await updateEvent({ id, body: payload }).unwrap();
      toast.success("Event updated successfully");
      router.push("/admin/events");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update event");
    }
  };

  if (isFetching) {
      return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }
  
  const event = (eventData as any)?.data || eventData;

  if (!event) {
      return <div>Event not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Event</h3>
        <p className="text-sm text-muted-foreground">
          Update event details.
        </p>
      </div>
      <EventForm 
        initialData={event} 
        onSubmit={onSubmit} 
        isLoading={isUpdating} 
      />
    </div>
  );
}
