# blogtool

blogtool is an [electron](/atom/electron) application designed to make publishing blogs using static site generators easier. it is also horribly named.

## The Problem

The Problem™ with content creation is that most content creators are not technical people. They don't care nor want to know about markdown. And they shouldn't.

## The Solution
The Solution© is to let them create content using the tools they like (WYSIWYG editors) but store the content in a presentation-neutral format (like markdown!).

This tool couples [medium-editor](https://github.com/yabwe/medium-editor) (since it's the least-worst open source WYSIWYG editor out there) and filters the output of the editor through [Dr SAX](/toddself/dr-sax) on save and [marked](/chjj/marked) on load transparently encoding and decoding the content between the presentation format and the storage format.

## Installation
```
git clone https://github.comt/toddself/blogtool
cd blogtool
npm install
npm start
```

## TODO
* Hook up to a static site generator
* Write tests

## License
©2015 Todd Kennedy, Apache-2.0
