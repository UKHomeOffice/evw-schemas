import sbt.Keys._
import sbt._

val moduleName = "evw-schemas"

lazy val module = Project(id = moduleName, base = file("."))
  .enablePlugins(GitVersioning)
  .settings(
    name := moduleName,
    organization := "uk.gov.homeoffice",
    scalaVersion := "2.11.8",
    scalacOptions ++= Seq(
      "-feature",
      "-language:implicitConversions",
      "-language:higherKinds",
      "-language:existentials",
      "-language:reflectiveCalls",
      "-language:postfixOps",
      "-Yrangepos",
      "-Yrepl-sync"
    ),
    resolvers ++= Seq(
      "Artifactory Snapshot Realm" at "http://artifactory.registered-traveller.homeoffice.gov.uk/artifactory/libs-snapshot-local/",
      "Artifactory Release Realm" at "http://artifactory.registered-traveller.homeoffice.gov.uk/artifactory/libs-release-local/",
      "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
      "Sonatype Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/",
      "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"),
    libraryDependencies ++= Seq(
    "uk.gov.homeoffice" %% "rtp-test-lib" % "1.3.1" withSources(),
    "uk.gov.homeoffice" %% "rtp-io-lib" % "1.7.17" withSources()),
    libraryDependencies ++= Seq(
      "uk.gov.homeoffice" %% "rtp-test-lib" % "1.3.1" % Test classifier "tests" withSources(),
      "uk.gov.homeoffice" %% "rtp-io-lib" % "1.7.17" % Test classifier "tests" withSources())
  )

credentials += Credentials(Path.userHome / ".ivy2" / ".credentials")

publishTo := {
  val artifactory = sys.env.get("ARTIFACTORY_SERVER").getOrElse("http://artifactory.registered-traveller.homeoffice.gov.uk/")
  Some("release"  at artifactory + "artifactory/libs-release-local")
}

git.useGitDescribe := true
git.gitDescribePatterns := Seq("v?.?")
git.gitTagToVersionNumber := { tag :String =>

val branchTag = if (git.gitCurrentBranch.value == "master") "" else "-" + git.gitCurrentBranch.value

tag match {
  case v if v.matches("v\\d+.\\d+") => Some(s"$v.0".drop(1))
  case v if v.matches("v\\d+.\\d+-.*") => Some(s"${v.replaceFirst("-",".")}${branchTag}".drop(1))
  case _ => None
}}

