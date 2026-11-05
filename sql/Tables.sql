/*==============================================================*/
/* Table : USER_                                                */
/*==============================================================*/
create table USER_ (
   ID                   T_CODE20             not null,
   NAME                 T_DESIGNATION        not null,
   EMAIL                T_DESIGNATION        not null,
   PSW_HASH             nvarchar(255)        null,
   LAST_CONNECT         T_DATE_TIME          null,
   constraint PK_UER_ primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Index : IDX_UQ_USER_EMAIL                                    */
/*==============================================================*/
create unique index IDX_UQ_USER_EMAIL on USER_ (
	EMAIL ASC
)
go

--insert into User_ (ID, NAME, EMAIL, PSW_HASH, LAST_CONNECT)
--select id, NAME, EMAIL, passwordHash, LASTCONNECTED from IMA_ERP_DEV.dbo.User_ with (nolock)

/*==============================================================*/
/* Table : SESSION                                              */
/*==============================================================*/
create table DBO.SESSION (
   ID                   varchar(64)          not null,
   SESSION_TOKEN        varchar(64)          not null,
   USER_ID              T_CODE20             not null,
   EXPIRES              T_DATE_TIME          not null,
   USER_AGENT           nvarchar(500)        null,
   IP_ADDRESS           nvarchar(45)         null,
   constraint PK_SESSION primary key (ID)
)
go

/*==============================================================*/
/* Index : IDX_UQ_SESSION_TOKEN                                 */
/*==============================================================*/
create unique index IDX_UQ_SESSION_TOKEN on DBO.SESSION (
	SESSION_TOKEN ASC
)
go

alter table DBO.SESSION
   add constraint FK_USER_SESSION foreign key (USER_ID)
      references USER_ (ID)
	  ON DELETE CASCADE
go

/*==============================================================*/
/* Table : ROLE                                                 */
/*==============================================================*/
create table ROLE (
   ID                   varchar(60)          not null,
   DESCRIPTION          T_MEMO               null,
   constraint PK_ROLE primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Table : USER_ROLE                                            */
/*==============================================================*/
create table USER_ROLE (
   ID                   int                  identity,
   USER_ID              T_CODE20             not null,
   ROLE_ID              varchar(60)          not null,
   constraint PK_UTIL_ROLE primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Index : IDX_USER_ROLE_USER_ID_ROLE_ID                        */
/*==============================================================*/
create unique index IDX_USER_ROLE_USER_ID_ROLE_ID on USER_ROLE (
   USER_ID ASC,
   ROLE_ID ASC
)
go

/*==============================================================*/
/* Index : IDX_USER_ROLE_USER_ID                                */
/*==============================================================*/
create index IDX_USER_ROLE_USER_ID on USER_ROLE (
   USER_ID ASC
)
go

/*==============================================================*/
/* Index : IDX_USER_ROLE_ROLE_ID                                */
/*==============================================================*/
create index IDX_USER_ROLE_ROLE_ID on USER_ROLE (
   ROLE_ID ASC
)
go

alter table USER_ROLE
   add constraint FK_ROLE_USER_ROLE foreign key (ROLE_ID)
      references ROLE (ID)
go

alter table USER_ROLE
   add constraint FK_USER_USER_ROLE foreign key (USER_ID)
      references USER_ (ID)
go

/*==============================================================*/
/* Table : PROFILE                                              */
/*==============================================================*/
create table PROFILE (
   ID                   varchar(60)          not null,
   DESCRIPTION          T_MEMO               null,
   constraint PK_PROFILE primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Table : USER_PROFILE                                         */
/*==============================================================*/
create table USER_PROFILE (
   ID                   int                  identity,
   USER_ID              T_CODE20             not null,
   PROFILE_ID           varchar(60)          not null,
   constraint PK_USER_PROFILE primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Index : IDX_USER_PROFILE_USER_ID_ROLE_ID                     */
/*==============================================================*/
create unique index IDX_USER_PROFILE_USER_ID_ROLE_ID on USER_PROFILE (
	USER_ID ASC,
	PROFILE_ID ASC
)
go

/*==============================================================*/
/* Index : IDX_USER_PROFILE_USER_ID                             */
/*==============================================================*/
create index IDX_USER_PROFILE_USER_ID on USER_PROFILE (
	USER_ID ASC
)
go

/*==============================================================*/
/* Index : IDX_USER_PROFILE_PROFILE_ID                          */
/*==============================================================*/
create index IDX_USER_PROFILE_PROFILE_ID on USER_PROFILE (
	PROFILE_ID ASC
)
go

alter table USER_PROFILE
   add constraint FK_PROFILE_USER_PROFILE foreign key (PROFILE_ID)
      references PROFILE (ID)
go

alter table USER_PROFILE
   add constraint FK_USER_USER_PROFILE foreign key (USER_ID)
      references USER_ (ID)
go

/*==============================================================*/
/* Table : USER_TABLE_PARAM                                     */
/*==============================================================*/
create table USER_TABLE_PARAM (
   ID                   int                  identity,
   USER_ID              T_CODE20             not null,
   TABLE_NAME           T_DESIGNATION        not null,
   TABLE_ID             varchar(64)          null,
   SORT                 varchar(max)         null,
   FILTER               varchar(max)         null,
   PAGE_SIZE            int                  null,
   PAGE_NUMBER          int                  null,
   constraint PK_USER_TABLE_PARAM primary key nonclustered (ID)
   constraint PK_USER_TABLE_PARAM primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Index : IDX_USER_TABLE_PARAM_USER_ID                         */
/*==============================================================*/
create index IDX_USER_TABLE_PARAM_USER_ID on USER_TABLE_PARAM (
	USER_ID ASC
)
go

/*==============================================================*/
/* Index : UTIL_PROG_PARAM__NOM_SCHEMA_NOM_PROG                 */
/*==============================================================*/
create unique index UTIL_PROG_PARAM__NOM_SCHEMA_NOM_PROG on USER_TABLE_PARAM (
	USER_ID ASC,
	TABLE_NAME ASC
)
go

alter table USER_TABLE_PARAM
   add constraint FK_USER_USER_TABLEL_PARAM foreign key (USER_ID)
      references USER_ (ID)
go

/*==============================================================*/
/* Table : USER_TABLE_FILTER                                    */
/*==============================================================*/
create table USER_TABLE_FILTER (
   ID                   int                  identity not null,
   USER_ID              T_CODE20             not null,
   TABLE_NAME           T_DESIGNATION        not null,
   FILTER_NAME          T_DESIGNATION        not null,
   TYPE                 T_CODE10             not null
      constraint CKC_USER_TABLE_FILTER_TYPE check (TYPE in ('GLOBAL', 'USER')),
   FILTER               varchar(max)         not null,
   constraint PK_USER_TABLE_FILTER primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Index : IDX_USER_TABLE_FILTER_UER_ID                         */
/*==============================================================*/
create index IDX_USER_TABLE_FILTER_USER_ID on USER_TABLE_FILTER (
	USER_ID ASC
)
go

/*==============================================================*/
/* Index : UTIL_PROG_FILTRE_NOM_FILTRE                          */
/*==============================================================*/
create unique index UTIL_PROG_FILTRE_UER_ID_TABLE_NAME_FILTER_NAME on USER_TABLE_FILTER (
	USER_ID ASC,
	TABLE_NAME ASC,
	FILTER_NAME ASC
)
go

alter table USER_TABLE_FILTER
   add constraint FK_USER_USER_TABLEL_FILTER foreign key (USER_ID)
      references USER_ (ID)
go

CREATE TABLE [dbo].[UNITE] (
	[CODE] [dbo].[T_CODE10] NOT NULL,
	[DESIGNATION] [dbo].[T_DESIGNATION] NOT NULL,
	CONSTRAINT [PK_UNITE] PRIMARY KEY CLUSTERED (
		[CODE] ASC
	)
)
GO

--insert into UNITE select * from IMA_ERP_DEV.dbo.UNITE with (nolock)

CREATE TABLE [dbo].[UNITE_CONVERSION](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UNITE_SOURCE] [dbo].[T_CODE10] NOT NULL,
	[UNITE_DESTINATION] [dbo].[T_CODE10] NOT NULL,
	[COEFF] [numeric](10, 6) NOT NULL,
	CONSTRAINT [PK_UNITE_CONVERSION_NEW] PRIMARY KEY CLUSTERED (
		[id] ASC
	)
)
GO

--insert into UNITE_CONVERSION select * from IMA_ERP_DEV.dbo.UNITE_CONVERSION with (nolock)

CREATE UNIQUE NONCLUSTERED INDEX [IDX_UNITE_CONVERSION_UNITE_SOURCE_UNITE_DESTINATION] ON [dbo].[UNITE_CONVERSION] (
	[UNITE_SOURCE] ASC,
	[UNITE_DESTINATION] ASC
)
GO

ALTER TABLE [dbo].[UNITE_CONVERSION]  WITH CHECK ADD CONSTRAINT [FK_Unite_Conversion_Unite_Destination] FOREIGN KEY([UNITE_DESTINATION])
REFERENCES [dbo].[UNITE] ([CODE])
GO

ALTER TABLE [dbo].[UNITE_CONVERSION]  WITH CHECK ADD CONSTRAINT [FK_Unite_Conversion_Unite_Source] FOREIGN KEY([UNITE_SOURCE])
REFERENCES [dbo].[UNITE] ([CODE])
GO

/*==============================================================*/
/* Table : CLIENT_DECHET                                        */
/*==============================================================*/
create table CLIENT_DECHET (
   CODE                 T_CODE15             not null,
   RAISON_SOCIALE       T_DESIGNATION        not null,
   SOLDE_DECHET         T_MONTANT            not null,
   constraint PK_CLIENT_DECHET primary key (CODE)
)
go

/*==============================================================*/
/* Index : IDX_CLIENT_ECH_RAISON_SOCIALE                        */
/*==============================================================*/
create index IDX_CLIENT_ECH_RAISON_SOCIALE on CLIENT_DECHET (
RAISON_SOCIALE ASC
)
go

insert into CLIENT_DECHET select * from IMA_ERP.dbo.CLIENT_DECHET with (nolock)
go


/*==============================================================*/
/* Table : ARTICLE                                              */
/*==============================================================*/
create table ARTICLE (
   CODE                 T_CODE20             not null,
   DESIGNATION          varchar(60)         not null,
   UNITE_STK            T_CODE10             not null,
   NATURE               T_CODE10             not null,
   constraint PK_ARTICLE primary key (CODE)
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_ARTICLE_ARTICLE_CODE                      */
/*==============================================================*/
create index IDX_ARTICLE_NATURE on ARTICLE (
NATURE ASC
)

insert into dbo.ARTICLE
select * from IMA_ERP.x3.ARTICLE with (nolock)
where nature = 'DECHET'

/*==============================================================*/
/* Table : PESEE                                                */
/*==============================================================*/
create table PESEE (
   NUMERO_1             T_CODE10             not null,
   DATE_1               T_DATE_TIME          not null,
   HEURE_1              char(5)              not null,
   NUMERO_2             T_CODE10             not null,
   DATE_2               T_DATE_TIME          not null,
   HEURE_2              char(5)              not null,
   CLIENT_RAISON_SOCIALE T_DESIGNATION        null,
   FRS_RAISON_SOCIALE   T_DESIGNATION        null,
   ARTICLE_DESIGNATION  T_DESIGNATION        not null,
   IMMATRICULATION      T_CODE15             not null,
   POIDS_BRUT           T_QUANTITE           not null
      constraint CKC_PESEE_POIDS_BRUT check (POIDS_BRUT >= 0),
   TARE                 T_QUANTITE           not null
      constraint CKC_PESEE_TARE check (TARE >= 0),
   POIDS_NET  AS (CONVERT(numeric(10),POIDS_BRUT-TARE)),
   SENS                 T_CODE15             not null,
   constraint PK_PESEE primary key (NUMERO_1)
)
go

/*==============================================================*/
/* Index : IDX_PESEE_DATE_1                                     */
/*==============================================================*/
create index IDX_PESEE_DATE_1 on PESEE (
	DATE_1 ASC
)
go

/*==============================================================*/
/* Index : IDX_PESEE_DATE_2                                     */
/*==============================================================*/
create index IDX_PESEE_DATE_2 on PESEE (
	DATE_2 ASC
)
go

/*==============================================================*/
/* Table : SORTIE_DECHET                                        */
/*==============================================================*/
create table SORTIE_DECHET (
   NUMERO               int                  identity,
   CLIENT_CODE          T_CODE15             not null,
   CLIENT_RAISON_SOCIALE T_DESIGNATION        not null,
   DATE_PIECE           T_DATE_TIME          not null,
   MONTANT              T_MONTANT            not null,
   MONTANT_REGLE        T_MONTANT            not null,
   VALIDE               T_OUI_NON            not null,
   CONTROLE             T_OUI_NON            not null,
   constraint PK_SORTIE_DECHET primary key (NUMERO),
   constraint CHK_SORTIE_DECHET_MONTANT_MONTANT_REGLE check (MONTANT_REGLE <= MONTANT)
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_DECHET_CLIENT_CODE                        */
/*==============================================================*/
create index IDX_SORTIE_DECHET_CLIENT_CODE on SORTIE_DECHET (
	CLIENT_CODE ASC
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_DECHET_DATE_PIECE                         */
/*==============================================================*/
create index IDX_SORTIE_DECHET_DATE_PIECE on SORTIE_DECHET (
	DATE_PIECE ASC
)
go

alter table SORTIE_DECHET
   add constraint FK_CLIENT_DECHET_SORTIE_DECHET foreign key (CLIENT_CODE)
      references CLIENT_DECHET (CODE)
go

SET IDENTITY_INSERT SORTIE_DECHET ON;
insert into SORTIE_DECHET (NUMERO, CLIENT_CODE, CLIENT_RAISON_SOCIALE, DATE_PIECE, MONTANT, MONTANT_REGLE, VALIDE, CONTROLE)
select NUMERO, CLIENT_CODE, CLIENT_RAISON_SOCIALE, DATE_PIECE, MONTANT, MONTANT_REGLE, VALIDE, CONTROLE from IMA_ERP.dbo.SORTIE_DECHET with (nolock);
SET IDENTITY_INSERT SORTIE_DECHET OFF;

/*==============================================================*/
/* Table : SORTIE_DECHET_LIGNE                                  */
/*==============================================================*/
create table SORTIE_DECHET_LIGNE (
   ID                   int                  identity,
   SORTIE_DECHET_NUMERO int             not null,
   LIGNE_NUMERO         T_NUMERO             not null,
   ARTICLE_CODE         T_CODE20             not null,
   ARTICLE_DESIGNATION  T_DESIGNATION        not null,
   QUANTITE             T_QUANTITE           not null
      constraint CKC_SORTIE_DECHET_LIGNE_QUANTITE check (QUANTITE >= 0),
   UNITE                T_CODE10             not null,
   PRIX_VENTE           T_MONTANT            not null
      constraint CKC_SORTIE_DECHET_LIGNE_PRIX_VENTE check (PRIX_VENTE >= 0),
   MONTANT              T_MONTANT            not null,
   constraint PK_SORTIE_DECHET_LIGNE primary key (ID),
   PESEE_NUMERO         T_CODE10             null
)
go

/*===================================================================*/
/* Index : IDX_SORTIE_DECHET_LIGNE_SORTIE_DECHET_NUMERO_LIGNE_NUMERO */
/*===================================================================*/
create unique index IDX_SORTIE_DECHET_LIGNE_SORTIE_DECHET_NUMERO_LIGNE_NUMERO on SORTIE_DECHET_LIGNE (
SORTIE_DECHET_NUMERO ASC,
   LIGNE_NUMERO ASC
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_DECHET_LIGNE_SORTIE_DECHET_NUMERO         */
/*==============================================================*/
create index IDX_SORTIE_DECHET_LIGNE_SORTIE_DECHET_NUMERO on SORTIE_DECHET_LIGNE (
   SORTIE_DECHET_NUMERO ASC
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_DECHET_LIGNE_ARTICLE_CODE                 */
/*==============================================================*/
create index IDX_SORTIE_DECHET_LIGNE_ARTICLE_CODE on SORTIE_DECHET_LIGNE (
   ARTICLE_CODE ASC
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_DECHET_LIGNE_PESEE_NUMERO                 */
/*==============================================================*/
create index IDX_SORTIE_DECHET_LIGNE_PESEE_NUMERO on SORTIE_DECHET_LIGNE (
   PESEE_NUMERO ASC
)
go

alter table SORTIE_DECHET_LIGNE
   add constraint FK_SORTIE_DECHET_SORTIE_DECHET_LIGNE foreign key (SORTIE_DECHET_NUMERO)
      references SORTIE_DECHET (NUMERO)
go

alter table SORTIE_DECHET_LIGNE
   add constraint FK_ARTICLE_SORTIE_DECHET_LIGNE foreign key (ARTICLE_CODE)
      references ARTICLE (CODE)
go

alter table SORTIE_DECHET_LIGNE
   add constraint FK_UNITE_SORTIE_DECHET_LIGNE foreign key (UNITE)
      references DBO.UNITE (CODE)
go

alter table SORTIE_DECHET_LIGNE
   add constraint PK_PESEE_SORTIE_DECHET_LIGNE foreign key (PESEE_NUMERO)
      references PESEE (NUMERO_1)
go

insert into SORTIE_DECHET_LIGNE (SORTIE_DECHET_NUMERO, LIGNE_NUMERO, ARTICLE_CODE, ARTICLE_DESIGNATION, QUANTITE, UNITE, PRIX_VENTE, MONTANT, PESEE_NUMERO)
select SORTIE_DECHET_NUMERO, LIGNE_NUMERO, ARTICLE_CODE, ARTICLE_DESIGNATION, QUANTITE, UNITE, PRIX_VENTE, MONTANT, PESEE_NUMERO from IMA_ERP.dbo.SORTIE_DECHET_LIGNE with (nolock)
go

/*==============================================================*/
/* Table : SORTIE_DECHET_DETAIL                                 */
/*==============================================================*/
create table SORTIE_DECHET_DETAIL (
   ID                   int                  identity,
   SORTIE_DECHET_NUMERO int                  not null,
   LIGNE_NUMERO         T_NUMERO             not null,
   ARTICLE_CODE         T_CODE20             not null,
   ARTICLE_DESIGNATION  T_DESIGNATION        not null,
   POIDS                T_QUANTITE           not null
      constraint CKC_SORTIE_DECHET_DETAIL_POIDS check (POIDS >= 0),
   ML                   T_QUANTITE           not null
      constraint CKC_SORTIE_DECHET_DETAIL_ML check (ML >= 0),
   PRIX_VENTE           T_MONTANT            not null
      constraint CKC_SORTIE_DECHET_DETAIL_PRIX_VENTE check (PRIX_VENTE >= 0),
   MONTANT              T_MONTANT            not null,
   constraint PK_SORTIE_DECHET_DETAIL primary key (ID)
)
go

/*===================================================================*/
/* Index : IDX_SORTIE_DECHET_DETAIL_SORTIE_DECHET_NUMRO_LIGNE_NUMERO */
/*===================================================================*/
create unique index IDX_SORTIE_DECHET_DETAIL_SORTIE_DECHET_NUMRO_LIGNE_NUMERO on SORTIE_DECHET_DETAIL (
	SORTIE_DECHET_NUMERO ASC,
	LIGNE_NUMERO ASC
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_DECHET_DETAIL_SORTIE_DECHET_NUMERO        */
/*==============================================================*/
create index IDX_SORTIE_DECHET_DETAIL_SORTIE_DECHET_NUMERO on SORTIE_DECHET_DETAIL (
	SORTIE_DECHET_NUMERO ASC
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_DECHET_DETAIL_ARTICLE_CODE                */
/*==============================================================*/
create index IDX_SORTIE_DECHET_DETAIL_ARTICLE_CODE on SORTIE_DECHET_DETAIL (
	ARTICLE_CODE ASC
)
go

alter table SORTIE_DECHET_DETAIL
   add constraint FK_ARTICLE_SORTIE_DECHET_DETAIL foreign key (ARTICLE_CODE)
      references ARTICLE (CODE)
go

alter table SORTIE_DECHET_DETAIL
   add constraint FK_SORTIE_D_REFERENCE_SORTIE_D foreign key (SORTIE_DECHET_NUMERO)
      references SORTIE_DECHET (NUMERO)
go

insert into ARTICLE (CODE, DESIGNATION, UNITE_STK, NATURE)
select CODE, DESIGNATION, UNITE_STK, NATURE
from IMA_ERP.dbo.ARTICLE_X3 A with (nolock)
where exists(select ARTICLE_CODE
             from IMA_ERP.dbo.SORTIE_DECHET_DETAIL SDD with (nolock)
             where A.CODE = SDD.ARTICLE_CODE)

insert into SORTIE_DECHET_DETAIL (SORTIE_DECHET_NUMERO, LIGNE_NUMERO, ARTICLE_CODE, ARTICLE_DESIGNATION, POIDS, ML, PRIX_VENTE, MONTANT)
select SORTIE_DECHET_NUMERO, LIGNE_NUMERO, ARTICLE_CODE, ARTICLE_DESIGNATION, POIDS, ML, PRIX_VENTE, MONTANT from IMA_ERP.dbo.SORTIE_DECHET_DETAIL with (nolock)
go

/*==============================================================*/
/* Table : RETOUR_DECHET                                        */
/*==============================================================*/
create table RETOUR_DECHET (
   NUMERO               int                  identity,
   CLIENT_CODE          T_CODE15             not null,
   CLIENT_RAISON_SOCIALE T_DESIGNATION        not null,
   DATE_PIECE           T_DATE_TIME          not null,
   MONTANT              T_MONTANT            not null,
   MONTANT_REGLE        T_MONTANT            not null,
   DATE_SORTIE          T_DATE_TIME          not null,
   VALIDE               T_OUI_NON            not null,
   CONTROLE             T_OUI_NON            not null,
   constraint PK_RETOUR_DECHET primary key (NUMERO),
   constraint CHK_RETOUR_DECHET_MONTANT_MONTANT_REGLE check (MONTANT_REGLE <= MONTANT)
)
go

/*==============================================================*/
/* Index : IDX_RETOUR_DECHET_CLIENT_CODE                        */
/*==============================================================*/
create index IDX_RETOUR_DECHET_CLIENT_CODE on RETOUR_DECHET (
	CLIENT_CODE ASC
)
go

/*==============================================================*/
/* Index : IDX_RETOUR_DECHET_DATE_PIECE                         */
/*==============================================================*/
create index IDX_RETOUR_DECHET_DATE_PIECE on RETOUR_DECHET (
	DATE_PIECE ASC
)
go

alter table RETOUR_DECHET
   add constraint FK_CLIENT_DECHET_RETOUR_DECHET foreign key (CLIENT_CODE)
      references CLIENT_DECHET (CODE)
go

SET IDENTITY_INSERT RETOUR_DECHET ON;
insert into RETOUR_DECHET (NUMERO, CLIENT_CODE, CLIENT_RAISON_SOCIALE, DATE_PIECE, MONTANT, MONTANT_REGLE, VALIDE, CONTROLE)
select NUMERO, CLIENT_CODE, CLIENT_RAISON_SOCIALE, DATE_PIECE, MONTANT, MONTANT_REGLE, VALIDE, CONTROLE from IMA_ERP.dbo.RETOUR_DECHET with (nolock);
SET IDENTITY_INSERT RETOUR_DECHET OFF;

/*==============================================================*/
/* Table : RETOUR_DECHET_LIGNE                                  */
/*==============================================================*/
create table RETOUR_DECHET_LIGNE (
   ID                   int                  identity,
   RETOUR_DECHET_NUMERO T_NUMERO             not null,
   LIGNE_NUMERO         T_NUMERO             not null,
   ARTICLE_CODE         T_CODE20             not null,
   ARTICLE_DESIGNATION  T_DESIGNATION        not null,
   QUANTITE             T_QUANTITE           not null
      constraint CKC_RETOUR_DECHET_LIGNE_QUANTITE check (QUANTITE >= 0),
   UNITE                T_CODE10             not null,
   PRIX_VENTE           T_MONTANT            not null
      constraint CKC_RETOUR_DECHET_LIGNE_PRIX_VENTE check (PRIX_VENTE >= 0),
   MONTANT              T_MONTANT            not null,
   constraint PK_RETOUR_DECHET_LIGNE primary key (ID)
)
go

/*==============================================================*/
/* Index : IDX_RETOUR_DECHET_LIGNE_RETOUR_DECHET_NUMERO         */
/*==============================================================*/
create index IDX_RETOUR_DECHET_LIGNE_RETOUR_DECHET_NUMERO on RETOUR_DECHET_LIGNE (
	RETOUR_DECHET_NUMERO ASC
)
go

/*==============================================================*/
/* Index : IDX_RETOUR_DECHET_LIGNE_ARTICLE_CODE                 */
/*==============================================================*/
create index IDX_RETOUR_DECHET_LIGNE_ARTICLE_CODE on RETOUR_DECHET_LIGNE (
	ARTICLE_CODE ASC
)
go

/*==============================================================*/
/* Index : IDX_RETOUR_DECHET_LIGNE_UNITE                        */
/*==============================================================*/
create index IDX_RETOUR_DECHET_LIGNE_UNITE on RETOUR_DECHET_LIGNE (
	UNITE ASC
)
go

/*===================================================================*/
/* Index : IDX_RETOUR_DECHET_LIGNE_RETOUR_DECHET_NUMERO_LIGNE_NUMERO */
/*===================================================================*/
create unique index IDX_RETOUR_DECHET_LIGNE_RETOUR_DECHET_NUMERO_LIGNE_NUMERO on RETOUR_DECHET_LIGNE (
	RETOUR_DECHET_NUMERO ASC,
	LIGNE_NUMERO ASC
)
go

alter table RETOUR_DECHET_LIGNE
   add constraint FK_RETOUR_D_FK_ARTICL_ARTICLE foreign key (ARTICLE_CODE)
      references ARTICLE (CODE)
go

alter table RETOUR_DECHET_LIGNE
   add constraint FK_RETOUR_DECHET_RETOUR_DECHET_LIGNE foreign key (RETOUR_DECHET_NUMERO)
      references RETOUR_DECHET (NUMERO)
go

alter table RETOUR_DECHET_LIGNE
   add constraint FK_UNITE_RETOUR_DECHET_LIGNE foreign key (UNITE)
      references DBO.UNITE (CODE)
go

insert into RETOUR_DECHET_LIGNE (RETOUR_DECHET_NUMERO, LIGNE_NUMERO, ARTICLE_CODE, ARTICLE_DESIGNATION, QUANTITE, UNITE, PRIX_VENTE, MONTANT)
select RETOUR_DECHET_NUMERO, LIGNE_NUMERO, ARTICLE_CODE, ARTICLE_DESIGNATION, QUANTITE, UNITE, PRIX_VENTE, MONTANT from IMA_ERP.dbo.RETOUR_DECHET_LIGNE with (nolock)
go

/*==============================================================*/
/* Table : LOG                                                  */
/*==============================================================*/
create table LOG (
   ID                   int                  identity,
   DATE_OPER            T_DATE_TIME          not null,
   USER_ID              T_CODE20             null,
   SEVERITE             T_CODE10             null,
   MESSAGE              varchar(max)         not null,
   CONTEXTE             varchar(max)         null,
   constraint PK_LOG primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Index : IDX_LOG_DATE_OPER                                    */
/*==============================================================*/
create index IDX_LOG_DATE_OPER on LOG (
	DATE_OPER ASC
)
go

/*==============================================================*/
/* Index : IDX_LOG_USER_ID                                      */
/*==============================================================*/
create index IDX_LOG_USER_ID on LOG (
	USER_ID ASC
)
go

/*==============================================================*/
/* Table : PARAMETRE                                            */
/*==============================================================*/
create table PARAMETRE (
   RUBRIQUE             T_CODE10             not null,
   DESIGNATION          T_DESIGNATION        null,
   constraint PK_PARAMETRE primary key nonclustered (RUBRIQUE)
)
go

insert into parametre (rubrique) select * from IMA_ERP.dbo.TBL with (nolock)

/*==============================================================*/
/* Table : PARAMETRE_LIGNE                                      */
/*==============================================================*/
create table PARAMETRE_LIGNE (
   ID                   int                  identity,
   PARAMETRE_RUBRIQUE   T_CODE10             not null,
   CODE                 T_CODE10             not null,
   DESIGNATION          T_DESIGNATION        null,
   constraint PK_PARAMETRE_LIGNE primary key nonclustered (ID)
)
go

/*==============================================================*/
/* Index : IDX_PARAMETRE_LIGNE_PARAMETRE_RUBRIQUE_CODE          */
/*==============================================================*/
create unique index IDX_PARAMETRE_LIGNE_PARAMETRE_RUBRIQUE_CODE on PARAMETRE_LIGNE (
PARAMETRE_RUBRIQUE ASC,
CODE ASC
)
go

/*==============================================================*/
/* Index : IDX_PARAMETRE_LIGNE__RUBRIQUE                        */
/*==============================================================*/
create index IDX_PARAMETRE_LIGNE__RUBRIQUE on PARAMETRE_LIGNE (
PARAMETRE_RUBRIQUE ASC
)
go

/*==============================================================*/
/* Index : IDX_PARAMETRE_LIGNE__CODE                            */
/*==============================================================*/
create index IDX_PARAMETRE_LIGNE__CODE on PARAMETRE_LIGNE (
CODE ASC
)
go

alter table PARAMETRE_LIGNE
   add constraint FK_PARAMETRE_PARAMETRE_LIGNE foreign key (PARAMETRE_RUBRIQUE)
      references PARAMETRE (RUBRIQUE)
go

insert into PARAMETRE_LIGNE (PARAMETRE_RUBRIQUE, CODE, DESIGNATION) select * from IMA_ERP.dbo.L_TBL with (nolock)

/*==============================================================*/
/* Table : ARTICLE_DECHET_COEFF                                 */
/*==============================================================*/
create table ARTICLE_DECHET_COEFF (
   ARTICLE_CODE         T_CODE20             not null,
   COEFF                T_POURCENTAGE        not null
   constraint CKC_ARTICLE_DECHET_COEFF check (COEFF > 0),
   constraint PK_ARTICLE_DECHET_COEFF primary key (ARTICLE_CODE)
)
go

/*==============================================================*/
/* Index : IDX_ARTICLE_DECHET_COEFF_ARTICLE_CODE                */
/*==============================================================*/
create index IDX_ARTICLE_DECHET_COEFF_ARTICLE_CODE on ARTICLE_DECHET_COEFF (
	ARTICLE_CODE ASC
)
go

alter table ARTICLE_DECHET_COEFF
   add constraint FK_ARTICLE_ARTICLE_DECHET_COEFF foreign key (ARTICLE_CODE)
      references ARTICLE (CODE)
go

insert into ARTICLE_DECHET_COEFF select * from IMA_ERP.dbo.ARTICLE_DECHET_COEFF with (nolock)

/*==============================================================*/
/* Table : PERIODE                                              */
/*==============================================================*/
create table PERIODE (
   CODE                 T_CODE10             not null,
   DATE_DEB             T_DATE_TIME          not null,
   DATE_FIN             T_DATE_TIME          not null,
   constraint PK_PERIODE primary key nonclustered (CODE)
)
go

insert into PERIODE select * from IMA_ERP.dbo.PARAM with (nolock)

/*==============================================================*/
/* Table : REGLEMENT_DECHET                                     */
/*==============================================================*/
create table REGLEMENT_DECHET (
   NUMERO               int                  identity,
   DATE_PIECE           T_DATE_TIME          not null,
   CLIENT_CODE          T_CODE15             not null,
   CLIENT_RAISON_SOCIALE T_DESIGNATION        not null,
   MONTANT              T_MONTANT            not null,
   MONTANT_REGLE        T_MONTANT            not null,
   MONTANT_VERSE        T_MONTANT            not null,
   VALIDE               T_OUI_NON            not null,
   constraint PK_REGLEMENT_DECHET primary key (NUMERO),
   constraint CHK_REGLEMENT_DECHET_MONTANT_MONTANT_REGLE check (MONTANT_REGLE <= MONTANT),
   constraint CHK_REGLEMENT_DECHET_MONTANT_VERSE_MONTANT_REGLE check (MONTANT_VERSE <= MONTANT_REGLE )
)
go

/*==============================================================*/
/* Index : IDX_REGLEMENT_DECHET_DATE_PIECE                      */
/*==============================================================*/
create index IDX_REGLEMENT_DECHET_DATE_PIECE on REGLEMENT_DECHET (
	DATE_PIECE ASC
)
go

/*==============================================================*/
/* Index : IDX_REGLEMENT_DECHET_CLIENT_CODE                     */
/*==============================================================*/
create index IDX_REGLEMENT_DECHET_CLIENT_CODE on REGLEMENT_DECHET (
	CLIENT_CODE ASC
)
go

alter table REGLEMENT_DECHET
   add constraint FK_CLIENT_DECHET_REGLEMENT_DECHET foreign key (CLIENT_CODE)
      references CLIENT_DECHET (CODE)
go

SET IDENTITY_INSERT REGLEMENT_DECHET ON;
insert into REGLEMENT_DECHET (NUMERO, CLIENT_CODE, CLIENT_RAISON_SOCIALE, DATE_PIECE, MONTANT, MONTANT_REGLE, MONTANT_VERSE, VALIDE)
select NUMERO, CLIENT_CODE, CLIENT_RAISON_SOCIALE, DATE_PIECE, MONTANT, MONTANT_REGLE, 0, VALIDE from IMA_ERP.dbo.REGLEMENT_DECHET with (nolock);
SET IDENTITY_INSERT REGLEMENT_DECHET OFF;

/*==============================================================*/
/* Table : REGLEMENT_DECHET_LIGNE                               */
/*==============================================================*/
create table REGLEMENT_DECHET_LIGNE (
   ID                   int                  identity,
   REGLEMENT_DECHET_NUMERO T_NUMERO             not null,
   SORTIE_DECHET_NUMERO T_NUMERO             not null,
   MONTANT              T_MONTANT            not null,
   constraint PK_REGLEMENT_DECHET_LIGNE primary key (ID)
)
go

/*==============================================================*/
/* Index : IDX_REGLEMENT_DECHET_LIGNE_REGLEMENT_DECHET_NUMERO   */
/*==============================================================*/
create index IDX_REGLEMENT_DECHET_LIGNE_REGLEMENT_DECHET_NUMERO on REGLEMENT_DECHET_LIGNE (
	REGLEMENT_DECHET_NUMERO ASC
)
go

/*==============================================================*/
/* Index : IDX_REGLEMENT_DECHET_LIGNE_SORTIE_DECHET_NUMERO      */
/*==============================================================*/
create index IDX_REGLEMENT_DECHET_LIGNE_SORTIE_DECHET_NUMERO on REGLEMENT_DECHET_LIGNE (
	SORTIE_DECHET_NUMERO ASC
)
go

/*===========================================================================*/
/* Index : IDX_REGLEMENT_DECHET_REGLEMENT_DECHET_NUMERO_SORTIE_DECHET_NUMERO */
/*===========================================================================*/
create unique index IDX_REGLEMENT_DECHET_REGLEMENT_DECHET_NUMERO_SORTIE_DECHET_NUMERO on REGLEMENT_DECHET_LIGNE (
	REGLEMENT_DECHET_NUMERO ASC,
	SORTIE_DECHET_NUMERO ASC
)
go

alter table REGLEMENT_DECHET_LIGNE
   add constraint FK_REGLEMENT_DECHET_REGLEMENT_DECHET_LIGNE foreign key (REGLEMENT_DECHET_NUMERO)
      references REGLEMENT_DECHET (NUMERO)
go

alter table REGLEMENT_DECHET_LIGNE
   add constraint FK_SORTIE_DECHET_REGLEMENT_DECHET_LIGNE foreign key (SORTIE_DECHET_NUMERO)
      references SORTIE_DECHET (NUMERO)
go

insert into REGLEMENT_DECHET_LIGNE (REGLEMENT_DECHET_NUMERO, SORTIE_DECHET_NUMERO, MONTANT)
select REGLEMENT_DECHET_NUMERO, SORTIE_DECHET_NUMERO, MONTANT from IMA_ERP.dbo.REGLEMENT_DECHET_LIGNE RDL with (nolock)
where exists(select NUMERO from SORTIE_DECHET SD with (nolock) where SD.NUMERO = RDL.SORTIE_DECHET_NUMERO)
go


/*==============================================================*/
/* Table : VERSEMENT_DECHET                                     */
/*==============================================================*/
create table VERSEMENT_DECHET (
   NUMERO               int                  identity,
   DATE_PIECE           T_DATE_TIME          not null,
   VALIDE               T_OUI_NON            not null,
   constraint PK_VERSEMENT_DECHET primary key (NUMERO)
)
go

/*==============================================================*/
/* Index : IDX_SORTIE_DECHET_DATE_PIECE                         */
/*==============================================================*/
create index IDX_SORTIE_DECHET_DATE_PIECE on VERSEMENT_DECHET (
	DATE_PIECE ASC
)
go

SET IDENTITY_INSERT VERSEMENT_DECHET ON;
insert into VERSEMENT_DECHET (NUMERO, DATE_PIECE, VALIDE)
select NUMERO, DATE_PIECE, VALIDE from IMA_ERP.dbo.VERSEMENT_DECHET with (nolock);
SET IDENTITY_INSERT VERSEMENT_DECHET OFF;

/*==============================================================*/
/* Table : VERSEMENT_DECHET_LIGNE                               */
/*==============================================================*/
create table VERSEMENT_DECHET_LIGNE (
   ID                   int                  identity,
   VERSEMENT_DECHET_NUMERO int                  not null,
   REGLEMENT_DECHET_NUMERO int                  not null,
   MONTANT              T_MONTANT            not null,
   constraint PK_VERSEMENT_DECHET_LIGNE primary key (ID)
)
go

/*====================================================================================*/
/* Index : IDX_VERSEMENT_DECHET_LIGNE_VERSEMENT_DECHET_NUMERO_REGLEMENT_DECHET_NUMERO */
/*====================================================================================*/
create unique index IDX_VERSEMENT_DECHET_LIGNE_VERSEMENT_DECHET_NUMERO_REGLEMENT_DECHET_NUMERO on VERSEMENT_DECHET_LIGNE (
	VERSEMENT_DECHET_NUMERO ASC,
	REGLEMENT_DECHET_NUMERO ASC
)
go

/*==============================================================*/
/* Index : IDX_VERSEMENT_DECHET_LIGNE_VERSEMENT_DECHET_NUMERO   */
/*==============================================================*/
create index IDX_VERSEMENT_DECHET_LIGNE_VERSEMENT_DECHET_NUMERO on VERSEMENT_DECHET_LIGNE (
	VERSEMENT_DECHET_NUMERO ASC
)
go

/*==============================================================*/
/* Index : IDX_VERSEMENT_DECHET_LIGNE_REGLEMENT_DECHET_NUMERO   */
/*==============================================================*/
create index IDX_VERSEMENT_DECHET_LIGNE_REGLEMENT_DECHET_NUMERO on VERSEMENT_DECHET_LIGNE (
	REGLEMENT_DECHET_NUMERO ASC
)
go

alter table VERSEMENT_DECHET_LIGNE
   add constraint FK_REGLEMENT_DECHET_VERSEMENT_DECHET_LIGNE foreign key (REGLEMENT_DECHET_NUMERO)
      references REGLEMENT_DECHET (NUMERO)
go

alter table VERSEMENT_DECHET_LIGNE
   add constraint FK_VERSEMENT_DECHET_VERSEMENT_DECHET_LIGNE foreign key (VERSEMENT_DECHET_NUMERO)
      references VERSEMENT_DECHET (NUMERO)
go

insert into VERSEMENT_DECHET_LIGNE (VERSEMENT_DECHET_NUMERO, REGLEMENT_DECHET_NUMERO, MONTANT)
select VERSEMENT_DECHET_NUMERO, REGLEMENT_DECHET_NUMERO, MONTANT from IMA_ERP.dbo.VERSEMENT_DECHET_LIGNE VDL with (nolock)
go

/*==============================================================*/
/* Table : CLIENT_DECHET_SLD_INI                                */
/*==============================================================*/
create table CLIENT_DECHET_SLD_INI (
   ID                   int                  identity,
   CLIENT_CODE          T_CODE15             not null,
   ARTICLE_CODE         T_CODE20             not null,
   DATE_DEBUT           T_DATE_TIME          not null,
   QUANTITE             T_QTE_15_3           not null,
   VALIDE               T_OUI_NON            not null,
   constraint PK_CLIENT_DECHET_SLD_INI primary key (ID)
)
go

/*=======================================================================*/
/* Index : IDX_CLIENT_DECHET_SLD_INI_CLIENT_CODE_ARTICLE_CODE_DATE_DEBUT */
/*=======================================================================*/
create unique index IDX_CLIENT_DECHET_SLD_INI_CLIENT_CODE_ARTICLE_CODE_DATE_DEBUT on CLIENT_DECHET_SLD_INI (
	CLIENT_CODE ASC,
	ARTICLE_CODE ASC,
	DATE_DEBUT ASC
)
go

/*==============================================================*/
/* Index : IDX_CLIENT_DECHET_SLD_INI_DATE_DEBUT                 */
/*==============================================================*/
create index IDX_CLIENT_DECHET_SLD_INI_DATE_DEBUT on CLIENT_DECHET_SLD_INI (
	DATE_DEBUT ASC
)
go

/*==============================================================*/
/* Index : IDX_CLIENT_DECHET_SLD_INI_CLIENT_CODE                */
/*==============================================================*/
create index IDX_CLIENT_DECHET_SLD_INI_CLIENT_CODE on CLIENT_DECHET_SLD_INI (
	CLIENT_CODE ASC
)
go

/*==============================================================*/
/* Index : IDX_CLIENT_DECHET_SLD_INI_ARTICLE_CODE               */
/*==============================================================*/
create index IDX_CLIENT_DECHET_SLD_INI_ARTICLE_CODE on CLIENT_DECHET_SLD_INI (
	ARTICLE_CODE ASC
)
go

alter table CLIENT_DECHET_SLD_INI
   add constraint FK_ARTICLE_CLIENT_DECHET_SLD_INI foreign key (ARTICLE_CODE)
      references ARTICLE (CODE)
go

alter table CLIENT_DECHET_SLD_INI
   add constraint FK_CLIENT_DECHET_CLIENT_DECHET_SLD_INI foreign key (CLIENT_CODE)
      references CLIENT_DECHET (CODE)
go

insert into CLIENT_DECHET_SLD_INI (ARTICLE_CODE, CLIENT_CODE, DATE_DEBUT, QUANTITE)
select ARTICLE_CODE, CLIENT_CODE, DATE_DEBUT, QUANTITE from IMA_ERP.dbo.CLIENT_DECHET_SLD_INI VDL with (nolock)
go

/*==============================================================*/
/* Table : ENVOI_FRS_DECHET                                     */
/*==============================================================*/
create table ENVOI_FRS_DECHET (
   ID                   int                  identity,
   ANNEE                T_ANNEE              not null,
   NO_DOS_EXP           T_NUMERO             not null,
   NO_CMD_EXP           T_NUMERO             not null,
   DATE_CMD             T_DATE_TIME          not null,
   ARTICLE_CODE         T_CODE20             not null,
   QUANTITE             T_QUANTITE           not null
      constraint CKC_ENVOI_FRS_DECHET_QUANTITE check (QUANTITE > 0),
   constraint PK_ENVOI_FRS_DECHET primary key (ID)
)
go

/*=======================================================================*/
/* Index : IDX_ENVOI_FRS_DECHET_ANNEE_NO_DOS_EXP_NO_CMD_EXP_ARTICLE_CODE */
/*=======================================================================*/
create unique index IDX_ENVOI_FRS_DECHET_ANNEE_NO_DOS_EXP_NO_CMD_EXP_ARTICLE_CODE on ENVOI_FRS_DECHET (
	ANNEE ASC,
	NO_DOS_EXP ASC,
	NO_CMD_EXP ASC,
	ARTICLE_CODE ASC
)
go

/*==============================================================*/
/* Index : IDX_ENVOI_FRS_DECHET_ARTICLE_CODE                    */
/*==============================================================*/
create index IDX_ENVOI_FRS_DECHET_ARTICLE_CODE on ENVOI_FRS_DECHET (
	ARTICLE_CODE ASC
)
go

/*==============================================================*/
/* Index : IDX_ENVOI_FRS_DECHET_ANNEE_NO_DOS_EXP_NO_CMD_EXP     */
/*==============================================================*/
create index IDX_ENVOI_FRS_DECHET_ANNEE_NO_DOS_EXP_NO_CMD_EXP on ENVOI_FRS_DECHET (
	ANNEE ASC,
	NO_DOS_EXP ASC,
	NO_CMD_EXP ASC
)
go

/*==============================================================*/
/* Index : IDX_ENVOI_FRS_DECHET_DATE_CMD                        */
/*==============================================================*/
create index IDX_ENVOI_FRS_DECHET_DATE_CMD on ENVOI_FRS_DECHET (
	DATE_CMD ASC
)
go

alter table ENVOI_FRS_DECHET
   add constraint FK_ARTICLE_ENVOI_FRS_DECHET foreign key (ARTICLE_CODE)
      references ARTICLE (CODE)
go

insert into ENVOI_FRS_DECHET (ANNEE, NO_DOS_EXP, NO_CMD_EXP, DATE_CMD, ARTICLE_CODE, QUANTITE)
select ANNEE, NO_DOS_EXP, NO_CMD_EXP, DATE_CMD, ARTICLE_CODE, QUANTITE from IMA_ERP.dbo.ENVOI_FRS_DECHET with (nolock)
go

