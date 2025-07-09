import usePostManager from "@/constants/controller_templates/post_controller_template";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface CreateFormPayload {
  eventId?: string;
  data: any;
}

export const CreateFormManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/event/form`, ["event-forms"], true);

  const createForm = async (formData: any) => {
    try {
      const payload: CreateFormPayload = {
        data: formData,
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  return {
    createForm,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default CreateFormManager;