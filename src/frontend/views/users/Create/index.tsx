import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import { SystemProfileDocumentation } from "frontend/docs/system-profile";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { AppLayout } from "frontend/_layouts/app";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ICreateUserForm } from "shared/form-schemas/users/create";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { IActionButton } from "frontend/design-system/components/Button/types";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { ADMIN_USERS_CRUD_CONFIG, useCreateUserMutation } from "../users.store";

export const CREATE_USER_FORM_SCHEMA = (
  actionButton: IActionButton
): IAppliedSchemaFormConfig<ICreateUserForm> => {
  return {
    username: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "alphanumeric",
        },
      ],
    },
    name: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    password: {
      type: "password",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    role: {
      type: "selection",
      apiSelections: {
        listUrl: "/api/roles",
      },
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    systemProfile: {
      type: "json",
      rightActions: [actionButton],
      validations: [
        {
          validationType: "isJson",
        },
      ],
    },
  };
};

export function UserCreate() {
  const userCreationMutation = useCreateUserMutation();
  const { backLink } = useNavigationStack();

  const documentationActionButton =
    useDocumentationActionButton("System Profile");

  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
    viewKey: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE}
          backLink={backLink}
        >
          <SchemaForm<ICreateUserForm>
            onSubmit={userCreationMutation.mutateAsync}
            buttonText={ADMIN_USERS_CRUD_CONFIG.FORM_LANG.CREATE}
            fields={CREATE_USER_FORM_SCHEMA(documentationActionButton)}
            systemIcon="Plus"
            resetForm
          />
        </SectionBox>
      </ContentLayout.Center>
      <SystemProfileDocumentation />
    </AppLayout>
  );
}
