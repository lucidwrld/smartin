import useUpdateManager from "@/constants/controller_templates/put_controller_template";
 

export const UpdateFormManager = (formId: string) => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/forms/${formId}/update`,
    ["form", "event-forms"],
    true
  );

  const updateForm = async (fields: any) => {
    try {
      await updateCaller(fields);
    } catch (error) {
      console.error("Error updating form fields:", error);
    }
  };

  return {
    updateForm,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default UpdateFormManager;
