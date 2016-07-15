package uk.gov.homeoffice.evw

import org.json4s.JValue
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._
import org.scalactic.{Bad, Good, Or}
import org.specs2.mutable.Specification
import uk.gov.homeoffice.json.JValuable._
import uk.gov.homeoffice.json.{Json, JsonError, JsonFormats, JsonSchema}

import scala.util.Success

class EvwFlightJourneyUpdateSchemaSpec extends Specification with Json with JsonFormats {
  val schema = JsonSchema(getClass.getResource("/schema/evw-flight-journey-update-schema.json"))
  implicit val Success(json) = jsonFromClasspath("/data/flight-journey-primary-path-data.json")

  "Invalid EVW Flight Journey Update Entry JSON" should {

    "be missing all top level requirements" in {
      schema.validate("" -> "") must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""missing: ["flight-journey-update"""")
      }
    }

    "have invalid 'membership number'" in {
      schema validate {
        replace(json \ "flight-journey-update" \ "membershipNumber" -> "Xasdhjlskajdsaljalsdkjlkajklsdjlkasjdlkajalksjdlkajdkldjalkadj")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""is too long""")
      }
    }

    "have 'arrival date' with invalid date" in {
      schema validate {
        replace(json \ "flight-journey-update" \ "arrivalDate" -> "2100-99-99")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""pointer":"/properties/flight-journey-update/properties/departureForUKDate"""")
      }
    }

    "have invalid 'port Of Arrival Code'" in {
      schema validate {
        replace(json \ "flight-journey-update" \ "portOfArrivalCode" -> "FRANCE")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/properties/flight-journey-update/properties/portOfArrivalCode"""")
      }
    }

    "contain extra/unexpected data" in {
      schema.validate(json merge parse("""{ "extra": "data" }""")) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""unwanted: ["extra"]""")
      }
    }
  }

  "Valid Flight Journey Update JSON" should {
    "against primary path data" in {
      schema.validate(json) mustEqual Good(json)
    }
  }
}
