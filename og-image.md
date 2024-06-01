# How to OG:Image

- 👉 [https://og-playground.vercel.app/](https://og-playground.vercel.app/)
- 👉[image2base64](https://www.base64-image.de/)

```tsx
// Modified based on https://tailwindui.com/components/marketing/sections/cta-sections

<div tw="flex flex-col w-full h-full items-center justify-center bg-white">
  <div tw="bg-gray-50 flex w-full">
    <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
      <h2 tw="flex flex-col text-3xl sm:text-8xl font-bold tracking-tight text-gray-900 text-left">
        <span tw="text-blue-500">Live</span>
        <span tw="text-blue-600">Interactive</span>
        <span tw="text-blue-700">Brython!</span>
      </h2>
      <div tw="flex" style={{marginBottom: '1em'}}>
        <img height="560" src="...bas64...." />
      </div>
    </div>
  </div>
</div>
```