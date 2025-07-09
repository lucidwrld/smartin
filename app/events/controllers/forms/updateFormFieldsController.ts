import useUpdateManager from "@/constants/controller_templates/put_controller_template";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface UpdateFormFieldsPayload {
  formId: string;
  fields: any;
}

export const UpdateFormFieldsManager = (formId: string) => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/forms/${formId}`,
    ["form", "event-forms"],
    true
  );

  const updateFormFields = async (fields: any) => {
    try {
      await updateCaller(fields);
    } catch (error) {
      console.error("Error updating form fields:", error);
    }
  };

  return {
    updateFormFields,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default UpdateFormFieldsManager;
