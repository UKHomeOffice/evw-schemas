package uk.gov.homeoffice.evw

import uk.gov.homeoffice.json.{JsonSchema, JsonValidator}

trait EVWJsonValidator extends JsonValidator {
  val jsonSchema = JsonSchema(getClass.getResource("/evw/evw-schema.json"))
}