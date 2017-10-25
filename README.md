Electronic Visa Waiver Schemas
==============================

[![Build Status](https://travis-ci.org/UKHomeOffice/evw-schemas.svg?branch=master)](https://travis-ci.org/UKHomeOffice/evw-schemas)

JSON Schema files to allow validation of messages between Home Office systems for EVW

Introduction
------------
TODO

Note that even though this project is a Scala project, it is intended to be shared for its JSON schemas.

Publishing
----------
To publish the jar to artifactory you will need to 

1. Copy the .credentials file into your <home directory>/.ivy2/
2. Edit this .credentials file to fill in the artifactory user and password

> activator publish
