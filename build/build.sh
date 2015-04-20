#!/bin/bash

# Run from the project root

java -jar ./build/google_closure/compiler.jar --js ./src/markdownEditor.js --js_output_file ./markdownEditor.min.js 
java -jar ./build/google_closure/compiler.jar --js ./lib/markdown.min.js ./src/markdownEditor.js --js_output_file ./markdown.markdownEditor.min.js 
