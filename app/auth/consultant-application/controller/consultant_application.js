import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const ConsultantApplicationManagement = () => {
  const route = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/users/counsellor/application`,
    ["applications"],
    true
  );
  const apply = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
       
    }
  };
  return {
    apply,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
