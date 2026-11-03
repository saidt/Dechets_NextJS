CREATE TYPE [dbo].[T_CODE10] FROM [varchar](10) NULL
GO

CREATE TYPE [dbo].[T_CODE15] FROM [varchar](15) NULL
GO

CREATE TYPE [dbo].[T_CODE20] FROM [varchar](20) NULL
GO

CREATE TYPE [dbo].[T_DESIGNATION] FROM [varchar](40) NULL
GO

CREATE TYPE [dbo].[T_DATE_TIME] FROM [datetime] NULL
GO

CREATE TYPE [dbo].[T_OUI_NON] FROM [char](1) NULL
GO

create type T_MEMO from text
GO

CREATE TYPE [dbo].[T_ANNEE] FROM [numeric](4, 0) NULL
GO

CREATE TYPE [dbo].[T_MOIS] FROM [numeric](2, 0) NULL
GO

CREATE TYPE [dbo].[T_NUMERO] FROM [numeric](10, 0) NULL
GO

CREATE TYPE [dbo].[T_MONTANT] FROM [numeric](12, 2) NULL
GO

CREATE DEFAULT [dbo].[D_ZERO]  AS 0
GO

CREATE TYPE [dbo].[T_QUANTITE] FROM [numeric](10, 0) NULL
GO

EXEC sys.sp_bindefault @defname=N'[dbo].[D_ZERO]', @objname=N'[dbo].[T_MONTANT]' , @futureonly='futureonly'
GO

CREATE DEFAULT [dbo].[D_OUI_NON] 
AS
'N'
GO

EXEC sys.sp_bindefault @defname=N'[dbo].[D_OUI_NON]', @objname=N'[dbo].[T_OUI_NON]' , @futureonly='futureonly'
GO

CREATE RULE [dbo].[R_T_OUI_NON] 
AS
@column in ('O','N')
GO

EXEC sys.sp_bindrule @rulename=N'[dbo].[R_T_OUI_NON]', @objname=N'[dbo].[T_OUI_NON]' , @futureonly='futureonly'
GO

create type T_POURCENTAGE
   from numeric(6,2)
go

execute sp_bindefault D_ZERO, 'T_POURCENTAGE'
go

create type DBO.T_QTE_15_3
   from numeric(15,3)
go
