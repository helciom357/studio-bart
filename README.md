# Studio Bartô

Site do Studio Bartô — barbearia, estúdio de tatuagem, remoção a laser e Peeling Hollywood.

## Onde editar

- `src/site/config.ts` — endereço, horários, WhatsApp, Instagram e o e-mail do formulário (`FORM_EMAIL`).
- `src/site/content.ts` — profissionais, portfólio, estilos, serviços e preços (itens fictícios estão marcados).
- `public/images/` — fotos (fachada, equipe, tatuagens). Troque os arquivos mantendo o nome ou atualize o caminho em `content.ts`.
- `src/site/three/models.tsx` — objetos 3D das mesas.
- Fonte de títulos: Superior Title (quando licenciada, adicione os arquivos e o `src` no `@font-face` de `src/styles.css`); até lá usa Playfair Display. Textos em Montserrat.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/071092ab-2abe-428b-a0b2-203f7ad2263c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
