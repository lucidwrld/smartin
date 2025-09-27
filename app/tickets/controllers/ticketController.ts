import usePostManager from "@/constants/controller_templates/post_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";
import {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  BuyTicketPayload,
  BuyTicketResponse,
  TicketResponse,
} from "../types";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

export const CreateTicketManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/ticket/`, ["eventTickets"], true);

  const createTicket = async (ticketData: CreateTicketPayload) => {
    try {
      await postCaller(ticketData);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  return {
    createTicket,
    data,
    isLoading,
    isSuccess,
    error,
  };
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

export const UpdateTicketManager = ({ ticketId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<BaseResponse>(
      `/ticket/${ticketId}`,
      ["eventTickets"],
      true
    );

  const updateTicket = async (ticketData: UpdateTicketPayload) => {
    try {
      await updateCaller(ticketData);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  return {
    updateTicket,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteTicketManager = ({ ticketId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<BaseResponse>(
      `/ticket/${ticketId}`,
      ["eventTickets"],
      true
    );

  const deleteTicket = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  return {
    deleteTicket,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const BuyTicketManager = ({eventId}) => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BuyTicketResponse>(`/ticket/event/${eventId}/buy`, ["tickets"], true);

  const buyTicket = async (buyData: BuyTicketPayload) => {
    try {
      await postCaller(buyData);
    } catch (error) {
      console.error("Error buying ticket:", error);
    }
  };

  return {
    buyTicket,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const BuyTicketMobileManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BuyTicketResponse>(
      `/ticket/event/buy/mobile`,
      ["tickets"],
      true
    );

  const buyTicketMobile = async (
    eventId: string,
    buyData: BuyTicketPayload
  ) => {
    try {
      await postCaller({ eventId, data: buyData });
    } catch (error) {
      console.error("Error buying ticket mobile:", error);
    }
  };

  return {
    buyTicketMobile,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Get Customer Events (all events customer has tickets for)
export const useGetCustomerEventsManager = (email: string) => {
  return useQuery<BaseResponse, Error>(
    ["customerEvents", email],
    async () => {
      const response = await AxiosWithToken.get(`/ticket/events`, {
        params: { email }
      });
      return response.data;
    },
    {
      enabled: !!email,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Get Customer Tickets for Specific Event
export const useGetCustomerTicketsForEventManager = (email: string, eventId: string) => {
  return useQuery<BaseResponse, Error>(
    ["customerTicketsForEvent", email, eventId],
    async () => {
      const response = await AxiosWithToken.get(`/ticket/purchases`, {
        params: { email, eventId }
      });
      return response.data;
    },
    {
      enabled: !!email && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Request Edit Code for Ticket
export const RequestTicketEditCodeManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/ticket/request-edit-code`, ["ticketEditCode"], true);

  const requestEditCode = async (email: string, eventId: string) => {
    try {
      await postCaller({ email, eventId });
    } catch (error) {
      console.error("Error requesting ticket edit code:", error);
    }
  };

  return {
    requestEditCode,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Edit Ticket Details
export const EditTicketDetailsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/ticket/edit-details`, ["customerTickets"], true);

  const editTicketDetails = async (editData: {
    email: string;
    eventId: string;
    code: string;
    tickets: Array<{
      ticketId: string;
      name?: string;
      phone?: string;
      additionalInfo?: string;
    }>;
  }) => {
    try {
      await postCaller(editData);
    } catch (error) {
      console.error("Error editing ticket details:", error);
    }
  };

  return {
    editTicketDetails,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
