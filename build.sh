#!/bin/bash

if [ "$1" != "" ] && [ "$2" != "" ]; then
    gcc -E -x c -P "$1" > "./gen/$2"
    echo "script was created in gen folder"
else
    if [ "$1" != "" ]; then
    	gcc -E -x c -P "$1" > "./gen/output.js"
	cat ./gen/output.js > /dev/clipboard
	echo "script was copied to clipboard"
    else
    	echo "failed to generate script: no input files"
    fi
fi
