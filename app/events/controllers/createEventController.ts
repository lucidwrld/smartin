import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";
import { CreateEventPayload, EventFormData, CreateEventResponse } from "../types";

export const CreateEventManager = () => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<CreateEventResponse>(
    `/event`,
    ["events"],
    true
  );

  // Helper function to generate event_days array from date range
  const generateEventDays = (startDate: string, endDate: string, startTime: string, endTime: string, isMultiDay: boolean) => {
    const eventDays = [];
    const start = new Date(startDate);
    const end = new Date(endDate || startDate);
    
    if (!isMultiDay) {
      // Single day event
      eventDays.push({
        date: startDate,
        time: startTime
      });
    } else {
      // Multi-day event - generate all days between start and end
      const currentDate = new Date(start);
      while (currentDate <= end) {
        eventDays.push({
          date: currentDate.toISOString().split('T')[0],
          time: currentDate.getTime() === start.getTime() ? startTime : 
                currentDate.getTime() === end.getTime() ? endTime : startTime
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return eventDays;
  };

  // Helper function to map invitation methods to event_notification structure
  const mapInvitationMethodsToNotification = (invitationMethods: string[]) => {
    return {
      email: invitationMethods.includes('email'),
      sms: invitationMethods.includes('sms'),
      whatsapp: invitationMethods.includes('whatsapp')
    };
  };

  // Transform frontend form data to backend payload structure
  const transformFormDataToPayload = (formData: EventFormData): CreateEventPayload => {
    // Generate event_days array
    const eventDays = generateEventDays(
      formData.date,
      formData.end_date,
      formData.time,
      formData.end_time,
      formData.is_multi_day
    );

    // Map colors array (primary, secondary)
    const colors = [
      formData.primary_color,
      formData.secondary_color
    ];

    // Map invitation methods to event_notification
    const eventNotification = mapInvitationMethodsToNotification(formData.invitation_methods);

    return {
      // Basic Details
      name: formData.name,
      description: formData.description,
      host: formData.host,
      image: typeof formData.image === 'string' ? formData.image : null,
      event_type: formData.event_type,
      payment_type: formData.payment_type,
      venue: formData.venue,
      timezone: formData.timezone,
      no_of_invitees: Number(formData.no_of_invitees),
      currency: formData.currency,
      
      // Multi-day support
      event_days: eventDays,
      
      // Media
      gallery: formData.gallery.filter(item => typeof item === 'string') as string[],
      video: formData.video_url,
      logo: typeof formData.logo === 'string' ? formData.logo : '',
      colors: colors,
      
      // Features
      isVirtual: formData.isVirtual,
      showFeedback: formData.showFeedback,
      verification_type: formData.verification_type,
      
      // Financial
      donation: formData.donation,
      payment_mode: formData.payment_mode,
      
      // Content
      items: formData.items,
      thank_you_message: formData.thank_you_message,
      
      // Notifications & Reminders
      event_notification: eventNotification,
      enable_auto_reminder: formData.enable_auto_reminder,
      enable_auto_thank_you: formData.enable_auto_thank_you,
      
      // Optional Enhanced Features (only include if they have data)
      ...(formData.sessions?.length > 0 && { sessions: formData.sessions }),
      ...(formData.registration_forms?.length > 0 && { registration_forms: formData.registration_forms }),
      ...(formData.tickets?.length > 0 && { tickets: formData.tickets }),
      ...(formData.vendors?.length > 0 && { vendors: formData.vendors }),
      ...(formData.hosts?.length > 0 && { hosts: formData.hosts }),
      ...(formData.sponsors?.length > 0 && { sponsors: formData.sponsors }),
      ...(formData.partners?.length > 0 && { partners: formData.partners }),
      ...(formData.stakeholders?.length > 0 && { stakeholders: formData.stakeholders }),
      ...(formData.resources?.length > 0 && { resources: formData.resources }),
      ...(formData.speakers?.length > 0 && { speakers: formData.speakers })
    };
  };

  const createEvent = async (formData: EventFormData) => {
    try {
      const payload = transformFormDataToPayload(formData);
      await postCaller(payload);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    createEvent,
    data,
    isLoading,
    isSuccess,
    error,
  };
};