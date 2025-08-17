"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CompletePagination from "@/components/CompletePagination";
import PaginationRounded from "@/components/Pagination";
import StatusButton from "@/components/StatusButton";
import StatusCard from "@/components/StatusCard";
import TablesComponent from "@/components/TablesComponent";
import UserCard from "@/components/UserCard";
import { ArrowLeftRight, Clock, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import { formatAmount } from "@/utils/formatAmount";
import { formatDateTime } from "@/utils/formatDateTime";
import useGetUsersManager from "./controllers/getAllUsersController";
import useDebounce from "@/utils/UseDebounce";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import useGetSingleUser from "./controllers/getSingleUserController";
import { useRouter } from "next/navigation";
import { MakeUserPartnerManager } from "./controllers/makeUserPartnerController";
import { SuspendUnsuspendUserManager } from "./controllers/suspendUnsuspendUserController";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { DeleteUserManager } from "./controllers/deleteUserController";
import PartnershipModal from "@/components/modals/PartnershipModal";

const UsersPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [partnershipType, setPartnershipType] = useState("make");

  // Debounce search term with 1 second delay
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { data, isLoading } = useGetUsersManager({ 
    page: currentPage, 
    searchQuery: debouncedSearchTerm 
  });
  const { makePartner, isLoading: makingPartner } = MakeUserPartnerManager();
  const { manageSuspend } = SuspendUnsuspendUserManager({
    userId: selectedUser,
  });
  const { deleteUser, isLoading: deleting } = DeleteUserManager({
    userId: selectedUser,
  });
  const handlePartnershipAction = (discountId = null) => {
    const payload = {
      userId: selectedUser,
      ...(partnershipType === "make" && { discountId })
    };
    
    if (partnershipType === "make") {
      makePartner(payload);
    }
    
    setShowPartnershipModal(false);
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

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
      
      {/* Search Section */}
      <div className="mt-6 mb-4">
        <div className="w-full max-w-md">
          <InputWithFullBoarder
            id="user-search"
            name="search"
            type="text"
            placeholder="Search users by fullname..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        {debouncedSearchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            {isLoading ? "Searching..." : `Search results for "${debouncedSearchTerm}"`}
          </p>
        )}
      </div>

      <div className="flex flex-col w-full gap-4">
        <div className="h-[67vh] w-full relative">
          {
            <TablesComponent
              isLoading={isLoading}
              data={data?.data?.users}
              getFormattedValue={getFormattedValue}
              headers={headers}
              buttonFunction={() => {}}
              toggleRowFunction={() => {}}
              toggleSelectAllFunction={() => {}}
              setSelectedRows={() => {}}
              selectedRows={[]}
              popUpFunction={(option, inx, val) => {
                setSelectedUser(val?.id);
                setSelectedUserName(val?.fullname);
                if (inx === 0) {
                  router.push(`/admin/users/user?id=${val?.id}`);
                }
                if (inx === 1) {
                  //make user a partner
                  setPartnershipType("make");
                  setShowPartnershipModal(true);
                }
                if (inx === 2) {
                  //suspend user
                  if (selectedUser === val?.id) {
                    manageSuspend();
                  }
                }
                if (inx === 3) {
                  //delete user. use a modal here.
                  (document.getElementById("delete") as any)?.showModal();
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
        id="delete"
        buttonColor=""
        successFul={false}
      />
      
      <PartnershipModal
        isOpen={showPartnershipModal}
        onClose={() => setShowPartnershipModal(false)}
        onConfirm={handlePartnershipAction}
        isLoading={makingPartner}
        userName={selectedUserName}
        type={partnershipType}
      />
    </BaseDashboardNavigation>
  );
};

export default UsersPage;
