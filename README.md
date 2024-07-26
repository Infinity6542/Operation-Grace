# Operation Grace

## Introduction to OpGrace

This document provides a short insight into Operation Grace (“OpGrace”, “she” or simply “the Operation”).

Operation Grace is a modular platform powered by the browser, designed to cycle through multiple different outputs, slideshow-style. OpGrace includes multiple modules by default, although using them is completely optional, and the client may swap them out for a module of their choice.

> ⚠️ **Warning**
> 
> This readme.md guide will walk through users on the Windows operating system only for now. If there are problems with Linux machines, contact the developer for assistance.

## Running OpGrace

This section will walk through how to set up OpGrace for the first time using the Windows IIS Manager.<br>
<sup>Want access to the latest bleeding edge features? Download the source code from the Buffer or, if you dare, the Development branch to gain access to the latest and (sometimes) greatest!</sup>

> ℹ️ **IMPORTANT**
> 
> In some instances, OpGrace will require the PocketBase backend in order to run. To do this, simply `cd` into `./core/pb` and run the command `./pocketbase serve`.

1. Firstly, ensure that the Internet Information Services (IIS) is enabled. Head to the `Start Menu > Turn Windows features on or off > ENABLE Internet Information Services`.
2. Open the IIS Manager through a program of your choice (or just use the Start Menu).
3. On the left panel, expand your device name, then select `Sites`.
4. On the right panel, click on `Add Website...`
5. Configure the website to your choice, making sure to configure `Content Directory > Physical Path` to the OpGrace folder (NOT one of the subfolders or files).
6. Make sure that `Start Website immediately` is checked, and press `OK`. If the Website doesn't launch, simply head over to `http://localhost:[port you assigned earlier]` in a browser of your choice.
7. You're all done. Enjoy!

## Contributing

Anyone is free to contribute to Operation Grace.

Start by forking this repository, then make your changes. Once complete, make a pull request. Good luck!