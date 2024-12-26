import { changePhoto } from "@/public/icons";
import GlobalVariables from "@/utils/GlobalVariables";
import React, { useEffect, useState } from "react";
import CustomButton from "../Button";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomDropdown from "../CustomDropDown";
import useGetSettingsManager from "@/app/admin/settings/controllers/getSettingsController";
import { UpdateSettingsManager } from "@/app/admin/settings/controllers/updateSettingsController";
import Loader from "../Loader";

const ConfigurationSection = () => {
  const { data, isLoading } = useGetSettingsManager();
  const { updateSettings, isLoading: updating } = UpdateSettingsManager();

  const initialData = {
    general_meeting: {
      duration: 0,
      has_limit: true,
      limit_per_user: 2,
    },
    price_per_minute: 0.5,
    paymentActivation: true,
    token_price: 0.5,
    minimum_token_purchase: 15,
    minimum_duration_charge: 15,
    added_participant_percentage: 40,
    percentage_commission: 30,
    max_free_session_duration: 10,
    max_free_session_month: 2,
    minimum_time_charge: 1,
  };
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (data) {
      setFormData({ ...formData, ...data?.data });
    }
  }, [data]);

  const convertFormDataToNumbers = (data) => {
    const convertedData = { ...data };

    for (const key in convertedData) {
      if (
        typeof convertedData[key] === "string" &&
        !isNaN(convertedData[key])
      ) {
        convertedData[key] = parseFloat(convertedData[key]);
      } else if (
        typeof convertedData[key] === "object" &&
        convertedData[key] !== null
      ) {
        convertedData[key] = convertFormDataToNumbers(convertedData[key]);
      }
    }

    return convertedData;
  };

  const handleSaveChanges = () => {
    const updatedFormData = convertFormDataToNumbers(formData);
    updateSettings(updatedFormData);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex w-full bg-white rounded-[10px] flex-col text-brandBlack p-10">
      <div className="flex items-start gap-32">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Tokens</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Set and configure the Token value for the application
          </p>
          <CustomButton
            buttonText={`Save Changes`}
            isLoading={updating}
            onClick={handleSaveChanges}
          />
        </div>
        <div className="relative w-[546px] flex flex-col">
          <div className="w-full">
            <InputWithFullBoarder
              label={`Current Cost of Token ($)`}
              placeholder={`$ 0.00`}
              value={formData.token_price}
              onChange={(e) =>
                setFormData({ ...formData, token_price: e.target.value })
              }
            />
            <InputWithFullBoarder
              label={`Minimum token purchase cost`}
              placeholder={`0.00`}
              value={formData.minimum_token_purchase}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimum_token_purchase: e.target.value,
                })
              }
            />
            <InputWithFullBoarder
              label={`Percentage charge for added participants per minute`}
              placeholder={`0.00`}
              value={formData.added_participant_percentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  added_participant_percentage: e.target.value,
                })
              }
            />

            <InputWithFullBoarder
              label={`Minimum time lapse charge (mins)`}
              placeholder={`0.00`}
              value={formData.minimum_time_charge}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimum_time_charge: e.target.value,
                })
              }
            />
            <InputWithFullBoarder
              label={`Minimum charge per minute`}
              placeholder={`0.00`}
              value={formData.price_per_minute}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price_per_minute: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="divider my-10"></div>
      <div className="flex items-start gap-32">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Consulting</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Add and configure the consulting sessions for consultants and
            clients.
          </p>
          <CustomButton
            buttonText={`Save Changes`}
            onClick={handleSaveChanges}
            isLoading={updating}
          />
        </div>
        <div className="relative w-[546px] flex flex-col">
          <div className="flex w-full gap-3">
            <div className="w-full">
              <InputWithFullBoarder
                label={`Max free session (mins)`}
                value={formData.max_free_session_duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_free_session_duration: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full">
              <InputWithFullBoarder
                label={`Free Slots per month`}
                value={formData.max_free_session_month}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_free_session_month: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex w-full gap-3">
            <div className="w-full">
              <InputWithFullBoarder
                label={`Percentage charge per session`}
                value={formData.percentage_commission}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    percentage_commission: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full">
              <InputWithFullBoarder
                label={`Minimum duration charge`}
                value={formData.minimum_duration_charge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minimum_duration_charge: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSection;
