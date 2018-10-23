/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  /*api*/
  production: false,
  saveRole: "/api/saverole",
  saveUser: "/api/saveuser",
  getRoles: "/api/getroles",
  getRole: "/api/getRole",
  getUsers: "/api/getusers",
  getUser: "/api/getUser",
  getModules: "/api/modules",
  searchUsers: "/api/searchUsers",
  deleteUser: "/api/deleteUser",
  saveEmpPersonalDetails: "/api/savePersonalDetails",
  saveAddressDetails: "/api/saveAddressDetails",
  saveEducationDetails: "/api/saveEducationDetails",
  saveEmploymentDetails: "/api/saveEmploymentDetails",
  saveAttachmentDetails: "/api/saveAttachmentDetails",
  getAttachmentDetails: "/api/getAttachmentDetails",
  deleteAttachment: "/api/deleteAttachment",
  getAttachmentContent: "/api/getAttachmentContent",
  searchEmployee: "/api/searchEmployee",
  getPersonalDetails: "/api/getPersonalDetails",
  getAddressDetails: "/api/getAddressDetails",
  getEducationDetails: "/api/getEducationDetails",
  getEmploymentDetails: "/api/getEmploymentDetails",
  getMetaData: "/api/getMetaData",
  saveBacklinkBatch: "/api/saveBacklinkBatch",
  getBacklinkFile: "/api/getBacklinkFile",
  uploadBacklinks: "/api/uploadBacklinks",
  searchBacklink: "/api/searchBacklink",
  deleteBacklinkFile: "/api/deleteBacklinkFile",
  searchCreatedBacklink: "/api/searchCreatedBacklink",
  searchVisibleBacklink: "/api/searchVisibleBacklink",
  searchBacklinkBatch: "/api/searchBacklinkBatch",
  processFiles: "/api/processFiles",
  searchICV: "/api/searchICV",
  saveIcvDetails: "/api/saveIcvDetails",
  getIcvDetails: "/api/getIcvDetails",
  getWebsites: "/api/getWebsites",
  getBacklinkReportData: "/api/getBacklinkReportData",
  //getAttachmentContent: "api/getAttachmentContent",
  getIcvReportData: "/api/getIcvReportData",
  getICVCount: "/api/getICVCount",
  resetPassword: "/api/resetPassword",
  getMetaDataList: "/api/getMetaDataList",
  deleteMetaData: "/api/deletaMetaData",
  searchDisavow: "/api/searchDisavow",
  saveMetaDataDetails: "/api/saveMetaDataDetails",
  getICVMetaData: "api/getICVMetaData",
  getDisavowReportData: "api/getDisavowReportData",
  getMetadataFromTable: "api/getMetadataFromTable",
  getCompareReportData: "api/getCompareReportData",
  searchWebsite: "api/searchWebsite",
  getWebsiteDetails: "api/getWebsiteDetails",
  saveWebsiteDetails: "api/saveWebsiteDetails",
  
  /*Regex*/
  format: {
    email: /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
    noSpace: /^\S*$/,
    //date: //
  }
};

