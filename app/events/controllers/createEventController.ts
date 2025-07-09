import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";
import { CreateEventResponse } from "../types";

export const CreateEventManager = () => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<CreateEventResponse>(
    `/event`,
    ["events"],
    true
  );

  const createEvent = async (formData: any) => {
    try {
      // Send formData directly without transformation
      await postCaller(formData);
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