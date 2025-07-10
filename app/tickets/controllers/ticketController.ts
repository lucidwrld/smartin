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

export const BuyTicketManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BuyTicketResponse>(`/ticket/event/buy`, ["tickets"], true);

  const buyTicket = async (eventId: string, buyData: BuyTicketPayload) => {
    try {
      await postCaller({ eventId, data: buyData });
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
