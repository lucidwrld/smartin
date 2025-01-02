// GuestViewModal.jsx
import React from "react";
import ModalManagement from "@/components/ModalManagement";
import { formatDistanceToNow } from "date-fns";
import StatusButton from "@/components/StatusButton";
import StatusButtonWithBool from "@/components/StatusWithBool";
import CustomButton from "@/components/Button";
import { Trash2, Edit } from "lucide-react";
import { EditInviteeManager } from "@/app/events/controllers/editInviteeController";
import InputWithFullBoarder from "../InputWithFullBoarder";

export const GuestViewModal = ({ guest, onEdit, onDelete }) => {
  if (!guest) return null;

  const handleClose = () => {
    document.getElementById("view_guest_modal").close();
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <ModalManagement id="view_guest_modal" title="Guest Details">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        {/* Guest Image and Basic Info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            {guest?.image ? (
              <img
                src={guest.image}
                alt={guest.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="text-2xl text-gray-400">
                {guest.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{guest.name}</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">{guest.phone}</p>
              <p className="text-gray-600">{guest.email || "No email"}</p>
              <div className="mt-2">
                <StatusButton status={guest.response} />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <CustomButton
              buttonText=""
              prefixIcon={<Edit className="w-4 h-4" />}
              onClick={onEdit}
              radius="rounded-full"
              className="p-2"
            />
            <CustomButton
              buttonText=""
              prefixIcon={<Trash2 className="w-4 h-4" />}
              onClick={onDelete}
              radius="rounded-full"
              className="p-2 bg-red-500 hover:bg-red-600"
            />
          </div>
        </div>

        {/* Access Card & Timeline */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Access Code</span>
            <span className="font-mono bg-white px-3 py-1 rounded border">
              {guest.code}
            </span>
          </div>

          {guest.table && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Table Assignment</span>
              <span className="bg-white px-3 py-1 rounded border">
                Table {guest.table.name} ({guest.table.no_of_seats} seats)
              </span>
            </div>
          )}
        </div>

        {/* Timeline & Status */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Added</span>
            <span>{formatDate(guest.createdAt)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Last Updated</span>
            <span>{formatDate(guest.updatedAt)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Response Status</span>
            <span>{guest.responded ? "Has responded" : "No response yet"}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Attendance Status</span>
            <span>{guest.attended ? "Attended" : "Not attended"}</span>
          </div>
        </div>

        {/* Notification Status */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Notifications Sent</h4>
          <div className="flex gap-2">
            <StatusButtonWithBool
              isActive={guest.notification_sent.whatsapp}
              text="WhatsApp"
            />
            <StatusButtonWithBool
              isActive={guest.notification_sent.sms}
              text="SMS"
            />
            <StatusButtonWithBool
              isActive={guest.notification_sent.email}
              text="Email"
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <CustomButton
            buttonText="Close"
            radius="rounded-full"
            onClick={handleClose}
          />
        </div>
      </div>
    </ModalManagement>
  );
};

// GuestEditModal.jsx
export const GuestEditModal = ({ guest, onSave, isLoading }) => {
  if (!guest) return null;

  const { editInvitee, isLoading: editing } = EditInviteeManager({
    inviteeId: guest?.id,
  });

  const handleClose = () => {
    document.getElementById("edit_guest_modal").close();
  };

  const [formData, setFormData] = React.useState({
    name: guest?.name || "",
    phone: guest?.phone || "",
    email: guest?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editInvitee(formData);
    // onSave(formData);
  };

  return (
    <ModalManagement id="edit_guest_modal" title="Edit Guest">
      <div className="bg-white p-6 rounded-lg w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithFullBoarder
            label={"Name"}
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            isRequired
          />

          <InputWithFullBoarder
            label={"Phone"}
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            isRequired
          />

          <InputWithFullBoarder
            label={"Email"}
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded-full"
              onClick={handleClose}
            >
              Close
            </button>
            <CustomButton
              buttonText={"Save Changes"}
              isLoading={editing}
              type={"submit"}
              radius={"rounded-full"}
            />
          </div>
        </form>
      </div>
    </ModalManagement>
  );
};
