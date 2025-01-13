"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CompletePagination from "@/components/CompletePagination";
import PaginationRounded from "@/components/Pagination";
import StatusButton from "@/components/StatusButton";
import StatusCard from "@/components/StatusCard";
import TablesComponent from "@/components/TablesComponent";
import UserCard from "@/components/UserCard";
import { ArrowLeftRight, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

import { formatAmount } from "@/utils/formatAmount";
import { formatDateTime } from "@/utils/formatDateTime";
import useGetUsersManager from "./controllers/getAllUsersController";
import useGetSingleUser from "./controllers/getSingleUserController";
import { useRouter } from "next/navigation";
import { MakeUserPartnerManager } from "./controllers/makeUserPartnerController";
import { SuspendUnsuspendUserManager } from "./controllers/suspendUnsuspendUserController";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { DeleteUserManager } from "./controllers/deleteUserController";

const UsersPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data, isLoading } = useGetUsersManager({ page: currentPage });
  const { makePartner } = MakeUserPartnerManager({ userId: selectedUser });
  const { manageSuspend } = SuspendUnsuspendUserManager({
    userId: selectedUser,
  });
  const { deleteUser, isLoading: deleting } = DeleteUserManager({
    userId: selectedUser,
  });
  useEffect(() => {
    if (selectedUser) {
    }
  }, [selectedUser]);

  const cards = [
    { title: "Total Users", count: 120, icon: ArrowLeftRight },
    { title: "Total Partners", count: 120, icon: Clock },
  ];
  const headers = ["Name", "Email", "Phone", "Status", "Date", "Action"];

  const getFormattedValue = (el, index) => {
    return [
      <UserCard
        letter={el?.fullname.charAt(0)}
        email={el?.email}
        name={el?.fullname}
      />,
      el?.email,
      el?.phone,
      <StatusButton
        status={
          el?.isSuspended
            ? "Suspended"
            : el?.is_active
            ? "Active"
            : el?.isDeleted
            ? "Deleted"
            : "Inactive"
        }
      />,
      formatDateTime(el?.createdAt),
    ];
  };
  return (
    <BaseDashboardNavigation title={"Users"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>
      <div className="mt-6 flex flex-col w-full gap-4">
        <div className="h-[67vh] w-full relative">
          {
            <TablesComponent
              isLoading={isLoading}
              data={data?.data?.users}
              getFormattedValue={getFormattedValue}
              headers={headers}
              popUpFunction={(option, inx, val) => {
                setSelectedUser(val?.id);
                if (inx === 0) {
                  router.push(`/admin/users/user?id=${val?.id}`);
                }
                if (inx === 1) {
                  //make user a partner
                  if (selectedUser === val?.id) {
                    makePartner();
                  }
                }
                if (inx === 2) {
                  //suspend user
                  if (selectedUser === val?.id) {
                    manageSuspend();
                  }
                }
                if (inx === 3) {
                  //delete user. use a modal here.
                  document.getElementById("delete").showModal();
                }
              }}
              options={[
                "View User",
                "Make Partner",
                "Suspend User",
                "Delete User",
              ]}
              // Close popup function
            />
          }
        </div>
        {data?.data?.users.length > 0 && (
          <CompletePagination
            setCurrentPage={setCurrentPage}
            pagination={data?.data?.pagination}
            suffix={"Users"}
          />
        )}
      </div>
      <DeleteConfirmationModal
        title={"Delete User"}
        body={`Are you sure you want to delete this user?`}
        buttonText={"Delete User"}
        isLoading={deleting}
        onClick={() => deleteUser()}
      />
    </BaseDashboardNavigation>
  );
};

export default UsersPage;
