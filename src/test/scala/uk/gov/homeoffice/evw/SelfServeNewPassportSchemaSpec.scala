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

class SelfServeNewPassportSchemaSpec extends Specification with Json with JsonFormats {
  val verifySchema = JsonSchema(getClass.getResource("/schema/evw-self-serve-verify-new-passport-schema.json"))
  val uploadSchema = JsonSchema(getClass.getResource("/schema/evw-self-serve-upload-new-passport-schema.json"))

  "Verify New Passport Schema" should {
    "be valid if membershipNumber and token provided" in {
      val Success(json) = jsonFromClasspath("/data/self-serve-verify-new-passport-good.json")
      verifySchema.validate(json) mustEqual Good(json)
    }

    "fail if membershipNumber or token missing" in {
      val missingMembership = parse("""{ "token": "HIDOSA" }""")

      verifySchema.validate(missingMembership) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""object has missing required properties""")
      }

      val missingToken = parse("""{ "membershipNumber": "HIDOSA" }""")

      verifySchema.validate(missingToken) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""object has missing required properties""")
      }
    }

  }

  "Upload New Passport Schema" should {
    "be valid if membershipNumber and token provided" in {
      val Success(json) = jsonFromClasspath("/data/self-serve-upload-new-passport-good.json")
      uploadSchema.validate(json) mustEqual Good(json)
    }

    "fail if membershipNumber or token missing" in {
      val missingMembership = parse("""{ "token": "HIDOSA", "passportFileId" : "558d7997ac7ed77d28c6ea93" }""")

      uploadSchema.validate(missingMembership) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""object has missing required properties""")
      }

      val missingToken = parse("""{ "membershipNumber": "HIDOSA", "passportFileId" : "558d7997ac7ed77d28c6ea93" }""")

      uploadSchema.validate(missingToken) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""object has missing required properties""")
      }
    }

    "fail if passportFileId missing" in {
      val missingPassportFileId = parse("""{ "membershipNumber": "HIDOSA", "token" : "hello" }""")

      uploadSchema.validate(missingPassportFileId) must beLike[JValue Or JsonError] {
        case Bad(JsonError(_, Some(error), _)) => error must contain("""object has missing required properties""")
      }
    }
  }
}
