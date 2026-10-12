# Adding a new language

This project uses document-level internationalization in Sanity.

Each language has:

- its own Sanity document
- its own slug
- its own frontend deployment
- its own `APP_LOCALE`
- its own domain / frontend URL

Example locales:

- `uk-UA`
- `pl-PL`

---

## 1. Add the language to Sanity Studio

Edit:

`studio-hello-world/config/languages.js`

Example:

```js
export const languages = [
  {
    id: 'uk-UA',
    title: 'Українська',
    siteUrl: 'https://uk-site.example.com',
  },
  {
    id: 'pl-PL',
    title: 'Polski',
    siteUrl: 'https://pl-site.example.com',
  },
  {
    id: 'de-DE',
    title: 'Deutsch',
    siteUrl: 'https://de-site.example.com',
  },
]

This configuration is reused by:
- @sanity/document-internationalization
- Presentation Tool locations
- Presentation Tool allowed origins
Therefore no additional language condition should be added manually elsewhere in Studio.
2. Create a frontend deployment
Create a new Vercel Project from the same Next.js application.
Set:
APP_LOCALE=de-DE

Copy the other required environment variables from an existing language project.
Important:
APP_LOCALE must exist in Vercel Environment Variables, because dynamic Next.js routes may need it at runtime.
3. Add the frontend to Sanity CORS
In Sanity project settings, add the new frontend origin.
Example:
https://de-site.example.com

Enable:
Allow credentials

This is required for Draft Mode / Visual Editing.
4. Add the frontend to revalidation
Sanity Function uses:
NEXTJS_REVALIDATE_URLS

Add the new endpoint to the comma-separated list:
https://uk-site.example.com/api/revalidate-tags,
https://pl-site.example.com/api/revalidate-tags,
https://de-site.example.com/api/revalidate-tags

Update it with:
npx sanity@latest functions env add invalidate-tags NEXTJS_REVALIDATE_URLS "URL_1,URL_2,URL_3"

The new frontend must also have the same:
SANITY_REVALIDATE_TAGS_SECRET

as the other frontend deployments.
No Sanity Function code change is required when only adding another URL.
5. Deploy Sanity Studio
From:
studio-hello-world/

run:
npm run deploy

This publishes the updated language configuration and Presentation Tool configuration.
6. Create translations
In Sanity Studio:
1. Open the original document.
2. Create the new language version using the internationalization UI.
3. Translate the content.
4. Set the correct localized slug.
5. Publish the document.
Each translation should have its own locale:
language: de-DE

7. Frontend queries
All language-specific GROQ queries must include:
language == $language

The frontend passes:
language: APP_LOCALE

Example list query:
*[
  _type == "post"
  && defined(slug.current)
  && language == $language
]

Example detail query:
*[
  _type == "post"
  && slug.current == $slug
  && language == $language
][0]

Normally no query changes are required when adding another language.
8. Production test
After adding a language verify:
- New domain shows only documents for its APP_LOCALE.
- Existing language sites still show only their own content.
- /[slug] works on the new frontend.
- Presentation opens the correct domain and localized slug.
- Draft changes appear only inside Presentation.
- Public site does not show drafts.
- After Publish the public site updates automatically without refresh.
- Publishing one language does not replace content on another language site.
- A newly created translated document appears only on its corresponding frontend.
Architecture summary
Sanity dataset
├── post / uk-UA
├── post / pl-PL
└── post / de-DE
        ↓
translation.metadata connects translations

Frontend UA
APP_LOCALE=uk-UA

Frontend PL
APP_LOCALE=pl-PL

Frontend DE
APP_LOCALE=de-DE

One Sanity dataset is shared by all languages.
Each frontend deployment filters Sanity content using its own APP_LOCALE.
Draft content is visible through Presentation Tool.
Published content is updated through the Sync Tag Invalidate Function.
```
