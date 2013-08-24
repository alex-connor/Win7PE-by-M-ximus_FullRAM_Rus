Exif plugin version 1.5 for Total Commander

This plugin extracts digital camera data from JPG files, like exposure time.
Can be used in thumbnail view and custom column view, as well as in the
search and multi-rename functions.

Changelog:
20050213 Fixed: Access violation caused by Nikon images (Buffer "data" was too small)
20041124 Fixed: MaxApertureValue uses APEX field type: RootOf(2)^value
20041124 Added: ApertureValue and ExposureTimeFraction(APEX) fields
20041116 Fixed: Division by zero error if nominator or denominator contained 0 (rational value)
20041027 Added: Better display of ExposureTimeFraction for jpegs which store it as 16666/1000000
20041020 Added: Support for files in JFIF mode
20041017 Added: Support for ISO field
20041017 Added: Support for Canon RAW image files
20041017 Fixed: jpg file wasn't closed after extracting the exif data!
