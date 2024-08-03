# Changelog

## Version 3.0.0beta.25
- Breaking: Renamed `isGraphicsmodalOpen` to `graphicsModalExecutionNr` and changing it's type from `boolean` to `number`.
  This fixes an issue that caused the Turtle Output to display the first animation instead of the current created one, when the user kept the graphics modal open while changing the code. 