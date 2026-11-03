create FUNCTION [dbo].[Trim] (@Chaine varchar(256))
RETURNS varchar(256) AS
BEGIN 
--------------------------------------
  return rtrim(ltrim(@Chaine))
--------------------------------------
END
GO