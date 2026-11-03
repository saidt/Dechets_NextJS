BEGIN TRY

BEGIN TRAN;

-- CreateSchema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo') EXEC sp_executesql N'CREATE SCHEMA [dbo];';

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [provider] NVARCHAR(1000) NOT NULL,
    [providerAccountId] NVARCHAR(1000) NOT NULL,
    [refresh_token] NVARCHAR(1000),
    [access_token] NVARCHAR(1000),
    [expires_at] INT,
    [token_type] NVARCHAR(1000),
    [scope] NVARCHAR(1000),
    [id_token] NVARCHAR(1000),
    [session_state] NVARCHAR(1000),
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Account_provider_providerAccountId_key] UNIQUE NONCLUSTERED ([provider],[providerAccountId])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] NVARCHAR(1000) NOT NULL,
    [sessionToken] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [Session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Session_sessionToken_key] UNIQUE NONCLUSTERED ([sessionToken])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [emailVerified] DATETIME2,
    [image] NVARCHAR(1000),
    [passwordHash] NVARCHAR(1000),
    [lastConnected] DATETIME2,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[VerificationToken] (
    [identifier] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [VerificationToken_token_key] UNIQUE NONCLUSTERED ([token]),
    CONSTRAINT [VerificationToken_identifier_token_key] UNIQUE NONCLUSTERED ([identifier],[token])
);

-- CreateTable
CREATE TABLE [dbo].[SORTIE_DECHET] (
    [numero] INT NOT NULL IDENTITY(1,1),
    [CLIENT_CODE] NVARCHAR(1000) NOT NULL,
    [CLIENT_RAISON_SOCIALE] NVARCHAR(1000) NOT NULL,
    [DATE_PIECE] DATETIME2 NOT NULL,
    [Montant] DECIMAL(12,2) NOT NULL,
    [MONTANT_REGLE] DECIMAL(12,2) NOT NULL,
    [Valide] NVARCHAR(1000) NOT NULL,
    [Controle] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SORTIE_DECHET_pkey] PRIMARY KEY CLUSTERED ([numero])
);

-- CreateTable
CREATE TABLE [dbo].[RETOUR_DECHET] (
    [numero] INT NOT NULL IDENTITY(1,1),
    [CLIENT_CODE] NVARCHAR(1000) NOT NULL,
    [CLIENT_RAISON_SOCIALE] NVARCHAR(1000) NOT NULL,
    [DATE_PIECE] DATETIME2 NOT NULL,
    [Montant] DECIMAL(12,2) NOT NULL,
    [MONTANT_REGLE] DECIMAL(12,2) NOT NULL,
    [Valide] NVARCHAR(1000) NOT NULL,
    [Controle] NVARCHAR(1000) NOT NULL,
    [DATE_SORTIE] DATETIME2 NOT NULL,
    CONSTRAINT [RETOUR_DECHET_pkey] PRIMARY KEY CLUSTERED ([numero])
);

-- AddForeignKey
ALTER TABLE [dbo].[Account] ADD CONSTRAINT [Account_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

