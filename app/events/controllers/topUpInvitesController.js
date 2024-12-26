import { useMutation, useQueryClient } from "react-query";

import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const useTopUpInvitesManager = () => {
  const queryClient = useQueryClient();

  const { confirmDetails } = useParams();

  const handlePaymentResult = async () => {
    const urlString = confirmDetails;

    const url = new URL(urlString);

    // Get the search params from the URL
    const searchParams = new URLSearchParams(url.search);
    // Get the value of the 'status' parameter
    const status = searchParams.get("status");

    // Get the value of the 'tx_ref' parameter
    const txRef = searchParams.get("tx_ref");

    // Get the value of the 'transaction_id' parameter
    const transactionId = searchParams.get("transaction_id");
    try {
      const confirmationResponse = await AxiosWithToken.get(
        `/wallet/confirmation?status=${status}&tx_ref=${txRef}&transaction_id=${transactionId}`
      );

      return confirmationResponse.data;
    } catch (error) {
      throw new Error(`Sorry: ${error.confirmationResponse.data.message}`);
    }
    // Call the confirmTransaction function
  };

  const postController = async (details) => {
    try {
      const [response] = [
        await AxiosWithToken.post(`/event/invitees/topup`, details),
      ];

      const checkoutUrl = response.data.data.checkoutUrl;

      const cleanup = () => {
        window.removeEventListener("message", handlePaymentResult);
      };

      window.addEventListener("message", handlePaymentResult);
      // Redirect the user to the checkoutUrl
      window.location.href = checkoutUrl;

      return cleanup;
    } catch (error) {
      throw new Error(`Sorry: ${error.response.data.message}`);
    }
  };

  const mutation = useMutation(postController, {
    onSuccess: async (data) => {
      // Update other caches using useQuery
      toast({
        type: "success",
        message: data.message,
      });
      const updateQueryKeys = ["transactions", "events"];
      if (updateQueryKeys.length) {
        updateQueryKeys.forEach((key) => queryClient.invalidateQueries(key));
      }
    },
    onError: (error) => {
      // Handle error if necessary

      toast({
        type: "error",
        message: error?.message,
      });
      console.error("Post error:", error);
    },
  });

  const postCaller = async (details) => {
    try {
      await mutation.mutateAsync(details);
    } catch (error) {
      // Handle error if necessary
      console.error("Post error:", error);
    }
  };

  return {
    postCaller,
    data: mutation.data,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

export default useTopUpInvitesManager;
