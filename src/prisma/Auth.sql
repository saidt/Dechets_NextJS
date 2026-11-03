CREATE TABLE [User] (
    id NVARCHAR(255) PRIMARY KEY,
    name NVARCHAR(MAX),
    email NVARCHAR(255),
    passwordHash NVARCHAR(MAX),
    lastConnected DATETIME,
    CONSTRAINT UQ_User_Email UNIQUE (email)
);

CREATE TABLE Session (
    id NVARCHAR(255) PRIMARY KEY,
    sessionToken NVARCHAR(500) UNIQUE NOT NULL,
    userId NVARCHAR(255) NOT NULL,
    expires DATETIME NOT NULL,
    CONSTRAINT FK_Session_User FOREIGN KEY (userId) 
        REFERENCES [User](id) ON DELETE CASCADE
);
