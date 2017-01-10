package uk.gov.homeoffice.evw

import org.json4s.JValue
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._
import org.scalactic.{Bad, Good, Or}
import org.specs2.mutable.Specification
import uk.gov.homeoffice.json.JValuable._
import uk.gov.homeoffice.json.{Json, JsonError, JsonFormats, JsonSchema}

import scala.util.Success

class EvwSchemaSpec extends Specification with Json with JsonFormats {
  val schema = JsonSchema(getClass.getResource("/schema/evw-schema.json"))
  implicit val Success(json) = jsonFromClasspath("/data/primary-path-data.json")
  val Success(alternateJson) = jsonFromClasspath("/data/alternate-path-data.json")

  "Invalid EVW Entry JSON" should {
    "be missing all top level requirements" in {
      schema.validate("" -> "") must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""missing: ["applicationReference","contactDetails","journey","miscellaneous","objectId","passport","passportFileId","payment"]""")
      }
    }

    "be missing top level requirement 'reference ID'" in {
      schema.validate("applicationReference" -> "A23EJDQA") must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""missing: ["contactDetails","journey","miscellaneous","objectId","passport","passportFileId","payment"]""")
      }
    }

    "have incorrect 'passport file ID'" in {
      val passportFileId = "A23EJDQA"
      schema.validate {
        replace(json \ "passportFileId" -> passportFileId)
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""keyword: "pattern"""")
      }
    }

    "have 'issue date' in the future" in {
      schema validate {
        replace(json \ "passport" \ "issueDate" -> "2100-01-99")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""pointer":"/passport/issueDate"""")
      }
    }

    "have 'date of birth' in the future" in {
      schema validate {
        replace(json \ "passport" \ "dateOfBirth" -> "2100-01-99")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""pointer":"/passport/dateOfBirth"""")
      }
    }

    "have 'expiry date' in the past" in {
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
        replace(json \ "passport" \ "nationality" -> "FR")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""enum (possible values: [\"KWT\",\"QAT\",\"ARE\"])""")
      }
    }

//    "have 'fee' that is too small" in {
//      schema validate {
//        replace(json \ "payment" \ "feeInPence" -> 5)
//      } must beLike[JValue Or JsonError] {
//        case Bad(JsonError(_, Some(error), _)) => error must contain("numeric instance is lower than the required minimum")
//      }
//    }
//
//    "have 'fee' that is too large" in {
//      schema validate {
//        replace(json \ "payment" \ "feeInPence" -> 12345)
//      } must beLike[JValue Or JsonError] {
//        case Bad(JsonError(_, Some(error), _)) => error must contain("numeric instance is greater than the required maximum")
//      }
//    }

    "have 'payment date' in the future" in {
      schema validate {
        replace(json \ "payment" \ "paymentDate" -> "2100-01-99 00:00:00")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""pointer":"/payment/paymentDate"""")
      }
    }

    "have 'payment date' with no time" in {
      schema validate {
        replace(json \ "payment" \ "paymentDate" -> "2014-01-99")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""pointer":"/payment/paymentDate"""")
      }
    }

    "have 'payment date' with invalid time" in {
      schema validate {
        replace(json \ "payment" \ "paymentDate" -> "2100-01-99 67:87:98")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""pointer":"/payment/paymentDate"""")
      }
    }

    "have invalid 'email address'" in {
      schema validate {
        replace(json \ "contactDetails" \ "emailAddress" -> "definitely.not.an.email")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/contactDetails/emailAddress"""")
      }
    }

    "have invalid 'completers email address'" in {
      schema validate {
        replace(json \ "miscellaneous" \ "completersEmailAddress" -> "definitely.not.an.email")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/miscellaneous/completersEmailAddress"""")
      }
    }

    "have invalid 'reference ID'" in {
      schema validate {
        replace(json \ "applicationReference" -> "1234567")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/applicationReference"""")
      }

      schema validate {
        replace(json \ "applicationReference" -> "1234567x")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/applicationReference"""")
      }
    }

    "have missing order reference" in {
      val requiredJson = json removeField {
        case (key, _) => "orderCode" == key
      }
      schema validate(requiredJson) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""required: ["feeInPence","orderCode","paid","paymentDate"]""")
      }
    }

    "contain extra/unexpected data" in {
      schema.validate(json merge parse("""{ "extra": "data" }""")) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""unwanted: ["extra"]""")
      }
    }

    "have incorrect 'departure for UK date offset'" in {
      schema.validate {
        replace(json \ "journey" \ "departureForUKDateOffset" -> "+AB:00")
      } must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain(""""pointer":"/journey/departureForUKDateOffset"""")
      }
    }
  }

  "Valid EVW JSON" should {
    "against primary path data" in {
      schema.validate(json) mustEqual Good(json)
    }

    "against alternate path data" in {
      schema.validate(alternateJson) mustEqual Good(alternateJson)
    }

    "have all required data" in {
      val requiredJson = json removeField {
        case (key, _) => "secondEmail" == key
      }
      schema.validate(requiredJson) mustEqual Good(requiredJson)
    }
  }
}
