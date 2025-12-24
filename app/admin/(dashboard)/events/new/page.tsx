/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { EventForm } from '@/components/admin/EventForm';
import { usePostEventsMutation } from '@/lib/redux/api/openapi.generated';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateEventPage() {
  const router = useRouter();
  const [createEvent, { isLoading }] = usePostEventsMutation();

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        ticketLink: values.ticketingLink, // Mapping back to API name
      };

      await createEvent({ body: payload }).unwrap();
      toast.success('Event created successfully');
      router.push('/admin/events');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create Event</h3>
        <p className="text-sm text-muted-foreground">
          Announce a new event.
        </p>
      </div>
      <EventForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
