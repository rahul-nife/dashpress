import { IValueLabel } from "@gothicgeeks/design-system/dist/types";
import { IEntityField } from "shared/types";
import {
  ConfigurationService,
  configurationService,
} from "../configuration/configuration.service";
import { entitiesService, EntitiesService } from "./entities.service";
import { sortByList } from "./utils";

export class EntitiesController {
  constructor(
    private _entitiesService: EntitiesService,
    private _configurationService: ConfigurationService
  ) {}

  async getMenuEntities(): Promise<IValueLabel[]> {
    const [hiddenEntities, entitiesOrder, entities] = await Promise.all([
      this._configurationService.show<string[]>("disabled_entities"),
      this._configurationService.show<string[]>("entities_order"),
      this._entitiesService.getAllEntities(),
    ]);
    const entitiesToShow = entities.filter(
      ({ value }) => !hiddenEntities.includes(value)
    );

    sortByList(
      entitiesToShow.sort((a, b) => a.value.localeCompare(b.value)),
      entitiesOrder,
      "value"
    );

    return entitiesToShow;
  }

  async listAllEntities(): Promise<IValueLabel[]> {
    return await this._entitiesService.getAllEntities();
  }

  async getEntityRelations(
    entity: string
  ): Promise<{ toMany: string[]; toOne: Record<string, string> }> {
    const [entityRelations, disabledEntities] = await Promise.all([
      this._entitiesService.getEntityRelations(entity),
      this._configurationService.show<string[]>("disabled_entities"),
    ]);

    const allowedEntityRelation = entityRelations.filter(
      ({ table }) => !disabledEntities.includes(table)
    );

    return {
      toOne: Object.fromEntries(
        allowedEntityRelation
          .filter((relation) => relation?.joinColumnOptions?.[0].name)
          .map((relation) => {
            return [relation?.joinColumnOptions?.[0].name, relation.table];
          })
      ),
      toMany: allowedEntityRelation
        .filter((relation) => !relation?.joinColumnOptions?.[0].name)
        .map((relation) => relation.table),
    };
  }

  async getEntityFields(entity: string): Promise<IEntityField[]> {
    const [entityFields, entityFieldsOrder] = await Promise.all([
      this._entitiesService.getEntityFields(entity),
      this._configurationService.show<string[]>("entity_fields_orders", entity),
    ]);

    sortByList(
      entityFields as unknown as Record<string, unknown>[],
      entityFieldsOrder,
      "name" as keyof IEntityField
    );

    return entityFields;
  }
}

export const entitiesController = new EntitiesController(
  entitiesService,
  configurationService
);
