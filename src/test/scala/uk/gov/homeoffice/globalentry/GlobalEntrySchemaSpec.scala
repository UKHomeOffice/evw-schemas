package uk.gov.homeoffice.globalentry

import scala.util.Success
import org.json4s.JValue
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._
import org.scalactic.{Bad, Good, Or}
import org.specs2.mutable.Specification
import uk.gov.homeoffice.json.JValuable._
import uk.gov.homeoffice.json.{Json, JsonError, JsonFormats, JsonSchema}

class GlobalEntrySchemaSpec extends Specification with Json with JsonFormats {
  val schema = JsonSchema(getClass.getResource("/global-entry/global-entry-schema.json"))
  implicit val Success(json) = jsonFromClasspath("/global-entry/global-entry.json")

  "Invalid Global Entry JSON" should {
    "be missing all top level requirements" in {
      schema.validate("" -> "") must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""missing: ["email","passport","payment","referenceId"]""")
      }
    }

    "be missing top level requirement 'reference ID'" in {
      schema.validate("referenceId" -> "A23EJDQA") must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""missing: ["email","passport","payment"]""")
      }
    }

    "be missing sub level requirement 'given name'" in {
      schema.validate {
        json remove { _ == json \ "passport" \ "givenName" }
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""missing: ["givenName"]""")
      }
    }

    "have invalid 'expiry date'" in {
      schema validate {
        replace(json \ "passport" \ "expiryDate" -> "2000-01-99")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""pointer":"/passport/expiryDate"""")
      }
    }

    "have invalid 'gender'" in {
      schema validate {
        replace(json \ "passport" \ "gender" -> "X")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""enum: ["M","F"]""")
      }
    }

    "have invalid 'nationality'" in {
      schema validate {
        replace(json \ "passport" \ "nationalityCode" -> "FR")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""enum: ["GBR"]""")
      }
    }

    "have 'fee' that is too small" in {
      schema validate {
        replace(json \ "payment" \ "feeInPence" -> 5)
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("numeric instance is lower than the required minimum")
      }
    }

    "have 'fee' that is too large" in {
      schema validate {
        replace(json \ "payment" \ "feeInPence" -> 12345)
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("numeric instance is greater than the required maximum")
      }
    }

    "have invalid 'email'" in {
      schema validate {
        replace(json \ "email" -> "definitely.not.an.email")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/email"""")
      }
    }

    "have invalid 'reference ID'" in {
      schema validate {
        replace(json \ "referenceId" -> "1234567")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/referenceId"""")
      }

      schema validate {
        replace(json \ "referenceId" -> "1234567x")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/referenceId"""")
      }
    }

    "contain extra/unexpected data" in {
      schema.validate(json merge parse("""{ "extra": "data" }""")) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""unwanted: ["extra"]""")
      }
    }
  }

  "Valid Global Entry JSON" should {
    "have all data" in {
      schema.validate(json) mustEqual Good(json)
    }

    "have all required data" in {
      val requiredJson = json removeField {
        case (key, _) => "previousNames" == key
      }

      schema.validate(requiredJson) mustEqual Good(requiredJson)
    }
  }
}