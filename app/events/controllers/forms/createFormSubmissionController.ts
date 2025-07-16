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

export const CreateFormSubmissionManager = (
  eventId: string,
  formId: string
) => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(
      `/event/${eventId}/forms/${formId}/submission`,
      ["form-submissions"],
      false
    );

  const createFormSubmission = async (
    submissionData: CreateFormSubmissionPayload
  ) => {
    try {
      await postCaller(submissionData);
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
