import usePostManager from "@/constants/controller_templates/post_controller_template";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface FormResponse {
  type: string;
  label: string;
  response: string;
}

interface CreateFormSubmissionPayload {
  email: string;
  name: string;
  responses: FormResponse[];
}

export const CreateFormSubmissionManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/event/forms/submission`, ["form-submissions"], true);

  const createFormSubmission = async (eventId: string, formId: string, submissionData: CreateFormSubmissionPayload) => {
    try {
      const payload = {
        ...submissionData,
        eventId,
        formId,
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error creating form submission:", error);
    }
  };

  return {
    createFormSubmission,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default CreateFormSubmissionManager;