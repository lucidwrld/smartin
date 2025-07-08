import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { 
  Ticket, 
  CreateTicketPayload, 
  UpdateTicketPayload, 
  BuyTicketPayload, 
  BuyTicketResponse, 
  TicketResponse 
} from "../types";

// Create Ticket
export const CreateTicketManager = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createTicket, isLoading, isSuccess, error, data } = useMutation<
    TicketResponse,
    Error,
    CreateTicketPayload
  >(
    async (ticketData) => {
      const response = await AxiosWithToken.post(`/ticket/`, ticketData);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["eventTickets", variables.event]);
      },
    }
  );

  return { createTicket, isLoading, isSuccess, error, data };
};

// Get Tickets for Event
export const useGetEventTicketsManager = (eventId: string, enabled = true) => {
  return useQuery<TicketResponse, Error>(
    ["eventTickets", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/ticket/event/${eventId}`);
      return response.data;
    },
    {
      enabled: enabled && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Update Ticket
export const UpdateTicketManager = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateTicket, isLoading, isSuccess, error, data } = useMutation<
    TicketResponse,
    Error,
    { ticketId: string; data: UpdateTicketPayload; eventId: string }
  >(
    async ({ ticketId, data }) => {
      const response = await AxiosWithToken.put(`/ticket/${ticketId}`, data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["eventTickets", variables.eventId]);
      },
    }
  );

  return { updateTicket, isLoading, isSuccess, error, data };
};

// Delete Ticket
export const DeleteTicketManager = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteTicket, isLoading, isSuccess, error } = useMutation<
    void,
    Error,
    { ticketId: string; eventId: string }
  >(
    async ({ ticketId }) => {
      await AxiosWithToken.delete(`/ticket/${ticketId}`);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["eventTickets", variables.eventId]);
      },
    }
  );

  return { deleteTicket, isLoading, isSuccess, error };
};

// Buy Ticket
export const BuyTicketManager = () => {
  const { mutateAsync: buyTicket, isLoading, isSuccess, error, data } = useMutation<
    BuyTicketResponse,
    Error,
    { eventId: string; data: BuyTicketPayload }
  >(
    async ({ eventId, data }) => {
      const response = await AxiosWithToken.post(`/ticket/event/${eventId}/buy`, data);
      return response.data;
    }
  );

  return { buyTicket, isLoading, isSuccess, error, data };
};

// Buy Ticket Mobile
export const BuyTicketMobileManager = () => {
  const { mutateAsync: buyTicketMobile, isLoading, isSuccess, error, data } = useMutation<
    BuyTicketResponse,
    Error,
    { eventId: string; data: BuyTicketPayload }
  >(
    async ({ eventId, data }) => {
      const response = await AxiosWithToken.post(`/ticket/event/${eventId}/buy/mobile`, data);
      return response.data;
    }
  );

  return { buyTicketMobile, isLoading, isSuccess, error, data };
};