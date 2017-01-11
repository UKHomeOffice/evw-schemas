package uk.gov.homeoffice.evw

import org.json4s.{JValue, _}
import org.json4s.jackson.JsonMethods._
import org.scalactic.{Bad, Good, Or}
import org.specs2.mutable.Specification
import uk.gov.homeoffice.json.JValuable._
import uk.gov.homeoffice.json.{Json, JsonError, JsonFormats, JsonSchema}

import scala.util.Success

class EvwFlightJourneyUpdateSchemaSpec extends Specification with Json with JsonFormats {
  val schema = JsonSchema(getClass.getResource("/schema/evw-flight-journey-update-schema.json"))
  implicit val Success(json) = jsonFromClasspath("/data/journey-update-data.json")
  val Success(jsonDepartureFromUkChanged) = jsonFromClasspath("/data/journey-update-data-departureFromUkHasChanged.json")
  val Success(jsonDepartureFromUkChangedKnowsDetails) = jsonFromClasspath("/data/journey-update-data-departureFromUkHasChanged-knowsDetails.json")

  "Invalid EVW Flight Journey Update Entry JSON" should {

    "have invalid 'membership number'" in {
      schema validate {
        replace(json \ "membershipNumber" -> "Xasdhjlskajdsaljalsdkjlkajklsdjlkasjdlkajalksjdlkajdkldjalkadj")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""is too long""")
      }
    }

    "have 'arrival date' with invalid date" in {
      schema validate {
        replace(json \  "arrivalDate" -> "2100-99-99")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""pointer":"/properties/departureForUKDate"""")
      }
    }

    "have invalid 'port Of Arrival Code'" in {
      schema validate {
        replace(json \  "portOfArrivalCode" -> "FRANCE")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/properties/portOfArrivalCode"""")
      }
    }

    "contain extra/unexpected data" in {
      schema.validate(json merge parse("""{ "extra": "data" }""")) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""unwanted: ["extra"]""")
      }
    }

    "contain invalid 'haveDepartureFromUkDetailsChanged' when 'haveDepartureFromUkDetailsChanged is yes and " +
      "'knowDepartureDetails' is missing" in {

      val updatedJson = jsonDepartureFromUkChanged.removeField {
        case("knowDepartureDetails", _) => true
        case(_) => false
      }

      schema.validate(updatedJson) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) =>
          error must contain(""""pointer":"/dependencies/haveDepartureFromUkDetailsChanged"""")
      }
    }

    "contain invalid 'haveDepartureFromUkDetailsChanged' when 'haveDepartureFromUkDetailsChanged is yes and " +
      "'knowDepartureDetails' is 'no' and 'ukDuration' is missing" in {

      val updatedJson = jsonDepartureFromUkChanged.removeField{
        case ("ukDuration", _) => true
        case (_) => false
      }

      schema.validate(updatedJson) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) =>
          error must contain(""""pointer":"/dependencies/knowDepartureDetails"""")
      }
    }

    "contain invalid 'haveDepartureFromUkDetailsChanged' when 'haveDepartureFromUkDetailsChanged is yes and " +
      "'knowDepartureDetails' is 'yes' and 'departureDate' is missing" in  {

      val updatedJson = jsonDepartureFromUkChangedKnowsDetails.removeField{
        case ("departureDate", _) => true
        case (_) => false
      }

      schema.validate(updatedJson) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) =>
          error must contain(""""pointer":"/dependencies/knowDepartureDetails"""")
      }
    }

    "have missing 'departure for UK date offset'" in {
      val requiredJson = json removeField {
        case (key, _) => "departureForUKDateOffset" == key
      }
      schema validate(requiredJson) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""missing: ["departureForUKDateOffset"]""")
      }
    }
  }

 "Valid Flight Journey Update JSON" should {

    "against journey update data where haveDepartureFromUkDetailsChanged is no" in {
      schema.validate(json) mustEqual Good(json)
    }

   "against journey update data where haveDepartureFromUkDetailsChanged is not set" in {

     val haveDepartureFromUkDetailsChangedNotSetJson = json.removeField {
       case("haveDepartureFromUkDetailsChanged", _) => true
       case(_) => false
     }
     schema.validate(haveDepartureFromUkDetailsChangedNotSetJson) mustEqual
       Good(haveDepartureFromUkDetailsChangedNotSetJson)
   }

   "against journey update data where haveDepartureFromUkDetailsChanged is yes and knowDepartureDetails is no" in {

     schema.validate(jsonDepartureFromUkChanged) mustEqual Good(jsonDepartureFromUkChanged)
   }

   "against journey update data where haveDepartureFromUkDetailsChanged is yes and knowDepartureDetails is yes" in {
     schema.validate(jsonDepartureFromUkChangedKnowsDetails) mustEqual Good(jsonDepartureFromUkChangedKnowsDetails)
   }

  }
}
