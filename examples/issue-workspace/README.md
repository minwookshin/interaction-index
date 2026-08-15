# Issue workspace dogfood

This is an internal consumer proof for the release candidate. It imports components and styles only through the packed `interaction-index` public exports and exercises search, create, inspect, complete, archive, toast, Shared Detail, and Undo Stack behavior.

It is not external production-adoption evidence and must not be described as such. `npm run test:dogfood` copies this source into a fresh temporary project, installs the private tarball candidate, and requires a strict TypeScript plus Vite production build.
