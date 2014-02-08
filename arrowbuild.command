#!/bin/sh
#
# ENVIRONMENT
#
PROJECTNAME="Arrow"
PROJECTVERSION="1.2.0"
COPYRIGHT="Copyright (c) 2013-2014 Daniele Veneroni"
LICENSE="Licensed under GPLv3 License"
PROJECTDIR="/Users/Venerons/Desktop/Arrow/"
YUI="/Users/Venerons/Documents/Developer/yuicompressor-2.4.8.jar"
HTML="/Users/Venerons/Documents/Developer/htmlcompressor-1.5.3.jar"
buildhtml() {
	htmlmin index.html index.min.html
	rm index.html
	mv index.min.html index.html
}
buildcss() {
	cssmin css/style.css css/style.min.css
	rm css/style.css
	mv css/style.min.css css/style.css
}
buildjs() {
	jsmin js/presets.js js/presets.min.js
	rm js/presets.js
	mv js/presets.min.js js/presets.js
	jsmin js/synth.js js/synth.min.js
	rm js/synth.js
	mv js/synth.min.js js/synth.js
	jsmin js/utils.js js/utils.min.js
	rm js/utils.js
	mv js/utils.min.js js/utils.js
}
#
# BUILD PROCEDURE
#
clear
BLUE="\033[1;34m"
GREEN="\033[32m"
MAGENTA="\033[35m"
NORMAL="\033[0m"
echo "$BLUE \bStarting $PROJECTNAME Build...$NORMAL"
cd $PROJECTDIR
echo "// $PROJECTNAME v$PROJECTVERSION | $COPYRIGHT | $LICENSE" > headerjs
echo "/*! $PROJECTNAME v$PROJECTVERSION | $COPYRIGHT | $LICENSE */" > headercss
echo "<!-- $PROJECTNAME v$PROJECTVERSION | $COPYRIGHT | $LICENSE -->" > headerhtml
htmlmin() {
	if [ -e $2 ]; then
		rm $2;
	fi
	java -jar $HTML --type html --charset utf-8 --remove-intertag-spaces --remove-quotes --simple-doctype --remove-style-attr --remove-link-attr --remove-script-attr --simple-bool-attr --remove-js-protocol --remove-http-protocol --remove-https-protocol --compress-css --compress-js --js-compressor yui --preserve-semi $1 > $2
	echo "" >> $2
	mv $2 tmp
	cat headerhtml tmp > $2
	rm tmp
}
cssmin() {
	if [ -e $2 ]; then
		rm $2;
	fi
	java -jar $YUI $1 -o $2 --type css --charset utf-8
	echo "" >> $2
	mv $2 tmp
	cat headercss tmp > $2
	rm tmp
}
jsmin() {
	if [ -e $2 ]; then
		rm $2;
	fi
	java -jar $YUI $1 -o $2 --type js --charset utf-8 --preserve-semi
	echo "" >> $2
	mv $2 tmp
	cat headerjs tmp > $2
	rm tmp
}
echo "$MAGENTA \bStarting HTML compression...$NORMAL"
buildhtml
echo "$GREEN \bHTML compression finished.$NORMAL"
echo "$MAGENTA \bStarting CSS compression...$NORMAL"
buildcss
echo "$GREEN \bCSS compression finished.$NORMAL"
echo "$MAGENTA \bStarting JS compression...$NORMAL"
buildjs
echo "$GREEN \bJS compression finished.$NORMAL"
rm headerhtml headercss headerjs
echo "$BLUE \b$PROJECTNAME build finished.$NORMAL"
