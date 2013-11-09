#!/bin/sh
# Per rendere eseguibile questo script lanciare su un terminale il comando chmod +x cometx.command
# Poi per eseguirlo lanciare sul terminale il comando ./cometx.command
# In alternativa lo si può far eseguire anche con un doppio click sul file
#
echo "Comet X production build started..."
#
# HTML COMPRESSION
#
echo "HTML compression started..."
cd /Users/Venerons/Desktop/Comet\ X/
java -jar /Users/Venerons/Documents/Developer/htmlcompressor-1.5.3.jar --type html -o index.min.html index.html
rm index.html
mv index.min.html index.html
echo "HTML compression completed."
#
# JAVASCRIPT COMPRESSION
#
echo "JS compression started..."
cd js/
java -jar /Users/Venerons/Documents/Developer/compiler.jar --js=presets.js --js_output_file=presets.min.js
rm presets.js
mv presets.min.js presets.js
java -jar /Users/Venerons/Documents/Developer/compiler.jar --js=synth.js --js_output_file=synth.min.js
rm synth.js
mv synth.min.js synth.js
java -jar /Users/Venerons/Documents/Developer/compiler.jar --js=utils.js --js_output_file=utils.min.js
rm utils.js
mv utils.min.js utils.js
echo "JS compression completed."
echo "Comet X production build completed."
