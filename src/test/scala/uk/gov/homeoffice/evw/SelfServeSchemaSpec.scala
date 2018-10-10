package uk.gov.homeoffice.evw

import org.json4s.JValue
import org.json4s.JsonAST.JObject
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._
import org.scalactic.{Bad, Good, Or}
import org.specs2.mutable.Specification
import uk.gov.homeoffice.json.JValuable._
import uk.gov.homeoffice.json.{Json, JsonError, JsonFormats, JsonSchema}

import scala.util.Success

class SelfServeSchemaSpec extends Specification with Json with JsonFormats {
  val schema = JsonSchema(getClass.getResource("/schema/evw-self-serve-schema.json"))

  "Valid Data should pass" should {
    "multiple parts submitted" in {
      val Success(json) = jsonFromClasspath("/data/self-serve-good-all.json")
      schema.validate(json) mustEqual Good(json)
    }

    "accommodation only" in {
      val Success(json) = jsonFromClasspath("/data/self-serve-good-accommodation.json")
      schema.validate(json) mustEqual Good(json)
    }

    "arrival only" in {
      val Success(json) = jsonFromClasspath("/data/self-serve-good-arrival.json")
      schema.validate(json) mustEqual Good(json)
    }

    "departure only" in {
      val Success(json) = jsonFromClasspath("/data/self-serve-good-departure.json")
      schema.validate(json) mustEqual Good(json)
    }
  }

  "Invalid data should fail" should {
    "missing membership or token" in {
      val missingMembership = parse("""{
          "token": "HIDOSA",
          "accommodation" : {
            "ukAddress" : [
            "UkAddress1",
            "UkAddress2",
            "UkAddress3",
            "UkAddress4",
            "Postcode"
            ],
            "ukVisitPhoneNumber": "0793487837429"
            }
          }""")

      schema.validate(missingMembership) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""object has missing required properties""")
      }

      val missingToken = parse("""{
          "membershipNumber": "HIDOSA",
          "accommodation" : {
            "ukAddress" : [
            "UkAddress1",
            "UkAddress2",
            "UkAddress3",
            "UkAddress4",
            "Postcode"
            ],
            "ukVisitPhoneNumber": "0793487837429"
            }
          }""")

      schema.validate(missingToken) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""object has missing required properties""")
      }

    }

    "knownDeparture without further details" in {

      val badJson = parse("""{
        "membershipNumber": "C12345",
         "token": "HIDOSA",
         "departure" : {
           "knowDepartureDetails": "Yes"
         }
      }""")

      schema.validate(badJson) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""instance failed to match exactly one schema""")
      }

    }

    "bad date format" in {
      val badJson = parse("""{
      "membershipNumber": "C12345",
      "token": "HIDOSA",
      "arrival" : {
        "arrivalTravel": "Land",
        "arrivalDate" : "2015-11--26",
        "arrivalTime" : "21:45",
        "departureForUKDate": "2018-01-01",
        "departureForUKTime": "04:35",
        "inwardDepartureCountry": "FRA",
        "inwardDeparturePort": "Paris",
        "inwardDeparturePortCode": "PSX",
        "portOfArrival": "London Heathrow",
        "portOfArrivalCode": "LHR",
        "flightDetailsCheck" : "No"
      }}""")

      schema.validate(badJson) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("does not match input string")
      }
    }
  }
}