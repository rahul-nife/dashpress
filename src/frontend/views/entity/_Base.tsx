import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { AppLayout } from "frontend/_layouts/app";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import {
  IMenuSectionItem,
  MenuSection,
} from "frontend/design-system/components/Section/MenuSection";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { FORM_ACTION_CRUD_CONFIG } from "./Actions/constants";
import {
  ENTITY_CRUD_LABELS,
  ENTITY_FIELD_SETTINGS_TAB_LABELS,
} from "./constants";
import { useMutateBaseEntitySettingsMenu } from "./portal";

const baseMenuItems = (entity: string): IMenuSectionItem[] => [
  {
    action: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
      tab: ENTITY_CRUD_LABELS.create,
    }),
    systemIcon: "Sliders",
    name: "CRUD",
    order: 10,
  },
  {
    action: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
    name: "Diction",
    systemIcon: "Type",
    order: 20,
  },
  {
    action: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
      tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
    }),
    name: "Fields",
    systemIcon: "File",
    order: 30,
  },
  {
    action: NAVIGATION_LINKS.ENTITY.CONFIG.RELATIONS(entity),
    name: "Relations",
    systemIcon: "LinkAlt",
    order: 40,
  },
  {
    action: NAVIGATION_LINKS.ENTITY.CONFIG.VIEWS(entity),
    name: "Views",
    systemIcon: "Filter",
    order: 50,
  },
  {
    action: NAVIGATION_LINKS.ENTITY.CONFIG.FORM(entity),
    name: "Form Scripts",
    systemIcon: "Code",
    order: 60,
  },
  {
    action: NAVIGATION_LINKS.ENTITY.CONFIG.PRESENTATION(entity),
    name: "Presentation Scripts",
    systemIcon: "CodeAlt",
    order: 70,
  },
  {
    action: NAVIGATION_LINKS.ENTITY.CONFIG.FORM_INTEGRATIONS(entity),
    name: FORM_ACTION_CRUD_CONFIG.TEXT_LANG.TITLE,
    systemIcon: "Zap",
    order: 80,
  },
];

interface IProps {
  children: ReactNode;
  actionItems?: IDropDownMenuItem[];
}

export function BaseEntitySettingsLayout({ children, actionItems }: IProps) {
  const entity = useEntitySlug();
  const { canGoBack, goBack } = useNavigationStack();
  const router = useRouter();

  const menuItems = useMutateBaseEntitySettingsMenu(
    entity,
    baseMenuItems(entity)
  );

  return (
    <AppLayout actionItems={actionItems}>
      {canGoBack() && (
        <>
          <SoftButton
            systemIcon="Left"
            size="xs"
            label="Go Back"
            action={() => {
              goBack();
            }}
          />
          <Spacer />
        </>
      )}

      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection
            menuItems={menuItems}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
