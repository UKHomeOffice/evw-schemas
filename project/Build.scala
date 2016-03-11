import sbt.Keys._
import sbt._

object Build extends Build {
  val moduleName = "evw-schemas"

  lazy val module = Project(id = moduleName, base = file("."))
    .settings(
      name := moduleName,
      organization := "uk.gov.homeoffice",
      version := "1.0-SNAPSHOT",
      scalaVersion := "2.11.7",
      scalacOptions ++= Seq(
        "-feature",
        "-language:implicitConversions",
        "-language:higherKinds",
        "-language:existentials",
        "-language:reflectiveCalls",
        "-language:postfixOps",
        "-Yrangepos",
        "-Yrepl-sync"),
      ivyScala := ivyScala.value map { _.copy(overrideScalaVersion = true) },
      resolvers ++= Seq(
        "Artifactory Snapshot Realm" at "http://artifactory.registered-traveller.homeoffice.gov.uk/artifactory/libs-snapshot-local/",
        "Artifactory Release Realm" at "http://artifactory.registered-traveller.homeoffice.gov.uk/artifactory/libs-release-local/",
        "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
        "Sonatype Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/",
        "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases")
    )

  val rtpIoLib = ProjectRef(file("../rtp-io-lib"), "rtp-io-lib")
  val rtpTestLib = ProjectRef(file("../rtp-test-lib"), "rtp-test-lib")

  def existsLocallyAndNotOnJenkins(filePath: String) = file(filePath).exists && !file(filePath + "/nextBuildNumber").exists()

  lazy val root = if (Seq(rtpIoLib, rtpTestLib).forall(p => existsLocallyAndNotOnJenkins(p.build.getPath))) {
    println("=================================")
    println("Build locally Evw schemas")
    println("=================================")

    module.dependsOn(rtpIoLib % "test->test;compile->compile")
          .dependsOn(rtpTestLib % "test->test;compile->compile")
  } else {
    println("====================================")
    println("Build on Jenkins Evw schemas")
    println("====================================")

    module.settings(
      libraryDependencies ++= Seq(
        "uk.gov.homeoffice" %% "rtp-io-lib" % "1.4.0-SNAPSHOT" withSources()
      ),
      libraryDependencies ++= Seq(
        "uk.gov.homeoffice" %% "rtp-test-lib" % "1.2.0-SNAPSHOT" % Test classifier "tests" withSources(),
        "uk.gov.homeoffice" %% "rtp-io-lib" % "1.4.0-SNAPSHOT" % Test classifier "tests" withSources()))
  }
}
