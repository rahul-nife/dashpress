import {
  useAuthenticatedUserBag,
  useUserHasPermission,
} from "frontend/hooks/auth/user.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { SystemProfileDocumentation } from "frontend/docs/system-profile";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { AppLayout } from "frontend/_layouts/app";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  IResetPasswordForm,
  RESET_PASSWORD_FORM_SCHEMA,
} from "shared/form-schemas/users/reset-password";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { IActionButton } from "frontend/design-system/components/Button/types";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IUpdateUserForm } from "shared/form-schemas/users/update";
import { useUsernameFromRouteParam } from "../hooks";
import {
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useUserDetails,
  ADMIN_USERS_CRUD_CONFIG,
} from "../users.store";

export const UPDATE_USER_FORM_SCHEMA = (
  actionButton: IActionButton
): IAppliedSchemaFormConfig<IUpdateUserForm> => {
  return {
    name: {
      type: "text",
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
      formState: ($) => ({
        disabled: $.auth.username === $.routeParams.username,
      }),
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

export function UserUpdate() {
  const updateUserMutation = useUpdateUserMutation();
  const resetPasswordMutation = useResetUserPasswordMutation();
  const { backLink } = useNavigationStack();
  const username = useUsernameFromRouteParam();
  const userDetails = useUserDetails(username);
  const authenticatedUserBag = useAuthenticatedUserBag();

  const userHasPermission = useUserHasPermission();

  const documentationActionButton =
    useDocumentationActionButton("System Profile");

  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EDIT,
    viewKey: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EDIT,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  const { isLoading } = userDetails;

  const { error } = userDetails;

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EDIT}
          backLink={backLink}
        >
          <ViewStateMachine
            loading={isLoading}
            error={error}
            loader={
              <FormSkeleton
                schema={[
                  FormSkeletonSchema.Input,
                  FormSkeletonSchema.Input,
                  FormSkeletonSchema.Textarea,
                ]}
              />
            }
          >
            <SchemaForm<IUpdateUserForm>
              buttonText={ADMIN_USERS_CRUD_CONFIG.FORM_LANG.UPDATE}
              onSubmit={updateUserMutation.mutateAsync}
              initialValues={userDetails.data}
              systemIcon="Save"
              fields={UPDATE_USER_FORM_SCHEMA(documentationActionButton)}
            />
          </ViewStateMachine>
        </SectionBox>
        <Spacer />
        {userHasPermission(USER_PERMISSIONS.CAN_RESET_PASSWORD) &&
          authenticatedUserBag.data?.username !== username && (
            <SectionBox title="Reset User Password">
              <SchemaForm<IResetPasswordForm>
                buttonText={(submitting) =>
                  submitting ? "Resetting Password" : "Reset Password"
                }
                systemIcon="Unlock"
                fields={RESET_PASSWORD_FORM_SCHEMA}
                onSubmit={resetPasswordMutation.mutateAsync}
                resetForm
              />
            </SectionBox>
          )}
      </ContentLayout.Center>
      <SystemProfileDocumentation />
    </AppLayout>
  );
}
