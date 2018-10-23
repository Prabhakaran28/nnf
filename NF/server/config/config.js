var config = {};

config.dbconcfig = {};
config.rolesSQL = {};
config.modulesSQL = {};
config.usersSQL = {};
config.auth = {};
config.onBoard = {};
config.common = {};
config.seo = {};
config.product = {};
//DB Configuration
config.dbconcfig.host = 'localhost';
config.dbconcfig.user = 'neuralfront';
config.dbconcfig.password = 'neuralfront';
config.dbconcfig.database = 'system';

//Common SQL
config.common.GetMetaData = "CALL SYSSP_SEMD_METADATA_GET(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
//Roles SQL
//DB Configuration

config.rolesSQL.SaveRole = "CALL SYS_SERO_ROLE_SAVE(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.rolesSQL.AddRolePermissions = "CALL SYS_SERP_ROLEPERMISSIONS_ADD(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.rolesSQL.GetRolePermissions = "call SYS_SERP_ROLEPERMISSIONS_GET(?)";
config.rolesSQL.AddRoleUser = "CALL SYS_SERU_ROLEUSER_ADD(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.rolesSQL.GetRoleUsers = "call SYS_SERU_ROLEUSER_GET(?)";
config.rolesSQL.GetRole = 'call SYS_SERO_ROLE_GET(?)';
config.rolesSQL.GetRolesList = 'call SYS_SERO_ROLE_List()';
config.modulesSQL.GetModules = 'call SYS_SEMO_MODULE_SELECT()';
config.modulesSQL.database = 'system';

config.usersSQL.GetUsersList = "CALL SYS_SEUS_USER_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.GetUserRoles = "call SYS_SERU_USERROLE_GET(?)";
config.usersSQL.GetUser = 'call SYS_SEUS_USER_GET(?)';
config.usersSQL.SaveUser = "CALL SYSSP_SEUS_USER_SAVE(?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.resetPassword = "CALL SYSSP_SEUS_USER_RESETPASSWORD(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.SearchUsersList = "CALL SYS_SEUS_USER_SEARCH(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.DeleteUser = "CALL SYS_SEUS_USER_DELETE(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";

config.auth.emailTemplate = "call SYSSP_SEET_EMAIL_TEMPLATE_GET (?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";

config.auth.login = "call SYS_SERU_USER_AUTH (?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.auth.changePassword = "call SYS_SERU_USER_PWD_CHANGE (?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.auth.forgotPassword = "call SYS_SERU_VALIDATE_USER (?,@return_code,@return_message); select @return_code return_code,@return_message return_message";


config.auth.superSecret = '$2a$10$bE908V7zXrjqNFlJ4IG8me';
config.auth.passwordLength = "10";
config.auth.superKey

//config.onBoard.personalDetail ="INSERT INTO system.personaldetail (`FirstName`,`LastName`,`Email`,`Phone`,`StreetAddress`,`City`,`State`,`Country`,`Zip`,`PStreetAddress`,`PCity`,`PState`,`PCountry`,`PZip`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
config.onBoard.savepersonalDetail = "CALL hrms.HRMSP_EMPH_EMPLOYEE_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.saveaddressDetail = "CALL hrms.HRMSP_EMAD_ADDRESS_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.saveEducationDetails = "CALL hrms.HRMSP_EMED_EDUCATION_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.saveEmploymentDetails = "CALL hrms.HRMSP_EMEH_EMPHISTORY_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.searchEmployee = "CALL hrms.HRMSP_EMPH_EMPLOYEE_SEARCH(?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getPersonalDetails = "CALL hrms.HRMSP_EMPH_EMPLOYEE_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getAddressDetails = "CALL hrms.HRMSP_EMAD_ADDRESS_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getEducationDetails = "CALL hrms.HRMSP_EMED_EDUCATION_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getEmploymentDetails = "CALL hrms.HRMSP_EMEH_EMPHISTORY_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.currentRoleDetail = "INSERT INTO system.currentRoleDetail (`currentDesignation`,`department`,`shift`,`manager`,`salary`,`email`) VALUES (?,?,?,?,?,?)";
config.onBoard.saveAttachmentDetails = "CALL hrms.HRMSP_EMAT_ATTACHMENT_APPLY(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getAttachmentDetails = "CALL hrms.HRMSP_EMAT_ATTACHMENT_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.deleteAttachment = "CALL hrms.HRMSP_EMAT_ATTACHMENT_DELETE(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.UploadPath = './uploads/';
//Product Config
config.product.metaDataSQL = 'call SYS_SEMD_METADATA_SELECT()';
config.product.deleteMetaData = "CALL SYS_SEMD_METADATA_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.product.saveMetaDataDetails='CALL SYS_SEMD_METADATA_APPLY(?,?,?,?,?,?,?,?,?,@return_message); select @return_message return_message';

//SEO config
config.seo.backLinkPath = './backlinks/';
config.seo.saveBacklinkFile = "CALL seo.SEOSP_BLBF_BACKLINK_FILE_APPLY(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.searchBacklink = "CALL seo.SEOSP_BLBF_BACKLINK_FILE_SEARCH(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getBacklinkFile = "CALL seo.SEOSP_BLBF_BACKLINK_FILE_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getloadFiles  = "CALL seo.SEOSP_BACKLINK_LOADFILES_GET(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.updateFileStatus= "CALL seo.SEOSP_BACKLINK_LOADFILES_STATUS_APPLY(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.searchCreatedBacklink = "CALL seo.SEOSP_BLCR_CREATED_LINKS_SEARCH(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.searchVisibleBacklink = "CALL seo.SEOSP_BLVL_VISIBLE_LINKS_SEARCH(?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.processBacklink= "CALL seo.SEOSP_PROCESS_BACKLINK_FILES(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.batchStatus= "CALL seo.SEO_BLBS_BATCH_STATUS_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.searchBacklinkBatch = "CALL seo.SEO_BLBS_BATCH_STATUS_SEARCH(?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.searchICV = "CALL seo.SEOSP_BLIC_ICV_SEARCH(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getIcvDetails = "CALL seo.SEOSP_BLIC_ICV_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.saveIcvDetails = "CALL seo.SEOSP_BLIC_ICV_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getWebsites = "CALL seo.SEOSP_WEBSITES_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getBacklinkReportData= "CALL seo.SEOSP_BLRP_REPORTS(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getIcvReportData= "CALL seo.SEOSP_BLIC_REPORTS(?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getICVCount =  "CALL seo.SEOSP_BLIC_ICV_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.searchDisavow = "CALL seo.SEOSP_BLDV_DISAVOW_SEARCH(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getICVMetaData = "CALL seo.SEO_BLIC_ICV_GET_METADATA(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getDisavowReportData = "CALL seo.SEOSP_BLDV_REPORTS(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getMetadataFromTable = "CALL seo.SEOSP_METADATA_GET(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getCompareReportData = "CALL seo.SEO_BLRP_COMPARE_REPORT(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.searchWebsite = "CALL seo.SEOSP_BLWS_WEBSITE_SEARCH(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.getWebsiteDetails = "CALL seo.SEO_BLWS_WEBSITE_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.seo.saveWebsiteDetails = "CALL seo.SEOSP_BLWS_WEBSITE_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";

module.exports = config;