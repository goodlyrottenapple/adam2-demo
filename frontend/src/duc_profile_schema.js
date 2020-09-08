export const DUCProfileSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
      "DUCProfile": {
          "title": "DUC Profile",
          "type": "object",
          "properties": {
              "profileName": {
                  "type": "string",
                  "title": "profileName"
              },
              "profileVersion": {
                  "type": "string",
                  "title": "profileVersion"
              },
              "profileUpdatedOn": {
                  "type": "array",
                  "items": {
                      "type": "string",
                      "format": "date"
                  },
                  "title": "profileUpdatedOn"
              },
              "profileReferences": {
                  "type": "array",
                  "items": {
                      "type": "string"
                  },
                  "title": "profileReferences"
              },
              "resourceName": {
                  "type": "string",
                  "title": "resourceName"
              },
              "resourceDataLevel": {
                  "enum": [
                      "DATABASE",
                      "DATASET",
                      "METADATA",
                      "RECORD",
                      "RECORDFIELD",
                      "RECORDSET",
                      "SUMMARISED",
                      "UNKNOWN"
                  ],
                  "type": "string",
                  "title": "resourceDataLevel"
              },
              "resourceDescription": {
                  "type": "string",
                  "title": "resourceDescription"
              },
              "resourceContacts": {
                  "type": "array",
                  "items": {
                      "$ref": "#/definitions/ResourceContact"
                  },
                  "title": "resourceContacts"
              },
              "resourceOrganisations": {
                  "type": "array",
                  "items": {
                      "type": "string"
                  },
                  "title": "resourceOrganisations"
              },
              "sharingMode": {
                  "enum": [
                      "ACCESS",
                      "DISCOVERY",
                      "DISCOVERY_AND_ACCESS",
                      "UNKNOW"
                  ],
                  "type": "string",
                  "title": "sharingMode"
              },
              "permissionMode": {
                  "enum": [
                      "ALL_UNSTATED_TERMS_FORBIDDEN_BY_DEFAULT",
                      "ALL_UNSTATED_TERMS_PERMITTED_BY_DEFAULT",
                      "UNSPECIFIED"
                  ],
                  "type": "string",
                  "title": "permissionMode"
              },
              "terms": {
                  "type": "array",
                  "items": {
                      "$ref": "#/definitions/Term"
                  },
                  "title": "terms"
              }
          },
          "required": [
              "permissionMode",
              "profileName",
              "resourceDataLevel",
              "resourceName",
              "sharingMode",
              "terms"
          ]
      },
      "ResourceContact": {
          "title": "ResourceContact",
          "type": "object",
          "properties": {
              "name": {
                  "type": "string",
                  "title": "name"
              },
              "email": {
                  "type": "string",
                  "title": "email"
              }
          },
          "required": [
              "email",
              "name"
          ]
      },
      "Term": {
          "title": "Term",
          "type": "object",
          "properties": {
              "dataUseClassOntology": {
                  "type": "string",
                  "title": "dataUseClassOntology"
              },
              "dataUseClass": {
                  "type": "string",
                  "title": "dataUseClass"
              },
              "restrictionClass": {
                  "$ref": "#/definitions/RestrictionClass",
                  "title": "restrictionClass"
              },
              "childTerms": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/Term"
                },
                "title": "childTerms"
            }
          },
          "required": [
              "dataUseClass",
              "dataUseClassOntology",
              "restrictionClass"
          ]
      },
      "RestrictionClass": {
          "title": "RestrictionClass",
          "type": "object",
          "properties": {
              "restrictionRule": {
                  "enum": [
                      "CONSTRAINTS",
                      "FORBIDDEN",
                      "NO_CONSTRAINTS",
                      "UNKNOWN"
                  ],
                  "type": "string",
                  "title": "restrictionRule"
              },
              "restrictionObjectOntology": {
                  "type": "string",
                  "title": "restrictionObjectOntology"
              },
              "restrictionObject": {
                  "type": "string",
                  "title": "restrictionObject"
              },
              "constraintsDetails": {
                  "type": "string",
                  "title": "constraintsDetails"
              }
          },
          "required": [
              "restrictionObject",
              "restrictionObjectOntology",
              "restrictionRule"
          ]
      }
  },
  "$ref": "#/definitions/DUCProfile"
}

