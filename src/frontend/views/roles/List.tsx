import {
  Table,
  DEFAULT_TABLE_PARAMS,
  DeleteButton,
  SoftButton,
  Stack,
} from "@hadmean/chromista";
import {
  IBEPaginatedDataState,
  IFEPaginatedDataState,
  useFEPaginatedData,
} from "@hadmean/protozoa";
import React, { useState } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { Plus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import router from "next/router";
import { userFriendlyCase } from "frontend/lib/strings";
import { IValueLabel } from "@hadmean/chromista/dist/types";
import { SystemRoles, USER_PERMISSIONS } from "shared/types";
import { ADMIN_ROLES_ENDPOINT, useRoleDeletionMutation } from "./roles.store";

export function ListRoles() {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IValueLabel> | IBEPaginatedDataState
  >({ ...DEFAULT_TABLE_PARAMS, pageIndex: 1 });

  useSetPageDetails({
    pageTitle: "Roles",
    viewKey: "ROLES_LIST",
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  const roleDeletionMutation = useRoleDeletionMutation();

  const MemoizedAction = React.useCallback(
    ({ row }: any) => {
      const roleId = (row.original as unknown as IValueLabel).value;
      if ((Object.values(SystemRoles) as string[]).includes(roleId)) {
        return null;
      }
      return (
        <Stack spacing={4} align="center">
          <SoftButton
            action={NAVIGATION_LINKS.ROLES.DETAILS(roleId)}
            label="Details"
            justIcon
            icon="eye"
          />
          <DeleteButton
            onDelete={() => roleDeletionMutation.mutateAsync(roleId)}
            isMakingDeleteRequest={roleDeletionMutation.isLoading}
            shouldConfirmAlert
          />
        </Stack>
      );
    },
    [roleDeletionMutation.isLoading]
  );

  const tableData = useFEPaginatedData<Record<string, unknown>>(
    ADMIN_ROLES_ENDPOINT,
    {
      ...paginatedDataState,
      sortBy: undefined,
      pageIndex: 1,
      filters: undefined,
    }
  );

  return (
    <AppLayout
      actionItems={[
        {
          label: "Add New Role",
          IconComponent: Plus,
          onClick: () => {
            router.push(NAVIGATION_LINKS.ROLES.CREATE);
          },
        },
      ]}
    >
      <Table
        {...{
          tableData,
          setPaginatedDataState,
          paginatedDataState,
        }}
        columns={[
          {
            Header: "Role",
            accessor: "label",
            Cell: (value) => userFriendlyCase(value.value as string),
            disableSortBy: true,
          },
          {
            Header: "Action",
            Cell: MemoizedAction,
          },
        ]}
      />
    </AppLayout>
  );
}
